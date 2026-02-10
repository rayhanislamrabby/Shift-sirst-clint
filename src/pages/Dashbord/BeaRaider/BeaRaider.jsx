import { useForm } from "react-hook-form";

import { useLoaderData } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../hook/useAuth";
import useAxiosSecures from "../../../hook/useAxiosSecures";

const BeaRider = () => {
  const { user } = useAuth();

  const serviceCenters = useLoaderData();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRegion = watch("region");
  const axiosSecure = useAxiosSecures();

  // submit
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      name: user?.displayName || "",
      email: user?.email || "",
  photoURL: user.photoURL || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // console.log("RIDER APPLICATION DATA:", finalData);

    axiosSecure
      .post("/riders", finalData)

      .then((res) => {
        if (res.data.insertedId) {
          toast.success("Rider application submitted!");
        }
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 rounded-xl shadow">
      <Toaster />

      {/* ===== Header ===== */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Be a Rider</h1>
        <p className="text-gray-500 mt-2">
          Fill out the form to apply as a delivery rider
        </p>
      </div>

      {/* ===== Logged-in User Info ===== */}
      <div className="border rounded-lg p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>

        <div className="flex items-center gap-4 mb-4">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-14 h-14 rounded-full border"
            />
          )}
          <div>
            <p className="font-semibold">{user?.displayName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={user?.displayName || ""}
            disabled
            className="input input-bordered bg-gray-100 text-black cursor-not-allowed"
          />

          <input
            value={user?.email || ""}
            disabled
            className="input input-bordered bg-gray-100 text-black cursor-not-allowed"
          />
        </div>
      </div>

      {/* ===== Rider Application Form ===== */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Age */}
        <div>
          <input
            type="number"
            placeholder="Your Age"
            className="input input-bordered w-full"
            {...register("age", { required: true, min: 18 })}
          />
          {errors.age && (
            <p className="text-red-600 text-sm mt-1">
              You must be at least 18 years old
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            type="text"
            placeholder="Phone Number"
            className="input input-bordered w-full"
            {...register("phone", { required: true })}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">
              Phone number is required
            </p>
          )}
        </div>

        {/* NID */}
        <div>
          <input
            type="text"
            placeholder="National ID Card Number"
            className="input input-bordered w-full"
            {...register("nid", { required: true })}
          />
          {errors.nid && (
            <p className="text-red-600 text-sm mt-1">NID is required</p>
          )}
        </div>

        {/* Region */}
        <div>
          <select
            className="select select-bordered w-full"
            {...register("region", { required: true })}
          >
            <option value="">Select Region</option>
            {[...new Set(serviceCenters.map((s) => s.region))].map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-red-600 text-sm mt-1">Region is required</p>
          )}
        </div>

        {/* District */}
        <div>
          <select
            className="select select-bordered w-full"
            {...register("district", { required: true })}
          >
            <option value="">Select District</option>
            {serviceCenters
              .filter((s) => s.region === selectedRegion)
              .map((s) => (
                <option key={s.district} value={s.district}>
                  {s.district}
                </option>
              ))}
          </select>
          {errors.district && (
            <p className="text-red-600 text-sm mt-1">District is required</p>
          )}
        </div>

        {/* Bike Info */}
        <div>
          <input
            type="text"
            placeholder="Bike Brand (e.g. Yamaha FZ)"
            className="input input-bordered w-full"
            {...register("bike_brand", { required: true })}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Bike Registration Number"
            className="input input-bordered w-full"
            {...register("bike_registration", { required: true })}
          />
        </div>

        {/* Additional Info */}
        <textarea
          placeholder="Additional Information (optional)"
          className="textarea textarea-bordered w-full"
          {...register("additional_info")}
        />

        {/* Submit */}
        <div className="flex justify-center">
          <button className="btn btn-primary text-black px-12 text-lg">
            Apply as Rider
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeaRider;
