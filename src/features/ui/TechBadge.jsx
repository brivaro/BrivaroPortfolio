/* eslint-disable react/prop-types */

/*const colors = [
  "bg-gradient-to-r from-sky-400 to-red-500",
  "bg-gradient-to-r from-cyan-500 to-blue-500",
  "bg-gradient-to-r from-green-400 to-teal-500",
  "bg-gradient-to-r from-pink-500 to-rose-500",
  "bg-gradient-to-r from-amber-500 to-orange-600",
  "bg-gradient-to-r from-violet-500 to-purple-600",
  "bg-gradient-to-r from-indigo-400 to-green-600",
];*/

const colors = [
  "bg-blue-600",
  "bg-slate-600",
  "bg-yellow-700",
  "bg-fuchsia-700",
  "bg-emerald-700",
  "bg-rose-700",
  "bg-teal-700",
  "bg-indigo-700",
  "bg-red-600",
  "bg-green-600",
  "bg-cyan-600",
  "bg-pink-600",
  "bg-orange-600",
  "bg-gray-600",
  "bg-purple-700",
  "bg-sky-700",
];

function TechBadge({ technology, icon, index }) {
  const colorClass = colors[index % colors.length];

  return (
    <span
      className={`flex w-fit items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-white ${colorClass} shadow-md`}
    >
      <span
        className="h-4 w-4"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <span>{technology}</span>
    </span>
  );
}

export default TechBadge;