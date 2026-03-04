export function StepReading({ dailyGospel, isLoading }: { dailyGospel: any, isLoading: boolean }) {
  if (isLoading) return <div className="text-center italic">Loading...</div>;
  if (!dailyGospel) return <div className="text-center text-destructive">Error loading Gospel.</div>;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-serif italic text-muted-foreground">{dailyGospel.liturgicalDay}</h2>
        <h3 className="text-2xl font-serif font-bold mt-2">{dailyGospel.reference}</h3>
      </div>
      <div className="prose prose-stone dark:prose-invert mx-auto">
        <p className="text-xl leading-relaxed first-letter:text-4xl first-letter:font-serif">{dailyGospel.text}</p>
      </div>
    </div>
  );
}
