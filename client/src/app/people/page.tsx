"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { processPeopleImages } from "../../components/people-processor";

export default function PeoplePage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Meet the People of Dupont Street</h1>
      </header>

      <div className="absolute bottom-4 left-4 z-[1001]">
        <button
          onClick={handleNavigateToMap}
          className="bg-[#F2F0E1] text-black text-sm px-4 py-1 rounded-full font-apple-garamond uppercase hover:bg-[#e6e4d5] transition-colors duration-200"
          aria-label="Switch to map view"
        >
          Spaces
        </button>
      </div>
    </div>
  );
}