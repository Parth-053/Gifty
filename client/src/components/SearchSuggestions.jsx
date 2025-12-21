const suggestions = [
  "Customized Photo Frame",
  "Birthday Gift for Sister",
  "Anniversary Wooden Frame",
  "Personalized LED Lamp",
];

const SearchSuggestions = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Suggestions
      </h3>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {suggestions.map((item, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b last:border-b-0 cursor-pointer"
          >
            🔍 {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
