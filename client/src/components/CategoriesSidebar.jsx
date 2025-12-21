import CategoryItem from "./CategoryItem";

const CategoriesSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <aside className="w-32 bg-white overflow-y-auto border-r">
      {categories.map((cat) => (
        <CategoryItem
          key={cat._id}
          name={cat.name}
          active={selectedCategory === cat.name}
          onClick={() => setSelectedCategory(cat.name)}
        />
      ))}
    </aside>
  );
};

export default CategoriesSidebar;
