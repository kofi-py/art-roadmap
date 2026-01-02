import './globals.css'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import CookieConsent from '../components/CookieConsent'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: 'Art Roadmap - Learn Art from K-12 to College',
  description: '80 free art courses with immersive 3D experiences',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="proxima-nova-font antialiased">
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
