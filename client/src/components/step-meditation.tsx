export function StepMeditation({ meditationText, onMeditationChange }: { meditationText: string, onMeditationChange: (val: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif text-center">Meditatio</h2>
      <p className="text-center text-muted-foreground">Reflect on the word or phrase that stood out to you.</p>
      <textarea
        className="w-full min-h-[300px] p-4 rounded-xl border bg-card resize-none focus:ring-2 focus:ring-primary outline-none"
        placeholder="How does this text speak to your life today?"
        value={meditationText}
        onChange={(e) => onMeditationChange(e.target.value)}
      />
    </div>
  );
}
