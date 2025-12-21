import { useEffect, useState } from "react";
import API_URL from "../config/api";

import CategoriesHeader from "../components/categories/CategoriesHeader";
import CategoriesSidebar from "../components/categories/CategoriesSidebar";
import ProductsSection from "../components/categories/ProductsSection";
import BottomNavbar from "../components/BottomNavbar";

const Categories = () => {
  // Default = "All"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  // Fetch dynamic categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="h-screen bg-[#FFF7ED] flex flex-col">
      {/* TOP HEADER */}
      <CategoriesHeader />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 pt-14 pb-16 overflow-hidden">
        {/* SIDEBAR */}
        <CategoriesSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* PRODUCTS */}
        <ProductsSection selectedCategory={selectedCategory} />
      </div>

      {/* BOTTOM NAV */}
      <BottomNavbar active="Categories" />
    </div>
  );
};

export default Categories;
