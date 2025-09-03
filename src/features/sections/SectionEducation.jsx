/* eslint-disable react/prop-types */
import { Book } from "@phosphor-icons/react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useEducation } from "../../services/useEducation";
import FormattedDescription from "../ui/FormattedDescription";

function SectionEducation() {
  const { isDarkMode } = useDarkMode();
  const { isLoading, education, error } = useEducation();
  return (
    <section id="educacion" className="mt-8 pt-12">
      <div className="flex items-center gap-3">
        <Book size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Educación
        </h2>
      </div>

      <ul className="mt-6 border-l-2 border-gray4 ps-4 pt-4">
        {isLoading && <li>Cargando educación...</li>}
        {error && <li>Error al cargar educación</li>}
        {education && education.map((edu, idx) => (
          <EducationItem key={idx} {...edu} />
        ))}
      </ul>
    </section>
  );
}

export default SectionEducation;

function EducationItem({ title, institution, date, description }) {
  return (
    <li className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-0">
      <div className="relative">
        <div className="absolute -left-[25px] top-[6px] h-4 w-4 rounded-full bg-cyan2 lg:-left-[27px] lg:h-5 lg:w-5"></div>
        <h3 className="text-lg font-bold text-cyan lg:w-4/5 lg:text-2xl">
          {title}
        </h3>
        <h4 className="font-semibold text-gray9 lg:text-xl dark:text-white">
          {institution}
        </h4>
        <span className="text-sm text-gray7 lg:text-base dark:text-gray4">
          {date}
        </span>
      </div>
      <div>
        <FormattedDescription text={description} />
      </div>
    </li>
  );
}
