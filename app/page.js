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
import { useLocale } from '@/components/locale-provider'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'

export default function LandingPage() {
  const { copy } = useLocale()
  const t = copy.landing
  const common = copy.common

  const howCards = t.howSteps.map((step, idx) => ({
    ...step,
    step: idx + 1,
    icon: [Mic, Cpu, BarChart3][idx] || Mic
  }))

  const traitVisuals = {
    openness: { icon: Lightbulb, color: 'from-purple-500 to-pink-500' },
    conscientiousness: { icon: Target, color: 'from-blue-500 to-cyan-500' },
    extraversion: { icon: Users, color: 'from-orange-500 to-yellow-500' },
    agreeableness: { icon: Heart, color: 'from-green-500 to-emerald-500' },
    neuroticism: { icon: Zap, color: 'from-red-500 to-rose-500' }
  }

  const traitCards = t.bigFiveTraits.map((trait) => {
    const visual = traitVisuals[trait.key] || {}
    return { ...trait, icon: visual.icon || Lightbulb, color: visual.color || 'from-primary/80 to-primary' }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">{common.brand}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/demo">
              <Button size="sm">
                {t.ctaPrimary}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t.heroBadge}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t.heroTitleLine1}
            <br />
            <span className="gradient-text">{t.heroTitleAccent}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/demo">
              <Button size="lg" className="text-lg px-8">
                <Mic className="w-5 h-5 mr-2" />
                {t.ctaPrimary}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#how-it-works">
                {t.ctaSecondary}
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {t.trustBadges.map((label, idx) => {
              const Icon = [Clock, Shield, Zap][idx] || Clock
              return (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.howTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.howSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howCards.map((item) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.modelsTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.modelsSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{t.models.wavlmTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t.models.wavlmTagline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.models.wavlmBody}
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
                    <CardTitle>{t.models.baselineTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t.models.baselineTagline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t.models.baselineBody}
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {t.models.baselineList.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.bigFiveTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.bigFiveSubtitle}</p>
          </div>
          
          <div className="grid gap-4">
            {traitCards.map((trait) => (
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.faqTitle}</h2>
            <p className="text-muted-foreground text-lg">{t.faqSubtitle}</p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {t.faqItems.map((item, index) => (
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
              <p><strong className="text-foreground">{common.disclaimerTitle}</strong></p>
              <ul className="space-y-1 list-disc list-inside">
                {common.disclaimers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t.ctaSubtitle}
          </p>
          <Link href="/demo">
            <Button size="lg" className="text-lg px-8">
              <Mic className="w-5 h-5 mr-2" />
              {t.ctaButton}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>{t.footerNote}</p>
        </div>
      </footer>
    </div>
  )
}
