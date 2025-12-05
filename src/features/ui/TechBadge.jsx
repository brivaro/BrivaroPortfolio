/* eslint-disable react/prop-types */

function TechBadge({ technology, icon }) {
  return (
    <span
      className="
        flex items-center gap-2 rounded-lg 
        bg-white/5 border border-white/10 px-3 py-1.5 
        text-xs font-medium text-gray-300 transition-all duration-300 
        hover:bg-white/10 hover:text-white hover:border-white/20 hover:scale-105
      "
    >
      <span
        className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full [&>svg]:drop-shadow-sm"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <span>{technology}</span>
    </span>
  );
}

export default TechBadge;