const EmptySearch = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
      <div className="text-4xl mb-2">🔍</div>
      <p>No results found</p>
      <p className="text-sm">
        Try searching something else
      </p>
    </div>
  );
};

export default EmptySearch;
