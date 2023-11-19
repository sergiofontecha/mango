import Link from 'next/link'
import NavLinks from './navLinks'

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link className="text-3xl mb-2 flex h-20 items-center justify-center rounded-md bg-white p-4 md:h-40" href="/">
        MANGO technical test
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-full w-full grow rounded-md bg-transparent md:block"></div>
      </div>
    </div>
  )
}
