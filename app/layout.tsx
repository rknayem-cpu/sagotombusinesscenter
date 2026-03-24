import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Sagotom Business Center',
  description: 'আমাদের জন্য সবকিছু এক জায়গায় - সাগতম বিজনেস সেন্টার',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (


<html lang="bn" suppressHydrationWarning>
  

  
  <body suppressHydrationWarning>
  <Navbar />
    {children}
    <Footer /> 
  </body>
</html>


  )
}
