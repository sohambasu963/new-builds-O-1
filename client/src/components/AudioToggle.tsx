import React from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioToggleProps {
  isAudioOn: boolean;
  toggleAudio: () => void;
  className?: string; // Add this line
}

const AudioToggle: React.FC<AudioToggleProps> = ({
  isAudioOn,
  toggleAudio,
  className,
}) => {
  return (
    <button
      onClick={toggleAudio}
      className={`p-2 rounded-full transition-colors duration-200 ${className}`} // Modify this line
      aria-label={isAudioOn ? "Turn audio off" : "Turn audio on"}
    >
      {isAudioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
};

export default AudioToggle;
