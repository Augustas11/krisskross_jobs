import { useState, useRef, useCallback } from "react";

const AGENTS = [
  {
    id: "product_analyzer",
    index: 0,
    label: "01",
    name: "Product Analyzer",
    role: "VISION AGENT",
    description: "Reads the product image to extract category, style, target market, and key selling points",
    accent: "#f97316",
    systemPrompt: `You are a precision product analysis agent for an AI fashion e-commerce platform. Your job is to extract structured intelligence from product photos.

Analyze the product image and return ONLY valid JSON (no markdown, no explanation):
{
  "category": "string (e.g. tops, dresses, bottoms, outerwear, accessories)",
  "sub_category": "string (e.g. crop top, midi dress, wide-leg jeans)",
  "style_aesthetic": "string (e.g. streetwear, minimalist, bohemian, office-casual, Y2K)",
  "primary_colors": ["array of colors"],
  "key_materials": ["array of materials if identifiable"],
  "target_demographic": "string (e.g. Gen Z women 18-24, Millennial professionals 28-35)",
  "price_tier": "string (budget/mid-range/premium/luxury based on visible quality)",
  "key_selling_points": ["array of 3-5 strongest selling points visible in the image"],
  "occasion": ["array of occasions, e.g. casual, date night, work, party"],
  "season": "string (spring/summer/fall/winter/all-season)",
  "tiktok_trend_match": "string (closest current TikTok fashion trend this matches)",
  "product_condition": "string (describe what's visible: fabric quality, fit, unique details)"
}`,
  },
  {
    id: "script_generator",
    index: 1,
    label: "02",
    name: "Script Generator",
    role: "CREATIVE AGENT",
    description: "Transforms product intelligence into a punchy TikTok-native video script with hooks and scenes",
    accent: "#a855f7",
    systemPrompt: `You are a viral TikTok content strategist specializing in fashion e-commerce. You write scripts that stop the scroll and drive purchases.

Given product analysis data, return ONLY valid JSON (no markdown, no explanation):
{
  "hook": {
    "text": "string (0-3 second opening line that stops the scroll)",
    "visual_direction": "string (what the model is doing in the first frame)"
  },
  "scenes": [
    {
      "scene_number": 1,
      "duration_seconds": 3,
      "action": "string (what the model does)",
      "voiceover_text": "string (what's said, if anything)",
      "text_overlay": "string (on-screen text)",
      "emotional_beat": "string (desire/FOMO/social proof/urgency)"
    }
  ],
  "call_to_action": {
    "text": "string",
    "type": "string (link-in-bio/comment/duet/stitch)"
  },
  "total_duration_seconds": 15,
  "content_angle": "string (transformation/GRWM/outfit-reveal/styling-hack/POV)",
  "viral_hooks_used": ["array of psychological hooks applied"]
}`,
  },
  {
    id: "video_composer",
    index: 2,
    label: "03",
    name: "Video Composer",
    role: "DIRECTOR AGENT",
    description: "Translates the script into shot-by-shot video composition with transitions and visual effects",
    accent: "#06b6d4",
    systemPrompt: `You are a TikTok video director for fashion content. Be concise.

Return ONLY valid JSON, no markdown:
{
  "opening_shot": {"angle": "string", "model_pose": "string"},
  "shots": [
    {"n": 1, "type": "close-up|medium|wide", "focus": "string", "movement": "pan|zoom|static", "transition": "cut|swipe|whip-pan", "secs": 2},
    {"n": 2, "type": "string", "focus": "string", "movement": "string", "transition": "string", "secs": 3},
    {"n": 3, "type": "string", "focus": "string", "movement": "string", "transition": "string", "secs": 3}
  ],
  "color_grade": "string",
  "background": "string",
  "model_direction": "string",
  "key_moments": ["detail1", "detail2"]
}`,
  },
  {
    id: "tiktok_optimizer",
    index: 3,
    label: "04",
    name: "TikTok Optimizer",
    role: "GROWTH AGENT",
    description: "Maximizes discoverability with optimized metadata, hashtags, posting strategy, and trending audio",
    accent: "#10b981",
    systemPrompt: `You are a TikTok algorithm specialist and growth hacker for fashion e-commerce. You know what gets pushed by the FYP algorithm.

Given all previous agent outputs (product, script, composition), return ONLY valid JSON (no markdown, no explanation):
{
  "caption": {
    "hook_sentence": "string (first 1-2 lines visible before 'more')",
    "full_caption": "string (complete caption with emojis)",
    "character_count": 150
  },
  "hashtag_strategy": {
    "niche_hashtags": ["5-7 very specific hashtags, low competition"],
    "mid_hashtags": ["4-5 mid-size hashtags 100k-1M"],
    "trending_hashtags": ["2-3 large trending hashtags"],
    "brand_hashtag": "#KrissKross"
  },
  "posting_schedule": {
    "best_days": ["array of day names"],
    "best_times_utc": ["array of time strings"],
    "timezone_note": "string"
  },
  "sound_strategy": {
    "trending_audio_type": "string (viral sound type to use)",
    "original_audio_tip": "string (if creating original audio)"
  },
  "engagement_triggers": {
    "question_to_ask": "string (in caption or comments)",
    "comment_baiting_technique": "string",
    "duet_potential": "string (how to invite duets/stitches)"
  },
  "ab_test_suggestion": "string (what to test in next version)",
  "predicted_audience": "string",
  "virality_score": 8
}`,
  },
];

const AgentIcon = ({ index, accent }) => {
  const icons = ["🔍", "✍️", "🎬", "📈"];
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: `${accent}20`,
      border: `1px solid ${accent}50`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18
    }}>
      {icons[index]}
    </div>
  );
};

const StatusPill = ({ status, accent }) => {
  const configs = {
    idle: { bg: "#1e293b", color: "#64748b", text: "IDLE" },
    running: { bg: `${accent}20`, color: accent, text: "RUNNING" },
    done: { bg: "#10b98120", color: "#10b981", text: "DONE" },
    error: { bg: "#ef444420", color: "#ef4444", text: "ERROR" },
  };
  const c = configs[status] || configs.idle;
  return (
    <span style={{
      background: c.bg, color: c.color,
      border: `1px solid ${c.color}50`,
      borderRadius: 4, padding: "2px 8px",
      fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
      fontFamily: "monospace",
    }}>
      {status === "running" && <span style={{ marginRight: 4 }}>◉</span>}
      {c.text}
    </span>
  );
};

function renderOutput(result, accent) {
  if (!result) return null;

  const renderValue = (val, depth = 0) => {
    if (Array.isArray(val)) {
      return (
        <div style={{ paddingLeft: depth > 0 ? 12 : 0 }}>
          {val.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
              <span style={{ color: accent, opacity: 0.5 }}>▸</span>
              <span style={{ color: "#cbd5e1" }}>{typeof item === "object" ? renderValue(item, depth + 1) : String(item)}</span>
            </div>
          ))}
        </div>
      );
    }
    if (typeof val === "object" && val !== null) {
      return (
        <div style={{ paddingLeft: 12, borderLeft: `1px solid #1e293b` }}>
          {Object.entries(val).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 4 }}>
              <span style={{ color: "#64748b", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>
                {k.replace(/_/g, " ")}
              </span>
              <div style={{ marginTop: 2 }}>{renderValue(v, depth + 1)}</div>
            </div>
          ))}
        </div>
      );
    }
    return <span style={{ color: "#e2e8f0" }}>{String(val)}</span>;
  };

  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.entries(result).map(([key, val]) => (
        <div key={key} style={{
          background: "#0f172a",
          border: `1px solid #1e293b`,
          borderRadius: 8,
          padding: "10px 14px"
        }}>
          <div style={{
            color: accent, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: "monospace", marginBottom: 6
          }}>
            {key.replace(/_/g, " ")}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            {renderValue(val)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SHOT PROMPT BUILDER ─────────────────────────────────────────────────────
// Deterministic — no LLM needed. Assembles Seedance prompt from Agent 03 fields.
function buildShotPrompt(shot, composerResult, productAnalysis) {
  const parts = [];
  // Shot type + focus
  const typeMap = { "close-up": "Extreme close-up shot", "medium": "Medium shot", "wide": "Wide establishing shot" };
  parts.push(typeMap[shot.type] || `${shot.type} shot`);
  if (shot.focus) parts.push(`focusing on ${shot.focus}`);
  // Camera movement
  const movMap = { pan: "with slow horizontal pan", zoom: "with smooth zoom in", static: "static camera", tilt: "with gentle tilt up" };
  parts.push(movMap[shot.movement] || `${shot.movement} camera`);
  // Model + environment from composer
  if (composerResult.model_direction) parts.push(`fashion model: ${composerResult.model_direction}`);
  if (composerResult.background) parts.push(`setting: ${composerResult.background}`);
  if (composerResult.color_grade) parts.push(`color grade: ${composerResult.color_grade}`);
  // Product context from analyzer
  if (productAnalysis?.style_aesthetic) parts.push(`${productAnalysis.style_aesthetic} aesthetic`);
  if (productAnalysis?.primary_colors?.length) parts.push(`colors: ${productAnalysis.primary_colors.slice(0, 2).join(", ")}`);
  // TikTok vertical framing
  parts.push("vertical 9:16 framing, TikTok fashion video, cinematic quality");
  return parts.join(", ");
}

// ─── SEEDANCE API ─────────────────────────────────────────────────────────────
const SEEDANCE_BASE = "https://seedance1-5pro.com/api";

async function submitSeedanceJob(prompt, durationSecs, apiKey) {
  const res = await fetch(`${SEEDANCE_BASE}/generate`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      aspect_ratio: "9:16",
      duration: String(Math.max(3, Math.min(10, durationSecs || 4))),
      sound: false,
    }),
  });
  if (!res.ok) throw new Error(`Seedance submit failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data?.data?.task_id) throw new Error("No task_id returned from Seedance");
  return data.data.task_id;
}

async function pollSeedanceJob(taskId, apiKey, onProgress) {
  const MAX_POLLS = 40; // ~2 min at 3s interval
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const res = await fetch(`${SEEDANCE_BASE}/status?task_id=${taskId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error(`Seedance poll failed: ${res.status}`);
    const data = await res.json();
    const status = data?.data?.status;
    onProgress(status, i);
    if (status === "SUCCESS") {
      const url = data?.data?.response?.[0];
      if (!url) throw new Error("No video URL in Seedance response");
      return url;
    }
    if (status === "FAILED") throw new Error(data?.data?.error_message || "Seedance generation failed");
  }
  throw new Error("Seedance timed out after 2 minutes");
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function KrissKrossAgentPipeline() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [agentStates, setAgentStates] = useState({ 0: "idle", 1: "idle", 2: "idle", 3: "idle" });
  const [agentResults, setAgentResults] = useState({});
  const [agentErrors, setAgentErrors] = useState({});
  const [running, setRunning] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const fileInputRef = useRef();
  const abortRef = useRef(false);

  // ── Phase 5: Seedance shot generation ─────────────────────────────────────
  const [seedanceKey, setSeedanceKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [shotStates, setShotStates] = useState({});   // { shotIndex: "idle"|"submitting"|"polling"|"done"|"error" }
  const [shotPrompts, setShotPrompts] = useState({});  // { shotIndex: promptString }
  const [shotVideos, setShotVideos] = useState({});    // { shotIndex: videoUrl }
  const [shotErrors, setShotErrors] = useState({});    // { shotIndex: errorMsg }
  const [seedanceRunning, setSeedanceRunning] = useState(false);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
    setAgentStates({ 0: "idle", 1: "idle", 2: "idle", 3: "idle" });
    setAgentResults({});
    setAgentErrors({});
    setExpandedAgent(null);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(fakeEvent);
    }
  }, [handleImageUpload]);

  // ── Phase 5: Generate each shot via Seedance ──────────────────────────────
  const generateShots = async () => {
    const composerResult = agentResults[2];
    const productAnalysis = agentResults[0];
    if (!composerResult?.shots?.length || !seedanceKey.trim()) return;

    setSeedanceRunning(true);
    setShotVideos({});
    setShotErrors({});

    // Build all prompts upfront (deterministic, instant)
    const prompts = {};
    composerResult.shots.forEach((shot, idx) => {
      prompts[idx] = buildShotPrompt(shot, composerResult, productAnalysis);
    });
    setShotPrompts(prompts);

    // Also handle opening_shot as shot index -1
    if (composerResult.opening_shot) {
      const openingPrompt = buildShotPrompt(
        { type: "wide", focus: composerResult.opening_shot.angle, movement: "static", secs: 3,
          model_pose: composerResult.opening_shot.model_pose },
        composerResult, productAnalysis
      );
      prompts[-1] = openingPrompt;
      setShotPrompts({ ...prompts, [-1]: openingPrompt });
    }

    // Initialise states
    const allIdxs = composerResult.shots.map((_, i) => i);
    if (composerResult.opening_shot) allIdxs.unshift(-1);
    setShotStates(Object.fromEntries(allIdxs.map(i => [i, "submitting"])));

    // Submit + poll all shots in parallel
    await Promise.all(allIdxs.map(async (idx) => {
      const prompt = prompts[idx];
      const secs = idx === -1 ? 3 : (composerResult.shots[idx]?.secs || 4);
      try {
        setShotStates(s => ({ ...s, [idx]: "submitting" }));
        const taskId = await submitSeedanceJob(prompt, secs, seedanceKey.trim());

        setShotStates(s => ({ ...s, [idx]: "polling" }));
        const videoUrl = await pollSeedanceJob(taskId, seedanceKey.trim(), (status) => {
          // Keep polling state updated with Seedance status text
          setShotStates(s => ({ ...s, [idx]: `polling:${status}` }));
        });

        setShotVideos(v => ({ ...v, [idx]: videoUrl }));
        setShotStates(s => ({ ...s, [idx]: "done" }));
      } catch (err) {
        setShotErrors(e => ({ ...e, [idx]: err.message }));
        setShotStates(s => ({ ...s, [idx]: "error" }));
      }
    }));

    setSeedanceRunning(false);
  };

  const callAgent = async (agent, messages) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        system: agent.systemPrompt,
        messages,
      }),
    });
    if (!response.ok) throw new Error(`Agent ${agent.name} failed: ${response.statusText}`);
    const data = await response.json();
    if (data.stop_reason === "max_tokens") {
      throw new Error(`Agent ${agent.name} response was cut off — JSON truncated. Try again.`);
    }
    const text = data.content?.[0]?.text || "";
    const cleaned = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
  };

  const runPipeline = async () => {
    if (!imageBase64) return;
    abortRef.current = false;
    setRunning(true);
    setAgentStates({ 0: "idle", 1: "idle", 2: "idle", 3: "idle" });
    setAgentResults({});
    setAgentErrors({});
    setExpandedAgent(null);

    const results = {};

    for (let i = 0; i < AGENTS.length; i++) {
      if (abortRef.current) break;
      const agent = AGENTS[i];

      setAgentStates(s => ({ ...s, [i]: "running" }));
      setExpandedAgent(i);

      try {
        let messages = [];

        if (i === 0) {
          messages = [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
              { type: "text", text: "Analyze this product image and return the JSON analysis." }
            ]
          }];
        } else if (i === 1) {
          messages = [{
            role: "user",
            content: `Generate a TikTok video script for this product.\n\nProduct Analysis:\n${JSON.stringify(results[0], null, 2)}`
          }];
        } else if (i === 2) {
          // Agent 03 only needs hook + scenes from script, not the full script object
          const scriptSummary = {
            hook: results[1]?.hook,
            content_angle: results[1]?.content_angle,
            total_duration_seconds: results[1]?.total_duration_seconds,
            scenes: results[1]?.scenes,
          };
          const productSummary = {
            category: results[0]?.category,
            style_aesthetic: results[0]?.style_aesthetic,
            primary_colors: results[0]?.primary_colors,
            key_selling_points: results[0]?.key_selling_points,
          };
          messages = [{
            role: "user",
            content: `Create shot composition.\n\nProduct:${JSON.stringify(productSummary)}\n\nScript:${JSON.stringify(scriptSummary)}`
          }];
        } else if (i === 3) {
          // Agent 04 only needs product intel + script hook/CTA, not full composition
          const metaSummary = {
            category: results[0]?.category,
            target_demographic: results[0]?.target_demographic,
            tiktok_trend_match: results[0]?.tiktok_trend_match,
            occasion: results[0]?.occasion,
            hook: results[1]?.hook?.text,
            content_angle: results[1]?.content_angle,
            call_to_action: results[1]?.call_to_action,
            color_grade: results[2]?.color_grade,
          };
          messages = [{
            role: "user",
            content: `Optimize TikTok metadata for maximum reach.\n\nContext:${JSON.stringify(metaSummary)}`
          }];
        }

        const result = await callAgent(agent, messages);
        results[i] = result;
        setAgentResults(r => ({ ...r, [i]: result }));
        setAgentStates(s => ({ ...s, [i]: "done" }));
      } catch (err) {
        setAgentErrors(e => ({ ...e, [i]: err.message }));
        setAgentStates(s => ({ ...s, [i]: "error" }));
        break;
      }
    }

    setRunning(false);
  };

  const allDone = Object.values(agentStates).every(s => s === "done");
  const anyRunning = Object.values(agentStates).some(s => s === "running");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020617",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e2e8f0",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #0f172a",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#020617",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(8px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #f97316, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 900, color: "white"
          }}>K</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>KrissKross</div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", fontFamily: "monospace" }}>
              PRODUCT → VIDEO PIPELINE
            </div>
          </div>
        </div>
        <div style={{
          display: "flex", gap: 6, alignItems: "center",
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: 6, padding: "4px 10px"
        }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: agentStates[i] === "done" ? "#10b981"
                : agentStates[i] === "running" ? AGENTS[i].accent
                : agentStates[i] === "error" ? "#ef4444"
                : "#1e293b",
              transition: "all 0.3s",
              boxShadow: agentStates[i] === "running" ? `0 0 6px ${AGENTS[i].accent}` : "none"
            }} />
          ))}
          <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", marginLeft: 4 }}>
            {allDone ? "COMPLETE" : anyRunning ? "RUNNING" : "READY"}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Upload + Trigger */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, marginBottom: 32 }}>
          {/* Upload */}
          <div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 8 }}>
              INPUT / PRODUCT IMAGE
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={{
                border: `2px dashed ${image ? "#1e293b" : "#334155"}`,
                borderRadius: 12,
                cursor: "pointer",
                overflow: "hidden",
                aspectRatio: "4/5",
                background: "#0a0f1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "border-color 0.2s"
              }}>
              {image ? (
                <img src={image} alt="product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📦</div>
                  <div style={{ fontSize: 13, color: "#475569" }}>Drop product image</div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>or click to browse</div>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </div>

          {/* Pipeline overview */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 8 }}>
                PIPELINE OVERVIEW
              </div>
              <div style={{
                fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em",
                lineHeight: 1.2, marginBottom: 12
              }}>
                4-Agent<br />
                <span style={{ color: "#f97316" }}>Modular</span> Pipeline
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>
                Each agent is specialized for a single task. Output from one becomes input to the next — easier to debug, test, and iterate per component independently.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {AGENTS.map((agent) => (
                  <div key={agent.id} style={{
                    background: "#0a0f1a", border: `1px solid #0f172a`,
                    borderRadius: 8, padding: "10px 12px",
                    borderLeft: `3px solid ${agent.accent}40`
                  }}>
                    <div style={{ fontSize: 9, color: agent.accent, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 3 }}>
                      {agent.label} · {agent.role}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{agent.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={runPipeline}
              disabled={!imageBase64 || running}
              style={{
                marginTop: 20,
                background: !imageBase64 || running
                  ? "#0f172a"
                  : "linear-gradient(135deg, #f97316, #a855f7)",
                color: !imageBase64 || running ? "#334155" : "white",
                border: "none", borderRadius: 10,
                padding: "14px 24px",
                fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em",
                cursor: !imageBase64 || running ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                width: "100%"
              }}>
              {running ? "⟳  Pipeline Running..." : allDone ? "↺  Run Again" : "▶  Run Pipeline"}
            </button>
          </div>
        </div>

        {/* Agent Cards */}
        <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 12 }}>
          AGENT OUTPUTS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {AGENTS.map((agent, i) => {
            const status = agentStates[i];
            const result = agentResults[i];
            const error = agentErrors[i];
            const isExpanded = expandedAgent === i;

            return (
              <div key={agent.id}>
                {/* Connector */}
                {i > 0 && (
                  <div style={{
                    display: "flex", alignItems: "center",
                    padding: "4px 20px", gap: 6
                  }}>
                    <div style={{
                      width: 1, height: 24,
                      background: agentStates[i - 1] === "done"
                        ? `linear-gradient(to bottom, ${AGENTS[i - 1].accent}60, ${agent.accent}30)`
                        : "#0f172a",
                      marginLeft: 19,
                      transition: "all 0.5s"
                    }} />
                    {agentStates[i - 1] === "done" && (
                      <span style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", marginLeft: 4 }}>
                        context passed →
                      </span>
                    )}
                  </div>
                )}

                <div
                  style={{
                    background: "#0a0f1a",
                    border: `1px solid ${isExpanded ? agent.accent + "40" : "#0f172a"}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    transition: "all 0.3s",
                    boxShadow: agentStates[i] === "running"
                      ? `0 0 20px ${agent.accent}20`
                      : "none",
                  }}>
                  {/* Card Header */}
                  <div
                    onClick={() => result && setExpandedAgent(isExpanded ? null : i)}
                    style={{
                      padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      cursor: result ? "pointer" : "default",
                    }}>
                    <AgentIcon index={i} accent={agent.accent} />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{
                          fontSize: 9, color: agent.accent, fontFamily: "monospace",
                          fontWeight: 700, letterSpacing: "0.12em"
                        }}>{agent.label} · {agent.role}</span>
                        <StatusPill status={status} accent={agent.accent} />
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        {agent.description}
                      </div>
                    </div>

                    {result && (
                      <div style={{
                        fontSize: 10, color: "#475569", fontFamily: "monospace",
                        transform: isExpanded ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s"
                      }}>▼</div>
                    )}

                    {status === "running" && (
                      <div style={{ display: "flex", gap: 3 }}>
                        {[0, 1, 2].map(j => (
                          <div key={j} style={{
                            width: 4, height: 4, borderRadius: "50%",
                            background: agent.accent,
                            animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite`
                          }} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{
                      margin: "0 20px 16px",
                      padding: "10px 14px",
                      background: "#ef444410",
                      border: "1px solid #ef444430",
                      borderRadius: 8,
                      fontSize: 12, color: "#ef4444"
                    }}>
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Expanded Results */}
                  {isExpanded && result && (
                    <div style={{
                      borderTop: `1px solid #0f172a`,
                      padding: "16px 20px 20px"
                    }}>
                      {renderOutput(result, agent.accent)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Summary */}
        {allDone && (
          <div style={{
            marginTop: 24,
            background: "linear-gradient(135deg, #0a0f1a, #0f172a)",
            border: "1px solid #10b98130",
            borderRadius: 16,
            padding: "24px 28px",
            boxShadow: "0 0 40px #10b98110"
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 16
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "#10b98120", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 14
              }}>✅</div>
              <div>
                <div style={{ fontSize: 9, color: "#10b981", fontFamily: "monospace", letterSpacing: "0.12em", fontWeight: 700 }}>
                  PIPELINE COMPLETE
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  Ready to generate your TikTok video
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {AGENTS.map((agent, i) => (
                <div key={i} style={{
                  background: "#020617",
                  border: `1px solid ${agent.accent}30`,
                  borderRadius: 8, padding: "10px 12px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>
                    {["🔍", "✍️", "🎬", "📈"][i]}
                  </div>
                  <div style={{ fontSize: 10, color: agent.accent, fontFamily: "monospace", fontWeight: 700 }}>
                    {agent.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    {agent.name}
                  </div>
                  <div style={{
                    fontSize: 10, color: "#10b981", marginTop: 4,
                    fontFamily: "monospace"
                  }}>✓ DONE</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: "12px 16px",
              background: "#020617", borderRadius: 8,
              border: "1px solid #1e293b",
              fontSize: 12, color: "#64748b", fontFamily: "monospace",
              lineHeight: 1.6
            }}>
              <span style={{ color: "#10b981" }}>→</span> All 4 agents completed successfully.{" "}
              <span style={{ color: "#94a3b8" }}>
                Product insights, video script, shot composition, and TikTok metadata are ready.
                Each agent's output is independently debuggable and can be re-run in isolation.
              </span>
            </div>
          </div>
        )}

        {/* ── PHASE 5: Seedance Shot Generation ──────────────────────────────── */}
        {agentResults[2]?.shots?.length > 0 && (
          <div style={{
            marginTop: 24,
            background: "#080d14",
            border: "1px solid #06b6d430",
            borderRadius: 16,
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid #0f172a",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 9, color: "#06b6d4", fontFamily: "monospace", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 4 }}>
                  05 · SEEDANCE 1.5 · SHOT GENERATION
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  Generate Video Shots
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  Each shot from Agent 03 → Seedance prompt → 9:16 video clip
                </div>
              </div>
              <div style={{ fontSize: 24 }}>🎥</div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* API Key input */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 8
                }}>
                  <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                    SEEDANCE API KEY
                  </div>
                  <button
                    onClick={() => setShowKeyInput(v => !v)}
                    style={{
                      background: "none", border: "none",
                      color: "#475569", fontSize: 10, cursor: "pointer",
                      fontFamily: "monospace", padding: 0
                    }}>
                    {showKeyInput ? "▲ hide" : "▼ enter key"}
                  </button>
                </div>
                {showKeyInput && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="password"
                      placeholder="Bearer key from seedance1-5pro.com dashboard..."
                      value={seedanceKey}
                      onChange={e => setSeedanceKey(e.target.value)}
                      style={{
                        flex: 1,
                        background: "#0a0f1a",
                        border: `1px solid ${seedanceKey ? "#06b6d440" : "#1e293b"}`,
                        borderRadius: 6,
                        padding: "8px 12px",
                        color: "#e2e8f0",
                        fontSize: 12,
                        fontFamily: "monospace",
                        outline: "none",
                      }}
                    />
                    {seedanceKey && (
                      <div style={{
                        padding: "8px 10px",
                        background: "#06b6d410",
                        border: "1px solid #06b6d430",
                        borderRadius: 6,
                        fontSize: 10,
                        color: "#06b6d4",
                        fontFamily: "monospace",
                        display: "flex", alignItems: "center"
                      }}>✓ KEY SET</div>
                    )}
                  </div>
                )}
              </div>

              {/* Shot prompts preview */}
              {agentResults[2] && (() => {
                const shots = agentResults[2].shots || [];
                const composerResult = agentResults[2];
                const productAnalysis = agentResults[0];
                const allShots = composerResult.opening_shot
                  ? [{ _isOpening: true, ...composerResult.opening_shot, secs: 3 }, ...shots]
                  : shots;

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    {allShots.map((shot, displayIdx) => {
                      const shotIdx = shot._isOpening ? -1 : displayIdx - (composerResult.opening_shot ? 1 : 0);
                      const state = shotStates[shotIdx];
                      const videoUrl = shotVideos[shotIdx];
                      const error = shotErrors[shotIdx];
                      const prompt = shotPrompts[shotIdx] || buildShotPrompt(
                        shot._isOpening
                          ? { type: "wide", focus: shot.angle, movement: "static", secs: shot.secs }
                          : shot,
                        composerResult, productAnalysis
                      );
                      const isDone = state === "done";
                      const isRunning = state && !isDone && state !== "error" && state !== "idle";
                      const pollStatus = state?.startsWith("polling:") ? state.split(":")[1] : null;

                      return (
                        <div key={shotIdx} style={{
                          background: "#020617",
                          border: `1px solid ${isDone ? "#06b6d440" : isRunning ? "#06b6d420" : "#0f172a"}`,
                          borderRadius: 10,
                          overflow: "hidden",
                          transition: "border-color 0.3s",
                          boxShadow: isRunning ? "0 0 16px #06b6d415" : "none",
                        }}>
                          <div style={{ display: "flex", gap: 0 }}>
                            {/* Left: shot metadata */}
                            <div style={{ flex: 1, padding: "12px 14px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{
                                  fontSize: 9, color: "#06b6d4", fontFamily: "monospace",
                                  fontWeight: 700, letterSpacing: "0.1em"
                                }}>
                                  {shot._isOpening ? "OPEN" : `SHOT ${shotIdx + 1}`}
                                </span>
                                <span style={{
                                  fontSize: 9, color: "#475569", fontFamily: "monospace",
                                  background: "#0f172a", borderRadius: 3, padding: "1px 5px"
                                }}>
                                  {shot._isOpening ? "wide" : shot.type} · {shot._isOpening ? "3" : shot.secs}s
                                </span>
                                {state && (
                                  <span style={{
                                    fontSize: 9, fontFamily: "monospace", fontWeight: 700,
                                    color: isDone ? "#10b981" : error ? "#ef4444" : "#06b6d4",
                                    background: isDone ? "#10b98115" : error ? "#ef444415" : "#06b6d415",
                                    border: `1px solid ${isDone ? "#10b98130" : error ? "#ef444430" : "#06b6d430"}`,
                                    borderRadius: 3, padding: "1px 6px"
                                  }}>
                                    {isDone ? "✓ DONE" : error ? "✗ ERR" : pollStatus || state?.toUpperCase()}
                                  </span>
                                )}
                              </div>

                              {/* Prompt */}
                              <div style={{
                                fontSize: 11, color: "#94a3b8", lineHeight: 1.6,
                                borderLeft: "2px solid #06b6d430",
                                paddingLeft: 10, marginBottom: 6
                              }}>
                                {prompt}
                              </div>

                              {error && (
                                <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                                  ⚠️ {error}
                                </div>
                              )}

                              {/* Shot details from Agent 03 */}
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {[
                                  shot._isOpening ? shot.angle : shot.focus,
                                  shot._isOpening ? shot.model_pose : shot.movement,
                                  !shot._isOpening && shot.transition,
                                ].filter(Boolean).map((tag, ti) => (
                                  <span key={ti} style={{
                                    fontSize: 9, color: "#475569", fontFamily: "monospace",
                                    background: "#0f172a", borderRadius: 3,
                                    padding: "2px 6px", border: "1px solid #1e293b"
                                  }}>{tag}</span>
                                ))}
                              </div>
                            </div>

                            {/* Right: video player or placeholder */}
                            <div style={{
                              width: 90, flexShrink: 0,
                              background: "#0a0f1a",
                              borderLeft: "1px solid #0f172a",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              position: "relative", overflow: "hidden"
                            }}>
                              {videoUrl ? (
                                <video
                                  src={videoUrl}
                                  controls
                                  autoPlay
                                  loop
                                  muted
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : isRunning ? (
                                <div style={{ textAlign: "center", padding: 8 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                                    {[0, 1, 2].map(j => (
                                      <div key={j} style={{
                                        width: 4, height: 4, borderRadius: "50%",
                                        background: "#06b6d4",
                                        animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite`
                                      }} />
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontSize: 22, opacity: 0.2 }}>▶</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Generate button */}
              <button
                onClick={generateShots}
                disabled={!seedanceKey.trim() || seedanceRunning}
                style={{
                  width: "100%",
                  background: !seedanceKey.trim() || seedanceRunning
                    ? "#0f172a"
                    : "linear-gradient(135deg, #06b6d4, #0891b2)",
                  color: !seedanceKey.trim() || seedanceRunning ? "#334155" : "white",
                  border: "none", borderRadius: 8,
                  padding: "12px 20px",
                  fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                  cursor: !seedanceKey.trim() || seedanceRunning ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  fontFamily: "monospace",
                }}>
                {seedanceRunning
                  ? `⟳  Generating ${agentResults[2]?.shots?.length || 0} shots via Seedance...`
                  : Object.keys(shotVideos).length > 0
                  ? `↺  Regenerate All Shots`
                  : `▶  Generate ${(agentResults[2]?.shots?.length || 0) + (agentResults[2]?.opening_shot ? 1 : 0)} Shots via Seedance 1.5`
                }
              </button>

              {!seedanceKey && (
                <div style={{
                  marginTop: 10, fontSize: 11, color: "#475569",
                  textAlign: "center", fontFamily: "monospace"
                }}>
                  Get your API key at{" "}
                  <span style={{ color: "#06b6d4" }}>seedance1-5pro.com</span>
                  {" "}→ Dashboard → API Keys
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
