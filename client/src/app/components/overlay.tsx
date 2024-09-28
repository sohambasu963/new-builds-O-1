import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

interface Location {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  coordinates: [number, number];
  date: string; // Add this line
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
    setTimeout(() => setSelectedLocation(null), 300);
  };

  const overlayStyle = {
    background: 'rgba(0, 0, 0, 0.74)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    zIndex: 1000,
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '40%',
    overflowY: 'auto' as const,
  };

  return (
    <div
      className="w-full md:w-2/5 h-full overflow-y-auto bg-opacity-30 backdrop-blur-md shadow-lg transition-opacity duration-300"
      style={overlayStyle}
    >
      <div className="relative">
        <img
          src={selectedLocation.coverImage}
          alt={selectedLocation.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2 text-white">{selectedLocation.name}</h2>
        <div className="inline-block bg-[#31574A] text-white text-sm px-2 py-1 rounded-full mb-2">
          {selectedLocation.date}
        </div>
        <p className="text-gray-300">{selectedLocation.description}</p>
      </div>
    </div>
  );
}
