import useAuth from "../../../hook/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecures from "../../../hook/useAxiosSecures";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecures();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);

      return res.data;
    },
  });

  if (isPending) {
    return "loadingg...";
  }
  return (
    <div className="bg-white rounded-lg border p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-slate-500">No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-600">
                <th className="text-left py-3 px-3">#</th>
                <th className="text-left py-3 px-3">Transaction ID</th>
                <th className="text-left py-3 px-3"> ID</th>
                <th className="text-left py-3 px-3">Amount</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-left py-3 px-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-3">{index + 1}</td>

                  <td className="py-3 px-3 font-mono text-xs text-blue-600">
                    {payment.transaction_id}
                  </td>

                  <td className="py-3 px-3">{payment.parcel_id || "—"}</td>

                  <td className="py-3 px-3 font-medium">${payment.amount}</td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      Paid
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 text-xs">
                    {new Date(payment.paid_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
