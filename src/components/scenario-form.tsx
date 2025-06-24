
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Building, CreditCard, Languages, Loader2, UserCog } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { addTries, getUsageCount } from "@/lib/usage"
import { MAX_FREE_TRIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useToast } from "@/hooks/use-toast"

export function ScenarioForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [remainingTries, setRemainingTries] = useState(MAX_FREE_TRIES);

  useEffect(() => {
    if (user) {
      setRemainingTries(getUsageCount(user.uid));
    }
  }, [user]);

  const handlePurchase = () => {
    // TODO: Implement Stripe checkout flow
    // 1. Create a checkout session on the server
    // 2. Redirect to Stripe checkout
    // 3. Handle webhook to update user's tries in the database
    toast({
      title: "Purchase Successful (Simulated)",
      description: "We've added 1 more interview credit to your account.",
    });
    if (user) {
      addTries(user.uid, 1);
      setRemainingTries(getUsageCount(user.uid));
    }
  }

  if (user && remainingTries <= 0) {
    return (
        <Card className="bg-muted/50 border-dashed">
            <CardHeader>
                <CardTitle>Out of Free Tries</CardTitle>
                <CardDescription>You've used all your {MAX_FREE_TRIES} free interview simulations. Purchase more to continue practicing.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handlePurchase} className="w-full">
                    <CreditCard className="mr-2"/>
                    Purchase Simulation ($3.00)
                </Button>
            </CardContent>
        </Card>
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
        toast({ title: "Authentication error", description: "Please sign in again.", variant: "destructive" });
        return;
    }

    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        params.append(key, value)
      }
    }
    
    router.push(`/interview?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <p className="text-sm text-center text-muted-foreground">
        You have <span className="font-bold text-primary">{remainingTries}</span> free {remainingTries === 1 ? 'try' : 'tries'} remaining.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Your Target Role</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="role" name="role" placeholder="e.g., Software Engineer" required className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Hiring Company</Label>
           <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="company" name="company" placeholder="e.g., Google" required className="pl-9" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select name="industry" defaultValue="technology" required>
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Select name="experience" defaultValue="mid-level" required>
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry-level">Entry-level</SelectItem>
              <SelectItem value="mid-level">Mid-level</SelectItem>
              <SelectItem value="senior-level">Senior-level</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Interview Language</Label>
          <div className="relative">
            <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select name="language" defaultValue="english" required>
                <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="mandarin">Mandarin</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="korean">Korean</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="persona">Interviewer Persona</Label>
           <div className="relative">
            <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select name="persona" defaultValue="friendly" required>
                <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select a persona" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Friendly & Casual">Friendly & Casual</SelectItem>
                <SelectItem value="Strict & Formal">Strict & Formal</SelectItem>
                <SelectItem value="Technical & In-depth">Technical & In-depth</SelectItem>
                <SelectItem value="Skeptical & Challenging">Skeptical & Challenging</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="animate-spin" /> : "Start Interview"}
      </Button>
    </form>
  )
}
