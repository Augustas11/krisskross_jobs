"use client";

import { useState, useEffect } from "react";
import {
  Video, ImageIcon, Sparkles, Download,
  ArrowRight, Star, Clock, Zap,
  Menu, X, CheckCircle2, ChevronLeft,
  Users, Target, CheckCircle, LayoutGrid, Loader2, Plus, ArrowLeftRight
} from "lucide-react";
import { canGenerate, addGeneration, getRemainingGenerations } from "@/lib/usageTracker";

// --- Mock Data ---

const PROJECTS = [
  {
    id: 1,
    title: "Zesica: Boho-Chic Summer Dress Transitions",
    budget: "$1,500 total ($100 per video)",
    quantity: "15 videos",
    posted: "Dec 28, 2025",
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
    posted: "Dec 27, 2025",
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
    posted: "Dec 26, 2025",
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

  // --- AI Generator State ---
  const [genMode, setGenMode] = useState<"video" | "image">("video");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [genResultUrl, setGenResultUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  // Usage tracking state
  const [remainingGenerations, setRemainingGenerations] = useState({ video: 2, image: 2 });

  // Separate prompts for video and image
  const [videoPrompt, setVideoPrompt] = useState("A lighthearted, playful cartoon-style video. The fruit from Image 1 blinks. An empty glass bottle from Image 2 slides in from one side and stops in front of the fruit. The fruit performs a simple magical gesture. Sparkling magic appears, and juice materializes directly inside the bottle, with the color strictly matching Image 2. As the bottle fills, it grows larger and moves to the center. The fruit runs off-screen, and the final shot holds on the Image 2 bottle. A friendly voiceover says, \"Fresh juice, made by magic!\" The voiceover must finish before the video ends. Include soft blink sounds, magic sparkle audio, light juice-fill sound, glass clinks, and a quick running sound.");
  const [imagePrompt, setImagePrompt] = useState("Change the character action in Figure 1 to the action of holding the cat in Figure 3 with both hands, and change the background to the background picture in Figure 2. Generate a single, cohesive, high-quality image with a natural perspective.");

  // Separate reference images for video and image
  // Video only needs first and last frame (2 images)
  const [videoRefImages, setVideoRefImages] = useState<(string | null)[]>([
    "/samples/fruit-character.png",
    "/samples/juice-bottle.png"
  ]);
  const [imageRefImages, setImageRefImages] = useState<(string | null)[]>([
    "/samples/fig1-character.jpg",
    "/samples/fig2-background.jpg",
    "/samples/fig3-cat.jpg"
  ]);

  // Current active prompt and images based on mode
  const prompt = genMode === "video" ? videoPrompt : imagePrompt;
  const setPrompt = genMode === "video" ? setVideoPrompt : setImagePrompt;
  const refImages = genMode === "video" ? videoRefImages : imageRefImages;
  const setRefImages = genMode === "video" ? setVideoRefImages : setImageRefImages;

  // Initialize remaining generations on mount
  useEffect(() => {
    setRemainingGenerations({
      video: getRemainingGenerations('video'),
      image: getRemainingGenerations('image')
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newImages = [...refImages];
      newImages[index] = url;
      setRefImages(newImages);
    }
  };

  const removeFrame = (index: number) => {
    const newImages = [...refImages];
    newImages[index] = null;
    setRefImages(newImages);
  };

  const pollTaskStatus = async (taskId: string) => {
    const check = async () => {
      try {
        const res = await fetch(`/api/generate/status?taskId=${taskId}`);
        const data = await res.json();

        if (data.status === 'succeeded') {
          // Video API returns: data.content.video_url
          // Image API (if async) might return: data.result.url or data.data[0].url
          const videoUrl = data.content?.video_url || data.result?.url || data.data?.[0]?.url;

          if (videoUrl) {
            setGenResultUrl(videoUrl);
            setGenStatus("completed");
            setIsGenerating(false);

            // Track successful generation
            addGeneration(genMode);
            setRemainingGenerations({
              video: getRemainingGenerations('video'),
              image: getRemainingGenerations('image')
            });
          } else {
            console.error('Generation succeeded but no URL found. Data:', data);
            alert('Generation error: Video URL is missing from response. Please try again.');
            setGenStatus("idle");
            setIsGenerating(false);
          }
        } else if (data.status === 'failed') {
          alert('Generation failed: ' + (data.message || 'Unknown error'));
          setGenStatus("idle");
          setIsGenerating(false);
        } else {
          // Keep polling
          setTimeout(check, 3000);
        }
      } catch (err) {
        console.error('Polling error:', err);
        setTimeout(check, 5000);
      }
    };
    check();
  };

  const blobToBase64 = (blobUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      fetch(blobUrl)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Check if user has remaining free generations
    if (!canGenerate(genMode)) {
      setIsSignupModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGenStatus("processing");
    setGenResultUrl(null);

    try {
      // Resolve blobs and samples to base64 before sending
      const resolvedRefImages = await Promise.all(refImages.map(async (img) => {
        if (!img) return null;

        // Convert both blob URLs (uploads) and local samples (starting with /) to base64
        if (img.startsWith('blob:') || img.startsWith('/')) {
          try {
            return await blobToBase64(img);
          } catch (e) {
            console.error('Failed to convert image:', e);
            return null;
          }
        }
        return img;
      }));

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: genMode,
          prompt,
          refImages: resolvedRefImages,
          userEmail: userEmail || "anonymous@local"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Generation error:', data);
        throw new Error(`Error ${res.status}: ${data.error || data.message || res.statusText}`);
      }

      // Extract task ID (BytePlus uses 'id' for Seedance, some endpoints use 'task_id')
      const taskId = data.task_id || data.id;

      if (genMode === 'video' && taskId) {
        pollTaskStatus(taskId);
      } else if (genMode === 'image' && taskId) {
        // Image generation can also be async
        pollTaskStatus(taskId);
      } else if (genMode === 'image' && data.data && data.data[0]) {
        // Image API returns immediate result in data[0].url
        setGenResultUrl(data.data[0].url);
        setGenStatus("completed");
        setIsGenerating(false);

        // Track successful generation
        addGeneration(genMode);
        setRemainingGenerations({
          video: getRemainingGenerations('video'),
          image: getRemainingGenerations('image')
        });
      } else {
        // Fallback: Check if we have an immediate URL
        const directUrl = data.url || data.video_url || data.data?.[0]?.url;

        if (directUrl) {
          setGenResultUrl(directUrl);
          setGenStatus("completed");
          setIsGenerating(false);

          // Track successful generation
          addGeneration(genMode);
          setRemainingGenerations({
            video: getRemainingGenerations('video'),
            image: getRemainingGenerations('image')
          });
        } else {
          console.error('Unknown response format (no ID, no URL):', data);
          throw new Error('Received successful response but no content URL or Task ID found.');
        }
      }
    } catch (error: any) {
      alert(error.message);
      setGenStatus("idle");
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!genResultUrl) return;

    try {
      const response = await fetch(genResultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `krisskross-${genMode}-${Date.now()}.${genMode === 'video' ? 'mp4' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or right-click to save.');
    }
  };

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
            <a
              href="#ai-generator"
              className="group flex items-center gap-1.5 text-sm font-bold text-primary transition-all whitespace-nowrap leading-none px-4 py-2 bg-primary/5 rounded-full border border-primary/10 hover:bg-primary hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" /> Free AI Tool
            </a>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-6 shrink-0">
            <a href="/login" className="hidden lg:block text-sm font-bold text-slate-500 hover:text-brand-dark transition-colors">
              Log In
            </a>
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

      {/* 3. AI GENERATOR (LEAD MAGNET) */}
      <section id="ai-generator" className="mx-auto max-w-7xl px-6 py-20 scroll-mt-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-dark p-8 md:p-16 shadow-2xl">
          {/* Background Accents */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#977DFF]/10 blur-[100px]"></div>

          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary mb-6">
                <Sparkles className="h-4 w-4" /> Creator Studio Beta
              </div>
              <h2 className="text-3xl font-black text-white md:text-5xl leading-tight">
                Create your first <br />
                <span className="text-primary italic">proposal asset</span> with AI
              </h2>
              <p className="mt-6 text-lg text-slate-400 font-medium max-w-lg">
                Aspiring creators: Use our free tool to generate stunning AI visuals for your next job application. Show brands what you can do before you even talk to them.
              </p>

              <div className="mt-10 space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/10">
                  <button
                    onClick={() => {
                      setGenMode("video");
                      setGenStatus("idle");
                      setGenResultUrl(null);
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${genMode === "video" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white"}`}
                  >
                    <Video className="h-4 w-4" /> Video
                  </button>
                  <button
                    onClick={() => {
                      setGenMode("image");
                      setGenStatus("idle");
                      setGenResultUrl(null);
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${genMode === "image" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-white"}`}
                  >
                    <ImageIcon className="h-4 w-4" /> Image
                  </button>
                </div>

                {/* Remaining Generations Indicator */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-white">Free {genMode === 'video' ? 'Video' : 'Image'} Generations</span>
                  </div>
                  <div className={`text-sm font-black ${remainingGenerations[genMode] > 0 ? 'text-primary' : 'text-slate-500'}`}>
                    {remainingGenerations[genMode]} of 2 remaining
                  </div>
                </div>

                {/* Reference Images (Formerly Frame Uploaders) */}
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                      {genMode === "video" ? "First Frame & Last Frame" : "Reference Images (Figure 1, 2, 3)"}
                    </label>
                    <div className="flex items-center gap-4">
                      {refImages.map((img, idx) => {
                        // Get label based on mode
                        let label = "";
                        let figLabel = "";
                        if (genMode === "video") {
                          label = idx === 0 ? "First Frame" : "Last Frame";
                          figLabel = idx === 0 ? "1ST" : "LAST";
                        } else {
                          label = `Add Fig ${idx + 1}`;
                          figLabel = `FIG ${idx + 1}`;
                        }

                        return (
                          <div key={idx} className="relative flex-1 aspect-square rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-primary/50 transition-all overflow-hidden group">
                            {img ? (
                              <div className="relative h-full w-full">
                                <img src={img} className="h-full w-full object-cover" alt={`Ref ${idx + 1}`} />
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFrame(idx); }}
                                  className="absolute top-2 right-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-brand-dark/80 text-white shadow-lg hover:bg-primary transition-all backdrop-blur-sm"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-brand-dark/60 backdrop-blur-sm text-[10px] font-black text-white/70">{figLabel}</div>
                              </div>
                            ) : (
                              <label className="absolute inset-0 z-10 flex flex-col items-center justify-center text-slate-500 group-hover:text-primary transition-colors cursor-pointer">
                                <Plus className="h-5 w-5 mb-1" />
                                <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, idx)} />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={genMode === "video" ? "e.g. A cinematic close-up of a skincare bottle with water splashes..." : "e.g. A high-fashion flatlay of winter boots on marble background..."}
                    className="w-full h-32 rounded-3xl bg-white/5 border border-white/10 p-6 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all resize-none font-medium leading-relaxed"
                  />
                </div>

                {/* Email Identification */}
                <div className="relative">
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email to link this to your portfolio..."
                    className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="group relative w-full overflow-hidden rounded-2xl bg-primary py-5 text-lg font-black text-white shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Generating Your {genMode === "video" ? "Video" : "Image"}...
                      </>
                    ) : (
                      <>
                        Generate Free {genMode === "video" ? "Video" : "Image"} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#6C8DFF] to-primary bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>

            <div className="relative lg:ml-auto w-full max-w-md aspect-square">
              {/* Preview Card */}
              <div className="h-full w-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center text-center p-8 relative">

                {genStatus === "idle" && (
                  <div className="space-y-6">
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Ready to Create?</h4>
                      <p className="text-slate-500 text-sm font-medium">Your generated asset will appear here. No login required for your first sample.</p>
                    </div>
                  </div>
                )}

                {genStatus === "processing" && (
                  <div className="space-y-8 w-full max-w-xs">
                    <div className="relative mx-auto w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <div className="absolute inset-4 rounded-3xl bg-primary/10 flex items-center justify-center">
                        {genMode === "video" ? <Video className="h-8 w-8 text-primary" /> : <ImageIcon className="h-8 w-8 text-primary" />}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-progress-fast"></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>Rendering AI Model</span>
                        <span className="text-primary">In Progress</span>
                      </div>
                    </div>
                  </div>
                )}

                {genStatus === "completed" && (
                  <div className="absolute inset-0 flex flex-col">
                    {/* Real Result Preview */}
                    {genResultUrl ? (
                      <div className="flex-1 w-full relative bg-slate-900">
                        {genMode === "video" ? (
                          <video src={genResultUrl} controls className="h-full w-full object-contain" />
                        ) : (
                          <img src={genResultUrl} className="h-full w-full object-contain" alt="Generated asset" />
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-slate-200">
                        <p className="text-brand-dark font-black text-xs uppercase tracking-[0.2em] opacity-40">Sample Rendered Successfully</p>
                      </div>
                    )}

                    {/* Action Bar at Bottom */}
                    <div className="bg-white/10 backdrop-blur-md border-t border-white/20 p-6 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <h4 className="text-lg font-black text-white">Generation Complete!</h4>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleDownload}
                          className="flex-1 rounded-xl bg-primary text-white py-3 text-sm font-black shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" /> Download HD
                        </button>
                        <button
                          onClick={() => { setGenStatus("idle"); setGenResultUrl(null); }}
                          className="px-6 rounded-xl border-2 border-white/20 text-white py-3 text-sm font-bold hover:bg-white/10 transition-all"
                        >
                          Try Another
                        </button>
                      </div>

                      {/* Soft signup CTA */}
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-slate-400 text-center mb-2">
                          💡 Want more? Apply to join our creator network.
                        </p>
                        <button
                          onClick={() => setIsSignupModalOpen(true)}
                          className="w-full text-xs font-bold text-primary hover:text-white transition-colors"
                        >
                          Apply for Access →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Tags for flair */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-bold text-slate-500 border border-white/5 uppercase">1080p</div>
                  <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-bold text-slate-500 border border-white/5 uppercase">AI Rendered</div>
                </div>
              </div>
            </div>
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

              <div className="mt-auto border-t border-slate-100 pt-6">
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

                <div>
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
                title: "1. Apply & Get Approved",
                desc: "Submit your portfolio for review. We curate the best AI talent for our brands."
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
                <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-start text-left gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 flex-1">{text}</span>
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
              <p className="text-slate-400 text-sm font-bold">Join the community of elite AI creators.</p>
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

            {/* Context-aware banner */}
            {(remainingGenerations.video === 0 || remainingGenerations.image === 0) && (
              <div className="mb-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm font-bold text-primary text-center">
                  You've used your free generations. Apply for creator access to unlock the full platform.
                </p>
              </div>
            )}

            <div className="text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                <Sparkles className="h-10 w-10" />
              </div>
              <h2 className="text-4xl font-black text-brand-dark">Apply for Access</h2>
              <p className="mt-4 text-slate-500 font-medium">Join an exclusive network of top-tier AI creators. Applications are reviewed manually.</p>
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
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Your Portfolio URL <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="portfolio"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                  placeholder="Loomly, Instagram, Behance..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Link to AI Samples</label>
                <p className="mb-2 text-xs text-slate-400 font-medium">Please include examples created with KrissKross AI or other tools.</p>
                <input
                  type="url"
                  name="samples_link"
                  className="w-full rounded-xl border border-slate-200 p-4 font-bold focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none"
                  placeholder="Paste your Drive or Dropbox link here..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-brand-dark py-5 text-lg font-black text-white shadow-2xl hover:scale-[1.02] transition-all"
              >
                Submit Application
              </button>
              <p className="text-center text-[11px] text-slate-400 font-bold">
                We review every application. If approved, you will receive an invite to create your profile and access the full toolset.
              </p>
              <div className="mt-8 text-center border-t border-slate-100 pt-6">
                <p className="text-xs font-bold text-slate-400">Already a member?</p>
                <a href="/login" className="text-sm font-black text-primary hover:text-brand-dark transition-colors">
                  Sign In to Creator Studio
                </a>
              </div>
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
