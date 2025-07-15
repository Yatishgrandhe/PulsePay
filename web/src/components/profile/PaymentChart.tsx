import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Payment } from './PaymentHistory';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function aggregatePayments(payments: Payment[]) {
  const map: Record<string, number> = {};
  payments.forEach(p => {
    map[p.date] = (map[p.date] || 0) + p.amount;
  });
  const dates = Object.keys(map).sort();
  return {
    labels: dates,
    data: dates.map(date => map[date]),
  };
}

export default function PaymentChart({ payments }: { payments: Payment[] }) {
  const { labels, data } = aggregatePayments(payments);
  return (
    <div className="bg-white/90 dark:bg-pulsepay-blue/90 rounded-2xl shadow-lg p-6 mt-4">
      <h3 className="font-heading font-bold text-lg text-pulsepay-purple mb-4">Payment Volume</h3>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'USDC Volume',
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