import { Link } from "react-router-dom";

const AuthFooterLink = ({ text, linkText, to }) => {
  return (
    <p className="text-sm text-center text-gray-600 mt-4">
      {text}{" "}
      <Link
        to={to}
        className="text-black font-medium underline"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default AuthFooterLink;
