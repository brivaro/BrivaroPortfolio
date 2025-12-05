/* eslint-disable react/prop-types */
import { GithubLogoIcon, LinkIcon } from "@phosphor-icons/react";
import TechBadge from "./TechBadge";
import FormattedDescription from "./FormattedDescription";

const parseTechnologies = (techString) => {
    if (!techString || typeof techString !== 'string') return [];
    
    const technologies = [];
    const regex = /\(([^,]+?),\s*(<svg.*?<\/svg>)\)/gs; 
    let match;

    while ((match = regex.exec(techString)) !== null) {
        if (match[1] && match[2]) {
            technologies.push({
                name: match[1].trim(),
                svg: match[2].trim(),
            });
        }
    }
    return technologies;
};

function ProjectCard({ project }) { 
  const technologies = parseTechnologies(project.technologies);
  
  return (
    // Eliminamos z-10 para que no tape el menú
    <li className="group relative mb-20 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 items-start">
      
      {/* --- COLUMNA IMAGEN --- */}
      <div className="relative w-full">
        {/* Efecto de sombra/glow detrás de la imagen (sutil en light, brillante en dark) */}
        <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40 dark:opacity-30 dark:group-hover:opacity-50"></div>
        
        <picture className="relative block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all dark:border-white/10 dark:bg-gray-900 dark:shadow-none">
          {project.img ? (
            <img
              // Hover Scale restaurado y mejorado
              className="aspect-video w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={project.img}
              alt={project.title}
              loading="lazy"
            />
          ) : (
            <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800" />
          )}
        </picture>
      </div>

      {/* --- COLUMNA TEXTO --- */}
      <div className="flex flex-col justify-center">
        
        {/* Título: Negro en Light, Blanco en Dark */}
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {project.title}
        </h3>

        {/* Badges */}
        {technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <TechBadge 
                key={tech.name} 
                technology={tech.name} 
                icon={tech.svg} 
              />
            ))}
          </div>
        )}

        {/* Descripción: Gris oscuro en Light, Gris claro en Dark */}
        <div className="mt-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <FormattedDescription text={project.description} />
        </div>

        {/* Botones */}
        <div className="mt-8 flex flex-wrap gap-4">
          
          {/* BOTÓN CÓDIGO */}
          {project.code !== '#' && (
            <a 
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 rounded-full px-6 py-2.5 font-bold transition-all duration-300
                
                /* MODO CLARO: Borde gris, texto oscuro, hover gris */
                border-2 border-gray-200 bg-transparent text-gray-800 hover:border-gray-800 hover:bg-gray-50
                
                /* MODO OSCURO: Borde blanco suave, texto blanco, hover blanco */
                dark:border-white/20 dark:text-white dark:hover:bg-white/10 dark:hover:border-white
              "
            >
              <GithubLogoIcon size={20} weight="bold" />
              <span>Código</span>
            </a>
          )}
          
          {/* BOTÓN DEMO */}
          {project.demo !== '#' && (
            <a 
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 rounded-full px-6 py-2.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                
                /* Color sólido para destacar en ambos modos */
                bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500
              "
            >
              <LinkIcon size={20} weight="bold" />
              <span>Ver Demo Live</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProjectCard;