import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrissKross Jobs | The AI Content Marketplace",
  description: "Connect with expert AI creators who generate product videos and images in minutes.",
};

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkPubKey && !clerkPubKey.startsWith("YOUR_");

function Header() {
  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20">KJ</div>
          <span className="text-lg font-bold tracking-tight text-brand-dark">KrissKross <span className="text-primary font-black">Jobs</span></span>
        </Link>

        <nav className="flex items-center gap-4">
          {isClerkConfigured ? (
            <>
              <SignedOut>
                <SignInButton>
                  <button className="text-sm font-bold text-slate-600 hover:text-brand-dark transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-brand-dark transition-colors">
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              </SignedIn>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-bold text-slate-600 hover:text-brand-dark transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} font-sans antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );

  if (isClerkConfigured) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
