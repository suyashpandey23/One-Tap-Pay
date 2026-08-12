export const Balance = ({ value }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-200">
      <span className="text-gray-600 text-base sm:text-lg font-medium">
        Your Balance
      </span>
      <span className="text-2xl font-bold text-green-600 mt-1 sm:mt-0">
        ₹ {value.toLocaleString("en-IN")}
      </span>
    </div>
  );
};
