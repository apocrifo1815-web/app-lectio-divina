import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
}

export function NavigationButtons({ currentStep, totalSteps, onBack, onNext }: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center w-full">
      <button
        onClick={onBack}
        disabled={currentStep === 0}
        className="flex items-center px-4 py-2 rounded-lg hover:bg-muted disabled:opacity-0 transition-all font-medium text-muted-foreground"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      <button
        onClick={onNext}
        className="flex items-center px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-sm"
      >
        {currentStep === totalSteps - 1 ? "Finish" : "Next"}
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
}
