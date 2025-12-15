"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  email: string
  fullName: string
  nationalId: string
  phoneNumber: string
  role: string
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

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

    if (userData.role === "lender") {
      router.push("/lender")
      return
    } else if (userData.role === "borrower") {
      router.push("/borrower")
      return
    }
  }, [router])

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
      {/* Header with Profile Icon */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold">Bankiti</span>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Go to profile"
          >
            <Avatar className="size-10 cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user.fullName.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Here's an overview of your account</p>
          </div>

          {/* User Details Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your personal information and account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
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
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Phone Number</p>
                  <p className="text-base font-medium">{user.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Account Role</p>
                  <div className="flex items-center gap-2">
                    {user.role ? (
                      <Badge variant={user.role === "lender" ? "default" : "secondary"} className="capitalize">
                        {user.role}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not set</Badge>
                    )}
                  </div>
                </div>
              </div>

              {(!user.phoneNumber || !user.role) && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Complete your profile by adding your phone number and selecting your role (lender or borrower).{" "}
                    <button
                      onClick={() => router.push("/profile")}
                      className="text-primary font-medium hover:underline"
                    >
                      Update profile
                    </button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Account Status</CardDescription>
                <CardTitle className="text-2xl">Active</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Transactions</CardDescription>
                <CardTitle className="text-2xl">0</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Member Since</CardDescription>
                <CardTitle className="text-2xl">2025</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
