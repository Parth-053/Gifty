const categories = [
  "Photo Frames",
  "3D Memory Boxes",
  "Plaques",
  "Polaroid Gifts",
  "Desk Gifts",
  "Rakhi Gifts",
  "Jewellery",
];

const CategoryRow = () => {
  return (
    <div className="px-4 py-4 overflow-x-auto">
      <div className="flex gap-4 w-max">
        {categories.map((cat, index) => (
          <div key={index} className="flex flex-col items-center text-sm">
            <div className="w-14 h-14 rounded-full border-2 border-purple-600 flex items-center justify-center">
              🎁
            </div>
            <span className="mt-1 text-center">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryRow;
