import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = { onLogout: () => void }

export function ProfilePage({ onLogout }: Props) {
  const [email, setEmail] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('s2s_auth')
      if (raw) {
        const obj = JSON.parse(raw)
        setEmail(obj.email ?? null)
      }
    } catch (err) {
      setEmail(null)
    }
  }, [])

  const initials = useMemo(() => {
    if (!email) return 'U'
    const name = String(email).split('@')[0] || String(email)
    const parts = name.split(/[^A-Za-z0-9]+/).filter(Boolean)
    const chars = parts.map((p) => p[0]?.toUpperCase() ?? '')
    return (chars[0] ?? 'U') + (chars[1] ?? '')
  }, [email])

  const handleLogout = () => {
    localStorage.removeItem('s2s_auth')
    onLogout()
    navigate('/')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-white">
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover -z-20"
        src="/videos/video3.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6),rgba(0,0,0,0.85))] -z-10" />

      <div className="relative mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[rgba(10,15,12,0.45)] p-10 shadow-[0_40px_140px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/8 text-2xl font-semibold text-white">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
              <div className="mt-2 text-sm text-white/60">Member since {new Date().getFullYear()}</div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-white/6 bg-white/2 p-4">
              <div className="text-xs text-white/60">Email</div>
              <div className="mt-2 text-lg font-medium text-white">{email ?? 'Unknown'}</div>
            </div>

            <div className="rounded-lg border border-white/6 bg-white/2 p-4">
              <div className="text-xs text-white/60">Account</div>
              <div className="mt-2 text-lg font-medium text-white">Standard user</div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-[10px] bg-[radial-gradient(circle_at_0%_0%,#1b2a23,#0f1714)] px-4 py-2 text-sm font-medium text-white shadow hover:brightness-110"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
