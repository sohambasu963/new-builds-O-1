"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Map as LeafletMap } from "leaflet";
import { MapContainerProps, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { Marker, TileLayer } from "react-leaflet";
import MarkerShadow from "../../../public/images/marker-shadow.png";
import { locations } from "./locations";
import Overlay from "../components/overlay";
import OldOverlay from "../components/old-overlay";

const MapContainer = dynamic<MapContainerProps>(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const LeafletCSS = () => {
  useEffect(() => {
    require("leaflet/dist/leaflet.css");
  }, []);
  return null;
};

interface Location {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  coordinates: [number, number];
}

function MapEvents({ setSelectedLocation }: { setSelectedLocation: React.Dispatch<React.SetStateAction<Location | null>> }) {
    useMapEvents({
      click: () => {
        setTimeout(() => setSelectedLocation(null), 300);
      },
    });
    return null;
  }

export default function MapPage() {
  const centerPoint: [number, number] = [43.668522, -79.399061];
  const mapRef = useRef<LeafletMap | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  const defaultIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: MarkerShadow.src,
    iconSize: [25, 41],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    shadowAnchor: [13, 41],
    popupAnchor: [1, -34],
  });

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <>
      <LeafletCSS />
      <div className="w-screen h-screen flex">
        <div id="map" className="flex-grow">
          <MapContainer
            center={centerPoint}
            zoom={13}
            minZoom={10}
            maxZoom={18}
            maxBounds={[
              [-90, -180],
              [90, 180],
            ]}
            maxBoundsViscosity={1.0}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapEvents setSelectedLocation={setSelectedLocation} />

            {locations.map((location) => (
              <Marker
                key={location.id}
                position={location.coordinates}
                icon={defaultIcon}
                eventHandlers={{
                  click: () =>
                    setSelectedLocation({
                      ...location,
                      coordinates: location.coordinates as [number, number],
                    }),
                }}
              />
            ))}
          </MapContainer>
        </div>

        {selectedLocation && (
        //   <OldOverlay
        //     selectedLocation={selectedLocation}
        //     setSelectedLocation={setSelectedLocation}
        //   />
          <Overlay
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {/* {selectedLocation && (
          <div className="w-1/3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">
                {selectedLocation.name}
              </h2>
              <img
                src={selectedLocation.coverImage}
                alt={selectedLocation.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <p className="text-gray-600">{selectedLocation.description}</p>
              <button
                onClick={() => setSelectedLocation(null)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}
