"use client";

import { useState } from "react";
import {
  Video, ImageIcon, Sparkles, Download,
  ArrowRight, Star, Clock, Zap,
  Menu, X, CheckCircle2, ChevronLeft,
  Users, Target, CheckCircle, LayoutGrid
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
    hiringRate: "97%",
    brandInitial: "S"
  }
];

// --- Components ---

export default function KrissKrossJobs() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">

      {/* 1. NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group mr-10 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black text-base shadow-lg shadow-primary/20">KJ</div>
            <span className="text-xl font-bold tracking-tight hidden lg:block text-brand-dark">KrissKross <span className="text-primary font-black">Jobs</span></span>
          </div>



          {/* Navigation Links - Centered */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-10 px-8">
            <a href="#browse-projects" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors whitespace-nowrap leading-none">Browse Projects</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors whitespace-nowrap leading-none">How It Works</a>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="rounded-full bg-primary px-8 py-3 text-sm font-black text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              Become Creator
            </button>
            <button className="lg:hidden ml-2" onClick={() => setMobileMenuOpen(false)}>
              <Menu className="h-6 w-6 text-brand-dark" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center md:py-36">
        <h1 className="text-5xl font-black tracking-tight text-brand-dark md:text-7xl lg:text-8xl leading-[1.1]">
          Turn your AI work <br className="hidden md:block" /> into a <span className="text-primary">creator business</span>
        </h1>
        <p className="mx-auto mt-10 max-w-2xl text-lg text-slate-600 md:text-xl leading-relaxed font-medium">
          Find brands actively hiring for TikTok Shop content—curated projects,
          vetted clients, built for creators like you. Only on KrissKross Jobs.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <button
            onClick={() => setIsSignupModalOpen(true)}
            className="w-full sm:w-auto rounded-full bg-primary px-12 py-6 text-xl font-black text-white shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
          >
            Become Creator
          </button>
          <button
            onClick={() => { document.getElementById('browse-projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="w-full sm:w-auto rounded-full border-2 border-primary/20 px-12 py-6 text-xl font-bold text-primary hover:bg-primary/5 transition-all active:scale-95"
          >
            Browse Available Projects
          </button>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-center gap-10 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            New Projects Daily
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-[#10B981]" />
            Get Hired in 72 Hours
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-primary" />
            Vetted Brands Only
          </div>
        </div>
      </section>



      {/* 4. PROJECT LISTING GRID */}
      <section id="browse-projects" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-20">
        <h2 className="text-2xl font-black mb-10 text-brand-dark">Available Projects for AI Creators</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedJob(project)}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  {project.tags.includes("Animation") ? <Video className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                  {project.title}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-slate-700">{project.budget}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-slate-600">{project.quantity} required</span>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Activity</span>
                    <span className="text-sm font-black text-primary animate-pulse">{project.applicants}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Posted</span>
                    <p className="text-sm font-bold text-slate-500">{project.posted}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">{tag}</span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 group-hover:scale-[1.02]">
                    View Project Details <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-32 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black text-brand-dark md:text-5xl">How to Get Hired</h2>
            <p className="mt-6 text-xl text-slate-500 font-medium">From portfolio to payment in 72 hours.</p>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                icon: <Sparkles className="h-8 w-8 text-primary" />,
                title: "1. Build Your Profile",
                desc: "Upload 3-5 of your best AI-generated samples. No approval process—go live immediately."
              },
              {
                icon: <LayoutGrid className="h-8 w-8 text-primary" />,
                title: "2. Browse & Apply",
                desc: "Find projects that match your style. Apply with your portfolio in one click."
              },
              {
                icon: <Zap className="h-8 w-8 text-[#10B981]" />,
                title: "3. Deliver & Get Paid",
                desc: "Complete the project, get client approval, and receive payments securely via Stripe."
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl shadow-primary/5">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black text-brand-dark">{step.title}</h3>
                <p className="mt-4 text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-24 bg-background relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#977DFF]/5 rounded-full blur-[100px] -z-0"></div>

        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-brand-dark md:text-5xl lg:text-6xl tracking-tight leading-tight">
            Ready to Turn Your AI Skills <br className="hidden md:block" /> Into Client Work?
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-500 md:text-xl leading-relaxed font-medium">
            Join creators landing their first client in 72 hours.
            Build your portfolio, browse curated projects, get paid fast.
          </p>

          <div className="mt-12 space-y-12">
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "Curated projects posted daily",
                "Payment protection included",
                "Get paid in 48 hours (Pro tier)",
                "Direct relationships with vetted brands"
              ].map((text, i) => (
                <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setIsSignupModalOpen(true)}
                className="w-full sm:w-auto rounded-2xl bg-primary px-12 py-6 text-xl font-black text-white shadow-2xl shadow-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
              >
                Become Creator
              </button>
              <p className="text-slate-400 text-sm font-bold">No approval needed. Go live in 10 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-brand-dark pt-24 pb-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li key="Browse Projects"><a href="#browse-projects" className="hover:text-primary transition-colors">Browse Projects</a></li>
                <li key="How It Works"><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Resources</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li key="Creator Guide"><a href="/creator-guide" className="hover:text-primary transition-colors">Creator Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 font-bold text-white uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li key="About KrissKross"><a href="https://www.krisskross.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">About KrissKross</a></li>
                <li key="Contact"><a href="mailto:hello@krisskross.ai" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold">© 2025 KrissKross Jobs. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* PROJECT DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
          <div className="relative flex h-full w-full max-w-5xl overflow-hidden rounded-none border border-slate-200 bg-white shadow-2xl md:rounded-3xl animate-in slide-in-from-bottom-8 duration-500">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-6 top-6 z-10 rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition-colors"
            >
              <X className="h-6 w-6 text-brand-dark" />
            </button>

            <div className="flex h-full w-full flex-col md:flex-row divide-x divide-slate-100 overflow-y-auto">
              <div className="flex-1 p-8 md:p-12">
                <div className="inline-flex rounded-full bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase text-primary tracking-widest mb-6 border border-primary/10">Project Brief</div>
                <h2 className="text-3xl font-black text-brand-dark md:text-5xl leading-tight">{selectedJob.title}</h2>
                <div className="mt-8 flex items-center gap-6">
                  <span className="text-3xl font-black text-primary">{selectedJob.budget}</span>
                  <span className="text-xl font-bold text-slate-400">{selectedJob.quantity} needed</span>
                </div>

                <div className="mt-12 space-y-12">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Project Overview</h3>
                    <p className="mt-4 text-xl text-slate-600 leading-relaxed font-medium">
                      High-end {selectedJob.tags?.[0]} brand looking for creator to deliver {selectedJob.quantity} AI-generated videos in this category.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-6">
                      <Clock className="h-6 w-6 text-primary mb-3" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</h4>
                      <p className="mt-1 font-bold text-brand-dark">48-72 Hours</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-6">
                      <Zap className="h-6 w-6 text-accent-green mb-3" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Urgency</h4>
                      <p className="mt-1 font-bold text-brand-dark">Standard</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-6">
                      <Users className="h-6 w-6 text-primary mb-3" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Applications</h4>
                      <p className="mt-1 font-bold text-brand-dark">{selectedJob.applicants.split(' ')[0]}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[380px] bg-slate-50/50 p-8 md:p-12">
                <div className="sticky top-0 space-y-8">
                  <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark text-white font-black text-xl">
                        {selectedJob.brandInitial}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark text-lg">{selectedJob.brandName}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-bold text-slate-500">Managed Account</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => { setSelectedJob(null); setIsSignupModalOpen(true); }}
                      className="w-full rounded-2xl bg-primary py-5 text-base font-black text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all mb-4"
                    >
                      Apply to Project
                    </button>
                    <button className="w-full rounded-2xl border-2 border-slate-200 py-5 text-base font-bold text-slate-600 hover:border-primary hover:text-primary transition-all">
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setIsSignupModalOpen(false)}></div>
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsSignupModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-brand-dark transition-colors"><X className="h-6 w-6" /></button>
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                <Sparkles className="h-10 w-10" />
              </div>
              <h2 className="text-4xl font-black text-brand-dark">Become Creator</h2>
              <p className="mt-4 text-slate-500 font-medium">Showcase your AI skills and start applying to projects in minutes.</p>
            </div>

            <form
              action="https://formspree.io/f/xpqzowon"
              method="POST"
              encType="multipart/form-data"
              className="mt-12 space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Your Portfolio URL (Optional)</label>
                <input
                  type="text"
                  name="portfolio"
                  className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                  placeholder="Loomly, Instagram, Behance..."
                />
              </div>
              <div className="relative group">
                <input
                  type="file"
                  name="samples"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="rounded-3xl border-2 border-dashed border-slate-100 p-10 text-center bg-slate-50 group-hover:bg-slate-100 transition-colors">
                  <Download className="mx-auto h-8 w-8 text-slate-300 mb-4 rotate-180" />
                  <p className="text-sm font-bold text-slate-700">Upload 3-5 AI samples</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">Click or drag to upload (Max 50MB per file)</p>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-5 text-lg font-black text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Go Live Now
              </button>
              <p className="text-center text-[11px] text-slate-400 font-bold">No approval required. Instant access to all projects.</p>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[400] bg-white p-8 animate-in slide-in-from-right duration-500">
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2 font-black text-primary text-xl">KJ <span className="text-brand-dark">KrissKross Jobs</span></div>
            <button onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-slate-100 p-2"><X className="h-6 w-6 text-brand-dark" /></button>
          </div>
          <div className="space-y-12">
            {["Browse Projects", "How It Works"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMobileMenuOpen(false)} className="block text-4xl font-black text-brand-dark hover:text-primary transition-colors">{l}</a>
            ))}
            <div className="pt-12">
              <button onClick={() => { setMobileMenuOpen(false); setIsSignupModalOpen(true); }} className="w-full rounded-3xl bg-primary py-6 text-xl font-black text-white shadow-2xl shadow-primary/20">Become Creator</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
