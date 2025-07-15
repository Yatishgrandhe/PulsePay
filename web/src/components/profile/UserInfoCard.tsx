import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

export default function UserInfoCard({ email }: { email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex items-center gap-4 bg-white/90 dark:bg-pulsepay-blue/90 rounded-2xl shadow-lg p-6 mb-4"
    >
      <UserCircle className="text-pulsepay-purple" size={48} aria-label="User avatar" />
      <div>
        <div className="font-heading font-bold text-lg text-pulsepay-purple">User</div>
        <div className="font-body text-pulsepay-blue text-sm">{email}</div>
      </div>
    </motion.div>
  );
} 