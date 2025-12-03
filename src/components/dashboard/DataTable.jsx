import { Edit2, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "../services/apiService";
import { BeatLoader } from "react-spinners";

export default function DataTable({ url, columns }) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(columns[0].key);
  useEffect(() => {
    const fetchRows = async () => {
      try {
        const response = await apiClient.get(url);
        setRows(response.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRows();
  }, []);

  const deleteRow = async (id) => {
    try {
      console.log(id);
      const response = await apiClient.delete(`${url}/${id}`, {});
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRows = rows.filter((row) => {
    if (!row || !sort) return false;
    return row[sort]?.toString().toLowerCase().includes(search.toLowerCase());
  });
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader size={10} />
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center py-10 text-gray-500">
          No product data available to display.
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto shadow-xl bg-white rounded-2xl">
      <div className="flex justify-start items-center py-2 px-3">
        <input
          placeholder={`search by ${sort}`}
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          className="appearance-none h-10 w-1/4 block px-3 py-2 border mr-5 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
        />
        {columns.map((column) =>
          column.key == "actions" ? (
            <div></div>
          ) : (
            <button
              key={column.key}
              onClick={() => setSort(column.key)}
              className={`flex  justify-center py-3 px-3 transition duration-200 ease-in-out rounded-lg cursor-pointer ${
                sort == column.header
                  ? "bg-blue-100/70 text-blue-700 font-semibold "
                  : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }   `}
            >
              <p className=" text-sm">{column.header}</p>
            </button>
          )
        )}
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="overflow-hidden">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-blue-600 text-sm font-semibold p-2"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center py-10 text-gray-500">Not found.</div>
            </div>
          ) : (
            filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="text-sm text-center">{row.id}</td>
                <td className="text-sm text-start">
                  {row.title.length > 30
                    ? `${row.title.slice(0, 27)}...`
                    : row.title}
                </td>
                <td className="text-sm text-center">{row.category}</td>
                <td className="text-sm text-start">
                  {row.description.length > 70
                    ? `${row.description.slice(0, 67)}...`
                    : row.description}
                </td>
                <td className="text-sm text-center">{row.price}</td>
                <td className="text-sm text-center">
                  {row.discountPercentage}
                </td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteRow(row.id);
                      }}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
