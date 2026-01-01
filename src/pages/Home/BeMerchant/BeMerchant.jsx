




import React from "react";
import locationMerchent from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div
      className="
        bg-no-repeat 
        bg-[url('assets/be-a-merchant-bg.png')] 
        bg-[#03373D] 
        rounded-4xl 
        px-6 py-10
        md:px-12 md:py-14
        lg:p-20
      "
    >
      <div className="hero-content flex-col lg:flex-row-reverse gap-10">
        {/* Image */}
        <img
          src={locationMerchent}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-2xl"
          alt="Merchant Location"
        />

        {/* Text */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug">
            Merchant and Customer Satisfaction <br className="hidden md:block" />
            is Our First Priority!
          </h1>

          <p className="py-6 text-sm md:text-base text-gray-200">
            We offer the lowest delivery charge with <br className="hidden md:block" />
            the highest value along with 100% safety of your product.
            Pathao courier delivers your parcels in every <br className="hidden md:block" />
            corner of Bangladesh right on time.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="btn btn-primary rounded-full text-black">
              Become a Merchant
            </button>
            <button className="btn btn-primary btn-outline rounded-full">
              Earn with ZapShift Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
