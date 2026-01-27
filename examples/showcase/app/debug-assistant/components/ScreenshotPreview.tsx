"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Download, Maximize2, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Screenshot {
  id: string;
  dataUrl: string;
  timestamp: Date;
  description?: string;
}

interface ScreenshotPreviewProps {
  screenshots: Screenshot[];
  onCapture: () => void;
  onRemove: (id: string) => void;
}

export function ScreenshotPreview({
  screenshots,
  onCapture,
  onRemove,
}: ScreenshotPreviewProps) {
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<Screenshot | null>(null);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-5 w-5" />
              Screenshots
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onCapture}>
              <Camera className="h-4 w-4 mr-2" />
              Capture
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {screenshots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No screenshots captured yet</p>
              <p className="text-xs mt-1">
                Click capture or let the AI capture automatically
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {screenshots.map((screenshot) => (
                <div
                  key={screenshot.id}
                  className="relative group rounded-lg overflow-hidden border bg-muted"
                >
                  <img
                    src={screenshot.dataUrl}
                    alt={screenshot.description || "Screenshot"}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      onClick={() => setSelectedScreenshot(screenshot)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                      onClick={() => onRemove(screenshot.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-[10px]">
                    {screenshot.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedScreenshot}
        onOpenChange={() => setSelectedScreenshot(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Screenshot Preview</DialogTitle>
          </DialogHeader>
          {selectedScreenshot && (
            <div className="space-y-4">
              <img
                src={selectedScreenshot.dataUrl}
                alt={selectedScreenshot.description || "Screenshot"}
                className="w-full rounded-lg"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Captured at {selectedScreenshot.timestamp.toLocaleString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.download = `screenshot-${selectedScreenshot.id}.png`;
                    link.href = selectedScreenshot.dataUrl;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
