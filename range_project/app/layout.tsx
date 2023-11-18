import './global.css'
import { montserrat } from '../assets/fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <footer className="py-10 flex justify-center items-center">This footer was made with ❤️ by Sergio</footer>
      </body>
    </html>
  )
}
