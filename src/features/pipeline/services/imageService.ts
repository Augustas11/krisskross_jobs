/**
 * Image Service
 * Client-side image storage, thumbnail generation, and hashing.
 */

const THUMBNAIL_SIZE = 200;

/** Create a compressed thumbnail from a base64 image */
export async function createThumbnail(base64: string): Promise<string> {
    const img = await loadImage(base64);
    const canvas = document.createElement("canvas");
    const aspect = img.width / img.height;

    if (aspect > 1) {
        canvas.width = THUMBNAIL_SIZE;
        canvas.height = Math.round(THUMBNAIL_SIZE / aspect);
    } else {
        canvas.height = THUMBNAIL_SIZE;
        canvas.width = Math.round(THUMBNAIL_SIZE * aspect);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
}

/** Convert a File to base64 data URL */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/** Extract raw base64 (without data URL prefix) from a data URL */
export function extractBase64(dataUrl: string): string {
    const idx = dataUrl.indexOf(",");
    return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
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
