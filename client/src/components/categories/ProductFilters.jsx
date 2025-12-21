const ProductFilters = ({ sort, setSort, rating, setRating }) => {
  // TOGGLE SORT
  const handleSortToggle = (value) => {
    setSort((prev) => (prev === value ? "" : value));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 sticky top-0 bg-[#FFF7ED] z-10">

      {/* PRICE LOW → HIGH */}
      <button
        onClick={() => handleSortToggle("price_asc")}
        className={`px-4 py-1.5 rounded-full text-sm border
        ${sort === "price_asc" ? "bg-black text-white" : "bg-white"}`}
      >
        Price ↑
      </button>

      {/* PRICE HIGH → LOW */}
      <button
        onClick={() => handleSortToggle("price_desc")}
        className={`px-4 py-1.5 rounded-full text-sm border
        ${sort === "price_desc" ? "bg-black text-white" : "bg-white"}`}
      >
        Price ↓
      </button>

      {/* SORT BY RATING */}
      <button
        onClick={() => handleSortToggle("rating")}
        className={`px-4 py-1.5 rounded-full text-sm border
        ${sort === "rating" ? "bg-black text-white" : "bg-white"}`}
      >
        Rating
      </button>

      {/* RATING FILTER */}
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="px-3 py-1.5 rounded-full border text-sm bg-white"
      >
        <option value="">All Ratings</option>
        <option value="4">4★ & above</option>
        <option value="3">3★ & above</option>
      </select>

    </div>
  );
};

export default ProductFilters;
