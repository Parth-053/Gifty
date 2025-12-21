import { useEffect, useState } from "react";
import API_URL from "../config/api";

import CategoriesHeader from "../components/CategoriesHeader";
import CategoriesSidebar from "../components/CategoriesSidebar";
import ProductsSection from "../components/ProductsSection";
import BottomNavbar from "../components/BottomNavbar";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="h-screen bg-[#FFF7ED]">
      <CategoriesHeader />

      <div className="flex pt-14 pb-16 h-full">
        <CategoriesSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ProductsSection category={selectedCategory} />
      </div>

      <BottomNavbar active="Categories" />
    </div>
  );
};

export default Categories;
