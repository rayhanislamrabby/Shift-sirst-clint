import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const CustomerReviewPage = () => {
  const reviews = [
    {
      name: "Rasel Ahamed",
      role: "CTO",
      image: "https://i.pravatar.cc/150?img=12",
      review:
        "A posture corrector works by providing support and gentle alignment to your shoulders, back and spine.",
    },
    {
      name: "Awlad Hossin",
      role: "Senior Product Designer",
      image: "https://i.pravatar.cc/150?img=32",
      review:
        "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    },
    {
      name: "Nasir Uddin",
      role: "CEO",
      image: "https://i.pravatar.cc/150?img=45",
      review:
        "A posture corrector works by providing support and gentle alignment to your shoulders, back and spine.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold  text-green-900">Customer Reviews</h2>
          <p className="text-gray-500 mt-2">
            What our customers say about our product
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, Pagination]}
          
          loop
          centeredSlides
        
          spaceBetween={24}
          navigation={{
            nextEl: ".review-next",
            prevEl: ".review-prev",
          }}
          pagination={{
            el: ".review-dots",
            clickable: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mx-auto"
        >
          {reviews.map((item, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div
                  className={`transition-all duration-500 rounded-2xl bg-white p-8 shadow
                    ${
                      isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
                    }`}
                >
                  {/* Quote */}
                  <div className="text-5xl mb-4  text-green-800">“</div>

                  {/* Review */}
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    {item.review}
                  </p>

                  {/* Profile */}
                  <div className="border-t border-dashed pt-4 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <h4 className=" text-sm  font-bold text-green-900">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 🔹 Small Controls (Exact Image Style) */}

        <div className="flex flex-col items-center gap-3 mt-6">
          {/* Dots */}
          <div className="review-dots flex justify-center gap-1.5"></div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="review-prev w-7 h-7 rounded-full border border-gray-300
                 flex items-center justify-center text-xs text-gray-600
                 bg-primary
                 hover:bg-lime-500 transition"
            >
              ❮
            </button>

            <button
              className="review-next w-7 h-7 rounded-full bg-primary
                 flex items-center justify-center text-xs text-black
                 hover:bg-lime-500 transition"
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviewPage;
