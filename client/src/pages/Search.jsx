import SearchHeader from "../components/SearchHeader";
import RecentSearches from "../components/RecentSearches";
import TrendingSearches from "../components/TrendingSearches";
import SearchSuggestions from "../components/SearchSuggestions";

const Search = () => {
  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <SearchHeader />

      <div className="px-4 mt-4 space-y-6">
        <RecentSearches />
        <TrendingSearches />
        <SearchSuggestions />
      </div>
    </div>
  );
};

export default Search;
