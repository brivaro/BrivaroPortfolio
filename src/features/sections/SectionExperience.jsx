/* eslint-disable react/prop-types */
import { Briefcase } from "@phosphor-icons/react";
import { useExperience } from "../../services/useExperience";
import { useDarkMode } from "../../hooks/useDarkMode";
import FormattedDescription from "../ui/FormattedDescription";


function SectionExperience() {
  const { isDarkMode } = useDarkMode();
  const { isLoading, experience, error } = useExperience();

  return (
    <section id="experiencia" className="relative mt-8 pt-12">
      <div
        className="scroll-down top-2 absolute left-1/2 -translate-x-1/2"
        style={{
          "--mouse-border-color": isDarkMode ? "#fff" : "#343a40",
          "--mouse-wheel-color": isDarkMode ? "#fff" : "#343a40",
        }}
      >
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-24">
        <Briefcase size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Experiencia
        </h2>
      </div>

      <ul className="mt-6 border-l-2 border-gray4 ps-4 pt-4">
        {isLoading && <li>Cargando experiencia...</li>}
        {error && <li>Error al cargar experiencia</li>}
        {experience && experience.filter(e => e.isShown).map((exp, idx) => (
          <ExperienceItem key={idx} {...exp} />
        ))}
      </ul>
    </section>
  );
}

export default SectionExperience;

function ExperienceItem({ title, company, date, location, description }) {
  return (
    <li className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-0">
      <div className="relative">
        <div className="absolute -left-[25px] top-[6px] h-4 w-4 rounded-full bg-cyan2 lg:-left-[27px] lg:h-5 lg:w-5"></div>
        <h3 className="text-lg font-bold text-cyan lg:w-4/5 lg:text-2xl">{title}</h3>
        <h4 className="font-semibold text-gray9 lg:text-xl dark:text-white">{company}</h4>
        <span className="text-sm text-gray8 lg:text-base dark:text-gray4">{date}</span>
        <span className="block text-sm text-gray7 lg:text-base dark:text-gray5">{location}</span>
      </div>
      <div>
        <FormattedDescription text={description} />
      </div>
    </li>
  );
}


