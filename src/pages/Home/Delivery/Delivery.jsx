import {
  FaTruck,
  FaMoneyBillWave,
  FaWarehouse,
  FaBuilding
} from "react-icons/fa";

const Delivery = () => {
  const services = [
    {
      title: "Booking Pick & Drop",
      desc: "From personal packages to business shipments — we deliver on time, every time.",
      icon: <FaTruck />
    },
    {
      title: "Cash On Delivery",
      desc: "From personal packages to business shipments — we deliver on time, every time.",
      icon: <FaMoneyBillWave />
    },
    {
      title: "Delivery Hub",
      desc: "From personal packages to business shipments — we deliver on time, every time.",
      icon: <FaWarehouse />
    },
    {
      title: "Booking SME & Corporate",
      desc: "From personal packages to business shipments — we deliver on time, every time.",
      icon: <FaBuilding />
    }
  ];

  return (
    <section className="bg-base-200 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-xl font-semibold text-teal-900 mb-10">
          How it Works
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="text-teal-800 text-3xl mb-4">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Delivery;
