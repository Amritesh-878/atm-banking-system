const AccountCard = ({ title, balance }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">
        ₹{typeof balance === "number" ? balance.toLocaleString() : "0"}
      </p>
    </div>
  );
};

export default AccountCard;
