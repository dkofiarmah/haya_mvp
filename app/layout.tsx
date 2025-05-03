import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/components/providers/supabase-provider"
import { SupabaseAuthProvider } from "@/components/providers/supabase-auth-provider"
import { OrganizationProvider } from "@/lib/organizations"
import "./globals.css"
import { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { NavigationProgress } from "@/components/navigation-progress"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "HAYA | AI-Powered Tour Operator Platform", // Improved SEO Title
  description: "HAYA: The intelligent platform for modern tour operators. Automate tasks, enhance client communication, and grow your business with our Digital Assistant.", // Improved SEO Description
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SupabaseProvider>
            <SupabaseAuthProvider>
              <OrganizationProvider>
                <NavigationProgress />
                {children}
                <Toaster />
              </OrganizationProvider>
            </SupabaseAuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
