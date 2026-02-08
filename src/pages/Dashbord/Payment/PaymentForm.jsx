import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecures from "../../../hook/useAxiosSecures";
import useAuth from "../../../hook/useAuth";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hook/useTrackingLogger";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState();
  const [isProcessing, setIsProcessing] = useState(false); // Add a state to track the loading state of the form submission
  const { parcelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecures();
  const { logTracking } = useTrackingLogger();

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return "...loadingg";
  }

  const amount = parcelInfo.deliveryCost;

  const amountInCents = amount * 100;

  // Update the handleSubmit function to handle the loading state
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true); // Disable the button

    const card = elements.getElement(CardElement);

    if (!card) {
      setIsProcessing(false);
      return;
    }

    //  valided tha card

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setIsProcessing(false);
      return;
    }

    // stpe-2 creat payment intent

    const res = await axiosSecure.post("/create-payment-intent", {
      amountInCents,
      parcelId,
    });

    const clientSecret = res.data.clientSecret;

    // step -3  confiram payment

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
      setIsProcessing(false);
    } else {
      setError("");
      if (result.paymentIntent.status === "succeeded") {
        const transaction_id = result.paymentIntent.id;

        //  step -4 mark parcel paid aslo creat payment history

        const paymentData = {
          parcel_id: parcelId,
          tracking_id: parcelInfo.tracking_id,
          amount,
          payment_method: result.paymentIntent.payment_method_types,
          transaction_id: result.paymentIntent.id,
          paid_by: user.email,
        };

        const paymentRes = await axiosSecure.post("/payments", paymentData);

        console.log("paymentRes:", paymentRes);
        // Add a console.log to debug the SweetAlert issue
        if (paymentRes.data.success) {
          // ✅ SweetAlert with transaction ID
          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `
      <p class="mb-2">Your payment has been completed.</p>
      <p><strong>Transaction ID:</strong></p>
      <code style="color:green;">${transaction_id}</code>
    `,
            confirmButtonText: "Go to My Parcels",
          });
          await logTracking({
            tracking_id: parcelInfo.tracking_id,
            status: "payment_done",
            details: `paid by ${user.displayName}`,
         
            updated_by: user.email,
          });
          // 🚀 Navigate after confirmation
          navigate("/dashbord/myParcels");
        }
      }
    }

    setIsProcessing(false); // Re-enable the button
  };

  // CardElement এর styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
    placeholder: "Enter your card details",
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="border p-3 rounded mb-4">
          <CardElement options={cardElementOptions}></CardElement>
        </div>
        <button
          type="submit"
          className="btn btn-success w-full"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? "Processing..." : `Pay $${amount}`}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      <div className="mt-4 p-3 bg-blue-100 rounded text-sm">
        <p className="font-semibold mb-2">Test Card Numbers:</p>
        {/* <p>✅  (Success)</p> */}

        <textarea className="textarea textarea-ghost">
          4242 4242 4242 4242
        </textarea>
      </div>
    </div>
  );
}

export default PaymentForm;
