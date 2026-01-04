import "leaflet/dist/leaflet.css";

import BangladeshMap from "./BangladeshMap";
import { useLoaderData } from "react-router";

const Coverage = () => {

const serviceCenter = useLoaderData();

console.log(serviceCenter)

  return (
    <div className="min-h-screen bg-base-200 px-4 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* 🔹 Title */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B3F45]">
            We Are Available in 64 Districts
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Nationwide parcel delivery across Bangladesh
          </p>

          <BangladeshMap serviceCenter={serviceCenter}></BangladeshMap>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
