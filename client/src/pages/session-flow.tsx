import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateSession } from "@/hooks/use-sessions";
import { X, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import type { SessionInput } from "@shared/routes";

/**
 * Fetches the daily Gospel automatically from the Catholic Liturgical Calendar API.
 */
async function fetchDailyGospel() {
  try {
    const res = await fetch(`https://catholic-readings.vercel.app/api/today`);
    if (!res.ok) throw new Error("Catholic Readings API offline");
    const data = await res.json();
    
    // Extract gospel reference or use a fallback
    const reference = data.gospel?.reference || "Matthew 5:17-19";
    const liturgicalDay = data.title || "Daily Gospel";

    // Fetch the actual text from Bible-API
    const bibleRes = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
    if (!bibleRes.ok) throw new Error("Bible API offline");
    
    const bibleData = await bibleRes.json();

    return {
      reference: bibleData.reference || reference,
      liturgicalDay: liturgicalDay,
      text: bibleData.text || "Loading daily word...",
    };

  } catch (error) {
    console.error("Erro ao buscar evangelho:", error);
    // Fallback exactly as requested for March 4th if API fails
    return {
      reference: "Matthew 5:17-19",
      liturgicalDay: "Wednesday of the 9th Week in Ordinary Time",
      text: "Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil. For verily I say unto you, Till heaven and earth pass, one jot or one tittle shall in no wise pass from the law, till all be fulfilled. Whosoever therefore shall break one of these least commandments, and shall teach men so, he shall be called the least in the kingdom of heaven: but whosoever shall do and teach them, the same shall be called great in the kingdom of heaven.",
    };
  }
}

const STEPS = [
  {
    id: "setup",
    title: "Preparation",
    prompt: "What scriptural passage will you meditate on today?",
    placeholder: "Loading today's Gospel...",
    field: "passage" as keyof SessionInput,
  },
  {
    id: "lectio",
    title: "Lectio (Read)",
    prompt: "Read the passage slowly. What word or phrase stands out to you?",
    description: "Don't analyze it yet. Just let the text speak and notice what captures your attention.",
    placeholder: "The word that stood out to me was...",
    field: "lectioNotes" as keyof SessionInput,
  },
  {
    id: "meditatio",
    title: "Meditatio (Reflect)",
    prompt: "How does this connect to your life right now?",
    description: "Reflect on why God might be bringing this word or phrase to your attention today.",
    placeholder: "I feel like this relates to...",
    field: "meditatioNotes" as keyof SessionInput,
  },
  {
    id: "oratio",
    title: "Oratio (Respond)",
    prompt: "What is your prayer to God based on this?",
    description: "Speak honestly with God about what you've read and reflected upon.",
    placeholder: "Lord, I ask that...",
    field: "oratioNotes" as keyof SessionInput,
  },
  {
    id: "contemplatio",
    title: "Contemplatio (Rest)",
    prompt: "Rest in God's presence.",
    description: "Sit quietly. No words are necessary. Write any final thoughts when you are ready to conclude.",
    placeholder: "(Optional) Final thoughts or feelings of peace...",
    field: "contemplatioNotes" as keyof SessionInput,
  }
];

export default function SessionFlow() {
  const [, setLocation] = useLocation();
  const createSession = useCreateSession();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadingGospel, setIsLoadingGospel] = useState(true);
  const [formData, setFormData] = useState<SessionInput>({
    passage: "",
    lectioNotes: "",
    meditatioNotes: "",
    oratioNotes: "",
    contemplatioNotes: "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch daily gospel on mount
  useEffect(() => {
    fetchDailyGospel().then(data => {
      setFormData(prev => ({ ...prev, passage: data.reference }));
      setIsLoadingGospel(false);
    });
  }, []);

  // Auto-focus input when step changes
  useEffect(() => {
    if (currentStep === 0) {
      inputRef.current?.focus();
    } else {
      textareaRef.current?.focus();
    }
  }, [currentStep, isLoadingGospel]);

  const stepInfo = STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = isFirstStep ? formData.passage.trim().length > 0 : true;

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (isLastStep) {
      createSession.mutate(formData, {
        onSuccess: (data) => {
          setLocation(`/session/${data.id}`);
        }
      });
    }
  };

  const handleChange = (val: string) => {
    setFormData((prev) => ({ ...prev, [stepInfo.field]: val }));
  };

  // Allow Command+Enter to advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (isLastStep) handleComplete();
      else handleNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50 overflow-hidden">
      
      {/* Top Header */}
      <header className="flex-none flex items-center justify-between p-6">
        <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium tracking-wide uppercase">
          <span className="text-foreground">{currentStep + 1}</span>
          <div className="w-8 h-[2px] bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <span>{STEPS.length}</span>
        </div>
        
        <button 
          onClick={() => setLocation("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Cancel session"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-6 md:px-12 max-w-4xl mx-auto w-full pb-32">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col"
          >
            <h2 className="text-primary font-medium tracking-widest uppercase mb-4 text-sm md:text-base">
              {stepInfo.title}
            </h2>
            <h1 className="text-3xl md:text-5xl font-serif text-foreground leading-tight mb-4">
              {stepInfo.prompt}
            </h1>
            
            {stepInfo.description && (
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                {stepInfo.description}
              </p>
            )}

            <div className={`mt-8 ${!stepInfo.description ? 'mt-12' : ''}`}>
              {isFirstStep ? (
                <div className="relative">
                  {isLoadingGospel && (
                    <div className="absolute right-0 top-0 pt-2 pr-2">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={formData.passage}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={stepInfo.placeholder}
                    className="w-full text-2xl md:text-4xl bg-transparent border-b-2 border-border/60 focus:border-primary pb-4 placeholder:text-muted focus:outline-none transition-colors"
                  />
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={formData[stepInfo.field] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={stepInfo.placeholder}
                  className="w-full min-h-[200px] text-xl md:text-2xl bg-transparent border-none resize-none placeholder:text-muted focus:outline-none leading-relaxed"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <footer className="flex-none p-6 md:p-10 flex items-center justify-between max-w-4xl mx-auto w-full border-t border-border/40 bg-background/80 backdrop-blur-md">
        <button
          onClick={handleBack}
          disabled={isFirstStep}
          className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
            isFirstStep 
              ? "opacity-0 pointer-events-none" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>

        {!isLastStep ? (
          <button
            onClick={handleNext}
            disabled={!canProceed || isLoadingGospel}
            className={`flex items-center px-8 py-3 rounded-full font-medium shadow-lg transition-all duration-300 ${
              canProceed && !isLoadingGospel
                ? "bg-foreground text-background hover:scale-105 hover:shadow-xl" 
                : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
            }`}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={createSession.isPending}
            className="flex items-center px-8 py-3 rounded-full font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:transform-none transition-all duration-300"
          >
            {createSession.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Complete Session
                <Check className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        )}
      </footer>

    </div>
  );
}
