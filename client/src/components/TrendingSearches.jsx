const trending = [
  "Valentine Gifts ❤️",
  "Rakhi Gifts 🎁",
  "Couple Frames",
  "3D Lamps",
];

const TrendingSearches = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Trending Searches
      </h3>

      <div className="space-y-2">
        {trending.map((item, index) => (
          <div
            key={index}
            className="bg-white px-4 py-3 rounded-xl shadow-sm cursor-pointer"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearches;
