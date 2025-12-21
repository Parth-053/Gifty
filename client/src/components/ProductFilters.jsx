const ProductFilters = () => {
  return (
    <div className="flex gap-2 py-3 sticky top-0 bg-[#FFF7ED] z-10">
      <button className="px-3 py-1 border rounded-full text-sm">
        Price ↑
      </button>
      <button className="px-3 py-1 border rounded-full text-sm">
        Price ↓
      </button>
      <button className="px-3 py-1 border rounded-full text-sm">
        Rating
      </button>
    </div>
  );
};

export default ProductFilters;
