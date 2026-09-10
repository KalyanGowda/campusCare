import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Building2 } from "lucide-react"
import { clsx } from "clsx"
import { apiFetch } from "../api"

export function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      if (!isLogin) {
        // Register
        const res = await apiFetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? "Registration failed.")
          setLoading(false)
          return
        }
        // Auto-login after successful registration
        const loginRes = await apiFetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
        const loginData = await loginRes.json()
        if (!loginRes.ok) {
          setError(loginData.error ?? "Login failed after registration.")
          setLoading(false)
          return
        }
        redirectByRole(loginData.role)
      } else {
        // Login
        const res = await apiFetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? "Login failed.")
          setLoading(false)
          return
        }
        redirectByRole(data.role)
      }
    } catch (err) {
      setError("Could not reach the server. Is the backend running on port 3000? Check the browser console for details.")
      console.error("Login fetch error:", err)
      setLoading(false)
    }
  }

  const redirectByRole = (role: string) => {
    if (role === "student") navigate("/student")
    else if (role === "staff") navigate("/staff")
    else if (role === "admin") navigate("/admin")
    else setError("Unknown role received from server.")
  }

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      {/* Left Column */}
      <div className="w-[55%] flex flex-col justify-center px-16 lg:px-32 relative">
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="w-8 h-8 bg-navy text-white font-bold flex items-center justify-center rounded-sm">
            C
          </div>
          <span className="font-semibold text-navy text-sm tracking-wide">
            Campus Alert &amp; Resolution Engine
          </span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-semibold text-navy mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-ink-muted text-sm mb-8">
            {isLogin
              ? "Sign in with your college email and password."
              : "Students only. Staff and Admin accounts are created by your administrator."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-line rounded-md px-4 py-2.5 outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                  placeholder="e.g. Arjun Kumar"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink">College Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-line rounded-md px-4 py-2.5 outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                placeholder="you@bmsit.in"
                required
              />
              <p className="text-xs text-ink-muted mt-1">
                Use your college email — e.g. you@bmsit.in
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-line rounded-md px-4 py-2.5 outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                required
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border border-line rounded-md px-4 py-2.5 outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-danger text-sm bg-danger/5 border border-danger/20 rounded-md px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-navy-deep disabled:opacity-60 text-white font-medium py-3 rounded-md mt-2 transition-colors"
            >
              {loading ? "Please wait…" : isLogin ? "Log In" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError("") }}
              className="text-navy font-medium text-sm hover:underline"
            >
              {isLogin
                ? "New here? Create a student account"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-[45%] bg-navy flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="grid grid-cols-3 gap-4 transform -rotate-6 scale-110 z-10 p-12">
          {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((block, i) => (
            <div
              key={block}
              className={clsx(
                "w-24 h-24 rounded-lg bg-navy-deep border border-white/10 flex items-center justify-center shadow-2xl",
                i === 4 ? "bg-accent/20 border-accent/40" : "",
                i % 2 === 0 ? "translate-y-4" : "-translate-y-4",
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <Building2 className={clsx("w-6 h-6", i === 4 ? "text-accent" : "text-white/40")} />
                <span className={clsx("text-xs font-semibold", i === 4 ? "text-accent" : "text-white/60")}>
                  Block {block}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 z-10 text-white/50 text-sm tracking-widest uppercase font-medium flex items-center gap-3 bg-navy-deep/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Serving 6 blocks across BMSIT&M campus.
        </div>
      </div>
    </div>
  )
}
