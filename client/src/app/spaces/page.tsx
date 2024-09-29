"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Map as LeafletMap } from "leaflet";
import { MapContainerProps, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { Marker, TileLayer } from "react-leaflet";
import MarkerShadow from "../../../public/images/marker-shadow.png";
// import { locations } from "./locations";
import Overlay from "@/components/overlay";
import OldOverlay from "@/components/old-overlay";
import { supabase } from "@/functions/supabaseClient.js";
import { processSupabaseData } from "@/components/processor";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
  coverImage?: string;
  description: string;
  coordinates: [number, number];
}

function MapEvents({
  setSelectedLocation,
}: {
  setSelectedLocation: React.Dispatch<React.SetStateAction<Location | null>>;
}) {
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const [locations, setLocations] = useState<any[] | null>([
    {
      id: "1",
      name: "CN Tower",
      images: [
        {
          url: "/images/cn-tower.jpeg",
          month: "January",
          year: "2000",
          description: "CN Tower",
        },
      ],
      description:
        "A 553.3 m-high concrete communications and observation tower in downtown Toronto, Ontario, Canada.",
      coordinates: [43.6426, -79.3871],
      date: "May",
      year: "2023",
    },
  ]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("neighbourhoods").select("*");

      if (error) {
        console.log("Error:", error);
      } else {
        const processedData = processSupabaseData(data);
        console.log(processedData);
        setLocations(processedData);

        const locationParam = searchParams.get("location");
        if (locationParam) {
          const matchingLocation = processedData.find(
            (loc) => loc.id === locationParam,
          );
          if (matchingLocation) {
            setSelectedLocation({
              ...matchingLocation,
              coordinates: matchingLocation.coordinates as [number, number],
            });
          }
        }
      }
    }

    fetchData();
  }, []);

  // useEffect(() => {
  //   const locationParam = searchParams.get('location');
  //   if (locationParam && locations) {
  //     const matchingLocation = locations.find(loc => loc.id === locationParam);
  //     if (matchingLocation) {
  //       setSelectedLocation({
  //         ...matchingLocation,
  //         coordinates: matchingLocation.coordinates as [number, number],
  //       });
  //     }
  //   }
  // }, [searchParams, locations]);

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

  const [isToggled, setIsToggled] = useState(false);

  const handleNavigateToPeople = () => {
    if (selectedLocation) {
      router.push(`/people?location=${selectedLocation.id}`);
    } else {
      router.push("/people");
    }
  };

  const handleMarkerClick = useCallback(
    (location: Location) => {
      setSelectedLocation({
        ...location,
        coordinates: location.coordinates as [number, number],
      });

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("location", location.id);
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <>
      <LeafletCSS />
      <div className="w-screen h-screen flex relative">
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

            {locations &&
              locations.map((location) => (
                <Marker
                  key={location.id}
                  position={location.coordinates}
                  icon={defaultIcon}
                  // eventHandlers={{
                  //   click: () =>
                  //     setSelectedLocation({
                  //       ...location,
                  //       coordinates: location.coordinates as [number, number],
                  //     }),
                  // }}
                  eventHandlers={{
                    click: () => handleMarkerClick(location),
                  }}
                />
              ))}
          </MapContainer>
        </div>

        {selectedLocation && (
          <Overlay
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        <div className="absolute bottom-4 left-4 z-[1001]">
          <button
            onClick={handleNavigateToPeople}
            className="bg-black text-[#F2F0E1] text-sm px-4 py-1 rounded-full font-apple-garamond uppercase hover:bg-gray-900 transition-colors duration-200"
            aria-label="Switch to people spaces view"
          >
            People
          </button>
        </div>
      </div>
    </>
  );
}
