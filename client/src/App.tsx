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
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const res = await fetch(`https://catholic-readings.vercel.app/api/${formattedDate}`);
    if (!res.ok) throw new Error("API failure");

    const data = await res.json();
    let liturgicalDay = data.title || "Daily Gospel";
    
    // Manual Correction for March 2026 offset
    if (today.getFullYear() === 2026 && today.getMonth() === 2 && today.getDate() <= 8) {
      liturgicalDay = liturgicalDay.replace("3rd Week", "2nd Week");
    }

    const reference = data.gospel?.reference || "Luke 16:19-31";

    const bibleRes = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
    if (!bibleRes.ok) throw new Error("Bible API offline");

    const bibleData = await bibleRes.json();

    return {
      reference: bibleData.reference || reference,
      liturgicalDay: liturgicalDay,
      text: bibleData.text || "Loading daily word...",
    };
  } catch (error) {
    console.error("Fetch Error:", error);
   return {
      reference: "Luke 16:19-31",
      liturgicalDay: "Thursday of the 2nd Week of Lent",
      text: "There was a certain rich man, which was clothed in purple and fine linen, and fared sumptuously every day: And there was a certain beggar named Lazarus, which was laid at his gate, full of sores, And desiring to be fed with the crumbs which fell from the rich man's table: moreover the dogs came and licked his sores. And it came to pass, that the beggar died, and was carried by the angels into Abraham's bosom: the rich man also died, and was buried; And in hell he lift up his eyes, being in torments, and seeth Abraham afar off, and Lazarus in his bosom.",
    };
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
