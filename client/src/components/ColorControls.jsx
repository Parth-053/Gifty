const colors = ["#000000", "#7C3AED", "#EF4444", "#22C55E", "#F59E0B"];

const ColorControls = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex gap-3">
        {colors.map((c) => (
          <div
            key={c}
            style={{ backgroundColor: c }}
            className="w-8 h-8 rounded-full border cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
};

export default ColorControls;
