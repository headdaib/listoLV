"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  adId: string;
  initialFavorited: boolean;
  locale: string;
}

export function FavoriteButton({ adId, initialFavorited, locale }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent triggering parent Link elements

    if (!session) {
      router.push(`/${locale}/auth/login`);
      return;
    }

    if (loading) return;
    setLoading(true);

    const newState = !isFavorited;
    setIsFavorited(newState); // Optimistic UI

    try {
      const res = await fetch("/api/favorites", {
        method: newState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error(error);
      setIsFavorited(!newState); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-md transition-all shadow-lg ${
        isFavorited
          ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
          : "bg-black/40 text-white hover:bg-black/60"
      }`}
      aria-label="Toggle Favorite"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 transition-transform active:scale-75"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
