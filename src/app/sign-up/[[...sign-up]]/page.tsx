import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 p-6">
            <SignUp
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "rounded-3xl shadow-xl border border-slate-100",
                        headerTitle: "font-black text-brand-dark",
                        headerSubtitle: "text-slate-500 font-medium",
                        socialButtonsBlockButton: "rounded-xl font-bold",
                        formButtonPrimary:
                            "rounded-2xl bg-brand-dark font-black shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-95 transition-all",
                        formFieldInput:
                            "rounded-xl border-slate-200 font-bold focus:ring-4 focus:ring-primary/10",
                        footerActionLink: "text-primary font-bold hover:text-primary/80",
                    },
                }}
            />
        </div>
    );
}
