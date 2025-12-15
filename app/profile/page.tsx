"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

interface User {
  id: string
  email: string
  fullName: string
  nationalId: string
  phoneNumber: string
  role: string
  password: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    role: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("bankiti_current_user")

    if (!currentUser) {
      // Redirect to signin if not authenticated
      router.push("/signin")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)
    setFormData({
      phoneNumber: userData.phoneNumber || "",
      role: userData.role || "",
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem("bankiti_users") || "[]")

      // Update current user
      const updatedUsers = users.map((u: User) => {
        if (u.id === user?.id) {
          return {
            ...u,
            phoneNumber: formData.phoneNumber,
            role: formData.role,
          }
        }
        return u
      })

      // Save updated users
      localStorage.setItem("bankiti_users", JSON.stringify(updatedUsers))

      // Update current user session
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("bankiti_current_user", JSON.stringify(updatedUser))
      setUser(updatedUser as User)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("bankiti_current_user")
    router.push("/signin")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/home")}>
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold">Bankiti</span>
            </div>
          </div>
          <Avatar className="size-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          {/* Profile Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your basic account details (read-only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                  <p className="text-base font-medium">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                  <p className="text-base font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">National ID</p>
                  <p className="text-base font-medium">{user.nationalId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Update Profile Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
              <CardDescription>Add your phone number and select your role</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lender">Lender</SelectItem>
                      <SelectItem value="borrower">Borrower</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose "Lender" if you want to lend money, or "Borrower" if you need to borrow
                  </p>
                </div>

                {success && (
                  <div className="text-sm text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    Profile updated successfully!
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Logout Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your session</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
