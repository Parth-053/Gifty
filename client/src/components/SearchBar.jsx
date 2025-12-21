import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-3">
      <input
        type="text"
        placeholder="Search for gifts, categories and more"
        className="w-full px-4 py-2 rounded-lg border bg-white"
        onFocus={() => navigate("/search")}
        readOnly
      />
    </div>
  );
};

export default SearchBar;
