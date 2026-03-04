import { useSessions } from "@/hooks/use-sessions";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Feather, Plus, ArrowRight, Loader2 } from "lucide-react";

export default function Home() {
  const { data: sessions, isLoading, isError } = useSessions();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full px-6 md:px-12 pb-24">
        
        {/* Hero Section */}
        <section className="py-16 md:py-24 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-serif text-foreground leading-tight mb-6"
          >
            Read, reflect, <br className="hidden md:block"/>
            <span className="text-primary italic">and rest.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg"
          >
            A guided space for Lectio Divina. Slow down, listen deeply, and meditate on scripture at your own pace.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <Link 
              href="/session/new"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Begin a Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </section>

        {/* Previous Sessions */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
            <h2 className="text-2xl font-serif text-foreground">Your Journey</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              <span className="font-medium">Loading your sessions...</span>
            </div>
          ) : isError ? (
            <div className="py-16 text-center text-destructive bg-destructive/5 rounded-2xl border border-destructive/10">
              <p>Unable to load sessions. Please try again.</p>
            </div>
          ) : sessions?.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 border-dashed">
              <div className="w-16 h-16 mb-6 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
                <Feather className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Your spiritual journey begins here. Start your first Lectio Divina session to record your reflections.
              </p>
              <Link 
                href="/session/new"
                className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Start First Session
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions?.map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link 
                    href={`/session/${session.id}`}
                    className="block group h-full bg-card rounded-2xl p-6 border border-border/60 hover:border-primary/30 meditation-shadow hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                        {format(new Date(session.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                      {session.passage}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {session.lectioNotes || session.meditatioNotes || "No reflection notes..."}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </div>
    </Layout>
  );
}
