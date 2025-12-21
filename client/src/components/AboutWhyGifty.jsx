const points = [
  {
    icon: "🎨",
    title: "Personalized Gifts",
    desc: "Customize gifts with photos, text, and designs.",
  },
  {
    icon: "🚚",
    title: "Reliable Delivery",
    desc: "Fast and safe delivery across India.",
  },
  {
    icon: "💝",
    title: "Made with Love",
    desc: "Every gift is crafted with attention to detail.",
  },
];

const AboutWhyGifty = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">
        Why Choose Gifty?
      </h3>

      <div className="space-y-4">
        {points.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-sm flex gap-4"
          >
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutWhyGifty;
