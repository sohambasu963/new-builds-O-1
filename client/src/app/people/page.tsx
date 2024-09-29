"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { processPeopleImages } from "../../components/people-processor";
import AudioToggle from "@/components/AudioToggle";
import "./people.css";


export default function PeoplePage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleNavigateToMap = () => {
    router.push("/");
  };

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    const slider = document.querySelector(".slider") as HTMLElement | null;

    if (slider) {
      const zOffset = scrollPos * 0.5; // Adjust scroll sensitivity if needed
      requestAnimationFrame(() => {
        slider.style.transform = `translate3d(-50%, -50%, 0) rotateX(0deg) rotateY(-25deg) rotateZ(-120deg) translateY(${zOffset}px)`;
      });
    }
  };

  const handleMouseOver = (e: any) => {
    e.currentTarget.style.left = "15%";
  };

  const handleMouseOut = (e: any) => {
    e.currentTarget.style.left = "0%";
  };

  // const capitalizeWords = (str: string) => {
  //   return str
  //     .split(/[-\s]/)
  //     .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  //     .join(str.includes('-') ? '-' : ' ');
  // };

  useEffect(() => {
    const fetchRandomImage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/people");
        if (!response.ok) {
          throw new Error("Failed to fetch random image");
        }
        const result = await response.json();
        const processedData = processPeopleImages(result.data);
        console.log(processedData);
        setData(processedData);

        // Run the animation while images are loading
        const slider = document.querySelector(".slider") as HTMLElement;
        slider.classList.add("run-animation");

        // Remove animation after 5 seconds
        setTimeout(() => {
          slider.classList.remove("run-animation");
        }, 5000);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomImage();

    window.addEventListener("scroll", handleScroll);

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
      window.removeEventListener("scroll", handleScroll);
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
    <div className="w-screen flex flex-col">
      <div className="background-gradient"></div>
    <header className="fixed top-4 left-4 z-[1000]">
      <h1 className="text-[40px] text-[#F2F0E1] font-apple-garamond">
        Meet the People of <i>TORONTO</i></h1>
    </header>

    {/* Slider Section */}
    <div className="slider">
        {data.map((person, index) => (
          <div
            key={index}
            className="card"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <img src={person.image} alt={`img${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 z-[1001] flex items-center space-x-2"> 
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