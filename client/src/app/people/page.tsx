"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { processPeopleImages } from "../../components/people-processor";
import AudioToggle from "@/components/AudioToggle";
import "./people.css";

interface PersonData {
  image: string;
  // Add other properties as needed
}

export default function PeoplePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "Toronto";
  
  const [data, setData] = useState<PersonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const capitalizeWords = (str: string) => {
    return str
      .split(/[-\s]/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(str.includes('-') ? '-' : ' ');
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

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
      <header className="fixed top-4 left-4 z-[1000]">
        <h1 className="text-[40px] text-[#F2F0E1] font-apple-garamond">
          Meet the People of {capitalizeWords(location!)}</h1>
      </header>

      {/* Slider Section */}
      <div className="slider">
        {data.map((person, index) => (
          <div
            key={index}
            className="card"
            onMouseOver={(e) => e.currentTarget.style.left = "15%"}
            onMouseOut={(e) => e.currentTarget.style.left = "0%"}
            onClick={() => handleImageClick(person.image)}
          >
            <img src={person.image} alt={`img${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2000]" onClick={handleCloseModal}>
          <div className="max-w-4xl max-h-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}

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