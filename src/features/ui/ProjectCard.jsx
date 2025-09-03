/* eslint-disable react/prop-types */

import { GithubLogo, Link } from "@phosphor-icons/react";
import Button from "./Button";
import TechBadge from "./TechBadge";

function ProjectCard({ project }) {
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
        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map(([technology, icon], idx) => (
              <TechBadge key={idx} technology={technology} icon={icon} />
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
