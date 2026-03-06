"use client"
import { useState, useEffect, useCallback } from "react"
import { ProgressBar } from "@/components/progress-bar"
import { StepReading } from "@/components/step-reading"
import { StepMeditation } from "@/components/step-meditation"
import { StepPrayer } from "@/components/step-prayer"
import { StepContemplation } from "@/components/step-contemplation"
import { NavigationButtons } from "@/components/navigation-buttons"

// Importando o seu arquivo local de leituras
import lectioData from "./dados-leitura.json"

const TOTAL_STEPS = 4

function getLocalGospel() {
  try {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`; // Formato "03-07"

    // @ts-ignore
    const data = lectioData[dateKey];

    if (data) {
      return {
        reference: data.reference,
        liturgicalDay: data.day || "Daily Gospel",
        text: data.text,
      };
    }

    // Caso não encontre a data no JSON, mostra um aviso amigável
    return {
      reference: "Check back tomorrow",
      liturgicalDay: "Liturgical Calendar",
      text: "Peace be with you. The readings for this specific date are being updated. Please check the Saint of the Day in the meantime.",
    };
  } catch (error) {
    console.error("Error loading local lectio:", error);
    return {
      reference: "Error",
      liturgicalDay: "System Offline",
      text: "Please check your lectio.json file structure.",
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

  const loadGospel = useCallback(() => {
    setIsLoading(true)
    const data = getLocalGospel()
    setDailyGospel(data)
    setIsLoading(false)
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
