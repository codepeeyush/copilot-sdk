/**
 * Screenshot Capture Tool
 *
 * Captures screenshots of the current viewport or specific elements.
 * Framework-agnostic implementation using native browser APIs.
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

/**
 * Capture a screenshot of an element or the viewport
 *
 * This implementation uses a lightweight approach:
 * 1. For simple use cases, uses foreignObject in SVG
 * 2. For complex use cases, recommend html2canvas
 *
 * @param options - Screenshot options
 * @returns Promise resolving to screenshot result
 *
 * @example
 * ```typescript
 * // Capture viewport
 * const screenshot = await captureScreenshot();
 *
 * // Capture specific element
 * const screenshot = await captureScreenshot({
 *   element: document.getElementById('my-element'),
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

  // Get element dimensions
  const rect = element.getBoundingClientRect();
  let width = rect.width || window.innerWidth;
  let height = rect.height || window.innerHeight;

  // Scale down if needed
  const scale = Math.min(opts.maxWidth / width, opts.maxHeight / height, 1);

  width = Math.round(width * scale);
  height = Math.round(height * scale);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to create canvas context");
  }

  // Set background
  ctx.fillStyle = getComputedStyle(element).backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Try to capture using different methods
  let captured = false;

  // Method 1: Try using SVG foreignObject (works for simple DOM)
  try {
    captured = await captureWithSVG(element, ctx, width, height, scale);
  } catch {
    // Silently fail, try next method
  }

  // Method 2: If SVG failed, try capturing visible viewport
  if (!captured) {
    try {
      captured = await captureViewport(ctx, width, height);
    } catch {
      // Viewport capture also failed
    }
  }

  // Method 3: Create a placeholder if all else fails
  if (!captured) {
    createPlaceholder(ctx, width, height, element);
  }

  // Convert to data URL
  const mimeType = `image/${opts.format === "jpeg" ? "jpeg" : opts.format}`;

  let data: string;
  try {
    data = canvas.toDataURL(mimeType, opts.quality);
  } catch (e) {
    // Handle tainted canvas (cross-origin images) - create a fresh placeholder canvas
    if (e instanceof DOMException && e.name === "SecurityError") {
      console.warn(
        "Screenshot blocked due to cross-origin content. Creating placeholder.",
      );
      // Create a new clean canvas for the placeholder
      const cleanCanvas = document.createElement("canvas");
      cleanCanvas.width = width;
      cleanCanvas.height = height;
      const cleanCtx = cleanCanvas.getContext("2d");
      if (cleanCtx) {
        createPlaceholder(cleanCtx, width, height, element);
        data = cleanCanvas.toDataURL(mimeType, opts.quality);
      } else {
        throw new Error("Failed to create placeholder canvas");
      }
    } else {
      throw e;
    }
  }

  return {
    data,
    format: opts.format,
    width,
    height,
    timestamp: Date.now(),
  };
}

/**
 * Capture element using SVG foreignObject
 */
async function captureWithSVG(
  element: HTMLElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
): Promise<boolean> {
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;

  // Inline all styles
  await inlineStyles(element, clone);

  // Create SVG with foreignObject
  const serializer = new XMLSerializer();
  const html = serializer.serializeToString(clone);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%" transform="scale(${scale})">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${html}
        </div>
      </foreignObject>
    </svg>
  `;

  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * Inline computed styles from source to target element
 */
async function inlineStyles(
  source: HTMLElement,
  target: HTMLElement,
): Promise<void> {
  const computedStyle = getComputedStyle(source);
  const importantStyles = [
    "color",
    "background-color",
    "background",
    "font-family",
    "font-size",
    "font-weight",
    "padding",
    "margin",
    "border",
    "border-radius",
    "display",
    "flex-direction",
    "justify-content",
    "align-items",
    "gap",
  ];

  importantStyles.forEach((prop) => {
    target.style.setProperty(prop, computedStyle.getPropertyValue(prop));
  });

  // Recursively inline styles for children
  const sourceChildren = source.children;
  const targetChildren = target.children;

  for (let i = 0; i < sourceChildren.length && i < targetChildren.length; i++) {
    if (
      sourceChildren[i] instanceof HTMLElement &&
      targetChildren[i] instanceof HTMLElement
    ) {
      await inlineStyles(
        sourceChildren[i] as HTMLElement,
        targetChildren[i] as HTMLElement,
      );
    }
  }
}

/**
 * Capture viewport using getDisplayMedia (if available)
 */
async function captureViewport(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): Promise<boolean> {
  // Check if screen capture API is available
  if (!navigator.mediaDevices?.getDisplayMedia) {
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { width, height },
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    // Wait for video to be ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    ctx.drawImage(video, 0, 0, width, height);

    // Stop all tracks
    stream.getTracks().forEach((track) => track.stop());

    return true;
  } catch {
    return false;
  }
}

/**
 * Create a placeholder image when capture fails
 */
function createPlaceholder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  element: HTMLElement,
): void {
  // Gray background
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, width - 4, height - 4);

  // Text
  ctx.fillStyle = "#666";
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const tagName = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const className = element.className
    ? `.${element.className.split(" ")[0]}`
    : "";

  ctx.fillText(
    `Screenshot: <${tagName}${id}${className}>`,
    width / 2,
    height / 2 - 10,
  );
  ctx.fillText(
    `${Math.round(width / window.devicePixelRatio)}×${Math.round(height / window.devicePixelRatio)}px`,
    width / 2,
    height / 2 + 10,
  );
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
