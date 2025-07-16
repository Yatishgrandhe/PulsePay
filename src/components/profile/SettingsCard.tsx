import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { HealthActivity } from "./PaymentHistory";

function toCSV(activities: HealthActivity[]): string {
  const header = "Date,Service,Patient,Status,Duration";
  const rows = activities.map(activity => `${activity.date},${activity.serviceName},${activity.patientName},${activity.status},${activity.duration}`);
  return [header, ...rows].join("\n");
}

function downloadCSV(activities: HealthActivity[]) {
  const csv = toCSV(activities);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "health-ai-activities.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function SettingsCard({ onSignOut, activities = [] }: { onSignOut: () => void; activities?: HealthActivity[] }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load theme from localStorage
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="bg-white/90 dark:bg-pulsepay-blue/90 rounded-2xl shadow-lg p-6 mt-4 flex flex-col gap-4"
    >
      <h3 className="font-heading font-bold text-lg text-pulsepay-purple mb-2">Settings</h3>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-body text-pulsepay-blue">Dark Mode</span>
        <Switch.Root
          checked={darkMode}
          onCheckedChange={setDarkMode}
          className="w-12 h-6 bg-pulsepay-purple/30 rounded-full relative outline-none cursor-pointer transition"
          id="theme-toggle"
        >
          <Switch.Thumb
            className={`block w-5 h-5 bg-pulsepay-gold rounded-full shadow transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </Switch.Root>
      </div>
      <button
        onClick={() => downloadCSV(activities)}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-pulsepay-gold via-pulsepay-purple to-pulsepay-pink text-white font-bold shadow hover:scale-105 transition-transform duration-300"
        disabled={!activities.length}
      >
        Download CSV
      </button>
      <button
        onClick={onSignOut}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-pulsepay-pink via-pulsepay-purple to-pulsepay-gold text-white font-bold shadow hover:scale-105 transition-transform duration-300"
      >
        Sign Out
      </button>
    </motion.div>
  );
} 