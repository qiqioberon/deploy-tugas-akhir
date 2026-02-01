// @ts-nocheck
'use client'

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react'
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
  ChevronDown,
  ChevronUp,
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
  BarChart3,
  Sparkles
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
import { useLocale } from '@/components/locale-provider'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { traitText, summaryText } from '@/lib/translations'
import { listBaselines, predictBaseline, predictFineTune, type Traits } from '@/lib/gradio'

const TARGET_DURATION = 15
const SAMPLE_RATE = 16000

const traitMeta = {
  openness: { icon: Lightbulb, color: '#a855f7' },
  conscientiousness: { icon: Target, color: '#3b82f6' },
  extraversion: { icon: Users, color: '#f97316' },
  agreeableness: { icon: Heart, color: '#22c55e' },
  neuroticism: { icon: Zap, color: '#ef4444' }
}

const buildTraitInfo = (locale) => {
  const text = traitText[locale] || traitText.en
  return Object.keys(traitMeta).reduce((acc, key) => {
    acc[key] = { ...traitMeta[key], ...text[key] }
    return acc
  }, {})
}

const getTraitDescription = (trait, value, info) => {
  const data = info[trait]
  if (!data) return ''
  if (value < 0.35) return data.descriptions.low
  if (value < 0.65) return data.descriptions.medium
  return data.descriptions.high
}

const getOverallSummary = (predictions, locale) => {
  if (!predictions) return ''
  const labels = traitText[locale] || traitText.en
  const summary = summaryText[locale] || summaryText.en
  const traits = []
  if (predictions.openness > 0.6) traits.push(labels.openness.summaryLabel)
  if (predictions.conscientiousness > 0.6) traits.push(labels.conscientiousness.summaryLabel)
  if (predictions.extraversion > 0.6) traits.push(labels.extraversion.summaryLabel)
  if (predictions.agreeableness > 0.6) traits.push(labels.agreeableness.summaryLabel)
  if (predictions.neuroticism > 0.6) traits.push(labels.neuroticism.summaryLabel)

  if (traits.length === 0) {
    return summary.balanced
  }

  return `${summary.intro}${traits.join(', ')}${summary.outro}`
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

function DemoContent() {
  const searchParams = useSearchParams()
  const { locale, copy } = useLocale()
  const t = copy.demo
  const common = copy.common
  const traitInfo = useMemo(() => buildTraitInfo(locale), [locale])

  // Audio state
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
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

  // Reset results when model changes
  useEffect(() => {
    setPredictions(null)
    setRawResponse(null)
    setStatus('idle')
  }, [modelType, baselineKey])

  // Hide results when audio cleared
  useEffect(() => {
    if (!audioFile) {
      setPredictions(null)
      setRawResponse(null)
      setStatus('idle')
    }
  }, [audioFile])

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
      const list = await listBaselines()
      setBaselines(Array.isArray(list) ? list : [])
      if (list.length > 0) {
        setBaselineKey(list[0])
      }
    } catch (error) {
      console.error('Failed to fetch baselines:', error)
      setBaselinesError(error?.message || t.baselineError)
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
      setAudioError(t.errors.microphone)
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
        setAudioError(t.errors.duration(duration.toFixed(1)))
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
      const fileName = `audio.${(finalBlob.type?.split('/')?.[1] || 'wav')}`
      const file = new File([finalBlob], fileName, { type: finalBlob.type || 'audio/wav' })
      setAudioFile(file)
      setAudioUrl(url)
      setAudioDuration(finalDuration)
      setAudioError(null)
      setPredictions(null)
      setStatus('idle')
    } catch (error) {
      console.error('Audio processing error:', error)
      setAudioError(t.errors.processing)
    }
  }

  const handleSelectedFile = async (file) => {
    if (!file) return
    if (audioFile) {
      setAudioError(t.errors.existingAudio)
      return
    }
    if (!file.type.startsWith('audio/')) {
      setAudioError(t.errors.fileType)
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
    if (!audioFile) {
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
    setAudioFile(null)
    setAudioUrl(null)
    setAudioDuration(0)
    setPredictions(null)
    setStatus('idle')
    setAudioError(null)
  }

  const runPrediction = async () => {
    if (!audioFile) {
      setAudioError(t.errors.missingAudio)
      return
    }

    setStatus('uploading')
    setPredictionError(null)
    const startTime = Date.now()

    try {
      setStatus('inferring')
      const traits = modelType === 'wavlm_ft'
        ? await predictFineTune(audioFile)
        : await predictBaseline(baselineKey, audioFile)

      const latency = Date.now() - startTime
      setResponseLatency(latency)
      setRawResponse(traits)
      setPredictions(traits)
      setStatus('done')
    } catch (error) {
      console.error('Prediction error:', error)
      setPredictionError(error.message || t.errors.prediction)
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">{common.brand}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {common.backHome}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="container mx-auto px-6 md:px-8 py-14">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Title */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{common.brand}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{t.title}</h1>
              <p className="text-muted-foreground max-w-2xl">{t.subtitle}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                <Shield className="w-4 h-4" />
                <span>{t.privacy}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* Left Panel - Audio Capture & Model */}
              <div className="flex flex-col gap-8 w-full col-span-1">
                <Card className="shadow-md border-border/60">
                  <CardHeader className="pb-2 px-6 pt-6">
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      {t.audioCardTitle}
                    </CardTitle>
                    <CardDescription>{t.audioCardDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 px-6 pb-6">
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
                            <p className="text-sm text-muted-foreground">{t.recordingLabel}</p>
                          </div>
                          <Progress value={(recordingTime / TARGET_DURATION) * 100} className="h-2" />
                          <Button variant="destructive" onClick={stopRecording}>
                            <Square className="w-4 h-4 mr-2" />
                            {t.stopRecording}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 justify-center">

                          <div
                            className={`relative flex-1 rounded-lg border-2 border-dashed transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/60'
                              } ${audioFile ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
                              disabled={!!audioFile}
                            />
                            <div className="flex flex-col items-center justify-center gap-2 py-4 px-3 text-center pointer-events-none">
                              <Upload className="w-5 h-5 text-muted-foreground" />
                              <div className="text-sm font-medium">{t.dragDropTitle}</div>
                              <div className="text-xs text-muted-foreground">{t.dragDropSubtitle}</div>
                            </div>
                          </div>
                          <Button
                            size="lg"
                            onClick={startRecording}
                            disabled={!!audioFile}
                            className="flex-1 p-4"
                          >
                            <Mic className="w-5 h-5 " />
                            {t.recordButton}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Duration requirement */}
                    <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{t.durationRequirement}</span>
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
                            <span className="text-sm font-medium">{t.audioReady}</span>
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
                            <><Pause className="w-4 h-4 mr-2" /> {t.pause}</>
                          ) : (
                            <><Play className="w-4 h-4 mr-2" /> {t.play}</>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Model Selection */}
                <Card className="shadow-md border-border/60">
                  <CardHeader className="pb-2 px-6 pt-6">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      {t.modelCardTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    <div className="space-y-2">
                      <Label>{t.modelTypeLabel}</Label>
                      <Select value={modelType} onValueChange={setModelType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wavlm_ft">
                            {t.modelOptionWavlm}
                          </SelectItem>
                          <SelectItem value="baseline">
                            {t.modelOptionBaseline}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {modelType === 'baseline' && (
                      <div className="space-y-2">
                        <Label>{t.baselineLabel}</Label>
                        <Select
                          value={baselineKey}
                          onValueChange={setBaselineKey}
                          disabled={baselinesLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={baselinesLoading ? t.baselineLoading : t.baselinePlaceholder} />
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
                          <p className="text-xs text-yellow-500">{baselinesError || t.baselineError}</p>
                        )}
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={runPrediction}
                      disabled={!audioFile || status === 'uploading' || status === 'inferring'}
                    >
                      {status === 'uploading' && (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t.statusUploading}</>
                      )}
                      {status === 'inferring' && (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t.statusInferring}</>
                      )}
                      {(status === 'idle' || status === 'done' || status === 'error') && (
                        <><Brain className="w-5 h-5 mr-2" /> {t.predict}</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Results */}
              <div className="flex flex-col gap-8 w-full lg:sticky lg:top-28 col-span-1">
                {/* Status Banner */}
                {status !== 'idle' && status !== 'done' && (
                  <Card className={status === 'error' ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'}>
                    <CardContent className="flex items-center gap-3 p-4">
                      {status === 'uploading' && (
                        <><Loader2 className="w-5 h-5 animate-spin text-primary" /><span>{t.statusUploadNote}</span></>
                      )}
                      {status === 'inferring' && (
                        <><Loader2 className="w-5 h-5 animate-spin text-primary" /><span>{t.statusInferenceNote}</span></>
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
                    <Card className="shadow-lg border-border/60">
                      <CardHeader className="px-6 pt-6 pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            {t.resultsTitle}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {responseLatency && <span>{t.latency}: {responseLatency}ms</span>}
                            <Button variant="outline" size="sm" onClick={copyShareableLink}>
                              {copySuccess ? (
                                <><CheckCircle className="w-4 h-4 mr-2" /> {t.copied}</>
                              ) : (
                                <><Share2 className="w-4 h-4 mr-2" /> {t.share}</>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
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
                                    {getTraitDescription(key, value, traitInfo)}
                                  </p>
                                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${Math.min(Math.max(Number(value) * 100, 0), 100).toFixed(0)}%`,
                                        background: info.color || '#6b21a8'
                                      }}
                                    />
                                  </div>
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
                              <p className="font-medium mb-1">{t.traitOverallHeading}</p>
                              <p className="text-sm text-muted-foreground">
                                {getOverallSummary(predictions, locale)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technical Details */}
                    <Collapsible open={technicalOpen} onOpenChange={setTechnicalOpen}>
                      <Card className="shadow-sm border-border/60">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors px-6 pt-6 pb-3">
                            <CardTitle className="flex items-center justify-between text-base">
                              <span>{t.technicalDetails}</span>
                              {technicalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </CardTitle>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="space-y-3 text-sm px-6 pb-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-muted-foreground">{t.model}</p>
                                <p className="font-mono">{modelType === 'wavlm_ft' ? t.modelOptionWavlm : t.modelOptionBaseline}</p>
                              </div>
                              {modelType === 'baseline' && (
                                <div>
                                  <p className="text-muted-foreground">{t.baselineKey}</p>
                                  <p className="font-mono">{baselineKey}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-muted-foreground">{t.latency}</p>
                                <p className="font-mono">{responseLatency ? `${responseLatency}ms` : 'N/A'}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-2">{t.rawResponse}</p>
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
                  <Card className="border-dashed shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold">{t.emptyStateTitle}</h3>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        {t.emptyStateSubtitle}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Big Five Quick Reference */}
                <Card className="shadow-sm border-border/60">
                  <CardHeader className="px-6 pt-6 pb-3">
                    <CardTitle className="text-base">{t.aboutTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2 px-6 pb-6">
                    {t.aboutItems.map((item) => {
                      const [abbr, rest] = item.split(' - ')
                      return (
                        <p key={item}><strong>{abbr[0]}</strong>{abbr.slice(1)} - {rest}</p>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                <div className="text-xs text-muted-foreground p-4 rounded-lg bg-muted/40 border border-border/60">
                  <p className="font-medium mb-1">{common.disclaimerTitle}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {common.disclaimers.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={null}>
      <DemoContent />
    </Suspense>
  )
}
