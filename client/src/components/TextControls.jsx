const TextControls = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
      <input
        type="text"
        placeholder="Enter your text"
        className="w-full border rounded-lg px-3 py-2"
      />

      <select className="w-full border rounded-lg px-3 py-2">
        <option>Choose Font</option>
        <option>Serif</option>
        <option>Sans</option>
        <option>Handwritten</option>
      </select>

      <div className="flex gap-3">
        <button className="flex-1 border rounded-lg py-2">
          Bold
        </button>
        <button className="flex-1 border rounded-lg py-2">
          Italic
        </button>
      </div>
    </div>
  );
};

export default TextControls;
