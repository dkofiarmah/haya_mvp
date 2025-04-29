export default function ShareableLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-blue-600">Haya</a>
            </div>
            <div>
              <a 
                href="/register" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} Haya. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</a>
              <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
              <a href="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
