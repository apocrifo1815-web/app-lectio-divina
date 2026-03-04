import { useRoute, Link } from "wouter";
import { useSession } from "@/hooks/use-sessions";
import { Layout } from "@/components/layout";
import { format } from "date-fns";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SessionDetail() {
  const [, params] = useRoute("/session/:id");
  const sessionId = params?.id ? parseInt(params.id, 10) : 0;
  
  const { data: session, isLoading, isError } = useSession(sessionId);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (isError || !session) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto w-full px-6 py-20 text-center">
          <h2 className="text-2xl font-serif text-foreground mb-4">Session Not Found</h2>
          <p className="text-muted-foreground mb-8">This reflection may have been removed or doesn't exist.</p>
          <Link href="/" className="inline-flex items-center text-primary font-medium hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
          </Link>
        </div>
      </Layout>
    );
  }

  const sections = [
    { title: "Lectio", subtitle: "Reading", content: session.lectioNotes },
    { title: "Meditatio", subtitle: "Reflection", content: session.meditatioNotes },
    { title: "Oratio", subtitle: "Response", content: session.oratioNotes },
    { title: "Contemplatio", subtitle: "Rest", content: session.contemplatioNotes },
  ].filter(s => s.content && s.content.trim().length > 0);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-12 md:py-20 pb-32">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Journey
        </Link>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-panel p-8 md:p-14 rounded-[2rem] relative overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 p-8 opacity-5 text-primary pointer-events-none">
            <BookOpen className="w-48 h-48" />
          </div>

          <header className="mb-14 relative z-10">
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">
              {format(new Date(session.createdAt), "EEEE, MMMM d, yyyy")}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
              {session.passage}
            </h1>
          </header>

          <div className="space-y-12 relative z-10">
            {sections.length === 0 ? (
              <p className="text-xl text-muted-foreground italic font-serif">
                A silent meditation. No notes were recorded for this session.
              </p>
            ) : (
              sections.map((section, idx) => (
                <motion.section 
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                  className="group"
                >
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-xl font-serif font-medium text-foreground">
                      {section.title}
                    </h2>
                    <span className="text-sm text-muted-foreground font-medium tracking-wide">
                      · {section.subtitle}
                    </span>
                  </div>
                  <div className="pl-4 border-l-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-300">
                    <p className="text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                </motion.section>
              ))
            )}
          </div>
        </motion.article>
      </div>
    </Layout>
  );
}
