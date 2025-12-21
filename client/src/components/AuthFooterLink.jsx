import { Link } from "react-router-dom";

const AuthFooterLink = ({ text, linkText, to }) => {
  return (
    <div className="text-center mt-6 text-sm">
      {text}{" "}
      <Link to={to} className="text-purple-700 font-medium">
        {linkText}
      </Link>
    </div>
  );
};

export default AuthFooterLink;
