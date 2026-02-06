// src/components/FormField.jsx
const FormField = ({ label, name, type = "text", value, onChange }) => (
  <div className="mb-3">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default FormField;
