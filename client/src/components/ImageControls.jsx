const ImageControls = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
      <input
        type="file"
        className="w-full border rounded-lg px-3 py-2"
      />

      <button className="w-full bg-purple-700 text-white py-2 rounded-lg">
        Upload Image
      </button>
    </div>
  );
};

export default ImageControls;
