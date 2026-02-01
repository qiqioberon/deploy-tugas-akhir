'use client'

import Link from 'next/link'
import { 
  Mic, 
  Brain, 
  BarChart3, 
  Sparkles, 
  Clock, 
  Shield, 
  ChevronRight,
  Lightbulb,
  Heart,
  Users,
  Target,
  Zap,
  HelpCircle,
  ArrowRight,
  Volume2,
  Cpu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const bigFiveTraits = [
  {
    name: 'Openness',
    short: 'O',
    description: 'Curiosity, imagination, preference for novelty and variety.',
    icon: Lightbulb,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Conscientiousness', 
    short: 'C',
    description: 'Organization, discipline, goal-directed behavior.',
    icon: Target,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Extraversion',
    short: 'E', 
    description: 'Social energy, assertiveness, talkativeness.',
    icon: Users,
    color: 'from-orange-500 to-yellow-500'
  },
  {
    name: 'Agreeableness',
    short: 'A',
    description: 'Empathy, cooperation, kindness toward others.',
    icon: Heart,
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Neuroticism',
    short: 'N',
    description: 'Emotional sensitivity, tendency toward stress/worry.',
    icon: Zap,
    color: 'from-red-500 to-rose-500'
  }
]

const howItWorks = [
  {
    step: 1,
    title: 'Record or Upload',
    description: 'Provide exactly 15 seconds of your voice. Read a passage or speak naturally.',
    icon: Mic
  },
  {
    step: 2,
    title: 'Choose Model',
    description: 'Select between fine-tuned WavLM or baseline ridge models with various embeddings.',
    icon: Cpu
  },
  {
    step: 3,
    title: 'Get Results',
    description: 'View your Big Five personality prediction with detailed explanations.',
    icon: BarChart3
  }
]

const faqItems = [
  {
    question: 'How accurate are the predictions?',
    answer: 'This is an experimental academic demo. Predictions are probabilistic and based on research models. They should not be used for clinical or employment decisions.'
  },
  {
    question: 'Why exactly 15 seconds?',
    answer: 'The models were trained on 15-second audio clips. Using this exact duration ensures consistent and reliable predictions.'
  },
  {
    question: 'What happens to my audio?',
    answer: 'Your audio is processed only for prediction. We do not store your recordings. Everything happens in real-time.'
  },
  {
    question: 'What\'s the difference between models?',
    answer: 'Fine-tuned WavLM was specifically trained for personality prediction. Baseline models use pre-trained audio embeddings with ridge regression.'
  },
  {
    question: 'Can I use this for hiring or clinical diagnosis?',
    answer: 'No. This demo is for educational and research purposes only. It should not be used for any consequential decisions.'
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">TA Personality</span>
          </div>
          <Link href="/demo">
            <Button size="sm">
              Try Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Experimental Research Demo</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Personality
            <br />
            <span className="gradient-text">From Your Voice</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload or record 15 seconds of audio. Our AI models analyze vocal patterns 
            to predict your Big Five (OCEAN) personality traits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/demo">
              <Button size="lg" className="text-lg px-8">
                <Mic className="w-5 h-5 mr-2" />
                Try Demo Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#how-it-works">
                Learn More
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>15 seconds only</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>No data stored</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to your personality profile</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <Card key={item.step} className="relative overflow-hidden glass-card border-0">
                <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                  {item.step}
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Models Available */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Models Available</h2>
            <p className="text-muted-foreground text-lg">Choose your preferred prediction model</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Fine-tuned WavLM</CardTitle>
                    <p className="text-sm text-muted-foreground">Recommended</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A WavLM model specifically fine-tuned for personality trait prediction. 
                  Directly maps audio features to Big Five traits.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Baseline Ridge Models</CardTitle>
                    <p className="text-sm text-muted-foreground">Multiple options</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Traditional approach using audio embeddings + ridge regression. 
                  Choose from different embedding types:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• eGeMAPS (acoustic features)</li>
                  <li>• wav2vec2 (self-supervised)</li>
                  <li>• HuBERT (speech representation)</li>
                  <li>• WavLM (general audio)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Big Five Explained */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Big Five (OCEAN)</h2>
            <p className="text-muted-foreground text-lg">Understanding the five fundamental personality dimensions</p>
          </div>
          
          <div className="grid gap-4">
            {bigFiveTraits.map((trait) => (
              <Card key={trait.short} className="glass-card border-0">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${trait.color} flex items-center justify-center shrink-0`}>
                    <trait.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">{trait.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{trait.short}</span>
                    </div>
                    <p className="text-muted-foreground">{trait.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Common questions about the demo</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-lg border-0 px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    <span>{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="py-12 px-4 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Shield className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong className="text-foreground">Important Disclaimers:</strong></p>
              <ul className="space-y-1 list-disc list-inside">
                <li>This is an experimental academic demo for research purposes only.</li>
                <li>Predictions are probabilistic and may be inaccurate.</li>
                <li>Not intended for medical, clinical, or employment decisions.</li>
                <li>Your audio is used only to compute predictions. Avoid uploading sensitive data.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Try?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Record or upload 15 seconds of audio and discover your personality profile.
          </p>
          <Link href="/demo">
            <Button size="lg" className="text-lg px-8">
              <Mic className="w-5 h-5 mr-2" />
              Start Demo
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>TA Personality Demo • Research Project • Not for commercial use</p>
        </div>
      </footer>
    </div>
  )
}
