import { Link, useLocation } from "wouter";
import { BookOpen } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isGuidedFlow = location === "/session/new";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle organic background gradient blobs to give a calming aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-[-1]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/40 blur-[100px] pointer-events-none z-[-1]" />

      {!isGuidedFlow && (
        <header className="w-full py-8 px-6 md:px-12 flex items-center justify-between z-10 max-w-6xl mx-auto">
          <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
              <BookOpen className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <span className="font-serif text-2xl font-medium tracking-tight text-foreground">
              Lectio
            </span>
          </Link>
          
          <nav>
            <Link 
              href="/session/new" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Start Session
            </Link>
          </nav>
        </header>
      )}

      <main className="flex-1 flex flex-col z-10">
        {children}
      </main>
    </div>
  );
}
