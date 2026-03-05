"use client"
import { useState, useEffect, useCallback } from "react"
import { ProgressBar } from "@/components/progress-bar"
import { StepReading } from "@/components/step-reading"
import { StepMeditation } from "@/components/step-meditation"
import { StepPrayer } from "@/components/step-prayer"
import { StepContemplation } from "@/components/step-contemplation"
import { NavigationButtons } from "@/components/navigation-buttons"

const TOTAL_STEPS = 4

async function fetchDailyGospel() {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const res = await fetch(`https://catholic-readings.vercel.app/api/${formattedDate}`);
    if (!res.ok) throw new Error("API failure");
    const data = await res.json();
    
    let liturgicalDay = data.title || "Daily Gospel";
    
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

  const loadGospel = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchDailyGospel()
      setDailyGospel(data)
    } catch (err) {
      console.error("Component error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGospel()
  }, [loadGospel])

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background/80 px-4 py-6 backdrop-blur-md md:px-6">
        <h1 className="text-center font-serif text-2xl font-bold tracking-tight md:text-3xl text-primary">
          Lectio Divina
        </h1>
        <div className="mx-auto mt-2 h-px w-8 bg-accent/50" />
      </header>

      <div className="pb-6 pt-4 md:pb-8 md:pt-6">
        <ProgressBar currentStep={currentStep} />
      </div>

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

      <footer className="sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4 md:px-6">
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onNext={nextStep}
           onBack={prevStep}
          />
        </div>
      </footer>
    </div>
  )
}
