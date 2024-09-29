"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { processPeopleImages } from "../../components/people-processor";
import "./people.css";

export default function PeoplePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("location");


  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNavigateToMap = () => {
    router.push("/spaces");
  };

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    const slider = document.querySelector(".slider") as HTMLElement | null;

    if (slider) {
      const initialTransform = `translate3d(-50%, -50%, 0) rotateX(0deg) rotateY(-25deg) rotateZ(-120deg)`;
      const zOffset = scrollPos * 0.5;
      slider.style.transform = `${initialTransform} translateY(${zOffset}px)`;
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
      .split(/[-\s]/) // Split by spaces or hyphens
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(str.includes('-') ? '-' : ' '); // Rejoin with the original delimiter
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
        console.log(processedData);
        setData(processedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomImage();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Meet the People of {capitalizeWords(location!)}</h1>
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

      <div className="absolute bottom-4 left-4 z-[1001]">
        <button
          onClick={handleNavigateToMap}
          className="bg-[#F2F0E1] text-black text-sm px-4 py-1 rounded-full font-apple-garamond uppercase hover:bg-[#e6e4d5] transition-colors duration-200"
          aria-label="Switch to map view"
        >
          Spaces
        </button>
      </div>

      {/* Loading and error states */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
