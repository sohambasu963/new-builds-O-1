import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

interface Location {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  coordinates: [number, number];
}

interface OverlayProps {
  selectedLocation: Location;
  setSelectedLocation: Dispatch<SetStateAction<Location | null>>;
}

export default function Overlay({
  selectedLocation,
  setSelectedLocation,
}: OverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setSelectedLocation(null), 300); // Match this with your transition duration
  };

  return (
    <div
      className={`w-full md:w-2/5 bg-[#F2F0E1] shadow-lg transform transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 h-full overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-2">{selectedLocation.name}</h2>
        <img
          src={selectedLocation.coverImage}
          alt={selectedLocation.name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <p className="text-gray-600">{selectedLocation.description}</p>
        {/* <button
          onClick={handleClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button> */}
      </div>
    </div>
  );
}
