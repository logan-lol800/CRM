// components/Store/CategoryButton.jsx
function CategoryButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative px-3 pb-2 text-base font-medium transition-colors ${
        active ? 'text-black' : 'text-black hover:text-gray-600'
      }`}
    >
      <span>{label}</span>
      <span
        className={`absolute left-0 -bottom-1 h-[3px] bg-logo-lightBlue transition-all duration-300 ${
          active ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      ></span>
    </button>
  );
}

export default CategoryButton;
