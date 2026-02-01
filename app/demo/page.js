'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Mic,
  Square,
  Upload,
  Play,
  Pause,
  Brain,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  Share2,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Volume2,
  Clock,
  Trash2,
  ArrowLeft,
  Lightbulb,
  Target,
  Users,
  Heart,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const GRADIO_BASE_URL = process.env.NEXT_PUBLIC_GRADIO_BASE_URL || 'https://qiqioberon-personality-with-audio-demo.hf.space'
const TARGET_DURATION = 15
const SAMPLE_RATE = 16000

const traitInfo = {
  openness: {
    name: 'Openness',
    short: 'O',
    icon: Lightbulb,
    color: '#a855f7',
    descriptions: {
      low: 'You tend to prefer routine and familiar experiences. Practical and grounded.',
      medium: 'You balance curiosity with practicality. Open to new ideas when relevant.',
      high: 'You embrace novelty and creativity. Imaginative and intellectually curious.'
    }
  },
  conscientiousness: {
    name: 'Conscientiousness',
    short: 'C',
    icon: Target,
    color: '#3b82f6',
    descriptions: {
      low: 'You prefer flexibility over strict planning. Spontaneous and adaptable.',
      medium: 'You balance organization with flexibility. Reliable when it matters.',
      high: 'You are highly organized and disciplined. Goal-oriented and dependable.'
    }
  },
  extraversion: {
    name: 'Extraversion',
    short: 'E',
    icon: Users,
    color: '#f97316',
    descriptions: {
      low: 'You recharge through solitude. Thoughtful and introspective.',
      medium: 'You enjoy social time but also value quiet moments. Balanced energy.',
      high: 'You thrive in social settings. Energetic and outgoing.'
    }
  },
  agreeableness: {
    name: 'Agreeableness',
    short: 'A',
    icon: Heart,
    color: '#22c55e',
    descriptions: {
      low: 'You prioritize directness over diplomacy. Independent minded.',
      medium: 'You balance cooperation with self-advocacy. Diplomatic when needed.',
      high: 'You value harmony and cooperation. Empathetic and considerate.'
    }
  },
  neuroticism: {
    name: 'Neuroticism',
    short: 'N',
    icon: Zap,
    color: '#ef4444',
    descriptions: {
      low: 'You stay calm under pressure. Emotionally stable and resilient.',
      medium: 'You experience normal emotional fluctuations. Generally balanced.',
      high: 'You are emotionally sensitive. May experience stress more intensely.'
    }
  }
}

const getTraitDescription = (trait, value) => {
  const info = traitInfo[trait]
  if (!info) return ''
  if (value < 0.35) return info.descriptions.low
  if (value < 0.65) return info.descriptions.medium
  return info.descriptions.high
}

const getOverallSummary = (predictions) => {
  if (!predictions) return ''

  const traits = []
  if (predictions.openness > 0.6) traits.push('creative and open-minded')
  if (predictions.conscientiousness > 0.6) traits.push('organized and disciplined')
  if (predictions.extraversion > 0.6) traits.push('socially energetic')
  if (predictions.agreeableness > 0.6) traits.push('empathetic and cooperative')
  if (predictions.neuroticism > 0.6) traits.push('emotionally sensitive')

  if (traits.length === 0) {
    return 'Your voice suggests a balanced personality profile with no extreme tendencies in any dimension.'
  }

  return `Based on your voice, you appear to be ${traits.join(', ')}. Remember, this is just an experimental prediction.`
}

function audioBufferToWav(buffer) {
  const numChannels = 1
  const sampleRate = buffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16

  const bytesPerSample = bitDepth / 8
  const blockAlign = numChannels * bytesPerSample

  const samples = buffer.getChannelData(0)
  const dataLength = samples.length * bytesPerSample
  const bufferLength = 44 + dataLength

  const arrayBuffer = new ArrayBuffer(bufferLength)
  const view = new DataView(arrayBuffer)

  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // chunk size
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(36, 'data')
  view.setUint32(40, dataLength, true)

  // Audio data
  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
    offset += 2
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

async function trimAudioTo15Seconds(audioBlob) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const arrayBuffer = await audioBlob.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  const duration = audioBuffer.duration
  const targetSamples = Math.floor(TARGET_DURATION * audioBuffer.sampleRate)
  const actualSamples = Math.min(targetSamples, audioBuffer.length)

  const trimmedBuffer = audioContext.createBuffer(
    1,
    actualSamples,
    audioBuffer.sampleRate
  )

  const sourceData = audioBuffer.getChannelData(0)
  const trimmedData = trimmedBuffer.getChannelData(0)

  for (let i = 0; i < actualSamples; i++) {
    trimmedData[i] = sourceData[i]
  }

  audioContext.close()
  return {
    blob: audioBufferToWav(trimmedBuffer),
    duration: actualSamples / audioBuffer.sampleRate
  }
}

async function getAudioDuration(blob) {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.onloadedmetadata = () => {
      resolve(audio.duration)
    }
    audio.onerror = reject
    audio.src = URL.createObjectURL(blob)
  })
}

export default function DemoPage() {
  const searchParams = useSearchParams()

  // Audio state
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audioDuration, setAudioDuration] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioError, setAudioError] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)

  // Model state
  const [modelType, setModelType] = useState('wavlm_ft')
  const [baselineKey, setBaselineKey] = useState('')
  const [baselines, setBaselines] = useState([])
  const [baselinesLoading, setBaselinesLoading] = useState(false)
  const [baselinesError, setBaselinesError] = useState(null)

  // Prediction state
  const [status, setStatus] = useState('idle') // idle, uploading, inferring, done, error
  const [predictions, setPredictions] = useState(null)
  const [predictionError, setPredictionError] = useState(null)
  const [responseLatency, setResponseLatency] = useState(null)
  const [rawResponse, setRawResponse] = useState(null)

  // UI state
  const [technicalOpen, setTechnicalOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Refs
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioRef = useRef(null)
  const recordingIntervalRef = useRef(null)
  const fileInputRef = useRef(null)

  // Load baselines on mount
  useEffect(() => {
    fetchBaselines()
  }, [])

  // Load results from URL params on mount
  useEffect(() => {
    const resultsParam = searchParams.get('results')
    if (resultsParam) {
      try {
        const decoded = JSON.parse(atob(resultsParam))
        setPredictions(decoded.predictions)
        setModelType(decoded.modelType || 'wavlm_ft')
        setBaselineKey(decoded.baselineKey || '')
        setStatus('done')
      } catch (e) {
        console.error('Failed to parse results from URL:', e)
      }
    }
  }, [searchParams])

  // Save results to localStorage when predictions change
  useEffect(() => {
    if (predictions) {
      localStorage.setItem('ta_personality_results', JSON.stringify({
        predictions,
        modelType,
        baselineKey,
        timestamp: Date.now()
      }))
    }
  }, [predictions, modelType, baselineKey])

  // Load results from localStorage on mount
  useEffect(() => {
    if (!searchParams.get('results')) {
      const saved = localStorage.getItem('ta_personality_results')
      if (saved) {
        try {
          const { predictions: savedPredictions } = JSON.parse(saved)
          if (savedPredictions && !predictions) {
            setPredictions(savedPredictions)
            setStatus('done')
          }
        } catch (e) {
          console.error('Failed to load saved results:', e)
        }
      }
    }
  }, [])

  const fetchBaselines = async () => {
    setBaselinesLoading(true)
    setBaselinesError(null)
    try {
      const response = await fetch(`${GRADIO_BASE_URL}/api/predict/list_baselines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [] })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      // Gradio returns { data: [...] }
      const baselineList = data.data?.[0] || data.data || []
      setBaselines(Array.isArray(baselineList) ? baselineList : [])
      if (baselineList.length > 0) {
        setBaselineKey(baselineList[0])
      }
    } catch (error) {
      console.error('Failed to fetch baselines:', error)
      setBaselinesError('Could not load baseline models. Using defaults.')
      setBaselines(['egemaps', 'wav2vec2', 'hubert', 'wavlm'])
      setBaselineKey('egemaps')
    } finally {
      setBaselinesLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      setAudioError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      })

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processAudio(blob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start(100)
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const next = prev + 0.1
          if (next >= TARGET_DURATION) {
            stopRecording()
            return TARGET_DURATION
          }
          return next
        })
      }, 100)
    } catch (error) {
      console.error('Recording error:', error)
      setAudioError('Could not access microphone. Please grant permission.')
    }
  }

  const stopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (blob) => {
    try {
      const duration = await getAudioDuration(blob)

      if (duration < TARGET_DURATION - 0.5) {
        setAudioError(`Audio is ${duration.toFixed(1)}s. Please record exactly 15 seconds.`)
        return
      }

      let finalBlob = blob
      let finalDuration = duration

      if (duration > TARGET_DURATION + 0.5) {
        const trimmed = await trimAudioTo15Seconds(blob)
        finalBlob = trimmed.blob
        finalDuration = trimmed.duration
      }

      const url = URL.createObjectURL(finalBlob)
      setAudioBlob(finalBlob)
      setAudioUrl(url)
      setAudioDuration(finalDuration)
      setAudioError(null)
      setPredictions(null)
      setStatus('idle')
    } catch (error) {
      console.error('Audio processing error:', error)
      setAudioError('Failed to process audio. Please try again.')
    }
  }

  const handleSelectedFile = async (file) => {
    if (!file) return
    if (audioBlob) {
      setAudioError('Hapus audio yang ada sebelum mengunggah yang baru.')
      return
    }
    if (!file.type.startsWith('audio/')) {
      setAudioError('Please upload an audio file.')
      return
    }
    await processAudio(file)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    await handleSelectedFile(file)
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const file = e.dataTransfer?.files?.[0]
    await handleSelectedFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!audioBlob) {
      setIsDragActive(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setAudioDuration(0)
    setPredictions(null)
    setStatus('idle')
    setAudioError(null)
  }

  const runPrediction = async () => {
    if (!audioBlob) {
      setAudioError('Please record or upload audio first.')
      return
    }

    setStatus('uploading')
    setPredictionError(null)
    const startTime = Date.now()

    try {
      const formData = new FormData()
      formData.append('files', audioBlob, 'audio.wav')

      // First upload the file
      const uploadResponse = await fetch(`${GRADIO_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: HTTP ${uploadResponse.status}`)
      }

      const uploadData = await uploadResponse.json()
      const filePath = uploadData[0] || uploadData.path || uploadData

      setStatus('inferring')

      // Choose endpoint based on model type
      let endpoint, requestBody

      if (modelType === 'wavlm_ft') {
        endpoint = `${GRADIO_BASE_URL}/api/predict/predict_wavlm_ft`
        requestBody = {
          data: [{ path: filePath, meta: { _type: 'gradio.FileData' } }]
        }
      } else {
        endpoint = `${GRADIO_BASE_URL}/api/predict/predict_baseline_ridge_audio`
        requestBody = {
          data: [
            baselineKey,
            { path: filePath, meta: { _type: 'gradio.FileData' } }
          ]
        }
      }

      const predictResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!predictResponse.ok) {
        const errorText = await predictResponse.text()
        throw new Error(`Prediction failed: ${errorText}`)
      }

      const predictData = await predictResponse.json()
      const latency = Date.now() - startTime

      setRawResponse(predictData)
      setResponseLatency(latency)

      // Parse predictions from Gradio response
      // Expected format: { data: [{ openness: 0.5, ... }] } or { data: [[0.5, 0.6, ...]] }
      const result = predictData.data?.[0]

      let parsed
      if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
        // Object format
        parsed = result
      } else if (Array.isArray(result)) {
        // Array format - assume order: O, C, E, A, N
        parsed = {
          openness: result[0],
          conscientiousness: result[1],
          extraversion: result[2],
          agreeableness: result[3],
          neuroticism: result[4]
        }
      } else {
        throw new Error('Unexpected response format')
      }

      setPredictions(parsed)
      setStatus('done')
    } catch (error) {
      console.error('Prediction error:', error)
      setPredictionError(error.message || 'Prediction failed. Please try again.')
      setStatus('error')
    }
  }

  const generateShareableLink = () => {
    if (!predictions) return ''

    const data = btoa(JSON.stringify({
      predictions,
      modelType,
      baselineKey
    }))

    return `${window.location.origin}/demo?results=${data}`
  }

  const copyShareableLink = async () => {
    const link = generateShareableLink()
    try {
      await navigator.clipboard.writeText(link)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }

  // Chart data
  const chartData = predictions ? Object.entries(predictions).map(([key, value]) => ({
    trait: traitInfo[key]?.short || key[0].toUpperCase(),
    name: traitInfo[key]?.name || key,
    value: typeof value === 'number' ? value : 0,
    fill: traitInfo[key]?.color || '#8884d8'
  })) : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">TA Personality</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Voice Personality Analysis</h1>
            <p className="text-muted-foreground">Record or upload 15 seconds of audio to analyze your Big Five traits.</p>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 justify-center mb-8 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Your audio is used only to compute predictions. Avoid uploading sensitive data.</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Audio Capture */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Audio Input
                  </CardTitle>
                  <CardDescription>Record or upload exactly 15 seconds of your voice.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Recording Controls */}
                  <div className="space-y-4">
                    {isRecording ? (
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                            <Mic className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-mono font-bold">{recordingTime.toFixed(1)}s</p>
                          <p className="text-sm text-muted-foreground">Recording...</p>
                        </div>
                        <Progress value={(recordingTime / TARGET_DURATION) * 100} className="h-2" />
                        <Button variant="destructive" onClick={stopRecording}>
                          <Square className="w-4 h-4 mr-2" />
                          Stop Recording
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 justify-center">

                        <div
                          className={`relative flex-1 rounded-lg border-2 border-dashed transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/60'
                            } ${audioBlob ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={!!audioBlob}
                          />
                          <div className="flex flex-col items-center justify-center gap-2 py-4 px-3 text-center pointer-events-none">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <div className="text-sm font-medium">Drag & drop audio</div>
                            <div className="text-xs text-muted-foreground">atau klik untuk pilih file</div>
                          </div>
                        </div>
                        <Button
                          size="lg"
                          onClick={startRecording}
                          disabled={!!audioBlob}
                          className="flex-1 p-4"
                        >
                          <Mic className="w-5 h-5 " />
                          Record Audio
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Duration requirement */}
                  <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Exactly 15 seconds required</span>
                  </div>

                  {/* Error message */}
                  {audioError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{audioError}</span>
                    </div>
                  )}

                  {/* Audio Preview */}
                  {audioUrl && (
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Audio Ready</span>
                          <span className="text-xs text-muted-foreground">({audioDuration.toFixed(1)}s)</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearAudio}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={togglePlayback}
                        className="w-full"
                      >
                        {isPlaying ? (
                          <><Pause className="w-4 h-4 mr-2" /> Pause</>
                        ) : (
                          <><Play className="w-4 h-4 mr-2" /> Play Audio</>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Model Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Model Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model Type</Label>
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wavlm_ft">
                          Fine-tuned WavLM (Recommended)
                        </SelectItem>
                        <SelectItem value="baseline">
                          Baseline Ridge Model
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {modelType === 'baseline' && (
                    <div className="space-y-2">
                      <Label>Baseline Embedding</Label>
                      <Select
                        value={baselineKey}
                        onValueChange={setBaselineKey}
                        disabled={baselinesLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={baselinesLoading ? 'Loading...' : 'Select baseline'} />
                        </SelectTrigger>
                        <SelectContent>
                          {baselines.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {baselinesError && (
                        <p className="text-xs text-yellow-500">{baselinesError}</p>
                      )}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={runPrediction}
                    disabled={!audioBlob || status === 'uploading' || status === 'inferring'}
                  >
                    {status === 'uploading' && (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading audio...</>
                    )}
                    {status === 'inferring' && (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Running inference...</>
                    )}
                    {(status === 'idle' || status === 'done' || status === 'error') && (
                      <><Brain className="w-5 h-5 mr-2" /> Predict Personality</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Results */}
            <div className="space-y-6">
              {/* Status Banner */}
              {status !== 'idle' && status !== 'done' && (
                <Card className={status === 'error' ? 'border-destructive' : 'border-primary'}>
                  <CardContent className="flex items-center gap-3 p-4">
                    {status === 'uploading' && (
                      <><Loader2 className="w-5 h-5 animate-spin text-primary" /><span>Uploading audio...</span></>
                    )}
                    {status === 'inferring' && (
                      <><Loader2 className="w-5 h-5 animate-spin text-primary" /><span>Running inference... This may take a moment.</span></>
                    )}
                    {status === 'error' && (
                      <><AlertCircle className="w-5 h-5 text-destructive" /><span className="text-destructive">{predictionError}</span></>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {predictions && status === 'done' && (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Your Results
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={copyShareableLink}>
                          {copySuccess ? (
                            <><CheckCircle className="w-4 h-4 mr-2" /> Copied!</>
                          ) : (
                            <><Share2 className="w-4 h-4 mr-2" /> Share</>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Chart */}
                      <div className="h-64 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                              type="number"
                              domain={[0, 1]}
                              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis
                              type="category"
                              dataKey="trait"
                              width={30}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <Tooltip
                              formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Score']}
                              labelFormatter={(label) => chartData.find(d => d.trait === label)?.name || label}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Trait Descriptions */}
                      <div className="space-y-3">
                        {Object.entries(predictions).map(([key, value]) => {
                          const info = traitInfo[key]
                          if (!info) return null
                          const Icon = info.icon
                          return (
                            <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${info.color}20` }}
                              >
                                <Icon className="w-4 h-4" style={{ color: info.color }} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{info.name}</span>
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted">
                                    {(value * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {getTraitDescription(key, value)}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Overall Summary */}
                      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium mb-1">What this means overall</p>
                            <p className="text-sm text-muted-foreground">
                              {getOverallSummary(predictions)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Technical Details */}
                  <Collapsible open={technicalOpen} onOpenChange={setTechnicalOpen}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                          <CardTitle className="flex items-center justify-between text-base">
                            <span>Technical Details</span>
                            {technicalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </CardTitle>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-muted-foreground">Model</p>
                              <p className="font-mono">{modelType === 'wavlm_ft' ? 'Fine-tuned WavLM' : 'Baseline Ridge'}</p>
                            </div>
                            {modelType === 'baseline' && (
                              <div>
                                <p className="text-muted-foreground">Baseline Key</p>
                                <p className="font-mono">{baselineKey}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-muted-foreground">Latency</p>
                              <p className="font-mono">{responseLatency ? `${responseLatency}ms` : 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-2">Raw Response</p>
                            <pre className="p-3 rounded-lg bg-muted overflow-auto text-xs max-h-48">
                              {JSON.stringify(rawResponse, null, 2)}
                            </pre>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </>
              )}

              {/* Empty State */}
              {!predictions && status === 'idle' && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <BarChart3 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">No Results Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Record or upload 15 seconds of audio, then click "Predict Personality" to see your results.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Big Five Quick Reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About Big Five (OCEAN)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>O</strong>penness - Curiosity, imagination, preference for novelty.</p>
                  <p><strong>C</strong>onscientiousness - Organization, discipline, goal-directed behavior.</p>
                  <p><strong>E</strong>xtraversion - Social energy, assertiveness, talkativeness.</p>
                  <p><strong>A</strong>greeableness - Empathy, cooperation, kindness.</p>
                  <p><strong>N</strong>euroticism - Emotional sensitivity, tendency toward stress.</p>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <div className="text-xs text-muted-foreground p-4 rounded-lg bg-muted/30">
                <p className="font-medium mb-1">Disclaimers:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This is an experimental academic demo.</li>
                  <li>Predictions are probabilistic and may be inaccurate.</li>
                  <li>Not for medical/clinical decisions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
