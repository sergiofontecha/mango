import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex justify-center">
      <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
        <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
          <strong>Welcome to range project</strong>
        </p>
      </div>
    </main>
  )
}
