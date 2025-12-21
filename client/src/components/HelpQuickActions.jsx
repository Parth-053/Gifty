const actions = [
  { label: "My Orders", icon: "📦" },
  { label: "Payments & Refunds", icon: "💳" },
  { label: "Customization Help", icon: "🎨" },
  { label: "Shipping & Delivery", icon: "🚚" },
];

const HelpQuickActions = () => {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3">
        Quick Help
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="text-2xl">{item.icon}</div>
            <span className="text-sm font-medium text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpQuickActions;
