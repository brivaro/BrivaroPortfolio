/* eslint-disable react/prop-types */
import { Briefcase } from "@phosphor-icons/react";
import { useDarkMode } from "../../hooks/useDarkMode";

function SectionExperience() {
  const { isDarkMode } = useDarkMode();

  return (
    <section id="experiencia" className="mt-8 pt-12">
      <div className="flex items-center gap-3">
        <Briefcase size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Experiencia
        </h2>
      </div>

      <ul className="mt-6 border-l-2 border-gray4 ps-4 pt-4">
        <ExperienceItem
          title={"Desarrollador Frontend"}
          company={"Freelance"}
          date={"2023 - Actualidad"}
          description={
            "Diseño y desarrollo de interfaces con React, Tailwind y buenas prácticas de UI/UX."
          }
        />
        <ExperienceItem
          title={"Animador 3D / Multimedia"}
          company={"Proyectos personales"}
          date={"2021 - Actualidad"}
          description={
            "Creación de piezas visuales y recursos 3D aplicados a experiencias web."
          }
        />
      </ul>
    </section>
  );
}

export default SectionExperience;

function ExperienceItem({ title, company, date, description }) {
  return (
    <li className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-0">
      <div className="relative">
        <div className="absolute -left-[25px] top-[6px] h-4 w-4 rounded-full bg-cyan2 lg:-left-[27px] lg:h-5 lg:w-5"></div>
        <h3 className="text-lg font-bold text-cyan lg:w-4/5 lg:text-2xl">{title}</h3>
        <h4 className="font-semibold text-gray9 lg:text-xl dark:text-white">{company}</h4>
        <span className="text-sm text-gray7 lg:text-base dark:text-gray4">{date}</span>
      </div>
      <div>
        {description ? (
          <p className="text-sm text-gray7 lg:text-base dark:text-gray4">{description}</p>
        ) : null}
      </div>
    </li>
  );
}


