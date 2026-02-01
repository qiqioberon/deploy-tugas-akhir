import { Client, handle_file } from "@gradio/client";

export type Traits = {
  extraversion: number;
  neuroticism: number;
  agreeableness: number;
  conscientiousness: number;
  openness: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_GRADIO_BASE_URL;
const TIMEOUT_MS = 60_000;
const RETRIES = 1;

let cachedClientPromise: Promise<Awaited<ReturnType<typeof Client.connect>>> | null = null;

const ensureBaseUrl = () => {
  if (!BASE_URL) {
    throw new Error(
      'NEXT_PUBLIC_GRADIO_BASE_URL is not set. Please configure it in your environment.'
    );
  }
};

const connectClient = async () => {
  ensureBaseUrl();
  if (typeof window === "undefined") {
    throw new Error("Gradio client must be used in a client-side context.");
  }

  if (!cachedClientPromise) {
    cachedClientPromise = Client.connect(BASE_URL).catch((err) => {
      cachedClientPromise = null;
      throw err;
    });
  }
  return cachedClientPromise;
};

export const getClient = async () => {
  return connectClient();
};

const withTimeout = <T>(promise: Promise<T>): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out after 60s")), TIMEOUT_MS)
    ),
  ]);
};

const isTransientError = (err: unknown) => {
  if (!err) return false;
  const message = typeof err === "string" ? err : (err as any).message || "";
  return /timeout|network|fetch|socket|temporarily unavailable/i.test(message);
};

const requestWithRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
  let attempt = 0;
  while (true) {
    try {
      return await withTimeout(fn());
    } catch (err) {
      if (attempt < RETRIES && isTransientError(err)) {
        attempt += 1;
        cachedClientPromise = null; // force reconnect on retry
        continue;
      }
      throw err;
    }
  }
};

const coerceTraits = (raw: any): Traits => {
  if (!raw) {
    throw new Error("Empty response from model.");
  }

  // Object with expected keys
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const maybe = raw as Record<string, number>;
    const traits: Traits = {
      extraversion: Number(maybe.extraversion) || 0,
      neuroticism: Number(maybe.neuroticism) || 0,
      agreeableness: Number(maybe.agreeableness) || 0,
      conscientiousness: Number(maybe.conscientiousness) || 0,
      openness: Number(maybe.openness) || 0,
    };
    return traits;
  }

  // Array format (Gradio sometimes returns arrays)
  if (Array.isArray(raw)) {
    const arr = raw.flat();
    if (arr.length >= 5) {
      return {
        openness: Number(arr[0]) || 0,
        conscientiousness: Number(arr[1]) || 0,
        extraversion: Number(arr[2]) || 0,
        agreeableness: Number(arr[3]) || 0,
        neuroticism: Number(arr[4]) || 0,
      };
    }
  }

  throw new Error("Unexpected response format from model.");
};

const extractData = (result: any) => {
  if (!result) throw new Error("Empty response.");
  if (Array.isArray(result.data)) {
    return result.data[0] ?? result.data;
  }
  if (result.data !== undefined) return result.data;
  return result;
};

const prepareFile = async (file: File) => {
  return handle_file(file);
};

type BaselinesPayload = {
  count?: number;
  baselines?: Array<{ key: string }>;
};

export const listBaselines = async (): Promise<string[]> => {
  return requestWithRetry(async () => {
    const client = await getClient();
    const res = await client.predict("/list_baselines", []);
    const payload = extractData(res) as BaselinesPayload;

    const keys = payload?.baselines?.map((b) => b.key).filter(Boolean);

    if (keys && keys.length > 0) return keys;

    throw new Error(
      `Unexpected baselines response. Got: ${JSON.stringify(payload)}`
    );
  });
};


export const predictFineTune = async (audioFile: File): Promise<Traits> => {
  return requestWithRetry(async () => {
    const client = await getClient();
    const fileData = await prepareFile(audioFile);
    const res = await client.predict("/predict_wavlm_ft", [fileData]);
    const payload = extractData(res);
    return coerceTraits(payload);
  });
};

export const predictBaseline = async (
  baselineKey: string,
  audioFile: File
): Promise<Traits> => {
  return requestWithRetry(async () => {
    if (!baselineKey) {
      throw new Error("Baseline key is required.");
    }
    const client = await getClient();
    const fileData = await prepareFile(audioFile);
    const res = await client.predict("/predict_baseline_ridge_audio", [
      baselineKey,
      fileData,
    ]);
    const payload = extractData(res);
    return coerceTraits(payload);
  });
};
