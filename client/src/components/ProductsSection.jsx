import ProductFilters from "./ProductFilters";
import ProductsGrid from "./ProductsGrid";

const ProductsSection = ({ selectedCategory }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <ProductFilters />

      <ProductsGrid selectedCategory={selectedCategory} />
    </div>
  );
};

export default ProductsSection;
