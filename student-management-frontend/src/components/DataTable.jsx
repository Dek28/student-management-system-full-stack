// src/components/DataTable.jsx
const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-3 py-2 text-left font-semibold text-gray-600"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-3 py-2 text-right font-semibold text-gray-600">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-3 py-4 text-center text-gray-500"
              >
                No records found.
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={row._id} className="border-t hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.accessor} className="px-3 py-2">
                  {row[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-3 py-2 text-right space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="px-2 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="px-2 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
