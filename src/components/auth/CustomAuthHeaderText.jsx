export default function CustomAuthHeaderText({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      <p className="text-gray-500 text-sm ">{subtitle}</p>
    </div>
  );
}
