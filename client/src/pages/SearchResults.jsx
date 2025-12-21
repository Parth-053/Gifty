import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API_URL from "../config/api";

import SearchResultHeader from "../components/SearchResultHeader";
import SearchFiltersBar from "../components/SearchFiltersBar";
import SearchResultsGrid from "../components/SearchResultsGrid";

const SearchResults = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(
        `${API_URL}/api/products/search?q=${query}`
      );
      const data = await res.json();
      setProducts(data);
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <SearchResultHeader query={query} />
      <SearchFiltersBar />
      <SearchResultsGrid products={products} />
    </div>
  );
};

export default SearchResults;
