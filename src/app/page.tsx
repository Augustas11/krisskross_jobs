"use client";

import { useState, useEffect } from "react";
import {
  Search, Video, ImageIcon, Sparkles, MessageSquare, Download,
  ChevronRight, ArrowRight, Star, TrendingUp, Clock, Zap,
  Menu, X, Bell, DollarSign, CheckCircle2, Globe, ChevronLeft,
  Briefcase, Users, LayoutGrid, Filter, ExternalLink, Target, CheckCircle
} from "lucide-react";

// --- Mock Data ---

const PROJECTS = [
  {
    id: 1,
    title: "Zesica: Boho-Chic Summer Dress Transitions",
    budget: "$1,500 total ($100 per video)",
    quantity: "15 videos",
    posted: "1 day ago",
    applicants: "18 creators applied",
    tags: ["Fashion", "Boho", "TikTok"],
    brandName: "ZESICA Official",
    totalSpent: "$14,500+",
    hiringRate: "94%",
    brandInitial: "Z"
  },
  {
    id: 2,
    title: "Evaless: Amazon-Style Try-On Haul AI Videos",
    budget: "$1,600 total ($80 per video)",
    quantity: "20 videos",
    posted: "2 days ago",
    applicants: "14 creators applied",
    tags: ["Apparel", "Try-on", "Viral"],
    brandName: "Evaless",
    totalSpent: "$8,200+",
    hiringRate: "88%",
    brandInitial: "E"
  },
  {
    id: 3,
    title: "Style Sorcery: Quiet Luxury Flat-Lay Animations",
    budget: "$1,200 total ($100 per video)",
    quantity: "12 videos",
    posted: "3 days ago",
    applicants: "22 creators applied",
    tags: ["Luxury", "Animation", "Elegant"],
    brandName: "Style Sorcery",
    totalSpent: "$21,000+",
    hiringRate: "97%",
    brandInitial: "S"
  }
];

// --- Components ---

export default function KrissKrossJobs() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pagination state (simulated)
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0040E5]/10 selection:text-[#0040E5]">

      {/* 1. NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group mr-10 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0040E5] text-white font-black text-sm">KJ</div>
            <span className="text-xl font-bold tracking-tight hidden lg:block">KrissKross <span className="text-[#0040E5]">Jobs</span></span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-sm hidden md:block shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Type to search jobs..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm transition-focus focus:border-[#0040E5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0040E5]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-10 px-8">
            <a href="#browse-projects" className="text-sm font-medium text-slate-600 hover:text-[#0040E5] transition-colors whitespace-nowrap">Browse Projects</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0040E5] transition-colors whitespace-nowrap">How It Works</a>
            <a href="#for-creators" className="text-sm font-bold text-[#0040E5] transition-colors whitespace-nowrap">For Creators</a>
            <a href="#for-brands" className="text-xs font-medium text-slate-400 hover:text-[#0040E5] transition-colors whitespace-nowrap">For Brands</a>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-2 mr-4">
              <button className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#0040E5] hover:text-[#0040E5] transition-all">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-[#0040E5]">Newest</button>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-[#0040E5]">Most pay</button>
            </div>
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="rounded-full bg-[#0040E5] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#0040E5]/20 hover:bg-[#0036C2] transition-all active:scale-95 whitespace-nowrap"
            >
              Start Portfolio
            </button>
            <button className="lg:hidden ml-2" onClick={() => setMobileMenuOpen(true)}>
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
            Start Your Portfolio
          </button>
          <button
            onClick={() => { document.getElementById('browse-projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="w-full sm:w-auto rounded-full border-2 border-[#0040E5] px-10 py-5 text-lg font-bold text-[#0040E5] hover:bg-[#0040E5]/5 transition-all active:scale-95"
          >
            Browse Available Projects
          </button>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#0040E5]" />
            New Projects Posted Daily
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#10B981]" />
            Get Your First Client in 72 Hours
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#0040E5]" />
            Only Vetted Brands
          </div>
        </div>
      </section>

      {/* 3. FILTER BAR */}
      <div className="sticky top-16 z-50 border-y border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:pb-0">
            {["All Projects", "TikTok Videos", "Product Images", "Lifestyle Content", "Fashion & Beauty", "Tech & Gadgets"].map((cat) => (
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

      {/* 4. PROJECT LISTING GRID */}
      <section id="browse-projects" className="mx-auto max-w-[1440px] px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Available Projects for AI Creators</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedJob(project)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start gap-2 mb-4">
                <span className="text-xl">💼</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0040E5] transition-colors leading-tight">
                  {project.title}
                </h3>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium text-slate-600">Budget: {project.budget}</p>
                <p className="text-sm font-medium text-slate-600">Quantity: {project.quantity} needed</p>
              </div>

              <div className="flex flex-col gap-1 mb-6 border-t border-slate-50 pt-4">
                <span className="text-xs text-slate-400">Posted {project.posted}</span>
                <span className="text-xs font-bold text-[#0040E5]">{project.applicants}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{tag}</span>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0040E5] py-3 text-sm font-bold text-white transition-all hover:bg-[#0036C2]">
                View Project Details
                <ArrowRight className="h-4 w-4" />
              </button>
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



      {/* 7. HOW IT WORKS (CREATORS) */}
      <section id="how-it-works" className="bg-white py-24 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">How to Get Your First Client</h2>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { icon: Sparkles, title: "Build Your Portfolio", desc: "Showcase your best 3-5 AI-generated videos or images. Takes 10 minutes. No approval needed—go live immediately.", color: "text-[#0040E5]", bgColor: "bg-[#0040E5]/5" },
              { icon: Search, title: "Browse & Apply to Projects", desc: "Filter by budget, deadline, and content type. Apply to projects that match your skills. Brands review applications within 24 hours.", color: "text-[#0040E5]", bgColor: "bg-[#0040E5]/5" },
              { icon: DollarSign, title: "Deliver & Get Paid", desc: "Upload your work through our platform. Client reviews and approves. Get paid in 48 hours via PayPal or bank transfer. Build your reputation.", color: "text-[#10B981]", bgColor: "bg-[#ECFDF5]" }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.bgColor} shadow-sm`}>
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => setIsSignupModalOpen(true)} className="rounded-full bg-[#0040E5] px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#0040E5]/30 hover:bg-[#0036C2]">
              Start Your Portfolio
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
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">Frequently Asked Questions for Creators</h2>
          <div className="mt-16 space-y-12">
            {[
              {
                q: "How do I get my first client?",
                a: "Build a portfolio with 3-5 strong examples. Browse available projects and apply to ones matching your style. Most creators land their first client within 1-2 weeks. Pro tip: Apply within 24 hours of project posting for best chances."
              },
              {
                q: "What if I don't get hired for projects I apply to?",
                a: "We review portfolios that aren't getting traction and provide feedback. Make sure your samples clearly show the product and match TikTok Shop style (clean, bright, product-focused). Quality over quantity."
              },
              {
                q: "How much can I realistically earn?",
                a: "Beginners: $500-1,000/month part-time. Experienced creators with good reviews: $2,000-4,000/month. Top 10%: $5,000+/month. Your rate depends on quality, turnaround time, and client reviews."
              },
              {
                q: "When do I get paid?",
                a: "Free tier: 7 days after client approval. Pro tier ($20/month): 48 hours after approval. Payments via PayPal, Stripe, or direct bank transfer."
              },
              {
                q: "What's the platform fee?",
                a: "Free tier: 15% of project value. Pro tier: 10%. Enterprise: 5%. Fees cover payment protection, dispute resolution, and platform maintenance."
              },
              {
                q: "Why not just find clients myself on Twitter or Fiverr?",
                a: "You can! But KrissKross curates projects specifically for AI-generated TikTok content. We handle payment escrow, provide project briefs, and protect you from scope creep. Plus brands come to us—you don't cold DM."
              },
              {
                q: "What tools do I need?",
                a: "Any AI video/image generation tool works (Runway, Midjourney, Pika, KrissKross AI, etc.). Pro creators get 50 free KrissKross AI credits monthly as a bonus."
              },
              {
                q: "Can I work with clients outside the platform?",
                a: "After completing 3 projects with a client through KrissKross, you can work directly with them. We encourage long-term relationships but ask you use our platform initially for payment protection."
              }
            ].map((item, i) => (
              <div key={i}>
                <h4 className="text-lg font-bold text-slate-900">{item.q}</h4>
                <p className="mt-3 text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="bg-gradient-to-r from-[#0040E5] to-[#6366F1] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-black text-white md:text-5xl lg:text-6xl">
            Ready to Turn Your AI Skills Into Client Work?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-white/90 md:text-xl leading-relaxed">
            Join creators landing their first client in 72 hours.
            Build your portfolio, browse curated projects, get paid fast.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-6">
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="w-full sm:w-auto rounded-full bg-white px-12 py-6 text-xl font-bold text-[#0040E5] shadow-2xl hover:bg-slate-50 active:scale-95 transition-all"
            >
              Start Your Portfolio
            </button>
            <p className="text-white/80 font-medium">No approval needed. Go live in 10 minutes.</p>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-4 text-white">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Curated projects daily</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Payment protection included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Get paid in 48 hours (Pro tier)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-[#111827] pt-24 pb-12 text-[#D1D5DB]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">For Creators</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["Browse Projects", "How to Get Started", "Creator Pricing", "Success Stories"].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Resources</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["Portfolio Examples", "Best Practices Guide", "Payment & Fees", "Help Center"].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Projects</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["Fashion & Apparel", "Beauty & Cosmetics", "Tech & Gadgets", "Food & Beverage"].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm font-medium">
                {["About Us", "Contact Support", "Terms of Service", "Privacy Policy"].map(l => (
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

      {/* PROJECT DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
          <div className="relative flex h-full w-full max-w-5xl overflow-hidden rounded-none border border-slate-200 bg-white shadow-2xl md:rounded-3xl animate-in slide-in-from-bottom-8 duration-500">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-6 top-6 z-10 rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex h-full w-full flex-col md:flex-row divide-x divide-slate-100 overflow-y-auto">
              {/* Left Side: Project Info */}
              <div className="flex-1 p-8 md:p-12">
                <div className="inline-flex rounded-full bg-[#0040E5]/5 px-4 py-1.5 text-xs font-black uppercase text-[#0040E5] tracking-widest mb-6 border border-[#0040E5]/10">Project Brief</div>
                <h2 className="text-3xl font-black text-slate-900 md:text-4xl leading-tight">{selectedJob.title}</h2>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#0040E5]">{selectedJob.budget}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                  <span className="text-lg font-medium text-slate-500">{selectedJob.quantity} required</span>
                </div>

                <div className="mt-12 space-y-10">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Project Overview</h3>
                    <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                      We're looking for an experienced AI creator to generate high-quality {selectedJob.tags?.[1] || 'content'} for our brand.
                      The ideal candidate should have a strong portfolio in {selectedJob.tags?.[0] || 'ecommerce'} and be familiar with TikTok Shop requirements.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Requirements</h3>
                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        "High-resolution AI output",
                        "TikTok-optimized format (9:16)",
                        "Clean, commercial aesthetic",
                        "Fast 48-hour turnaround",
                        "2 rounds of revisions",
                        "Final source file delivery"
                      ].map((d, i) => (
                        <li key={i} className="flex items-center gap-3 rounded-lg border border-slate-50 p-3 text-sm font-bold text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-5">
                      <Clock className="h-5 w-5 text-[#0040E5] mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Timeline</h4>
                      <p className="mt-1 font-bold text-slate-900">48-72 Hours</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-5">
                      <Zap className="h-5 w-5 text-[#10B981] mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Urgency</h4>
                      <p className="mt-1 font-bold text-slate-900">{selectedJob.tags?.includes('Urgent') ? 'High Priority' : 'Standard'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-5">
                      <Users className="h-5 w-5 text-[#0040E5] mb-2" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Applicants</h4>
                      <p className="mt-1 font-bold text-slate-900">{selectedJob.applicants?.split(' ')[0] || '0'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Apply Sidebar */}
              <div className="w-full md:w-[360px] bg-slate-50/50 p-8 md:p-10">
                <div className="sticky top-0 space-y-8">
                  <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white font-black">
                        {selectedJob.brandInitial || 'B'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{selectedJob.brandName || "Vetted Brand"}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-slate-600">4.9/5 Rating</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Hiring Rate</span>
                        <span className="font-bold text-slate-900">{selectedJob.hiringRate || "90%"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Verified Status</span>
                        <span className="font-bold text-[#10B981]">Managed Account</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => { setSelectedJob(null); setIsSignupModalOpen(true); }}
                      className="w-full rounded-xl bg-[#0040E5] py-4 text-base font-bold text-white shadow-lg shadow-[#0040E5]/20 hover:bg-[#0036C2] transition-all active:scale-95"
                    >
                      Apply to Project
                    </button>
                    <button className="w-full rounded-xl border-2 border-slate-200 bg-white py-4 text-base font-bold text-slate-700 hover:border-[#0040E5] hover:text-[#0040E5] transition-all">
                      Save for Later
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex gap-3">
                      <Zap className="h-5 w-5 text-[#0040E5] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-blue-900">Pro Tip</p>
                        <p className="text-[11px] text-blue-700 leading-tight mt-1">Creators with a complete portfolio are 5x more likely to be hired for this category.</p>
                      </div>
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
              <h2 className="text-3xl font-black text-slate-900">Start Your Portfolio</h2>
              <p className="mt-2 text-slate-500">Showcase your AI skills and start applying to projects immediately.</p>
            </div>

            <form className="mt-10 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                  <input type="text" className="mt-2 w-full rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-[#0040E5]/20 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Email</label>
                  <input type="email" className="mt-2 w-full rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-[#0040E5]/20 focus:outline-none" />
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
              <button type="submit" onClick={(e) => e.preventDefault()} className="w-full rounded-2xl bg-[#0040E5] py-4 text-base font-black text-white shadow-xl shadow-[#0040E5]/20 hover:bg-[#0036C2]">Go Live Now</button>
              <p className="text-center text-[10px] text-slate-400 font-medium">No approval needed. Create your profile and start applying in minutes.</p>
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
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black text-slate-900">Browse Projects</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black text-slate-900">How It Works</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold text-[#0040E5]">For Creators</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-xl font-medium text-slate-400">For Brands</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black text-slate-900">Pricing</a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-black text-slate-900">About Us</a>
            <div className="pt-8 space-y-4">
              <button className="w-full rounded-2xl bg-[#0040E5] py-4 font-bold text-white" onClick={() => { setMobileMenuOpen(false); setIsSignupModalOpen(true); }}>Start Portfolio</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
