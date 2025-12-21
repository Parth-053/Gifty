const CategoryItem = ({ category, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(category)}
      className={`w-full text-left px-4 py-2 rounded ${
        isActive ? "bg-black text-white" : "hover:bg-gray-100"
      }`}
    >
      {category}
    </button>
  );
};

export default CategoryItem;
