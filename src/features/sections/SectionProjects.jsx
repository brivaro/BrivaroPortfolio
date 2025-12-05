/* eslint-disable react/prop-types */
import { CodeIcon } from "@phosphor-icons/react";
import { useProjects } from "../../services/useProjects";
import ProjectCard from "../ui/ProjectCard";
import { useDarkMode } from "../../hooks/useDarkMode";

function SectionProjects() {
  const { isDarkMode } = useDarkMode();
  const { isLoading, projects, error } = useProjects();
  
  return (
    <section id="proyectos" className="mt-8 pt-12">
      <div className="flex items-center gap-3 mb-12">
        <CodeIcon size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Proyectos Destacados
        </h2>
      </div>

      <div className="mt-6 flex flex-col gap-12">
        {isLoading && <p className="text-gray-400">Cargando proyectos...</p>}
        {error && <li>Error al cargar proyectos</li>}
        
        {!isLoading && !error && (
          <>
            {projects.length === 0 && (
                <p className="text-center text-gray7 dark:text-gray4">No hay proyectos visibles.</p>
            )}
            {projects.map((project, idx) => (
              <ProjectCard 
                key={project.id || `${project.name}-${idx}`} 
                project={project} 
                index={idx} // Pasamos el índice
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

export default SectionProjects;