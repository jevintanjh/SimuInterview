
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Building, Languages, Loader2, Mic, Text, UserCog, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getUsageCount, decrementUsageCount } from "@/lib/usage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ScenarioForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice')
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  
  const usageCount = user ? getUsageCount(user.uid) : 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be signed in to start an interview.", variant: "destructive" });
        return;
    }

    if (getUsageCount(user.uid) <= 0) {
        setShowUpgradeDialog(true);
        return;
    }

    setIsLoading(true)
    decrementUsageCount(user.uid);
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        params.append(key, value)
      }
    }
    params.append('mode', inputMode);
    
    router.push(`/interview?${params.toString()}`)
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="grid gap-6">
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
          <Label htmlFor="persona">Interviewer Persona</Label>
           <div className="relative">
            <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select name="persona" defaultValue="The Behavioral Interviewer" required>
                <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select a persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="The Behavioral Interviewer">The Behavioral Interviewer</SelectItem>
                  <SelectItem value="The Technical Interviewer">The Technical Interviewer</SelectItem>
                  <SelectItem value="The Stress Interviewer">The Stress Interviewer</SelectItem>
                  <SelectItem value="The Friendly Interviewer">The Friendly Interviewer</SelectItem>
                  <SelectItem value="The Executive Interviewer">The Executive Interviewer</SelectItem>
                  <SelectItem value="The Panel Interviewers">The Panel Interviewers</SelectItem>
                  <SelectItem value="The Structured Interviewer">The Structured Interviewer</SelectItem>
                  <SelectItem value="The Unstructured Interviewer">The Unstructured Interviewer</SelectItem>
                  <SelectItem value="The Peer Interviewer">The Peer Interviewer</SelectItem>
                  <SelectItem value="The HR Interviewer">The HR Interviewer</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
           <div className="relative">
            <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Select name="language" defaultValue="en" required>
                <SelectTrigger className="pl-9">
                <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="zh">Mandarin</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
          <Label htmlFor="input-mode">Input Mode</Label>
          <div className="flex items-center gap-2 rounded-md border border-input h-10 px-3 justify-center">
             <Text className="h-4 w-4 text-muted-foreground" />
             <Label htmlFor="input-mode-switch" className="text-sm font-normal text-muted-foreground">Text</Label>
             <Switch
                id="input-mode-switch"
                checked={inputMode === 'voice'}
                onCheckedChange={(checked) => setInputMode(checked ? 'voice' : 'text')}
                className="mx-2"
              />
              <Label htmlFor="input-mode-switch" className="text-sm font-normal text-muted-foreground">Voice</Label>
              <Mic className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="animate-spin" /> : `Start Interview (${usageCount} tries left)`}
      </Button>
    </form>

    <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're out of free trials!</AlertDialogTitle>
            <AlertDialogDescription>
              Thanks for using SimuInterview! Please upgrade to continue practicing with unlimited interviews and feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => window.open("https://stripe.com", "_blank")}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
