/* eslint-disable react/prop-types */

import { GithubLogo, Link } from "@phosphor-icons/react";
import Button from "./Button";
import TechBadge from "./TechBadge";

// Función auxiliar para parsear el string de tecnologías
const parseTechnologies = (techString) => {
    console.log("String recibido para parsear:", techString);

    if (!techString || typeof techString !== 'string') {
        console.log("El string es inválido o no existe.");
        return [];
    }
    
    const technologies = [];
    const regex = /\(([^,]+?),\s*(<svg.*?<\/svg>)\)/gs; // Mantenemos la regex con flag 's'
    let match;

    while ((match = regex.exec(techString)) !== null) {
        if (match[1] && match[2]) {
            technologies.push({
                name: match[1].trim(),
                svg: match[2].trim(),
            });
        }
    }

    // AÑADE ESTE OTRO CONSOLE.LOG
    console.log("Resultado del parseo:", technologies);
    return technologies;
};
function ProjectCard({ project }) {
  const technologies = parseTechnologies(project.technologies);

  return (
    <li className="mb-16 grid grid-cols-1 last:mb-0 lg:grid-cols-2 lg:gap-6">
      <picture className="aspect-video overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg dark:shadow-white ">
        {project.img ? (
          <img
            className="scale-105 rounded-xl transition-all duration-300 ease-in-out hover:scale-100"
            src={project.img}
            alt={project.title || "Imagen del proyecto"}
          />
        ) : null}
      </picture>
      <div>
        <h3 className="mt-4 text-2xl font-bold sm:text-4xl dark:text-white">
          {project.title}
        </h3>

        {/* Badges de tecnologías */}
        {technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {technologies.map((tech, idx) => (
              <TechBadge 
                key={idx} 
                technology={tech.name} 
                icon={tech.svg} 
                index={idx} 
              />
            ))}
          </div>
        )}

        <p className="mt-2 text-sm text-gray7 dark:text-gray4">
          {project.description}
        </p>

        <div className="mt-4 flex gap-2">
          <Button href={project.code}>
            <GithubLogo size={24} weight="bold" />
            <span>Código</span>
          </Button>

          <Button href={project.demo}>
            <Link size={24} weight="bold" />
            <span>Demo</span>
          </Button>
        </div>
      </div>
    </li>
  );
}

export default ProjectCard;