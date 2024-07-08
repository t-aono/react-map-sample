import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export const MyMap = () => {
  const [position, setPosition] = useState({ lat: 35.710063, lng: 139.8107 });
  const mapRef = useRef<HTMLDivElement>(null);

  const loader = new Loader({
    apiKey: import.meta.env.VITE_MAPS_API_KEY,
    version: "weekly",
  });

  useEffect(() => {
    (async () => {
      const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        loader.importLibrary("maps"),
        loader.importLibrary("marker"),
      ]);
      const map = new Map(mapRef.current!, {
        center: position,
        zoom: 10,
        mapId: "DEMO_MAP_ID",
      });
      new AdvancedMarkerElement({ map, position, title: "" });
    })();
  }, [position]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const address = String(formData.get("address"));

    const { Geocoder } = await loader.importLibrary("geocoding");
    const geocoder = new Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (results) {
        const { lat, lng } = results[0].geometry.location;
        if (status === "OK") {
          setPosition({ lat: lat(), lng: lng() });
        }
      }
    });
  }

  return (
    <>
      <div ref={mapRef} style={{ height: "400px", width: "400px" }}></div>
      <form onSubmit={submit} className="mt-4">
        <input type="text" name="address" />
        <button>search</button>
      </form>
    </>
  );
};
