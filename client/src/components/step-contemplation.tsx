export function StepContemplation({ dailyGospel, meditationText, prayerText }: { dailyGospel: any, meditationText: string, prayerText: string }) {
  return (
    <div className="space-y-8 text-center">
      <h2 className="text-2xl font-serif">Contemplatio</h2>
      <p className="text-muted-foreground italic">Rest silently in God's presence.</p>
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-muted/50 text-left space-y-4">
        <h3 className="font-bold border-b pb-2">Session Summary</h3>
        <p className="text-sm font-medium">Passage: {dailyGospel?.reference}</p>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meditation</p>
          <p className="text-sm italic">{meditationText || "Resting in silence..."}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prayer</p>
          <p className="text-sm italic">{prayerText || "Heart to heart conversation..."}</p>
        </div>
      </div>
    </div>
  );
}
