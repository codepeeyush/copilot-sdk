"use client";

import { memo } from "react";
import { Cpu } from "lucide-react";
import type { PersonData } from "@/lib/types";
import { samplePersons } from "@/lib/constants";

// Hoisted outside component to prevent re-renders
const exampleQuestions = [
  "What's my current plan?",
  "How many credits do I have?",
  "What's my name and role?",
  "Am I on the enterprise plan?",
];

interface ContextDemoSectionProps {
  selectedPerson: PersonData;
  onSelectPerson: (person: PersonData) => void;
}

function ContextDemoSectionComponent({
  selectedPerson,
  onSelectPerson,
}: ContextDemoSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          useAIContext Demo
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Person Selector */}
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            Select a user profile. The AI sees this context and responds
            accordingly.
          </p>
          <div className="space-y-2">
            {samplePersons.map((person) => (
              <button
                key={person.id}
                onClick={() => onSelectPerson(person)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedPerson.id === person.id
                    ? "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/30"
                    : "bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {person.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      person.plan === "enterprise"
                        ? "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
                        : person.plan === "pro"
                          ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
                    }`}
                  >
                    {person.plan}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  {person.role} · {person.credits.toLocaleString()} credits
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Context Preview & Example Questions */}
        <div className="space-y-4">
          {/* Context JSON Preview */}
          <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3">
            <p className="text-[10px] font-mono text-zinc-400 mb-2">
              // AI receives this context
            </p>
            <pre className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto">
              {`{
  "name": "${selectedPerson.name}",
  "plan": "${selectedPerson.plan}",
  "credits": ${selectedPerson.credits},
  "role": "${selectedPerson.role}"
}`}
            </pre>
          </div>

          {/* Example Questions */}
          <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3">
            <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Try asking:
            </p>
            <div className="space-y-1.5">
              {exampleQuestions.map((q, i) => (
                <p
                  key={i}
                  className="text-xs text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded"
                >
                  &quot;{q}&quot;
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const ContextDemoSection = memo(ContextDemoSectionComponent);
