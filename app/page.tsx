import Logo3D from '@/components/Logo3D'
import Link from 'next/link'

function CubeSymbol({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 40 46" className={className} fill="none">
      <path d="M20 2 L37 12 L37 34 L20 44 L3 34 L3 12 Z" stroke={color} strokeWidth="1.2" />
      <path d="M20 2 L20 24 L3 12" stroke={color} strokeWidth="1.2" />
      <path d="M20 24 L37 12" stroke={color} strokeWidth="1.2" />
      <path d="M20 24 L20 44" stroke={color} strokeWidth="1.2" />
    </svg>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-influux-charcoal flex flex-col items-center justify-center px-6">

      <div className="absolute inset-0 bg-gradient-to-br from-influux-charcoal via-[#232538] to-influux-charcoal" />

      {/* Breathing glow blobs */}
      <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-influux-blue/30 rounded-full blur-[100px] animate-breathe" />
      <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-influux-green/25 rounded-full blur-[100px] animate-breathe [animation-delay:2s]" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-influux-blue/10 rounded-full blur-[80px] animate-breathe [animation-delay:4s]" />

      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <CubeSymbol color="#3498DB" className="hidden sm:block absolute top-20 left-[12%] w-10 h-10 opacity-40 animate-float" />
      <CubeSymbol color="#34C759" className="hidden sm:block absolute top-40 right-[15%] w-8 h-8 opacity-40 animate-float [animation-delay:1.5s]" />
      <CubeSymbol color="#F9F9F9" className="hidden sm:block absolute bottom-32 left-[18%] w-7 h-7 opacity-20 animate-float [animation-delay:3s]" />
      <CubeSymbol color="#3498DB" className="hidden sm:block absolute bottom-24 right-[10%] w-9 h-9 opacity-30 animate-float [animation-delay:0.8s]" />

      {/* Content - staggered entrance */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="animate-fade-in-up [animation-delay:0.1s]">
          <Logo3D />
        </div>

        <h1 className="text-4xl font-bold text-influux-offwhite tracking-tight mt-4 animate-fade-in-up [animation-delay:0.4s]">
          INFLUUX
        </h1>
        <p className="text-influux-offwhite/60 mt-2 text-center animate-fade-in-up [animation-delay:0.6s]">
          Empowering Collaboration, Driving Success
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md animate-fade-in-up [animation-delay:0.8s]">
          <Link
            href="/signup/creator"
            className="group flex-1 flex items-center justify-center gap-2 text-center bg-influux-blue text-white font-semibold py-4 px-6 rounded-2xl shadow-[0_8px_30px_rgba(52,152,219,0.35)] hover:shadow-[0_8px_30px_rgba(52,152,219,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            I am a Creator
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <Link
            href="/signup/business"
            className="group flex-1 flex items-center justify-center gap-2 text-center bg-transparent border-2 border-influux-green/60 text-influux-offwhite font-semibold py-4 px-6 rounded-2xl hover:bg-influux-green/10 hover:border-influux-green hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            I am a Business
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}