"use client";

import * as React from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { CustomerProfile, AuthContextType } from "@/types/auth";

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function formatAuthError(error: unknown): string {
  if (!error || typeof error !== "object") return "An unexpected error occurred. Please try again.";
  const errCode = "code" in error ? String((error as { code?: string }).code) : "";

  switch (errCode) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-not-found":
      return "No account found with this email. Please check your spelling or register.";
    case "auth/wrong-password":
      return "Incorrect password. Please verify your password and try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials.";
    case "auth/too-many-requests":
      return "Access temporarily blocked due to many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network connection issue. Please verify your internet connection and retry.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact customer care.";
    default:
      if ("message" in error && typeof (error as { message?: string }).message === "string") {
        return (error as { message: string }).message;
      }
      return "Authentication failed. Please check your details and try again.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [profile, setProfile] = React.useState<CustomerProfile | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Synchronize Firebase auth state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            setProfile(userSnap.data() as CustomerProfile);
          } else {
            // Document doesn't exist yet, construct profile from auth object
            const fallbackProfile: CustomerProfile = {
              uid: currentUser.uid,
              name: currentUser.displayName || "Valued Customer",
              email: currentUser.email || "",
              phone: currentUser.phoneNumber || "",
            };
            setProfile(fallbackProfile);
          }
        } catch (err) {
          console.error("Error loading user profile from Firestore:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (name: string, email: string, pass: string) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
    const createdUser = userCredential.user;

    // 2. Update Firebase Auth displayName
    await updateProfile(createdUser, {
      displayName: trimmedName,
    });

    // 3. Create customer document in Firestore (never store password)
    const newProfile: CustomerProfile = {
      uid: createdUser.uid,
      name: trimmedName,
      email: trimmedEmail,
      phone: "",
    };

    try {
      await setDoc(doc(db, "users", createdUser.uid), {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (firestoreError) {
      console.error("Failed to create Firestore profile document:", firestoreError);
    }

    setProfile(newProfile);
    setUser(createdUser);
  };

  const signIn = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
    const loggedInUser = userCredential.user;

    try {
      const userDocRef = doc(db, "users", loggedInUser.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setProfile(userSnap.data() as CustomerProfile);
      } else {
        setProfile({
          uid: loggedInUser.uid,
          name: loggedInUser.displayName || "Valued Customer",
          email: loggedInUser.email || "",
          phone: loggedInUser.phoneNumber || "",
        });
      }
    } catch (err) {
      console.error("Error fetching Firestore profile on sign-in:", err);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
