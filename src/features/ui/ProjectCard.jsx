/* eslint-disable react/prop-types */
import { GithubLogoIcon, LinkIcon } from "@phosphor-icons/react";
// Eliminado: import Button from "./Button"; (Causaba error 1)
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

// Eliminado: { project, index } -> { project } (Causaba error 2)
function ProjectCard({ project }) { 
  const technologies = parseTechnologies(project.technologies);
  
  return (
    <li className="group relative mb-24 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      
      {/* 1. IMAGEN CON EFECTO GLOW */}
      <div className="relative z-10 perspective-1000">
        {/* Glow de fondo */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"></div>
        
        <picture className="relative block overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
          {project.img ? (
            <img
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              src={project.img}
              alt={project.title}
              loading="lazy"
            />
          ) : (
            <div className="aspect-video w-full bg-gray-800" />
          )}
        </picture>
      </div>

      {/* 2. CONTENIDO */}
      <div className="relative z-10">
        {/* Título con gradiente sutil */}
        <h3 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          {project.title}
        </h3>

        {/* Badges de tecnologías */}
        {technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {/* Eliminado: (tech, idx) -> (tech) (Causaba error 3) */}
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
        <div className="mt-6 text-base leading-relaxed text-gray-400">
          <FormattedDescription text={project.description} />
        </div>

        {/* Botones de acción */}
        <div className="mt-8 flex flex-wrap gap-4">
          {project.code !== '#' && (
            <a 
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-2.5 font-medium text-white transition-all hover:bg-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <GithubLogoIcon size={20} />
              <span>Ver Código</span>
            </a>
          )}
          
          {project.demo !== '#' && (
            <a 
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-cyan-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-cyan-900/20 transition-all hover:bg-cyan-500 hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              <LinkIcon size={20} />
              <span>Ver Demo Live</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

export default ProjectCard;