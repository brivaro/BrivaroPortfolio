/* eslint-disable react/prop-types */

function TechBadge({ technology, icon }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md text-sm mr-2 mb-2">
      <span className="w-5 h-5 flex items-center" dangerouslySetInnerHTML={{ __html: icon }} />
      {technology}
    </span>
  );
}

export default TechBadge;
