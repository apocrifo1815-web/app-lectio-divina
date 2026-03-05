"use client"
import { useState, useEffect } from "react"
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
    <div className=\"flex min-h-screen flex-col bg-background text-foreground\">
      <header className=\"border-b border-border bg-background/80 px-4 py-6 backdrop-blur-md md:px-6\">\n        <h1 className=\"text-center font-serif text-2xl font-bold tracking-tight md:text-3xl text-primary\">\n          Lectio Divina\n        </h1>\n        <div className=\"mx-auto mt-2 h-px w-8 bg-accent/50\" />\n      </header>\n\n      <div className=\"pb-6 pt-4 md:pb-8 md:pt-6\">\n        <ProgressBar currentStep={currentStep} />\n      </div>\n\n      <main className=\"mx-auto w-full max-w-3xl flex-1 px-4 pb-8 md:px-6\">\n        <div className=\"transition-opacity duration-500\">\n          {currentStep === 0 && (\n            <StepReading dailyGospel={dailyGospel} isLoading={isLoading} />\n          )}\n          {currentStep === 1 && (\n            <StepMeditation\n              meditationText={meditationText}\n              onMeditationChange={setMeditationText}\n            />\n          )}\n          {currentStep === 2 && (\n            <StepPrayer prayerText={prayerText} onPrayerChange={setPrayerText} />\n          )}\n          {currentStep === 3 && (\n            <StepContemplation\n              dailyGospel={dailyGospel}\n              meditationText={meditationText}\n              prayerText={prayerText}\n            />\n          )}\n        </div>\n      </main>\n\n      <footer className=\"sticky bottom-0 border-t border-border bg-background/80 backdrop-blur-md\">\n        <div className=\"mx-auto max-w-3xl px-4 py-4 md:px-6\">\n          <NavigationButtons\n            currentStep={currentStep}\n            totalSteps={TOTAL_STEPS}\n            onNext={nextStep}\n            onPrev={prevStep}\n          />\n        </div>\n      </footer>\n    </div>\n  )\n}
