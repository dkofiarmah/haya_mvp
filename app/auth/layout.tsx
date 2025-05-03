export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Simple header for auth pages */}
      <header className="w-full py-4 px-6 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center font-bold text-lg">
            <img src="/haya-logo.svg" alt="HAYA Logo" className="h-8 mr-2" />
            HAYA
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} HAYA B2B SaaS for Tour Operators
        </div>
      </footer>
    </div>
  )
}
