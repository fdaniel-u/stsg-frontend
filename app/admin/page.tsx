"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await login(email, password)
      localStorage.setItem("admin_token", data.access_token)
      router.push("/admin/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#1a1a1a] p-4">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[#c8a882] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#7ec8c0] blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Geometric accents */}
        <div className="absolute -left-3 -top-3 h-6 w-6 bg-[#7ec8c0]" />
        <div className="absolute -bottom-3 -right-3 h-6 w-6 bg-[#c8a882]" />
        <div className="absolute -right-3 -top-3 h-3 w-3 bg-[#c8a882]" />
        <div className="absolute -bottom-3 -left-3 h-3 w-3 bg-[#7ec8c0]" />

        <div className="rounded-2xl bg-[#f5f0eb] p-10 shadow-xl">
          {/* Admin Access Tag */}
          <p className="mb-2 text-center text-xs uppercase tracking-widest text-[#c8a882]">
            ACCESO ADMINISTRATIVO
          </p>

          {/* Logo */}
          <h1 className="mb-6 text-center font-serif text-3xl font-bold text-[#1a1a1a]">
            STSG Calidad Total
          </h1>

          {/* Title */}
          <h2 className="mb-8 text-center font-serif text-2xl text-[#1a1a1a]">
            Bienvenido
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#1a1a1a]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-[#1a1a1a] placeholder-[#999] transition-all focus:border-[#c8a882] focus:outline-none focus:ring-2 focus:ring-[#c8a882]"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#1a1a1a]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-[#1a1a1a] placeholder-[#999] transition-all focus:border-[#c8a882] focus:outline-none focus:ring-2 focus:ring-[#c8a882]"
                placeholder="Tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-[#c8a882] px-4 py-3 font-medium text-white transition-all hover:bg-[#b89872] focus:outline-none focus:ring-2 focus:ring-[#c8a882] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
