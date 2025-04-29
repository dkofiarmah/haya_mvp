"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Play, MessageSquare, Users, Clock } from "lucide-react"
import { AuthNav } from "@/components/auth-nav"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/auth-helpers-nextjs'

// Core benefits for tour operators
const benefits = [
  {
    title: "Streamlined Bookings",
    description: "Unified booking system that converts 2x more inquiries into confirmed tours.",
    icon: <FileText className="h-6 w-6 text-primary" />
  },
  {
    title: "Responsive Client Service",
    description: "Instant responses to inquiries across all channels, even when you're offline.",
    icon: <MessageSquare className="h-6 w-6 text-primary" />
  },
  {
    title: "Team Coordination",
    description: "Keep guides, drivers and staff in sync with shared calendars and itineraries.",
    icon: <Users className="h-6 w-6 text-primary" />
  },
  {
    title: "Time-Saving Tools",
    description: "Automate repetitive admin tasks and save 15+ hours every week.",
    icon: <Clock className="h-6 w-6 text-primary" />
  }
]

// Single impactful testimonial
const testimonial = {
  quote: "Haya has completely transformed how we run our tours. We've cut admin time by 70% and bookings are up 35%.",
  author: "Sarah Thompson",
  company: "Adventure Trails Kenya",
  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
}

export default function LandingPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize Supabase client
  const supabase = createClientComponentClient();
  
  // Check for user session on component mount
  useEffect(() => {
    async function getUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error fetching user session:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    getUserSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  
  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>See how Haya works</DialogTitle>
            <DialogDescription>
              Watch our demo video to see how Haya can transform your tour operations
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.svg" 
                alt="Haya" 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
              <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">HAYA</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="#benefits" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Benefits</Link>
              <button onClick={openVideoModal} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Demo</button>
              <Link href="#testimonial" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Results</Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AuthNav />
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean, minimal, conversion-focused */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 rounded-full bg-amber-50 text-primary text-sm font-medium mb-6 shadow-sm border border-amber-100">
                FOR TOUR OPERATORS
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                Run Your Tour Business <span className="text-primary">Without The Headaches</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                One platform to manage bookings, client communication, and payments. Save 15+ hours every week while delighting your customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-white hover:bg-primary/90">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-white hover:bg-primary/90">
                      Start Free 14-Day Trial
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={openVideoModal}
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto px-8 py-6 text-base border-amber-300 text-primary hover:bg-amber-50"
                >
                  <Play className="mr-2 h-4 w-4" /> Watch Demo
                </Button>
              </div>
              <p className="text-sm text-gray-500 mb-8">No credit card required • Setup in minutes</p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
                <Image
                  src="https://images.unsplash.com/photo-1535941339077-2dd1c7963098?q=80&w=600&h=400&auto=format&fit=crop"
                  alt="Safari Experience"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits - Clear, concise value proposition */}
      <section id="benefits" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need To <span className="text-primary">Run Your Tours</span>
            </h2>
            <p className="text-lg text-gray-600">
              One unified platform that eliminates manual tasks and boosts your revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Single focused testimonial */}
      <section id="testimonial" className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto bg-primary/5 p-8 md:p-10 rounded-2xl border border-primary/10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-white shadow-lg">
                <Image 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  width={96} 
                  height={96} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-lg md:text-xl text-gray-700 mb-4 relative">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-medium text-gray-800">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Clear, focused action */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Start Streamlining Your Tour Operations Today
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join 500+ tour operators saving time and delighting customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto px-10 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-white hover:bg-primary/90">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto px-10 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-white hover:bg-primary/90">
                    Start Free 14-Day Trial
                  </Button>
                </Link>
              )}
              <Button 
                onClick={openVideoModal}
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto px-8 py-6 text-base border-primary text-primary hover:bg-primary/5"
              >
                <Play className="mr-2 h-4 w-4" /> Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simple and minimal */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image 
                src="/logo.svg" 
                alt="Haya" 
                width={24} 
                height={24} 
                className="h-6 w-6 mr-2"
              />
              <span className="font-medium text-gray-600">© {new Date().getFullYear()} Haya. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-primary transition-colors">Privacy</Link>
              <Link href="/contact" className="text-gray-500 hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
