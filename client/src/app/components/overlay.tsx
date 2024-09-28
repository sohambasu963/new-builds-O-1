import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

interface Location {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  coordinates: [number, number];
  date: string; // This will now be just the month
  year: string; // Add this new field for the year
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
  const [description, setDescription] = useState(selectedLocation.description);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setSelectedLocation(null), 300);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const overlayStyle = {
    background: "rgba(0, 0, 0, 0.74)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "opacity 300ms ease-in-out, transform 300ms ease-in-out",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(100%)",
    zIndex: 1000,
    position: 'absolute' as const,
    top: '50%',
    right: '2.5%',
    width: '599px',
    height: '774px',
    marginTop: '-387px', // Half of the height to center vertically
    overflowY: 'auto' as const,
    borderRadius: '20px', // Updated to 20px
  };

  return (
    <div style={overlayStyle}>
      <div className="relative pt-8 px-4 pb-20"> {/* Changed pb-32 to pb-24 */}
        <img
          src={selectedLocation.coverImage}
          alt={selectedLocation.name}
          className="w-[448px] h-[313.98px] object-cover rounded-lg mx-auto"
        />
        <button
          onClick={handleClose}
          className="absolute top-10 right-6 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
      <div className="px-4 pb-4 bg-black rounded-md border border-[#F2F0E1]">
        <h2 className="text-[40px] mb-2 mt-6 text-[#F2F0E1] font-apple-garamond">{selectedLocation.name}</h2>
        <div className="flex space-x-2 mb-2">th
          <div className="inline-block bg-[#31574A] text-white text-sm px-4 py-1 rounded-full font-apple-garamond uppercase">
            {selectedLocation.date}
          </div>
          <div className="inline-block bg-[#F2F0E1] text-black text-sm px-4 py-1 rounded-full font-apple-garamond">
            {selectedLocation.year}
          </div>
        </div>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="w-full h-[363px] p-2 bg-black text-white rounded-md resize-none font-apple-garamond mt-2"
          placeholder="Enter description..."
        />
      </div>
    </div>
  );
}