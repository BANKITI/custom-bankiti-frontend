"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Clock, Percent, Users } from "lucide-react"

interface User {
  id: string
  email: string
  fullName: string
  nationalId: string
  phoneNumber: string
  role: string
}

interface Loan {
  id: string
  lenderId: string
  amount: number
  interestRate: number
  duration: number
  createdAt: string
  status: "available" | "funded"
}

interface LoanApplication {
  id: string
  loanId: string
  borrowerId: string
  borrowerName: string
  borrowerEmail: string
  purpose: string
  appliedAt: string
  status: "pending" | "approved" | "rejected"
}

export default function LenderPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Form state
  const [amount, setAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [duration, setDuration] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("bankiti_current_user")
    if (!currentUser) {
      router.push("/signin")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== "lender") {
      router.push("/home")
      return
    }

    setUser(userData)
    loadLoans(userData.id)
    loadApplications()
  }, [router])

  const loadLoans = (userId: string) => {
    const storedLoans = localStorage.getItem("bankiti_loans")
    if (storedLoans) {
      const allLoans: Loan[] = JSON.parse(storedLoans)
      setLoans(allLoans.filter((loan) => loan.lenderId === userId))
    }
  }

  const loadApplications = () => {
    const storedApplications = localStorage.getItem("bankiti_applications")
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications))
    }
  }

  const handleApproveApplication = (applicationId: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: "approved" as const } : app,
    )
    setApplications(updatedApplications)
    localStorage.setItem("bankiti_applications", JSON.stringify(updatedApplications))
  }

  const handleRejectApplication = (applicationId: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === applicationId ? { ...app, status: "rejected" as const } : app,
    )
    setApplications(updatedApplications)
    localStorage.setItem("bankiti_applications", JSON.stringify(updatedApplications))
  }

  const handleCreateLoan = () => {
    if (!user || !amount || !interestRate || !duration) return

    const newLoan: Loan = {
      id: Date.now().toString(),
      lenderId: user.id,
      amount: Number.parseFloat(amount),
      interestRate: Number.parseFloat(interestRate),
      duration: Number.parseInt(duration),
      createdAt: new Date().toISOString(),
      status: "available",
    }

    const storedLoans = localStorage.getItem("bankiti_loans")
    const allLoans = storedLoans ? JSON.parse(storedLoans) : []
    allLoans.push(newLoan)
    localStorage.setItem("bankiti_loans", JSON.stringify(allLoans))

    setLoans([...loans, newLoan])
    setIsCreateDialogOpen(false)
    setAmount("")
    setInterestRate("")
    setDuration("")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const myApplications = applications.filter((app) => loans.some((loan) => loan.id === app.loanId))

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
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
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Lender Dashboard</h1>
              <p className="text-muted-foreground">Manage your loans and applications</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <DollarSign className="size-4" />
                  Create Loan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Loan</DialogTitle>
                  <DialogDescription>Enter the details for your loan offering</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="10000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interest">Interest Rate (%)</Label>
                    <Input
                      id="interest"
                      type="number"
                      step="0.1"
                      placeholder="5.5"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="12"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLoan}>Create Loan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Total Loans
                </CardDescription>
                <CardTitle className="text-2xl">{loans.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Total Amount
                </CardDescription>
                <CardTitle className="text-2xl">
                  ${loans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="size-4" />
                  Applications
                </CardDescription>
                <CardTitle className="text-2xl">{myApplications.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Percent className="size-4" />
                  Avg Interest
                </CardDescription>
                <CardTitle className="text-2xl">
                  {loans.length > 0
                    ? (loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length).toFixed(1)
                    : "0"}
                  %
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="loans" className="space-y-4">
            <TabsList>
              <TabsTrigger value="loans">My Loans</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            {/* My Loans Tab */}
            <TabsContent value="loans" className="space-y-4">
              {loans.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <DollarSign className="size-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No loans yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first loan to start lending</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>Create Loan</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {loans.map((loan) => (
                    <Card key={loan.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl">${loan.amount.toLocaleString()}</CardTitle>
                          <Badge variant={loan.status === "available" ? "default" : "secondary"}>{loan.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Percent className="size-3" />
                            Interest Rate
                          </span>
                          <span className="font-medium">{loan.interestRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            Duration
                          </span>
                          <span className="font-medium">{loan.duration} months</span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground">Created</span>
                          <span className="font-medium">{new Date(loan.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-4">
              {myApplications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="size-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground">Applications from borrowers will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myApplications.map((app) => {
                    const loan = loans.find((l) => l.id === app.loanId)
                    return (
                      <Card key={app.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle>{app.borrowerName}</CardTitle>
                              <CardDescription>{app.borrowerEmail}</CardDescription>
                            </div>
                            <Badge
                              variant={
                                app.status === "approved"
                                  ? "default"
                                  : app.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Loan Amount</p>
                            <p className="text-lg font-semibold">${loan?.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Purpose</p>
                            <p className="text-sm">{app.purpose}</p>
                          </div>
                          <div className="flex items-center justify-between text-sm pt-2 border-t">
                            <span className="text-muted-foreground">Applied</span>
                            <span className="font-medium">{new Date(app.appliedAt).toLocaleDateString()}</span>
                          </div>
                          {app.status === "pending" && (
                            <div className="flex gap-2 pt-3 border-t">
                              <Button className="flex-1" onClick={() => handleApproveApplication(app.id)}>
                                Approve
                              </Button>
                              <Button
                                className="flex-1"
                                variant="destructive"
                                onClick={() => handleRejectApplication(app.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
