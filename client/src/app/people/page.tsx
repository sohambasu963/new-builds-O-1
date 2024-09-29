"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { processPeopleImages } from "../../components/people-processor";
import AudioToggle from "@/components/AudioToggle";
import "./people.css";

interface Person {
  image: string;
  title: string;
  year: string;
  month: string;
}

export default function PeoplePage() {
  const router = useRouter();
  const [data, setData] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [response, setResponse] = useState("");
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
    if (selectedPerson) {
      const fetchStream = async () => {
        try {
          const payload = {
            data: selectedPerson,
          };

          const res = await fetch("/api/stream", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let completeResponse = "";

          while (true) {
            const { done, value } = (await reader?.read()) ?? { done: true };
            if (done) break;
            completeResponse += decoder.decode(value);
          }

          const parsedResponse = JSON.parse(completeResponse);
          setResponse(parsedResponse.summary);
        } catch (error) {
          console.error("Error while fetching the stream:", error);
        }
      };

      fetchStream();
    }

    return () => {
      setResponse("");
    };
  }, [selectedPerson]);

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
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioRef.current = new Audio("/audio/background-music.mp3");
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
      <header className="fixed top-8 left-8 z-[1000]">
        <h1 className="text-7xl text-[#1E1E1E] font-apple-garamond">
          Meet the Shawties of <br /> <i>TORONTO</i>
        </h1>
      </header>

      {/* Slider Section */}
      <div className="slider">
        {data.map((person, index) => (
          <div
            key={index}
            className="card"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => setSelectedPerson(person)}
          >
            <img src={person.image} alt={`img${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedPerson && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2000]"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="rounded-lg p-8 max-w-6xl w-10/12 max-h-[92vh] flex flex-row items-start"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-3/5 pr-2">
              <img
                src={selectedPerson.image}
                alt="Selected"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
            <div className="w-2/5 pl-2 text-white overflow-y-auto max-h-[85vh]">
              <p className="font-apple-garamond text-lg">
                {response ? response : "Loading description..."}
              </p>
            </div>
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
