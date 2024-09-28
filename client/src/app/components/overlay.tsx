import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

interface Location {
  id: string;
  name: string;
  images: Array<{
    url: string;
    month: string;
    year: string;
    description: string;
  }>;
  description: string;
  coordinates: [number, number];
  month: string;
  year: string;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);

    // Add event listener for keyboard navigation
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setSelectedLocation(null), 300);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedLocation.images.length - 1 : prevIndex - 1,
      );
    } else if (event.key === "ArrowRight") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedLocation.images.length - 1 ? 0 : prevIndex + 1,
      );
    }
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
    position: "absolute" as const,
    top: "50%",
    right: "2.5%",
    width: "599px",
    height: "774px",
    marginTop: "-387px",
    overflowY: "auto" as const,
    borderRadius: "20px",
  };

  return (
    <div style={overlayStyle}>
      <div className="relative pt-16 px-4 pb-4">
        <div className="relative w-[448px] h-[313.98px] mx-auto">
          <img
            src={selectedLocation.images[currentImageIndex].url}
            alt={`${selectedLocation.name} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          {selectedLocation.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-white w-4" : "bg-gray-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
      <div className="px-8 pb-4 rounded-t-[44px]">
        <h2 className="text-[40px] mb-2 mt-6 text-[#F2F0E1] font-apple-garamond">
          {selectedLocation.name}
        </h2>
        <div className="flex space-x-2 mb-2">
          <div className="inline-block bg-[#31574A] text-white text-sm px-4 py-1 rounded-full font-apple-garamond uppercase">
            {selectedLocation.images[currentImageIndex].month}
          </div>
          <div className="inline-block bg-[#F2F0E1] text-black text-sm px-4 py-1 rounded-full font-apple-garamond">
            {selectedLocation.images[currentImageIndex].year}
          </div>
        </div>
        {/* <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="w-full h-[363px] p-2 bg-black text-white rounded-[20px] resize-none font-instrument-sans mt-2"
          placeholder="Enter description..."
        /> */}
        <p className="text-white font-apple-garamond mt-4">{description}</p>
      </div>
    </div>
  );
}
