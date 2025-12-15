import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/signin" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
              Connect Lenders with Borrowers, Seamlessly
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8">
              Bankiti is your trusted platform for peer-to-peer lending and borrowing. Earn competitive returns as a
              lender or access flexible loans as a borrower.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 gap-2">
                Get Started
                <ArrowRight className="size-5" />
              </Button>
            </Link>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/professional-handshake-financial-agreement-lending.jpg"
              alt="Lending and borrowing concept"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 bg-secondary/10 rounded-3xl mb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Bankiti Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image src="/person-creating-account-on-laptop-financial-applic.jpg" alt="Create account" fill className="object-cover" />
              </div>
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Account</h3>
              <p className="text-muted-foreground">
                Sign up with your email, full name, and national ID. Choose to be a lender or borrower.
              </p>
            </div>
            <div className="text-center">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image src="/person-setting-preferences-dashboard-financial-set.jpg" alt="Set preferences" fill className="object-cover" />
              </div>
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Your Preferences</h3>
              <p className="text-muted-foreground">
                Lenders set their terms and rates. Borrowers specify their loan requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image src="/successful-financial-transaction-money-transfer-di.jpg" alt="Start transacting" fill className="object-cover" />
              </div>
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Transacting</h3>
              <p className="text-muted-foreground">
                Get matched with the right counterparty and start lending or borrowing with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Bankiti?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border bg-card">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data and transactions are protected with bank-level security and encryption.
              </p>
            </div>
            <div className="p-6 rounded-2xl border bg-card">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Competitive Returns</h3>
              <p className="text-muted-foreground">
                Lenders earn attractive interest rates while borrowers access flexible terms.
              </p>
            </div>
            <div className="p-6 rounded-2xl border bg-card">
              <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="size-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trusted Community</h3>
              <p className="text-muted-foreground">
                Join thousands of verified users in our growing lending and borrowing community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center bg-primary/5 rounded-3xl p-8 md:p-12 border">
          <div className="relative h-[300px] rounded-2xl overflow-hidden order-2 md:order-1">
            <Image src="/happy-diverse-people-using-financial-app-mobile-ba.jpg" alt="Join Bankiti community" fill className="object-cover" />
          </div>
          <div className="text-center md:text-left order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join Bankiti today and experience a new way of lending and borrowing.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <span className="font-semibold">Bankiti</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Bankiti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
