const TransactionButton = ({
  onClick,
  icon: Icon,
  iconColor,
  title,
  description,
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
    >
      <div className="flex flex-col items-center text-center">
        {Icon && (
          <Icon
            className={`${iconColor} group-hover:scale-110 transition-transform`}
            size={48}
          />
        )}
        <h3 className="font-semibold text-gray-800 mt-3">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </button>
  );
};

export default TransactionButton;
