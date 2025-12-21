const recent = [
  "Photo Frame",
  "Birthday Gift",
  "Anniversary",
  "Customized Mug",
];

const RecentSearches = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Recent Searches
      </h3>

      <div className="flex flex-wrap gap-2">
        {recent.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-white rounded-full text-sm border cursor-pointer"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
