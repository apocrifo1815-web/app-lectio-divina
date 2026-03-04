"use client"

import { useState, useEffect, useCallback } from "react"
import { ProgressBar } from "@/components/progress-bar"
import { StepReading } from "@/components/step-reading"
import { StepMeditation } from "@/components/step-meditation"
import { StepPrayer } from "@/components/step-prayer"
import { StepContemplation } from "@/components/step-contemplation"
import { NavigationButtons } from "@/components/navigation-buttons"

const TOTAL_STEPS = 4

/**
 * Fetches the daily Gospel automatically from the Catholic Liturgical Calendar API.
 */
async function fetchDailyGospel() {
  try {
    const res = await fetch(`https://catholic-readings.vercel.app/api/today`);
    if (!res.ok) throw new Error("API failure");
    
    const data = await res.json();
    const reference = data.gospel?.reference || "Matthew 5:17-19";
    const liturgicalDay = data.title || "Daily Gospel";

    // Fetch the text from Bible-API
    const bibleRes = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
    if (!bibleRes.ok) throw new Error("Bible API offline");
    
    const bibleData = await bibleRes.json();

    return {
      reference: bibleData.reference || reference,
      liturgicalDay: liturgicalDay,
      text: bibleData.text || "Loading daily word...",
    };

  } catch (error) {
    console.error("Erro geral:", error);
    // Fallback for March 4th if API fails
    return {
      reference: "Matthew 5:17-19",
      liturgicalDay: "Wednesday of the 3rd Week of Lent",
      text: "Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil. For verily I say unto you, Till heaven and earth pass, one jot or one tittle shall in no wise pass from the law, till all be fulfilled. Whosoever therefore shall break one of these least commandments, and shall teach men so, he shall be called the least in the kingdom of heaven: but whosoever shall do and teach them, the same shall be called great in the kingdom of heaven.",
    };
  }
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [dailyGospel, setDailyGospel] = useState<{
    reference: string
    text: string
    liturgicalDay: string
  } | null>(null)
  const [meditationText, setMeditationText] = useState("")
  const [prayerText, setPrayerText] = useState("")

  useEffect(() => {
    setIsLoading(true)
    fetchDailyGospel()
      .then((data) => {
        setDailyGospel(data)
      })
      .catch((err) => {
        console.error("Gospel fetch component error:", err);
        setDailyGospel(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex flex-col items-center pb-2 pt-6 md:pt-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          A Contemplative Practice
        </p>
        <h1 className="mt-1 font-serif text-xl font-medium text-foreground md:text-2xl">
          Lectio Divina
        </h1>
        <div className="mx-auto mt-2 h-px w-8 bg-accent/50" />
      </header>

      {/* Progress */}
      <div className="pb-6 pt-4 md:pb-8 md:pt-6">
        <ProgressBar currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 md:px-6">
        <div className="transition-opacity duration-500">
          {currentStep === 0 && (
            <StepReading dailyGospel={dailyGospel} isLoading={isLoading} />
          )}
          {currentStep === 1 && (
            <StepMeditation
              meditationText={meditationText}
              onMeditationChange={setMeditationText}
            />
          )}
          {currentStep === 2 && (
            <StepPrayer prayerText={prayerText} onPrayerChange={setPrayerText} />
          )}
          {currentStep === 3 && (
            <StepContemplation
              dailyGospel={dailyGospel}
              meditationText={meditationText}
              prayerText={prayerText}
            />
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4 md:px-6">
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onBack={goBack}
            onNext={goNext}
          />
        </div>
      </footer>
    </div>
  )
}
