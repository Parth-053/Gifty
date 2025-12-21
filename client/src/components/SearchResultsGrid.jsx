import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchResultCard from "./SearchResultCard";
import API_URL from "../config/api";

const SearchResultsGrid = () => {
  const [products, setProducts] = useState([]);
  const [params] = useSearchParams();
  const query = params.get("q");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      const res = await fetch(
        `${API_URL}/api/products/search?q=${query}`
      );
      const data = await res.json();
      setProducts(data);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="px-4 py-4 grid grid-cols-2 gap-4">
      {products.map((product) => (
        <SearchResultCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default SearchResultsGrid;
