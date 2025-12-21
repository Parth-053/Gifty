import AccountItem from "./AccountItem";

const AccountSection = ({ title, items }) => {
  return (
    <div className="mt-4 bg-white rounded-2xl mx-4 overflow-hidden shadow-sm">
      <h3 className="px-4 py-2 text-sm font-semibold text-gray-600">
        {title}
      </h3>

      {items.map((item, index) => (
        <AccountItem key={index} {...item} />
      ))}
    </div>
  );
};

export default AccountSection;
