/**
 * Screenshot Capture Tool
 *
 * Captures screenshots of the current viewport using html-to-image library.
 * Works with modern CSS including oklch, color-mix, etc.
 */

import type { ScreenshotOptions, ScreenshotResult } from "./types";

// Check if we're in a browser environment
const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

/**
 * Default screenshot options
 */
const DEFAULT_OPTIONS: Required<ScreenshotOptions> = {
  element: isBrowser ? document.body : (null as unknown as HTMLElement),
  quality: 0.8,
  format: "png",
  maxWidth: 1920,
  maxHeight: 1080,
  includeCursor: false,
};

// Lazy-loaded html-to-image
let htmlToImagePromise: Promise<typeof import("html-to-image")> | null = null;

async function getHtmlToImage(): Promise<typeof import("html-to-image")> {
  if (!htmlToImagePromise) {
    htmlToImagePromise = import("html-to-image");
  }
  return htmlToImagePromise;
}

/**
 * Capture a screenshot using html-to-image library
 * This method works with modern CSS including oklch, color-mix, etc.
 */
async function captureWithHtmlToImage(
  element: HTMLElement,
  opts: Required<ScreenshotOptions>,
): Promise<ScreenshotResult> {
  const htmlToImage = await getHtmlToImage();

  const rect = element.getBoundingClientRect();
  const width = rect.width || window.innerWidth;
  const height = rect.height || window.innerHeight;

  // Scale down if needed
  const scale = Math.min(opts.maxWidth / width, opts.maxHeight / height, 1);

  let dataUrl: string;

  if (opts.format === "jpeg") {
    dataUrl = await htmlToImage.toJpeg(element, {
      quality: opts.quality,
      pixelRatio: scale,
      skipAutoScale: true,
      cacheBust: true,
    });
  } else {
    dataUrl = await htmlToImage.toPng(element, {
      pixelRatio: scale,
      skipAutoScale: true,
      cacheBust: true,
    });
  }

  // Get actual dimensions from the image
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load captured image"));
    img.src = dataUrl;
  });

  return {
    data: dataUrl,
    format: opts.format,
    width: img.width,
    height: img.height,
    timestamp: Date.now(),
  };
}

/**
 * Capture a screenshot using the native browser Screen Capture API
 * Fallback method that requires user permission
 */
async function captureWithDisplayMedia(
  opts: Required<ScreenshotOptions>,
): Promise<ScreenshotResult> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "browser",
    },
    audio: false,
    // @ts-expect-error - preferCurrentTab is a newer API
    preferCurrentTab: true,
  });

  try {
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();

    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        video
          .play()
          .then(() => resolve())
          .catch(reject);
      };
      video.onerror = () => reject(new Error("Failed to load video stream"));
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const videoWidth = settings.width || video.videoWidth || window.innerWidth;
    const videoHeight =
      settings.height || video.videoHeight || window.innerHeight;

    const scale = Math.min(
      opts.maxWidth / videoWidth,
      opts.maxHeight / videoHeight,
      1,
    );
    const width = Math.round(videoWidth * scale);
    const height = Math.round(videoHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }

    ctx.drawImage(video, 0, 0, width, height);

    const mimeType = `image/${opts.format === "jpeg" ? "jpeg" : opts.format}`;
    const data = canvas.toDataURL(mimeType, opts.quality);

    return {
      data,
      format: opts.format,
      width,
      height,
      timestamp: Date.now(),
    };
  } finally {
    stream.getTracks().forEach((track) => track.stop());
  }
}

/**
 * Capture a screenshot of an element or the viewport
 *
 * Uses html-to-image for reliable capture that works with modern CSS
 * including oklch, color-mix, and other modern color functions.
 *
 * @param options - Screenshot options
 * @returns Promise resolving to screenshot result
 *
 * @example
 * ```typescript
 * // Capture viewport
 * const screenshot = await captureScreenshot();
 *
 * // Capture with custom quality
 * const screenshot = await captureScreenshot({
 *   format: 'jpeg',
 *   quality: 0.9,
 * });
 * ```
 */
export async function captureScreenshot(
  options: ScreenshotOptions = {},
): Promise<ScreenshotResult> {
  if (!isBrowser) {
    throw new Error(
      "Screenshot capture is only available in browser environment",
    );
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const element = opts.element || document.body;

  // Try html-to-image first (no dialog, works with modern CSS)
  try {
    return await captureWithHtmlToImage(element, opts);
  } catch (error) {
    console.warn(
      "[Copilot SDK] html-to-image capture failed, trying native API",
      error,
    );
  }

  // Fallback to native Screen Capture API (requires dialog)
  const hasDisplayMedia =
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices !== "undefined" &&
    typeof navigator.mediaDevices.getDisplayMedia === "function";

  if (hasDisplayMedia) {
    try {
      return await captureWithDisplayMedia(opts);
    } catch (error) {
      console.warn(
        "[Copilot SDK] Screen capture cancelled or not supported",
        error,
      );
    }
  }

  // Final fallback: Create a placeholder
  const rect = element.getBoundingClientRect();
  let width = rect.width || window.innerWidth;
  let height = rect.height || window.innerHeight;

  const scale = Math.min(opts.maxWidth / width, opts.maxHeight / height, 1);
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    createPlaceholder(ctx, width, height, element, "Screenshot capture failed");
  }

  const mimeType = `image/${opts.format === "jpeg" ? "jpeg" : opts.format}`;
  const data = canvas.toDataURL(mimeType, opts.quality);

  return {
    data,
    format: opts.format,
    width,
    height,
    timestamp: Date.now(),
  };
}

/**
 * Create a placeholder image when capture fails
 */
function createPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  element: HTMLElement,
  errorMessage?: string,
): void {
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, width - 4, height - 4);

  ctx.fillStyle = "#666";
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const tagName = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const className = element.className
    ? `.${String(element.className).split(" ")[0]}`
    : "";

  ctx.fillText(
    `Screenshot: <${tagName}${id}${className}>`,
    width / 2,
    height / 2 - 20,
  );
  ctx.fillText(
    `${Math.round(width)}×${Math.round(height)}px`,
    width / 2,
    height / 2,
  );

  if (errorMessage) {
    ctx.fillStyle = "#999";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(
      `Error: ${errorMessage.slice(0, 50)}`,
      width / 2,
      height / 2 + 20,
    );
  }
}

/**
 * Check if screenshot capture is supported
 */
export function isScreenshotSupported(): boolean {
  return isBrowser && typeof document.createElement === "function";
}

/**
 * Resize a screenshot result
 */
export async function resizeScreenshot(
  screenshot: ScreenshotResult,
  maxWidth: number,
  maxHeight: number,
): Promise<ScreenshotResult> {
  if (!isBrowser) {
    throw new Error("Resize is only available in browser environment");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to create canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const data = canvas.toDataURL(`image/${screenshot.format}`, 0.8);

      resolve({
        ...screenshot,
        data,
        width,
        height,
        timestamp: Date.now(),
      });
    };
    img.onerror = () => reject(new Error("Failed to load screenshot"));
    img.src = screenshot.data;
  });
}
