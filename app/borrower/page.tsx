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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Clock, Percent, CheckCircle2 } from "lucide-react"

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

export default function BorrowerPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [availableLoans, setAvailableLoans] = useState<Loan[]>([])
  const [myApplications, setMyApplications] = useState<LoanApplication[]>([])
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [purpose, setPurpose] = useState("")

  useEffect(() => {
    const currentUser = localStorage.getItem("bankiti_current_user")
    if (!currentUser) {
      router.push("/signin")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== "borrower") {
      router.push("/home")
      return
    }

    setUser(userData)
    loadLoans()
    loadApplications(userData.id)
  }, [router])

  const loadLoans = () => {
    const storedLoans = localStorage.getItem("bankiti_loans")
    if (storedLoans) {
      const allLoans: Loan[] = JSON.parse(storedLoans)
      setAvailableLoans(allLoans.filter((loan) => loan.status === "available"))
    }
  }

  const loadApplications = (userId: string) => {
    const storedApplications = localStorage.getItem("bankiti_applications")
    if (storedApplications) {
      const allApplications: LoanApplication[] = JSON.parse(storedApplications)
      setMyApplications(allApplications.filter((app) => app.borrowerId === userId))
    }
  }

  const handleApplyForLoan = () => {
    if (!user || !selectedLoan || !purpose.trim()) return

    const newApplication: LoanApplication = {
      id: Date.now().toString(),
      loanId: selectedLoan.id,
      borrowerId: user.id,
      borrowerName: user.fullName,
      borrowerEmail: user.email,
      purpose: purpose,
      appliedAt: new Date().toISOString(),
      status: "pending",
    }

    const storedApplications = localStorage.getItem("bankiti_applications")
    const allApplications = storedApplications ? JSON.parse(storedApplications) : []
    allApplications.push(newApplication)
    localStorage.setItem("bankiti_applications", JSON.stringify(allApplications))

    setMyApplications([...myApplications, newApplication])
    setIsApplyDialogOpen(false)
    setPurpose("")
    setSelectedLoan(null)
  }

  const openApplyDialog = (loan: Loan) => {
    setSelectedLoan(loan)
    setIsApplyDialogOpen(true)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const hasAppliedForLoan = (loanId: string) => {
    return myApplications.some((app) => app.loanId === loanId)
  }

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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Borrower Dashboard</h1>
            <p className="text-muted-foreground">Browse available loans and track your applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Available Loans
                </CardDescription>
                <CardTitle className="text-2xl">{availableLoans.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  My Applications
                </CardDescription>
                <CardTitle className="text-2xl">{myApplications.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Pending
                </CardDescription>
                <CardTitle className="text-2xl">
                  {myApplications.filter((app) => app.status === "pending").length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Approved
                </CardDescription>
                <CardTitle className="text-2xl">
                  {myApplications.filter((app) => app.status === "approved").length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="available" className="space-y-4">
            <TabsList>
              <TabsTrigger value="available">Available Loans</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            </TabsList>

            {/* Available Loans Tab */}
            <TabsContent value="available" className="space-y-4">
              {availableLoans.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <DollarSign className="size-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No loans available</h3>
                    <p className="text-muted-foreground">Check back later for new loan opportunities</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {availableLoans.map((loan) => {
                    const alreadyApplied = hasAppliedForLoan(loan.id)
                    return (
                      <Card key={loan.id} className={alreadyApplied ? "opacity-60" : ""}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl">${loan.amount.toLocaleString()}</CardTitle>
                            {alreadyApplied && <Badge variant="outline">Applied</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
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
                            <span className="text-muted-foreground">Total Repayment</span>
                            <span className="font-semibold text-primary">
                              ${(loan.amount * (1 + loan.interestRate / 100)).toLocaleString()}
                            </span>
                          </div>
                          <Button
                            onClick={() => openApplyDialog(loan)}
                            disabled={alreadyApplied}
                            className="w-full mt-2"
                          >
                            {alreadyApplied ? "Already Applied" : "Apply for Loan"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* My Applications Tab */}
            <TabsContent value="applications" className="space-y-4">
              {myApplications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="size-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground">Browse available loans and apply to get started</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myApplications.map((app) => {
                    const loan = availableLoans.find((l) => l.id === app.loanId)
                    if (!loan) return null
                    return (
                      <Card key={app.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-2xl">${loan.amount.toLocaleString()}</CardTitle>
                              <CardDescription>
                                {loan.interestRate}% interest • {loan.duration} months
                              </CardDescription>
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
                            <p className="text-sm font-medium text-muted-foreground mb-1">Purpose</p>
                            <p className="text-sm">{app.purpose}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground">Applied</p>
                              <p className="font-medium">{new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Repayment</p>
                              <p className="font-semibold text-primary">
                                ${(loan.amount * (1 + loan.interestRate / 100)).toLocaleString()}
                              </p>
                            </div>
                          </div>
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

      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Loan</DialogTitle>
            <DialogDescription>
              {selectedLoan && (
                <>
                  Applying for ${selectedLoan.amount.toLocaleString()} at {selectedLoan.interestRate}% interest for{" "}
                  {selectedLoan.duration} months
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Loan</Label>
              <Textarea
                id="purpose"
                placeholder="Explain why you need this loan..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsApplyDialogOpen(false)
                setPurpose("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleApplyForLoan} disabled={!purpose.trim()}>
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
