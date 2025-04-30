'use client'

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Compass, MessageCircle, Zap, Sparkles, X, Menu } from "lucide-react"
import FloatingCTABanner from "@/components/floating-cta-banner"
import "./landing-page.css" // Keep custom styles if needed

// Simple fade-in hook
const useFadeIn = (ref: React.RefObject<Element>) => {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100) // Simple delay
    // Optional: IntersectionObserver logic can be added here for more robust animation triggering
    return () => clearTimeout(timer)
  }, [ref])
  return isVisible
}

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showCTABanner, setShowCTABanner] = useState(true)

  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const heroVisible = useFadeIn(heroRef)
  const featuresVisible = useFadeIn(featuresRef)
  const ctaVisible = useFadeIn(ctaRef)

  useEffect(() => {
    setMounted(true)
    // Preload logo
    const img = new global.Image();
    img.src = '/logo.svg';
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
      {/* Floating CTA Banner */}
      {showCTABanner && <FloatingCTABanner onClose={() => setShowCTABanner(false)} />}
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group" aria-label="Haya Home">
              <Image 
                src="/logo.svg" 
                alt="Haya Logo" 
                width={36} 
                height={36} 
                className="text-primary group-hover:opacity-80 transition-opacity"
                priority // Prioritize logo loading
              />
              <span className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors font-display">haya</span>
            </Link>
            
            {/* Main Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              {[
                { name: 'Features', href: '#features' },
                { name: 'Testimonials', href: '#testimonials' },
                { name: 'FAQ', href: '#faq' }
              ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {mounted && user ? (
                <Button 
                  className="rounded-full px-4 py-2 transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => router.push('/dashboard')}
                  aria-label="Go to your dashboard"
                >
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Link href="/login" aria-label="Login to your account">
                    <Button variant="ghost" className="rounded-full px-4 py-2 hover:bg-accent transition-colors">Login</Button>
                  </Link>
                  <Link href="/register" aria-label="Sign up for a free account">
                    <Button className="rounded-full px-4 py-2 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90">
                      Start Free
                      <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">14d</span>
                    </Button>
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 px-2 border-t border-border/20 animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col space-y-4 pb-4">
                {[
                  { name: 'Features', href: '#features' },
                  { name: 'Testimonials', href: '#testimonials' },
                  { name: 'FAQ', href: '#faq' }
                ].map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors text-sm font-medium px-2 py-1.5 rounded-md hover:bg-secondary/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-border/20 mt-2 space-y-3">
                  <Link href="/login" aria-label="Login to your account" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start rounded-md">Login</Button>
                  </Link>
                  <Link href="/register" aria-label="Sign up for a free account" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className={`relative py-12 sm:py-16 overflow-hidden transition-opacity duration-1000 ease-out ${heroVisible ? "opacity-100" : "opacity-0 translate-y-4"}`}
        >
          {/* Subtle Background - Consider a very faint, large-scale abstract graphic or texture here */} 
          <div className="absolute inset-0 z-0 opacity-30">
             <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background" />
             {/* Adding a subtle pattern for visual interest */}
             <div className="absolute inset-0 opacity-10">
               <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
               <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
             </div>
          </div>
          
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 animate-pulse">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>AI-powered tour management reimagined</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance leading-tight sm:leading-tight lg:leading-tight font-display">
                <div className="typewriter-container">
                  <div className="typewriter-text">
                    Turn <span className="text-primary">Tour Chaos</span> Into <span className="text-primary">Business Magic</span>
                    <span className="typewriter-cursor" aria-hidden="true"></span>
                  </div>
                </div>
                <span className="block text-muted-foreground font-normal text-xl sm:text-2xl mt-6 font-sans">The Digital Assistant Every Tour Operator Has Been Waiting For</span>
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl text-muted-foreground/90 mb-16 max-w-[58rem] mx-auto text-balance leading-relaxed text-center">
              Haya combines AI intelligence with powerful automation to eliminate administrative overload. 
              Manage bookings, generate itineraries, and respond to clients — all from one intelligent platform.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" aria-label="Get started with a free account">
                <Button size="lg" className="rounded-full px-6 py-2.5 shadow-md hover:shadow-primary/20 hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="#features" aria-label="Learn more about Haya's features">
                <Button size="lg" variant="outline" className="rounded-full px-6 py-2.5 border-border/60 hover:bg-secondary/30 hover:border-primary/20 transition-all duration-300 font-medium">
                  See How It Works
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 text-sm text-muted-foreground/60 flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          {/* Subtle decorative line with animation */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
        </section>
        
        {/* Features Section */}
        <section 
          id="features" 
          ref={featuresRef}
          className={`py-10 sm:py-12 bg-secondary/5 transition-opacity duration-1000 ease-out ${featuresVisible ? "opacity-100" : "opacity-0 translate-y-4"}`}
        >
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[52rem] mx-auto text-center mb-10">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-secondary/30 text-muted-foreground border border-border/30">
                <Bot className="mr-2 h-4 w-4" />
                <span>AI-Powered Features</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-balance font-display">Transform Your Tour Operations</h2>
              <p className="text-lg text-muted-foreground/90 text-balance max-w-2xl mx-auto">Powerful automation that handles the tedious work while you focus on creating unforgettable experiences for your clients.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {/* Feature Cards - Painkiller Focused */}
              {[ 
                { 
                  icon: Sparkles, 
                  title: "AI Itinerary Generator", 
                  description: "Create personalized travel plans in seconds with our AI engine. Input preferences, budget, and dates to generate stunning itineraries that wow your clients.", 
                  highlight: "Save 15+ hours per week"
                },
                { 
                  icon: MessageCircle, 
                  title: "Unified Client Communication", 
                  description: "Connect WhatsApp, email, SMS and more in one inbox. Haya's AI can even draft responses and handle common questions automatically.", 
                  highlight: "Respond 5x faster"
                },
                { 
                  icon: Compass, 
                  title: "Intelligent Operations Hub", 
                  description: "Manage bookings, payments, and vendor relationships in one dashboard. Get automated reminders and insights to prevent problems before they happen.", 
                  highlight: "95% less manual admin"
                }
              ].map((feature, index) => (
                <div key={index} className="group relative p-8 border border-border/20 rounded-xl bg-card shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center overflow-hidden">
                  {/* Animated background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground relative z-10 font-display">{feature.title}</h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow text-center relative z-10">{feature.description}</p>
                  
                  <div className="mt-6 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium bg-secondary/30 text-primary border border-primary/20 relative z-10">
                    {feature.highlight}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Social Proof */}
            <div className="mt-24 text-center">
              <p className="text-sm uppercase tracking-wider text-muted-foreground/70 mb-6">Trusted by tour operators worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {['Serengeti Adventures', 'Coastal Expeditions', 'Himalaya Trek Co', 'Urban Explorer Tours', 'Safari Unlimited'].map((company, i) => (
                  <div key={i} className="text-muted-foreground/50 font-medium text-lg">{company}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 sm:py-15 bg-background relative overflow-hidden">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
              <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl"></div>
            </div>

            <div className="max-w-[52rem] mx-auto text-center mb-12">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-5 rounded-full text-sm font-medium bg-secondary/30 text-muted-foreground border border-border/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Why Choose Haya</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-balance font-display">Elevate Your Operations</h2>
              <p className="text-lg text-muted-foreground/90 text-balance max-w-2xl mx-auto">The modern approach to tour management</p>
            </div>
            
            {/* Comparison Header */}
            <div className="grid grid-cols-3 mb-6 max-w-5xl mx-auto">
              <div className="col-span-1"></div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Haya
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center px-4 py-2 bg-card text-muted-foreground rounded-full font-medium">
                  Traditional Approach
                </div>
              </div>
            </div>
            
            {/* Comparison Rows */}
            <div className="space-y-6 max-w-5xl mx-auto">
              {[
                {
                  feature: "Itinerary Creation",
                  haya: "AI generates complete itineraries in seconds",
                  traditional: "Hours of manual work for each client",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )
                },
                {
                  feature: "Client Communication",
                  haya: "Unified inbox with AI-assisted responses",
                  traditional: "Multiple platforms and manual responses",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  )
                },
                {
                  feature: "Booking Management",
                  haya: "Automated tracking and notifications",
                  traditional: "Spreadsheets and manual follow-ups",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  feature: "Payment Processing",
                  haya: "Integrated secure payments, automatic reminders",
                  traditional: "Separate systems and manual tracking",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )
                }
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-3 bg-card rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  {/* Feature column */}
                  <div className="p-5 flex items-center gap-4 border-r border-border/20">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {row.icon}
                    </div>
                    <h3 className="font-medium text-lg">{row.feature}</h3>
                  </div>
                  
                  {/* Haya column */}
                  <div className="p-5 bg-primary/5 flex items-center">
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary mr-3 flex-shrink-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-foreground">{row.haya}</p>
                    </div>
                  </div>
                  
                  {/* Traditional column */}
                  <div className="p-5 bg-card/30 flex items-center">
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-red-500/10 text-red-500 mr-3 flex-shrink-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">{row.traditional}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional comparative advantage */}
          </div>
        </section>

        {/* Client Results Section */}
        <section className="py-10 sm:py-14 bg-background relative overflow-hidden">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-[52rem] mx-auto text-center mb-10">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-secondary/30 text-muted-foreground border border-border/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Real Results</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance font-display">Measurable Impact on Your Business</h2>
              <p className="text-lg text-muted-foreground/90 text-balance">Our clients report dramatic improvements across their operations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  metric: "68%",
                  title: "Time Saved on Admin Tasks",
                  description: "Operators report reclaiming more than two-thirds of their administrative time thanks to Haya's automation."
                },
                {
                  metric: "42%",
                  title: "Increased Conversion Rate",
                  description: "Faster response times and personalized itineraries lead to significantly higher booking conversions."
                },
                {
                  metric: "93%",
                  title: "Customer Satisfaction",
                  description: "Clients report higher satisfaction scores thanks to faster responses and seamless communication."
                }
              ].map((stat, index) => (
                <div key={index} className="bg-card p-8 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
                  <div className="font-bold text-5xl text-primary mb-4">{stat.metric}</div>
                  <h3 className="font-semibold text-xl mb-3">{stat.title}</h3>
                  <p className="text-muted-foreground text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
        
          </div>
        </section>

        {/* Adding Testimonial Section */}
        <section id="testimonials" className="py-10 sm:py-14 bg-secondary/5 relative overflow-hidden">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-[52rem] mx-auto text-center mb-10">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-secondary/30 text-muted-foreground border border-border/30">
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Success Stories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance font-display">From Overwhelmed to Thriving</h2>
              <p className="text-lg text-muted-foreground/90 text-balance">Hear from tour operators who transformed their businesses with Haya</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "Before Haya, I was spending 70% of my time on admin. Now it's down to 20%, and our bookings have increased by 40% because I can focus on creating amazing experiences.",
                  author: "Sarah Omondi",
                  role: "Founder, Kenya Safari Experiences",
                  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                },
                {
                  quote: "The AI itinerary generator alone is worth every penny. What used to take hours now takes minutes, and clients are amazed by how personalized everything feels.",
                  author: "Michael Cheruiyot",
                  role: "CEO, Adventure East Africa",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                },
                {
                  quote: "Our response time went from 24 hours to under 1 hour. Haya's AI handles 80% of common questions, and clients love how quickly they get answers.",
                  author: "Amina Hassan",
                  role: "Operations Director, Coastal Tours",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-card p-8 rounded-xl border border-border/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <div className="mb-6 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <blockquote className="text-foreground/90 text-lg italic mb-6 flex-grow">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center mt-auto">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        width={48} 
                        height={48}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </section>
        
         {/* FAQ Section */}
        <section id="faq" className="py-10 sm:py-14 bg-background relative overflow-hidden">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-[52rem] mx-auto text-center mb-10">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-secondary/30 text-muted-foreground border border-border/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Common Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance font-display">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground/90 text-balance">Everything you need to know about Haya and how it can transform your tour business</p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "How long does it take to get started with Haya?",
                  answer: "Most tour operators are up and running within just 24 hours. Our onboarding process is streamlined, and our team provides personalized support to ensure you're getting maximum value right away."
                },
                {
                  question: "Do I need technical knowledge to use Haya?",
                  answer: "Not at all. Haya is designed to be incredibly user-friendly. If you can use email or social media, you can use Haya. Our AI assistant provides guidance along the way, and our support team is always available to help."
                },
                {
                  question: "How does the AI itinerary generator work?",
                  answer: "Our AI analyzes thousands of successful tour itineraries, local attractions, and seasonal factors. You input basic parameters like duration, budget, and traveler preferences, and the AI generates a fully customized itinerary. You can then tweak and adjust as needed before sending to your clients."
                },
                {
                  question: "Can Haya integrate with my existing booking system?",
                  answer: "Yes, Haya integrates with most popular booking systems and payment processors. We provide APIs and pre-built integrations for seamless connection to your existing tools. Our team can help evaluate your specific setup during onboarding."
                },
                {
                  question: "What kind of support do you offer?",
                  answer: "We provide 24/7 email support, live chat during business hours, and weekly check-ins during your first month. Premium plans include dedicated account managers and priority support. Our help center also contains detailed guides and video tutorials."
                },
                {
                  question: "Is my data secure with Haya?",
                  answer: "Absolutely. We use bank-level encryption, regular security audits, and comply with global data protection regulations. Your data and your clients' information are always protected. We never share or sell your data to third parties."
                }
              ].map((faq, index) => (
                <div key={index} className="border border-border/40 rounded-lg overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer marker:content-none">
                      <h3 className="font-medium text-lg">{faq.question}</h3>
                      <span className="relative flex-shrink-0 ml-1.5 w-5 h-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-5 w-5 transition-transform duration-300 ease-out group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground">
                      <p className="text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">Didn't find what you were looking for?</p>
              <Link href="/contact" aria-label="Contact our support team">
                <Button variant="outline" className="rounded-full px-6 py-2 border-border/60 hover:border-primary/30">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
    
      </main>

      {/* Simplified Footer for MVP */}
      <footer className="bg-card py-8 border-t border-border/20">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.svg" 
                alt="Haya Logo" 
                width={28} 
                height={28}
              />
              <span className="text-lg font-semibold text-foreground font-display">haya</span>
            </div>
            <p className="text-sm text-muted-foreground">Revolutionizing tour management with AI-powered automation.</p>
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Haya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
