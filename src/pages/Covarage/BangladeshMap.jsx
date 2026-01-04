import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

/* 🔹 Map animation controller */
const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();

  map.flyTo(center, zoom, {
    animate: true,
    duration: 1.5,
  });

  return null;
};

const BangladeshMap = ({ serviceCenter = [] }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapCenter, setMapCenter] = useState([23.685, 90.3563]);
  const [zoom, setZoom] = useState(7);

  /* 🔍 input typing */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = serviceCenter.filter((item) =>
      item.district.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered);
  };

  /* 📍 go to district */
  const goToDistrict = (district) => {
    setMapCenter([
      Number(district.latitude),
      Number(district.longitude),
    ]);
    setZoom(11);
    setSearchText(district.district);
    setSuggestions([]);
  };

  /* 🔎 search button */
  const handleSearchClick = () => {
    const found = serviceCenter.find(
      (item) =>
        item.district.toLowerCase() === searchText.toLowerCase()
    );

    if (found) {
      goToDistrict(found);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🔹 SEARCH UI */}
      <div className="relative max-w-lg mx-auto z-50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search district (e.g. Dhaka)"
            className="input input-bordered w-full"
            value={searchText}
            onChange={handleInputChange}
          />
          <button
            onClick={handleSearchClick}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>

        {/* 🔽 DROPDOWN */}
        {suggestions.length > 0 && (
          <ul className=" mt-1 w-full bg-base-100 rounded-lg shadow-xl border z-50 max-h-56 overflow-y-auto">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => goToDistrict(item)}
                className="px-4 py-2 cursor-pointer hover:bg-base-200"
              >
                {item.district}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🗺️ MAP */}
      <div className="rounded-2xl mt-14 overflow-hidden shadow-xl border">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          scrollWheelZoom={false}
          className="w-full  sm:h-96 md:h-96  h-72"
        >
          <MapFlyTo center={mapCenter} zoom={zoom} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {serviceCenter.map((center, index) => (
            <Marker
              key={index}
              position={[
                Number(center.latitude),
                Number(center.longitude),
              ]}
            >
              <Popup>
                <strong className="text-base">
                  {center.district}
                </strong>
                <br />
                Delivery Available
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;
