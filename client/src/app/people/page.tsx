"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { processPeopleImages } from "../../components/people-processor";
import AudioToggle from "@/components/AudioToggle";

export default function PeoplePage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleNavigateToMap = () => {
    router.push("/spaces");
  };

  useEffect(() => {
    const fetchRandomImage = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/people");
        if (!response.ok) {
          throw new Error("Failed to fetch random image");
        }
        const result = await response.json();
        const processedData = processPeopleImages(result.data);
        console.log(processedData);
        setData(processedData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomImage();

    // Initialize audio context and element
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioRef.current = new Audio('/audio/background-music.mp3');
    audioRef.current.loop = true;

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const toggleAudio = useCallback(() => {
    if (audioRef.current && audioContextRef.current) {
      if (isAudioOn) {
        audioRef.current.pause();
      } else {
        audioContextRef.current.resume().then(() => {
          audioRef.current?.play();
        });
      }
      setIsAudioOn(!isAudioOn);
    }
  }, [isAudioOn]);

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Meet the People of Dupont Street</h1>
      </header>

      <div className="absolute bottom-4 left-4 z-[1001] flex items-center space-x-2">
        <button
          onClick={handleNavigateToMap}
          className="bg-[#F2F0E1] text-black text-sm px-4 py-1 rounded-full font-apple-garamond uppercase hover:bg-[#e6e4d5] transition-colors duration-200"
          aria-label="Switch to map view"
        >
          Spaces
        </button>
        <AudioToggle 
          isAudioOn={isAudioOn} 
          toggleAudio={toggleAudio} 
          className="bg-[#F2F0E1] text-black hover:bg-[#e6e4d5]"
        />
      </div>
    </div>
  );
}