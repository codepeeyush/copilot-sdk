"use client";

import { memo } from "react";
import { Box } from "lucide-react";
import type { GenerativeUIConfig, GenerativeUIKey } from "@/lib/types";
import { WeatherModule } from "./modules/WeatherModule";
import { StockModule } from "./modules/StockModule";
import { AlertModule } from "./modules/AlertModule";

// Hoisted outside component to prevent re-renders
const generativeUIKeys: GenerativeUIKey[] = [
  "weather",
  "stock",
  "notification",
];

interface GenerativeUISectionProps {
  generativeUI: GenerativeUIConfig;
  onToggle: (key: GenerativeUIKey) => void;
}

function GenerativeUISectionComponent({
  generativeUI,
  onToggle,
}: GenerativeUISectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Box className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Generative UI Modules
        </h2>
      </div>
      <div className="flex items-center gap-4 mb-4">
        {generativeUIKeys.map((key) => (
          <label
            key={key}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <button
              onClick={() => onToggle(key)}
              className={`relative h-5 w-9 rounded-full transition-colors ${generativeUI[key] ? "bg-indigo-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${generativeUI[key] ? "translate-x-4 left-0.5" : "translate-x-0 left-0.5"}`}
              />
            </button>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
              {key}
            </span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <WeatherModule show={generativeUI.weather} />
        <StockModule show={generativeUI.stock} />
        <AlertModule show={generativeUI.notification} />
      </div>
    </section>
  );
}

export const GenerativeUISection = memo(GenerativeUISectionComponent);
