import { motion } from "framer-motion";

export type Payment = {
  id: string;
  amount: number;
  date: string;
  status: string;
  txHash: string;
};

export default function PaymentHistory({ payments }: { payments: Payment[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="bg-white/90 dark:bg-pulsepay-blue/90 rounded-2xl shadow-lg p-6 mt-4"
    >
      <h3 className="font-heading font-bold text-lg text-pulsepay-purple mb-4">Payment History</h3>
      {payments.length === 0 ? (
        <div className="text-pulsepay-blue font-body">No payments yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm font-body">
            <thead>
              <tr className="text-pulsepay-gold">
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Amount</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-pulsepay-purple/10 hover:bg-pulsepay-pink/10 transition">
                  <td className="px-2 py-1">{p.date}</td>
                  <td className="px-2 py-1">{p.amount} USDC</td>
                  <td className="px-2 py-1">
                    <span className={`font-bold ${p.status === 'Success' ? 'text-green-600' : 'text-red-600'}`}>{p.status}</span>
                  </td>
                  <td className="px-2 py-1 font-mono text-xs text-pulsepay-purple truncate max-w-[120px]">{p.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
} 