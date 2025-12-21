import { useNavigate } from "react-router-dom";

const SearchHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 p-4 bg-white">
      <button onClick={() => navigate(-1)}>←</button>
      <input
        placeholder="Search gifts"
        className="flex-1 border px-3 py-2 rounded"
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate("/search/results");
        }}
      />
    </div>
  );
};

export default SearchHeader;
