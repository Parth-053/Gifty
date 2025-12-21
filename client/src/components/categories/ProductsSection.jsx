import { useState } from "react";
import ProductFilters from "./ProductFilters";
import ProductsGrid from "./ProductsGrid";

const ProductsSection = ({ selectedCategory }) => {
  // FILTER STATES
  const [sort, setSort] = useState("");
  const [rating, setRating] = useState("");

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {/* FILTER BAR */}
      <ProductFilters
        sort={sort}
        setSort={setSort}
        rating={rating}
        setRating={setRating}
      />

      {/* PRODUCTS GRID */}
      <ProductsGrid
        selectedCategory={selectedCategory}
        sort={sort}
        rating={rating}
      />
    </div>
  );
};

export default ProductsSection;
