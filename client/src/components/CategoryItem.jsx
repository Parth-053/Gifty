const CategoryItem = ({ name, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-col items-center py-4 text-xs
        ${active ? "bg-purple-100 text-purple-700 font-semibold" : ""}
      `}
    >
      <div className="w-10 h-10 rounded-full border flex items-center justify-center mb-1">
        🎁
      </div>
      {name}
    </div>
  );
};

export default CategoryItem;
