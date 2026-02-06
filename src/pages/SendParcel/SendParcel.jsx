import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hook/useAuth";
import useAxiosSecures from "../../hook/useAxiosSecures";

const generateTrackingId = () => {
  const date = new Date().toISOString().slice(0, 10);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SFP-${date}-${random}`;
};

const SendParcel = () => {
  const serviceCenterData = useLoaderData();

  /* ---------------- React Hook Form ---------------- */
  const { register, handleSubmit, watch, setValue } = useForm();
  const parcelType = watch("parcelType");

  const { user } = useAuth();
const navigete = useNavigate()
  const axiosSecure = useAxiosSecures();

  /* ---------------- Local State ---------------- */
  const [senderRegion, setSenderRegion] = useState("");
  const [receiverRegion, setReceiverRegion] = useState("");

  /* ---------------- Unique Regions ---------------- */
  const regions = useMemo(() => {
    return [...new Set(serviceCenterData.map((item) => item.region))];
  }, [serviceCenterData]);

  /* ---------------- Get District ---------------- */
  const getDistrict = (region, center) => {
    const found = serviceCenterData.find(
      (item) => item.region === region && item.covered_area.includes(center)
    );
    return found?.district;
  };

  /* ---------------- Pricing Policy ---------------- */
  const calculateCost = (parcelType, weight, sameCity) => {
    weight = Number(weight || 0);

    if (parcelType === "document") {
      return sameCity ? 60 : 80;
    }

    if (weight <= 3) {
      return sameCity ? 110 : 150;
    }

    const extraKg = weight - 3;
    const extraCost = extraKg * 40;

    return sameCity ? 110 + extraCost : 150 + extraCost + 40;
  };

  /* ---------------- Submit ---------------- */
  const onSubmit = (data) => {
    const senderDistrict = getDistrict(
      data.senderRegion,
      data.senderServiceCenter
    );

    const receiverDistrict = getDistrict(
      data.receiverRegion,
      data.receiverServiceCenter
    );

    const sameCity = senderDistrict === receiverDistrict;

    const cost = calculateCost(data.parcelType, data.weight, sameCity);

    let breakdownHtml = "";

    if (data.parcelType === "document") {
      breakdownHtml = `
        <p><b>Parcel Type:</b> Document</p>
        <p><b>Delivery Type:</b> ${
          sameCity ? "Within City" : "Outside City"
        }</p>
        <p><b>Charge:</b> ৳${cost}</p>
      `;
    } else {
      const weight = Number(data.weight);
      if (weight <= 3) {
        breakdownHtml = `
          <p><b>Parcel Type:</b> Non-Document</p>
          <p><b>Weight:</b> ${weight} kg</p>
          <p><b>Delivery Type:</b> ${
            sameCity ? "Within City" : "Outside City"
          }</p>
          <p><b>Charge:</b> ৳${cost}</p>
        `;
      } else {
        const extraKg = weight - 3;
        breakdownHtml = `
          <p><b>Parcel Type:</b> Non-Document</p>
          <p><b>Weight:</b> ${weight} kg</p>
          <p><b>Extra Weight:</b> ${extraKg} kg × ৳40</p>
          <p><b>Delivery Type:</b> ${
            sameCity ? "Within City" : "Outside City"
          }</p>
          <p><b>Total Charge:</b> ৳${cost}</p>
        `;
      }
    }

    Swal.fire({
      title: "Delivery Cost Summary",
      html: `
        ${breakdownHtml}
        <hr />
        <h2 style="margin-top:10px;">Total Cost: ৳${cost}</h2>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      cancelButtonText: "Edit Parcel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
  
    }).then((result) => {
      if (result.isConfirmed) {
        const finalData = {
          ...data,
          senderDistrict,
          receiverDistrict,
          deliveryCost: cost,
          created_by: user.email,
          delivery_status: "not_collected",
          payment_status: "unpaid",
          creation_date: new Date().toISOString(),
          tracking_id: generateTrackingId(),
          
        };
 
        console.log("SAVE TO DATABASE:", finalData);

        axiosSecure.post("/parcels", finalData).then((res) => {
          console.log(res.data);

          if (res.data.insertedId) {
            Swal.fire(
              "Success!",
              "Parcel confirmed. Redirecting to payment...",
              "success"
            );
          }
           navigete("/dashbord/myparcels")
        });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-base-100 rounded-2xl shadow-xl">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Send Your Parcel</h1>
        <p className="text-gray-500 mt-2">Door to Door Delivery Service</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* ================= Parcel Info ================= */}
        <div className="border border-gray-300 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Parcel Info</h2>

          <div className="flex gap-8 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="document"
                {...register("parcelType", { required: true })}
                onChange={() => setValue("weight", "")}
                className="radio radio-primary"
              />
              Document
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="non-document"
                {...register("parcelType", { required: true })}
                className="radio radio-primary"
              />
              Non-Document
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              className="input input-bordered bg-white text-black"
              placeholder="Parcel Title"
              {...register("parcelTitle", { required: true })}
            />

            <input
              type="number"
              className={`input input-bordered bg-white text-black ${
                parcelType === "document" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Weight (kg)"
              {...register("weight", {
                required: parcelType !== "document",
              })}
              disabled={parcelType === "document"}
            />
          </div>
        </div>

        {/* ================= Sender & Receiver ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender Info */}
          <div className="border border-gray-300 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-4">Sender Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input input-bordered bg-white text-black"
                placeholder="Sender Name"
                {...register("senderName", { required: true })}
              />
              <input
                className="input input-bordered bg-white text-black"
                placeholder="Contact"
                {...register("senderContact", { required: true })}
              />

              <select
                className="select select-bordered bg-white text-black"
                {...register("senderRegion", {
                  required: true,
                  onChange: (e) => setSenderRegion(e.target.value),
                })}
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered bg-white text-black"
                {...register("senderServiceCenter", { required: true })}
              >
                <option value="">Service Center</option>
                {serviceCenterData
                  .filter((i) => i.region === senderRegion)
                  .flatMap((i) => i.covered_area)
                  .map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
              </select>

              <textarea
                className="textarea textarea-bordered bg-white text-black md:col-span-2"
                placeholder="Pickup Address"
                {...register("senderAddress", { required: true })}
              />
              <textarea
                className="textarea textarea-bordered bg-white text-black md:col-span-2"
                placeholder="Pickup Instruction"
                {...register("pickupInstruction", { required: true })}
              />
            </div>
          </div>

          {/* Receiver Info */}
          <div className="border border-gray-300 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-4">Receiver Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input input-bordered bg-white text-black"
                placeholder="Receiver Name"
                {...register("receiverName", { required: true })}
              />
              <input
                className="input input-bordered bg-white text-black"
                placeholder="Contact"
                {...register("receiverContact", { required: true })}
              />

              <select
                className="select select-bordered bg-white text-black"
                {...register("receiverRegion", {
                  required: true,
                  onChange: (e) => setReceiverRegion(e.target.value),
                })}
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered bg-white text-black"
                {...register("receiverServiceCenter", { required: true })}
              >
                <option value="">Service Center</option>
                {serviceCenterData
                  .filter((i) => i.region === receiverRegion)
                  .flatMap((i) => i.covered_area)
                  .map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
              </select>

              <textarea
                className="textarea textarea-bordered bg-white text-black md:col-span-2"
                placeholder="Delivery Address"
                {...register("receiverAddress", { required: true })}
              />
              <textarea
                className="textarea textarea-bordered bg-white text-black md:col-span-2"
                placeholder="Delivery Instruction"
                {...register("deliveryInstruction", { required: true })}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button className="btn btn-primary text-black px-12 text-lg">
            Submit Parcel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
