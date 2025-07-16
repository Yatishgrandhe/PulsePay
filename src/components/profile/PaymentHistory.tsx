import { motion } from "framer-motion";

export type HealthActivity = {
  id: string;
  serviceName: string;
  date: string;
  status: string;
  sessionId: string;
  patientName: string;
  type: string;
  duration: number;
};

export default function HealthActivityHistory({ activities }: { activities: HealthActivity[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="bg-white/90 dark:bg-pulsepay-blue/90 rounded-2xl shadow-lg p-6 mt-4"
    >
      <h3 className="font-heading font-bold text-lg text-pulsepay-purple mb-4">Health Activity History</h3>
      {activities.length === 0 ? (
        <div className="text-pulsepay-blue font-body">No health activities yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm font-body">
            <thead>
              <tr className="text-pulsepay-gold">
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Service</th>
                <th className="px-2 py-1 text-left">Patient</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b border-pulsepay-purple/10 hover:bg-pulsepay-pink/10 transition">
                  <td className="px-2 py-1">{activity.date}</td>
                  <td className="px-2 py-1">{activity.serviceName}</td>
                  <td className="px-2 py-1">{activity.patientName}</td>
                  <td className="px-2 py-1">
                    <span className={`font-bold ${activity.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>{activity.status}</span>
                  </td>
                  <td className="px-2 py-1">{activity.duration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
} 