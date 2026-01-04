"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "./types"
import { api } from "./api"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (id: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (id: string, password: string) => {
    try {
      const response = await api.login({ user: { id, password } })

      // Store token and user
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("auth_user", JSON.stringify(response.user))

      setToken(response.token)
      setUser(response.user)

      // Check if user needs to change password
      const userDetails = await api.getUser(id)
      router.push("/dashboard")
      
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      throw error
    }
  }

  const logout = () => {
    api.logout().catch(() => {
      // Continue with logout even if API call fails
    })

    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
