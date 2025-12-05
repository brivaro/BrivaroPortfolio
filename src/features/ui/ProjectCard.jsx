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
    <li className="group relative mb-20 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 items-start">
      
      {/* --- COLUMNA IMAGEN --- */}
      <div className="relative w-full">
        <div className="absolute -inset-2 rounded-xl bg-blue-500 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40 dark:opacity-30"></div>
        
        <picture className="relative block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all dark:border-white/10 dark:bg-gray-900 dark:shadow-none">
          {project.img ? (
            <img
              className="aspect-video w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
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

        {/* Descripción */}
        <div className="mt-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <FormattedDescription text={project.description} />
        </div>

        {/* --- BOTONES ARREGLADOS --- */}
        <div className="mt-8 flex flex-wrap gap-4">
          
          {/* 1. BOTÓN CÓDIGO (Outline) */}
          {project.code !== '#' && (
            <a 
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 rounded-full px-6 py-2.5 font-bold transition-all duration-300
                border-2 
                /* MODO CLARO: Borde negro, Texto negro */
                border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white
                /* MODO OSCURO: Borde blanco, Texto blanco */
                dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900
                hover:-translate-y-1 hover:shadow-lg
              "
            >
              <GithubLogoIcon size={20} weight="bold" />
              <span>Código</span>
            </a>
          )}
          
          {/* 2. BOTÓN DEMO (Sólido) */}
          {project.demo !== '#' && (
            <a 
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 rounded-full px-6 py-2.5 font-bold transition-all duration-300
                /* COLOR SÓLIDO AZUL (Sin gradientes que fallen) */
                bg-[#2563EB] text-white border-2 border-[#2563EB]
                /* HOVER: Azul más oscuro */
                hover:bg-[#1d4ed8] hover:border-[#1d4ed8]
                hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30
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