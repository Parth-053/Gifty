const stats = [
  { value: "10k+", label: "Happy Customers" },
  { value: "5k+", label: "Gifts Delivered" },
  { value: "4.8★", label: "Average Rating" },
];

const AboutStats = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-around text-center">
      {stats.map((stat, index) => (
        <div key={index}>
          <p className="text-lg font-semibold text-purple-700">
            {stat.value}
          </p>
          <p className="text-xs text-gray-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AboutStats;
