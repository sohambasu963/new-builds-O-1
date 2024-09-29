"use client";
import { useRouter } from "next/navigation";

export default function PeoplePage() {
  const router = useRouter();

  const handleNavigateToMap = () => {
    router.push("/spaces");
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">People</h1>
      </header>

      <main className="flex-grow p-4">
        {/* Content for the people spaces page will go here */}
        <p>This is the people spaces page. Content to be added.</p>
      </main>

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
