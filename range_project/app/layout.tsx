import './global.css'
import { montserrat } from '../assets/fonts'
import SideNav from './ui/home/navComponent'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-screen">
      <body className={`${montserrat.className} antialiased min-h-screen flex-col`}>
        <div className="flex min-h-screen">
          <div className="w-full flex-none md:w-64 bg-gray-300">
            <SideNav />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto pt-96">{children}</div>
        </div>
      </body>
    </html>
  )
}
