export default function CustomAuthButton({ type = "button", text }) {
  return (
    <button
      type={type}
      className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 active:bg-blue-700 transition-colors"
    >
      {text}
    </button>
  );
}
