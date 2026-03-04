export function StepPrayer({ prayerText, onPrayerChange }: { prayerText: string, onPrayerChange: (val: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif text-center">Oratio</h2>
      <p className="text-center text-muted-foreground">Talk to God about what you've reflected upon.</p>
      <textarea
        className="w-full min-h-[300px] p-4 rounded-xl border bg-card resize-none focus:ring-2 focus:ring-primary outline-none"
        placeholder="What is your heart's response to God?"
        value={prayerText}
        onChange={(e) => onPrayerChange(e.target.value)}
      />
    </div>
  );
}
