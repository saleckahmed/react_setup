import { Link } from "react-router-dom";

export default function CustomAuthText({ href, linkText, text }) {
  return (
    <Link to={href} className="text-center text-gray-600 text-sm">
      {text}
      <button
        type="button"
        className="text-blue-500 font-semibold hover:text-blue-700 hover:underline transition-colors"
      >
        {linkText}
      </button>
    </Link>
  );
}
