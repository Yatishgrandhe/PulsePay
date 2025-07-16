import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { HealthActivity } from './PaymentHistory';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function aggregateHealthActivities(activities: HealthActivity[]) {
  const map: Record<string, number> = {};
  activities.forEach(activity => {
    map[activity.date] = (map[activity.date] || 0) + activity.duration;
  });
  const dates = Object.keys(map).sort();
  return {
    labels: dates,
    data: dates.map(date => map[date]),
  };
}

export default function HealthActivityChart({ activities }: { activities: HealthActivity[] }) {
  const { labels, data } = aggregateHealthActivities(activities);
  return (
    <div className="bg-white/90 dark:bg-pulsepay-blue/90 rounded-2xl shadow-lg p-6 mt-4">
      <h3 className="font-heading font-bold text-lg text-pulsepay-purple mb-4">Health Activity Duration</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Duration (minutes)',
              data,
              fill: true,
              borderColor: '#7B61FF',
              backgroundColor: 'rgba(229,115,183,0.2)',
              pointBackgroundColor: '#FFD166',
              tension: 0.4,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              grid: { color: 'rgba(123,97,255,0.08)' },
              ticks: { color: '#7B61FF' },
            },
            y: {
              grid: { color: 'rgba(229,115,183,0.08)' },
              ticks: { color: '#E573B7' },
            },
          },
        }}
      />
    </div>
  );
} 