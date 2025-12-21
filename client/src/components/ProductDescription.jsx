const ProductDescription = ({ description }) => {
  return (
    <div className="px-4 mt-6">
      <h2 className="font-semibold mb-2">Product Details</h2>

      <div className="bg-white rounded-xl p-4 text-sm text-gray-600 shadow-sm">
        {description || "No description available"}
      </div>
    </div>
  );
};

export default ProductDescription;
