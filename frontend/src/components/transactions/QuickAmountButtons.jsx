const QuickAmountButtons = ({ onSelect, disabled = false }) => {
  const amounts = [200, 400, 600, 800, 1000, 2000, 3000, 4000, 5000];

  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {amounts.map((amt) => (
        <button
          key={amt}
          type="button"
          onClick={() => onSelect(amt.toString())}
          disabled={disabled}
          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
            disabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-800"
          }`}
        >
          ₹{amt}
        </button>
      ))}
    </div>
  );
};

export default QuickAmountButtons;
