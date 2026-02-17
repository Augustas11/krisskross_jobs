import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Briefcase, DollarSign } from "lucide-react";

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-6">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-dark mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Jobs
                </Link>

                <div className="rounded-2xl bg-white border border-slate-200 p-8 mb-6">
                    <h1 className="text-3xl font-black text-brand-dark mb-2">
                        Job Listing #{id}
                    </h1>
                    <p className="text-slate-500 font-medium mb-6">
                        Full job details will be loaded from the database.
                    </p>

                    <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-6">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> Remote
                        </span>
                        <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" /> Contract
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> Posted recently
                        </span>
                        <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" /> Competitive
                        </span>
                    </div>

                    <button className="rounded-2xl bg-primary px-8 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
}
