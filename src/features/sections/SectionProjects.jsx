/* eslint-disable react/prop-types */
import { CodeIcon } from "@phosphor-icons/react";
import { useProjects } from "../../services/useProjects";
import ProjectCard from "../ui/ProjectCard";
import { useDarkMode } from "../../hooks/useDarkMode";

function SectionProjects() {
  const { isDarkMode } = useDarkMode();
  const { isLoading, projects, error } = useProjects();
  const showBorder = !isLoading && !error && projects.length === 0;
  return (
    <section id="proyectos" className="mt-8 pt-12">
      <div className="flex items-center gap-3">
        <CodeIcon size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Proyectos
        </h2>
      </div>

      <ul className={`mt-6 ps-4 pt-4${showBorder ? ' border-l-2 border-gray4' : ''}`}>
        {isLoading && <li>Cargando proyectos...</li>}
        {error && <li>Error al cargar proyectos</li>}
        {!isLoading && !error && (
          <>
            {projects.length === 0 && (
                <li key="no-projects" className="text-center text-gray7 dark:text-gray4">No hay proyectos visibles.</li>
            )}
            {projects.map((project, idx) => (
              <ProjectCard key={project.id || `${project.name}-${idx}`} project={project} />
            ))}
          </>
        )}
      </ul>
    </section>
  );
}

export default SectionProjects;
