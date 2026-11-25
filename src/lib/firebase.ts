import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Safe singleton initialization for Next.js App Router (prevents duplicate app initialization during HMR)
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Analytics is opt-in so importing Firebase for another feature does not
// initialize an analytics client or add its SDK to the initial page bundle.
export async function getAnalyticsClient(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  try {
    const [{ getAnalytics, isSupported }] = await Promise.all([
      import("firebase/analytics"),
    ]);
    return (await isSupported()) ? getAnalytics(app) : null;
  } catch {
    return null;
  }
}

// Preserve the existing analytics initialization, but wait until the browser
// has spare time so it cannot compete with the initial render or LCP request.
if (typeof window !== "undefined") {
  const idleWindow = window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number };
  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(() => { void getAnalyticsClient(); }, { timeout: 5000 });
  } else {
    window.setTimeout(() => { void getAnalyticsClient(); }, 3000);
  }
}

export { app, auth, db };
