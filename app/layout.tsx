import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Wh from '@/components/Wh';
import Script from 'next/script'
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
  
<head>
  <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
              fbq('init', '1318681156539545');
              fbq('track', 'PageView');
            `,
          }}
        />
</head>
  
  <body suppressHydrationWarning>
  <Navbar />
    {children}
    <Wh />
    <Footer /> 
  </body>
</html>


  )
}
