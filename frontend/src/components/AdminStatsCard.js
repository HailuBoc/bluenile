export default function AdminStatsCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
