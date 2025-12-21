const GiftPreview = () => {
  return (
    <div className="px-4 mt-4">
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
        <div className="w-full h-56 bg-gray-200 rounded-xl flex items-center justify-center text-2xl">
          Gift Preview
        </div>

        <p className="mt-3 text-sm text-gray-600">
          Live preview of your personalized gift
        </p>
      </div>
    </div>
  );
};

export default GiftPreview;
