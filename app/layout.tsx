import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShippedToday - Discover Daily Launches',
  description: 'Share and discover what the community shipped today',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-2xl font-bold text-gray-900">
                    📦 ShippedToday
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <a 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Launches
                  </a>
                  <a 
                    href="/submit" 
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Submit Launch
                  </a>
                </div>
              </nav>
            </div>
          </header>
          
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600">
              <p>&copy; 2024 ShippedToday. Built for the community.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 