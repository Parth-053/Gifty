const ProductImageGallery = ({ images = [] }) => {
  return (
    <div className="px-4 mt-2">
      <img
        src={images[0]}
        alt="Product"
        className="w-full h-72 object-cover rounded-2xl bg-gray-200"
      />

      <div className="flex gap-2 mt-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-16 h-16 object-cover rounded-lg bg-gray-300"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
