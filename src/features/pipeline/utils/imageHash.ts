/**
 * Image Hash (Average Perceptual Hash)
 * Client-side image hashing for cache lookups.
 * Resizes to 8×8 grayscale, computes average-based 64-bit hash.
 */

/** Compute a perceptual hash of an image (base64 data URL or base64 string) */
export async function computeImageHash(imageBase64: string): Promise<string> {
    const img = await loadImage(imageBase64);
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");

    // Draw image at 8×8 — browser handles downscaling
    ctx.drawImage(img, 0, 0, 8, 8);
    const { data } = ctx.getImageData(0, 0, 8, 8);

    // Convert to grayscale values
    const grays: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
        // Luminosity formula
        grays.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }

    // Compute average
    const avg = grays.reduce((s, v) => s + v, 0) / grays.length;

    // Build hash: each bit = 1 if pixel >= average
    let hash = "";
    for (const g of grays) {
        hash += g >= avg ? "1" : "0";
    }

    // Convert 64-bit binary to hex (16 hex chars)
    let hex = "";
    for (let i = 0; i < 64; i += 4) {
        hex += parseInt(hash.slice(i, i + 4), 2).toString(16);
    }

    return hex;
}

/** Hamming distance between two hex hashes (0 = identical) */
export function hashDistance(a: string, b: string): number {
    if (a.length !== b.length) return Infinity;
    let dist = 0;
    for (let i = 0; i < a.length; i++) {
        const xor = parseInt(a[i], 16) ^ parseInt(b[i], 16);
        // Count set bits in the 4-bit XOR
        dist += ((xor >> 0) & 1) + ((xor >> 1) & 1) + ((xor >> 2) & 1) + ((xor >> 3) & 1);
    }
    return dist;
}

/** Are two hashes similar enough to be the same product? (threshold: Hamming ≤ 10) */
export function isSimilarImage(hashA: string, hashB: string, threshold = 10): boolean {
    return hashDistance(hashA, hashB) <= threshold;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function loadImage(base64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
    });
}
