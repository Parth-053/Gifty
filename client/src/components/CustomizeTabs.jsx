import { useState } from "react";
import TextControls from "./TextControls";
import ImageControls from "./ImageControls";
import ColorControls from "./ColorControls";

const CustomizeTabs = () => {
  const [active, setActive] = useState("text");

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex justify-around bg-white mx-4 rounded-xl shadow-sm">
        {[
          { id: "text", label: "Text ✍️" },
          { id: "image", label: "Image 🖼️" },
          { id: "color", label: "Color 🎨" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`py-3 flex-1 text-sm font-medium ${
              active === tab.id
                ? "text-purple-700 border-b-2 border-purple-700"
                : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Controls */}
      <div className="px-4 mt-4">
        {active === "text" && <TextControls />}
        {active === "image" && <ImageControls />}
        {active === "color" && <ColorControls />}
      </div>
    </div>
  );
};

export default CustomizeTabs;
