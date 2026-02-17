import { Briefcase, MapPin, Clock, Search } from "lucide-react";
import Link from "next/link";

// Placeholder job data
const SAMPLE_JOBS = [
    {
        id: "1",
        title: "AI Product Video Creator",
        company: "StyleBrand Co",
        location: "Remote",
        type: "Contract",
        budget: "$500 - $1,500",
        posted: "2 days ago",
        tags: ["Video", "Fashion", "TikTok"],
    },
    {
        id: "2",
        title: "UGC Content Specialist",
        company: "FreshBeauty",
        location: "Remote",
        type: "Freelance",
        budget: "$200 - $800",
        posted: "5 days ago",
        tags: ["UGC", "Beauty", "Instagram"],
    },
    {
        id: "3",
        title: "AI Image Generation Expert",
        company: "TechWear",
        location: "Remote",
        type: "Project",
        budget: "$1,000 - $3,000",
        posted: "1 week ago",
        tags: ["AI", "Product Photos", "E-commerce"],
    },
];

export default function JobsPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50">
            {/* Hero Section */}
            <div className="bg-brand-dark text-white py-16 px-6">
                <div className="mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Find AI Content <span className="text-primary">Jobs</span>
                    </h1>
                    <p className="text-lg text-slate-300 font-medium max-w-lg mx-auto mb-8">
                        Browse opportunities from brands looking for AI content creators.
                    </p>

                    {/* Search Bar */}
                    <div className="flex items-center max-w-2xl mx-auto bg-white rounded-2xl p-2 shadow-xl">
                        <div className="flex items-center gap-2 flex-1 px-4">
                            <Search className="h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="w-full py-3 text-brand-dark font-medium placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <button className="rounded-xl bg-primary px-6 py-3 text-sm font-black text-white hover:scale-[1.02] active:scale-95 transition-all">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm font-bold text-slate-500">
                        {SAMPLE_JOBS.length} jobs found
                    </p>
                </div>

                <div className="space-y-4">
                    {SAMPLE_JOBS.map((job) => (
                        <Link
                            key={job.id}
                            href={`/jobs/${job.id}`}
                            className="block rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-black text-brand-dark group-hover:text-primary transition-colors">
                                        {job.title}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-500">{job.company}</p>
                                </div>
                                <span className="text-sm font-black text-primary">{job.budget}</span>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" /> {job.type}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {job.posted}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {job.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
