/* eslint-disable react/prop-types */

function TechBadge({ technology, icon }) {
  return (
    <span
      className="
        flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition-all duration-300
        
        /* MODO CLARO: Fondo blanco sucio, texto oscuro, borde suave */
        bg-gray-100 text-gray-800 border border-gray-200
        
        /* MODO OSCURO: Fondo transparente/blanco, texto claro */
        dark:bg-white/10 dark:text-gray-200 dark:border-white/10
        
        /* Hover effects */
        hover:scale-105
      "
    >
      {/* Eliminamos clases que fuercen el color del SVG para que se vean los colores originales */}
      <span
        className="h-4 w-4 shrink-0"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <span>{technology}</span>
    </span>
  );
}

export default TechBadge;