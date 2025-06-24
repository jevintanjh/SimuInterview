'use client';

import type { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function FirebaseConfigNotice() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                        Firebase Not Configured
                    </CardTitle>
                    <CardDescription>
                        Your Firebase API keys are missing or invalid. Please add them to your <code>.env</code> file to enable authentication.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        You can get these keys from your Firebase project settings. Copy the following into your <code>.env</code> file and fill in the values:
                    </p>
                    <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...`}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigValid, setIsConfigValid] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsConfigValid(false);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth,
        (user) => {
          // Success
          setUser(user);
          setIsConfigValid(true);
          setLoading(false);
        },
        (error) => {
          // Failure on async check
          console.error("Firebase Auth Error (async):", error);
          setIsConfigValid(false);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (error) {
      // Failure on sync setup
      console.error("Firebase Auth Error (sync):", error);
      setIsConfigValid(false);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase not configured.");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured.");
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error("Error signing in with email", error);
        throw new Error(error.code || error.message);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not configured.");
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error("Error signing up with email", error);
        throw new Error(error.code || error.message);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (!isConfigValid) {
    return <FirebaseConfigNotice />;
  }

  const value = { user, loading, signInWithGoogle, signOut, signInWithEmail, signUpWithEmail };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
