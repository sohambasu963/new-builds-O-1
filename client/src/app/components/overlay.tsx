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
    //   className={`w-full md:w-2/5 bg-black bg-opacity-30 backdrop-blur-md shadow-lg flex items-center justify-center transition-opacity duration-300 ${
    //     isVisible ? "translate-x-0" : "translate-x-full"
    //   }`}
      className="w-full md:w-2/5 h-full overflow-y-auto"
      style={overlayStyle}
    >
      <div className="p-4">
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
      </div>
    </div>
  );
}
