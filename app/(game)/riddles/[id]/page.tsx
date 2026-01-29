"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { RiddleCard } from "@/app/components/organisms";
import Button from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui";
import { Share2, Download } from "lucide-react";
import { toast } from "sonner";

interface SharedRiddle {
  id: string;
  question: string;
  difficulty: string;
  category?: string | null;
  hint1?: string | null;
  hint2?: string | null;
  tags: string[];
  answer: string[]; // already parsed array
}

export default function SharedRiddlePage() {
  const params = useParams<{ id: string }>();
  const [riddle, setRiddle] = useState<SharedRiddle | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingImage, setSavingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchRiddle = async () => {
      try {
        const res = await fetch(`/api/riddles/${params.id}`);
        if (!res.ok) {
          setRiddle(null);
          return;
        }
        const data = await res.json();
        setRiddle(data.riddle as SharedRiddle);
      } catch (error) {
        console.error("Failed to load riddle:", error);
        toast.error("Failed to load riddle");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      void fetchRiddle();
    }
  }, [params.id]);

  const handleShare = async () => {
    if (!riddle || typeof window === "undefined") return;

    const url = `${window.location.origin}/riddles/${riddle.id}`;
    const text = riddle.question;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "RiddleQuest Riddle",
          text,
          url,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } else {
        toast.error("Sharing not supported on this device");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Failed to share riddle");
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current || typeof window === "undefined") return;

    try {
      setSavingImage(true);
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#020617", // fallback bg
        scale: 2,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `riddle-${riddle?.id || "share"}.png`;
      link.click();
      toast.success("Riddle image saved");
    } catch (error) {
      console.error("Failed to save image:", error);
      toast.error("Failed to save image");
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight px-4 py-8 md:px-8 md:py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Shareable Riddle
          </h1>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleShare}
              disabled={loading || !riddle}
              className="p-2 rounded-full w-9 h-9 flex items-center justify-center"
              title="Share riddle"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSaveImage}
              disabled={loading || !riddle || savingImage}
              className="p-2 rounded-full w-9 h-9 flex items-center justify-center"
              title="Save as image"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div ref={cardRef}>
          {loading ? (
            <Skeleton className="h-72 w-full rounded-2xl" />
          ) : riddle ? (
            <RiddleCard
              riddle={{
                id: riddle.id,
                question: riddle.question,
                // For display we just show the question; answer stays hidden
                answer: riddle.answer,
                difficulty: riddle.difficulty as "easy" | "medium" | "hard",
                category: riddle.category || undefined,
                hint1: riddle.hint1 || undefined,
                hint2: riddle.hint2 || undefined,
                tags: riddle.tags,
              }}
            />
          ) : (
            <div className="text-center py-16 bg-[#161616] rounded-lg border border-[#FFFFFF1A]">
              <p className="text-lg font-medium text-white mb-2">
                Riddle not found
              </p>
              <p className="text-sm text-gray-400">
                The riddle you are trying to view does not exist or is inactive.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

