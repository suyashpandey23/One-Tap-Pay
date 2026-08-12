export function Button({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full flex justify-center items-center gap-2
                 bg-gradient-to-r from-lime-400 to-green-600
                 hover:from-green-400 hover:to-lime-600
                 text-white font-semibold tracking-wide
                 rounded-full px-5 py-2.5 text-base
                 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400
                 active:scale-95"
    >
      {label}
    </button>
  );
}
