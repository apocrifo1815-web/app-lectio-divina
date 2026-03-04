export function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ["Reading", "Meditation", "Prayer", "Contemplation"];
  return (
    <div className="flex justify-center space-x-4">
      {steps.map((step, i) => (
        <div key={i} className={`h-1 w-12 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
      ))}
    </div>
  );
}
