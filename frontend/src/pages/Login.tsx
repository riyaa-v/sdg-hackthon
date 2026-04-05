import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = { onLogin: (user?: { email: string }) => void }

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Minimal client-side "auth" — in a real app replace with API call
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    // mark logged in
    try {
      localStorage.setItem('s2s_auth', JSON.stringify({ email }))
      onLogin({ email })
      navigate('/')
    } catch (err) {
      setError('Unable to persist login state')
    }
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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.75),rgba(0,0,0,0.9))] -z-10" />

      <div className="relative mx-auto flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[rgba(20,25,30,0.6)] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-white/70">Sign in to view your profile and run analyses.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-white/70">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-accent/60"
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-white outline-none focus:ring-2 focus:ring-accent/60"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="text-sm text-rose-400">{error}</div>}

            <div className="mt-4">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-[10px] bg-[radial-gradient(circle_at_0%_0%,#1b2a23,#0f1714)] px-4 py-2 text-sm font-medium text-white shadow transition hover:brightness-110"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
