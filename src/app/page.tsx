"use client";

import { useState, useEffect } from "react";
import {
  Search, Video, ImageIcon, Sparkles, MessageSquare, Download,
  ChevronRight, ArrowRight, Star, TrendingUp, Clock, Zap,
  Menu, X, Bell, DollarSign, CheckCircle2, Globe, ChevronLeft,
  Briefcase, Users, LayoutGrid, Filter, ExternalLink
} from "lucide-react";

// --- Mock Data ---

const JOBS = [
  {
    id: 1,
    title: "Fashion Video Expert - Dress & Apparel",
    price: "$80 - $150 / video",
    avatars: ["#3B82F6", "#8B5CF6", "#EC4899"],
    hiredCount: 24,
    earnings: "$2,400",
    tags: ["Fashion", "Video", "9:16"],
    rating: 4.9,
    reviews: 32,
    responseTime: "< 1 hour",
    totalEarnings: "$12,400",
    jobsCompleted: 89,
    onTimeDelivery: "98%",
    repeatClients: "67%",
    creator: "Sarah Chen",
    description: "I specialize in high-converting AI fashion videos using advanced motion synthesis. My workflow ensures realistic fabric movement and lighting that sells products on TikTok Shop.",
    deliverables: ["1x 15-30s TikTok Video", "Color grading & transitions", "Copyright-free background music", "2 Revisions"],
    turnaround: "24-48 hours",
  },
  {
    id: 2,
    title: "Product Image Generator - Beauty & Cosmetics",
    price: "$30 - $60 / batch",
    avatars: ["#10B981", "#F59E0B", "#EF4444"],
    hiredCount: 18,
    earnings: "$1,800",
    tags: ["Beauty", "Images", "Batch"],
    rating: 4.8,
    reviews: 24,
    creator: "Mike Rodriguez",
  },
  {
    id: 3,
    title: "Bilingual Creator | English & Spanish TikTok",
    price: "$60 - $120 / video",
    avatars: ["#6366F1", "#14B8A6", "#F97316"],
    hiredCount: 31,
    earnings: "$3,100",
    tags: ["Bilingual", "TikTok", "Video"],
    rating: 5.0,
    reviews: 45,
    creator: "Jessica Park",
  },
  {
    id: 4,
    title: "Accessory & Jewelry Video Specialist",
    price: "$50 - $90 / video",
    avatars: ["#A855F7", "#F43F5E", "#06B6D4"],
    hiredCount: 15,
    earnings: "$1,350",
    tags: ["Accessories", "Video", "9:16"],
    rating: 4.7,
    reviews: 19,
    creator: "Alex Thompson",
  },
  {
    id: 5,
    title: "Tech Product Video - Gadgets & Electronics",
    price: "$70 - $130 / video",
    avatars: ["#1E293B", "#475569", "#94A3B8"],
    hiredCount: 19,
    earnings: "$1,900",
    tags: ["Tech", "Video", "Product"],
    rating: 4.9,
    reviews: 28,
    creator: "David Kim",
  },
  {
    id: 6,
    title: "Lifestyle Image Creator - Home & Living",
    price: "$40 - $80 / batch",
    avatars: ["#D97706", "#059669", "#2563EB"],
    hiredCount: 22,
    earnings: "$2,200",
    tags: ["Lifestyle", "Images", "Batch"],
    rating: 4.6,
    reviews: 15,
    creator: "Emily Davis",
  },
  {
    id: 7,
    title: "Food & Beverage Product Video Expert",
    price: "$60 - $110 / video",
    avatars: ["#DC2626", "#F97316", "#FACC15"],
    hiredCount: 27,
    earnings: "$2,700",
    tags: ["Food", "Video", "TikTok"],
    rating: 4.9,
    reviews: 36,
    creator: "Chris Evans",
  },
  {
    id: 8,
    title: "Fitness & Sportswear Video Creator",
    price: "$55 - $100 / video",
    avatars: ["#0284C7", "#7C3AED", "#DB2777"],
    hiredCount: 14,
    earnings: "$1,400",
    tags: ["Fitness", "Video", "9:16"],
    rating: 4.8,
    reviews: 21,
    creator: "Sophie Lane",
  },
  {
    id: 9,
    title: "Bilingual Creator | English & French",
    price: "$65 - $125 / video",
    avatars: ["#4F46E5", "#0EA5E9", "#10B981"],
    hiredCount: 20,
    earnings: "$2,000",
    tags: ["Bilingual", "Video", "French"],
    rating: 4.7,
    reviews: 17,
    creator: "Jean Dupont",
  },
  {
    id: 10,
    title: "Pet Product Video Specialist",
    price: "$45 - $85 / video",
    avatars: ["#EA580C", "#CA8A04", "#65A30D"],
    hiredCount: 16,
    earnings: "$1,600",
    tags: ["Pets", "Video", "TikTok"],
    rating: 4.8,
    reviews: 23,
    creator: "Bella Reed",
  },
  {
    id: 11,
    title: "Kids & Baby Product Video Expert",
    price: "$50 - $95 / video",
    avatars: ["#FB7185", "#38BDF8", "#FCD34D"],
    hiredCount: 21,
    earnings: "$2,100",
    tags: ["Kids", "Video", "Product"],
    rating: 4.9,
    reviews: 31,
    creator: "Liam Scott",
  },
  {
    id: 12,
    title: "General Product Image Generator",
    price: "$25 - $50 / batch",
    avatars: ["#94A3B8", "#64748B", "#475569"],
    hiredCount: 30,
    earnings: "$3,000",
    tags: ["General", "Images", "Batch"],
    rating: 4.5,
    reviews: 40,
    creator: "Noah Walker",
  }
];

// --- Components ---

export default function KrissKrossJobs() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Jobs");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pagination state (simulated)
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0040E5]/10 selection:text-[#0040E5]">

      {/* 1. NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
          {/* Left: Logo & Search */}
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0040E5] text-white font-black text-sm">KJ</div>
              <span className="text-xl font-bold tracking-tight hidden lg:block">KrissKross <span className="text-[#0040E5]">Jobs</span></span>
            </div>

            <div className="relative flex-1 max-w-sm hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Type to search jobs..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm transition-focus focus:border-[#0040E5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0040E5]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Center: Nav links */}
          <div className="hidden lg:flex items-center gap-8 mx-auto">
            {["Browse Jobs", "How It Works", "For Sellers"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-slate-600 hover:text-[#0040E5] transition-colors">{item}</a>
            ))}
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
            <div className="hidden xl:flex items-center gap-2 mr-4">
              <button className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#0040E5] hover:text-[#0040E5] transition-all">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-[#0040E5]">Newest</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-[#0040E5]">Most pay</button>
            </div>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="rounded-full bg-[#0040E5] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#0040E5]/20 hover:bg-[#0036C2] transition-all active:scale-95"
            >
              Post a Job
            </button>
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
          Turn your AI work into a <span className="text-[#0040E5]">creator business</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 md:text-xl leading-relaxed">
          Find brands actively hiring for TikTok Shop content—curated projects,
          vetted clients, built for creators like you. Only on KrissKross Jobs.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="w-full sm:w-auto rounded-full bg-[#0040E5] px-10 py-5 text-lg font-bold text-white shadow-xl shadow-[#0040E5]/30 hover:bg-[#0036C2] transition-all active:scale-95"
          >
            Become a Creator
          </button>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#0040E5]" />
            700+ Active Creators
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#10B981]" />
            $50-150 Average Project
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#0040E5]" />
            10,000+ Jobs Completed
          </div>
        </div>
      </section>

      {/* 3. FILTER BAR */}
      <div className="sticky top-16 z-50 border-y border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:pb-0">
            {["All Jobs", "TikTok Videos", "Product Images", "Lifestyle Content", "Fashion & Beauty", "Tech & Gadgets"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all ${activeCategory === cat
                  ? "bg-[#0040E5] text-white"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-6 hidden items-center gap-3 sm:flex">
            <span className="text-sm font-medium text-slate-500">Sort by:</span>
            <button className="flex items-center gap-2 text-sm font-bold border-none bg-transparent">
              Newest
              <ChevronLeft className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. JOB LISTING GRID */}
      <section className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {JOBS.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#0040E5]/30"
            >
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0040E5] transition-colors">{job.title}</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">{job.price}</p>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {job.avatars.map((color, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#10B981]">
                  <DollarSign className="h-3.5 w-3.5" />
                  {job.earnings}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="text-xs font-semibold text-slate-400">{job.hiredCount} hired this month</span>
                <div className="flex gap-1">
                  {job.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. PAGINATION */}
        <div className="mt-20 flex items-center justify-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronLeft className="h-5 w-5" />
          </button>
          {[1, 2, 3, 4, 10].map((num) => (
            <button
              key={num}
              className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm transition-all ${num === 1 ? "bg-[#0040E5] text-white shadow-lg shadow-[#0040E5]/20" : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              {num === 10 && <span className="mr-2 text-slate-300 font-normal">...</span>}
              {num}
            </button>
          ))}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>



      {/* 7. HOW IT WORKS (SELLERS) */}
      <section id="for-sellers" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">Start Earning as an AI Creator</h2>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "Create Your Profile", desc: "Showcase your best AI-generated samples. Set your rates ($50-150 per project). Get verified in 24 hours.", color: "text-[#10B981]" },
              { icon: Bell, title: "Receive Job Requests", desc: "Buyers browse your portfolio and send project inquiries. You choose which jobs to accept based on budget.", color: "text-[#10B981]" },
              { icon: DollarSign, title: "Deliver & Get Paid", desc: "Generate content using AI tools. Upload deliverables via our secure dashboard. Receive payment within 48 hours.", color: "text-[#10B981]" }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] shadow-sm">
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-[#10B981]/30 bg-[#ECFDF5] p-8 text-center">
            <p className="text-xl font-bold text-[#065F46]">💰 Average creator earnings: $1,500-3,000/month</p>
            <p className="mt-2 text-sm text-[#047857]">Top creators earn $5,000+/month with repeat clients</p>
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => setIsSignupModalOpen(true)} className="rounded-full bg-[#10B981] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#10B981]/30 hover:bg-[#059669]">
              Become a Creator
            </button>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="bg-[#EFF6FF] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">Real Creators, Real Earnings</h2>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { char: "S", name: "Sarah Chen", role: "Fashion Video Creator", badge: "$2,400/month", quote: "I went from $0 to $2,400 in my first month. KrissKross Jobs gave me a platform to monetize my AI skills immediately." },
              { char: "M", name: "Mike Rodriguez", role: "Product Image Specialist", badge: "$3,100/month", quote: "The quality of buyers is incredible. They know exactly what they want, pay on time, and many become repeat clients." },
              { char: "J", name: "Jessica Park", role: "Bilingual Video Creator", badge: "$1,800/month", quote: "I love that I can work from anywhere. I set my own rates, choose my projects, and keep 85% of what I earn." }
            ].map((t, i) => (
              <div key={i} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0040E5] text-xl font-black text-white">{t.char}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-sm font-medium text-slate-500">{t.role}</p>
                  </div>
                </div>
                <p className="mb-6 text-lg text-slate-700 italic leading-relaxed">"{t.quote}"</p>
                <span className="inline-flex rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-[#059669]">{t.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 10. FAQ */}
      <section className="bg-[#F9FAFB] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">For Buyers</h3>
              <div className="space-y-8">
                {[
                  { q: "How much does it cost to hire?", a: "Prices range from $25-150 per project depending on complexity. Product images start at $25-50 per batch. TikTok videos typically cost $50-100 each." },
                  { q: "How long does delivery take?", a: "Most creators deliver within 24-48 hours. Rush orders (6-12 hours) available for 50% premium." },
                  { q: "What if I'm not satisfied?", a: "All creators offer 1-2 free revisions. If still unsatisfied, request a refund through our dispute resolution system." }
                ].map((item, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-slate-900">{item.q}</h4>
                    <p className="mt-2 text-slate-600 leading-relaxed text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">For Creators</h3>
              <div className="space-y-8">
                {[
                  { q: "How much can I earn?", a: "Experienced creators earn $2,000-4,000/month. Top 10% can exceed $5,000/month by building repeat client bases." },
                  { q: "What tools do I need?", a: "Any AI tool works (Runway, Midjourney, etc.). Pro creators get 50 free KrissKross AI credits monthly." },
                  { q: "When do I get paid?", a: "Free tier: 7 days after delivery. Pro tier: 48 hours. Payments via PayPal, Stripe, or bank transfer." }
                ].map((item, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-slate-900">{item.q}</h4>
                    <p className="mt-2 text-slate-600 leading-relaxed text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="bg-gradient-to-r from-[#0040E5] to-[#6366F1] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-black text-white md:text-5xl lg:text-6xl">
            Turn your AI work into a creator business
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-white/90 md:text-xl leading-relaxed">
            Find brands actively hiring for TikTok Shop content—curated projects,
            vetted clients, built for creators like you. Only on KrissKross Jobs.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="w-full sm:w-auto rounded-full bg-white px-10 py-5 text-base font-bold text-[#0040E5] shadow-2xl hover:bg-slate-50 active:scale-95 transition-all"
            >
              Become a Creator
            </button>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className="w-full sm:w-auto rounded-full border-2 border-white px-10 py-5 text-base font-bold text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-[#111827] pt-24 pb-12 text-[#D1D5DB]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["Browse Jobs", "How It Works", "Pricing", "Success Stories"].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">For Creators</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["Become a Creator", "Creator Resources", "Earnings Calculator", "Best Practices"].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["About Us", "Contact", "Terms of Service", "Privacy Policy"].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-12 md:flex-row">
            <p className="text-sm font-medium">© 2025 KrissKross Jobs.</p>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* JOB DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
          <div className="relative flex h-full w-full max-w-7xl overflow-hidden rounded-none border border-slate-200 bg-white shadow-2xl md:rounded-3xl animate-in slide-in-from-bottom-8 duration-500">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-6 top-6 z-10 rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex h-full w-full flex-col md:flex-row divide-x divide-slate-100 overflow-y-auto">
              {/* Left Side: Job Info */}
              <div className="flex-1 p-8 md:p-16">
                <div className="inline-flex rounded-full bg-[#0040E5]/5 px-4 py-1.5 text-xs font-black uppercase text-[#0040E5] tracking-widest mb-6">Open Project</div>
                <h2 className="text-4xl font-black text-slate-900 md:text-5xl">{selectedJob.title}</h2>
                <p className="mt-4 text-2xl font-bold text-slate-500">{selectedJob.price}</p>

                <div className="mt-12 space-y-10">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Project Description</h3>
                    <p className="mt-4 text-lg text-slate-600 leading-relaxed">{selectedJob.description || "A professional creator will generate high-quality AI assets tailored to your brand identity."}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Deliverables</h3>
                    <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {(selectedJob.deliverables || ["1x High-Res Output", "Full Commercial Rights", "2 Revisions", "Source Files Included"]).map((d: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 text-sm font-bold text-slate-700">
                          <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-6">
                      <Clock className="h-6 w-6 text-[#0040E5] mb-3" />
                      <h4 className="font-bold text-slate-900">Turnaround Time</h4>
                      <p className="mt-1 text-slate-500">{selectedJob.turnaround || "2-3 Days"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-6">
                      <Zap className="h-6 w-6 text-[#10B981] mb-3" />
                      <h4 className="font-bold text-slate-900">Urgent Delivery</h4>
                      <p className="mt-1 text-slate-500">Available (+50%)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Creator Sidebar */}
              <div className="w-full md:w-[400px] bg-slate-50/50 p-8 md:p-12">
                <div className="sticky top-0 space-y-8">
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#0040E5] text-3xl font-black text-white shadow-xl shadow-[#0040E5]/20 uppercase">
                      {selectedJob.creator?.charAt(0) || "C"}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <h4 className="text-xl font-bold text-slate-900">{selectedJob.creator}</h4>
                      <CheckCircle2 className="h-5 w-5 fill-[#0040E5] text-white" />
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <div className="flex text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        < Star className="h-4 w-4 fill-current" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{selectedJob.rating} <span className="text-slate-400 font-medium">({selectedJob.reviews} reviews)</span></span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full rounded-2xl bg-[#0040E5] py-4 text-base font-bold text-white shadow-xl shadow-[#0040E5]/20 hover:bg-[#0036C2]">Hire This Creator</button>
                    <button className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 text-base font-bold text-slate-700 hover:border-[#0040E5] hover:text-[#0040E5] transition-all">Message Creator</button>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Jobs completed</span>
                      <span className="text-sm font-bold text-slate-900">{selectedJob.jobsCompleted || "150+"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">On-time delivery</span>
                      <span className="text-sm font-bold text-[#10B981]">{selectedJob.onTimeDelivery || "100%"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">Repeat clients</span>
                      <span className="text-sm font-bold text-slate-900">{selectedJob.repeatClients || "45%"}</span>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                      <span className="text-sm font-medium text-slate-400 uppercase tracking-widest text-[10px]">Total Platform Earnings</span>
                      <span className="text-lg font-black text-[#10B981]">{selectedJob.totalEarnings || "$10k+"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST A JOB MODAL */}
      {isPostJobModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPostJobModalOpen(false)}></div>
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsPostJobModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900"><X className="h-6 w-6" /></button>
            <h2 className="text-3xl font-black text-slate-900">Post a Job</h2>
            <p className="mt-2 text-slate-500">Get custom quotes from expert AI creators in hours.</p>

            <form className="mt-10 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700">Project Type</label>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {["TikTok Video", "Image Batch", "Custom"].map(t => (
                    <button key={t} type="button" className={`rounded-xl border p-3 text-xs font-bold transition-all ${t === "TikTok Video" ? "border-[#0040E5] bg-[#0040E5]/5 text-[#0040E5]" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Project Title</label>
                <input type="text" placeholder="e.g. 5x Fashion Shorts for TikTok" className="mt-2 w-full rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-[#0040E5]/20 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Budget Range</label>
                <input type="range" className="mt-4 w-full accent-[#0040E5]" min="25" max="500" step="25" />
                <div className="mt-2 flex justify-between text-xs font-bold text-slate-400">
                  <span>$25</span>
                  <span className="text-[#0040E5]">$250 Average</span>
                  <span>$500+</span>
                </div>
              </div>
              <button type="submit" onClick={(e) => e.preventDefault()} className="w-full rounded-2xl bg-[#0040E5] py-4 text-base font-black text-white shadow-xl shadow-[#0040E5]/20 hover:bg-[#0036C2]">Post My Job Now</button>
              <p className="text-center text-[10px] text-slate-400 font-medium">Your job will be live immediately. Creators typically respond within 2-4 hours.</p>
            </form>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSignupModalOpen(false)}></div>
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsSignupModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900"><X className="h-6 w-6" /></button>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#10B981]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Join as a Creator</h2>
              <p className="mt-2 text-slate-500">Showcase your AI skills and start earning from TikTok Shop sellers.</p>
            </div>

            <form className="mt-10 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                  <input type="text" className="mt-2 w-full rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-[#10B981]/20 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Email</label>
                  <input type="email" className="mt-2 w-full rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-[#10B981]/20 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Your Top Skill</label>
                <select className="mt-2 w-full rounded-xl border border-slate-200 p-4 focus:outline-none bg-white">
                  <option>AI Video Generation (TikTok)</option>
                  <option>AI Product Photography</option>
                  <option>Lifestyle Branding</option>
                </select>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50">
                <Download className="mx-auto h-6 w-6 text-slate-400 mb-2 rotate-180" />
                <p className="text-sm font-bold text-slate-700">Upload 3-5 portfolio samples</p>
                <p className="text-xs text-slate-400 mt-1">Videos or Images generated by AI</p>
              </div>
              <button type="submit" onClick={(e) => e.preventDefault()} className="w-full rounded-2xl bg-[#10B981] py-4 text-base font-black text-white shadow-xl shadow-[#10B981]/20 hover:bg-[#059669]">Submit Application</button>
              <p className="text-center text-[10px] text-slate-400 font-medium">We'll verify your account within 24 hours. Good luck!</p>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[400] bg-white p-6 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-[#0040E5]">KJ <span className="text-slate-900">KrissKross Jobs</span></div>
            <button onClick={() => setMobileMenuOpen(false)}><X className="h-6 w-6" /></button>
          </div>
          <div className="mt-12 space-y-8">
            {["Browse Jobs", "How It Works", "For Sellers", "Pricing", "About Us"].map(l => (
              <a key={l} href="#" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black text-slate-900">{l}</a>
            ))}
            <div className="pt-8 space-y-4">
              <button className="w-full rounded-2xl bg-[#0040E5] py-4 font-bold text-white">Post a Job</button>
              <button className="w-full rounded-2xl border-2 border-slate-200 py-4 font-bold text-slate-700" onClick={() => { setMobileMenuOpen(false); setIsSignupModalOpen(true); }}>Become a Creator</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
