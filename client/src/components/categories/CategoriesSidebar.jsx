import CategoryItem from "./CategoryItem";

const CategoriesSidebar = ({
  categories = [],
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="w-56 bg-white p-4 space-y-1 rounded-xl shadow">

      {/* ALL (STATIC) */}
      <CategoryItem
        category="All"
        isActive={selectedCategory === "All"}
        onClick={setSelectedCategory}
      />

      {/* DYNAMIC CATEGORIES */}
      {categories.map((cat) => (
        <CategoryItem
          key={cat.name}
          category={cat.name}
          isActive={selectedCategory === cat.name}
          onClick={setSelectedCategory}
        />
      ))}

    </div>
  );
};

export default CategoriesSidebar;
