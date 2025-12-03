export default function CustomAuthForm({ onSubmit, children }) {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm w-[90%] space-y-4 p-6 bg-white rounded-lg shadow-lg"
    >
      {children}
    </form>
  );
}
