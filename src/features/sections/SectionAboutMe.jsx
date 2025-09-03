import { User } from "@phosphor-icons/react";
import MeImg from "../../assets/aboutme.webp";
//import MeImg from "../../assets/me.webp";
import { useDarkMode } from "../../hooks/useDarkMode";

function SectionAboutMe() {
  const { isDarkMode } = useDarkMode();

  return (
    <section id="sobremi" className="mt-8 pt-12">
      <div className="flex items-center gap-3">
        <User size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Sobre mí
        </h2>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-aboutme-layout">
        <picture className="flex items-center justify-center sm:order-1">
          <img
            className="aspect-square h-80 w-52 rotate-6 rounded-[4rem] object-cover shadow-xl"
            src={MeImg}
            alt="Brian Valiente Rodenas"
          />
        </picture>
        <div className="mt-6 flex flex-col gap-3 text-xs lg:text-base dark:text-gray4">
          <p>
            Soy Brian Valiente Rodenas, Ingeniero Informático especializado en Big Data 
            e Inteligencia Artificial. Con más de dos años de experiencia profesional, 
            he liderado proyectos de automatización de procesos de datos, integración de 
            modelos de Machine Learning y desarrollo de soluciones avanzadas que han 
            optimizado la toma de decisiones estratégicas en empresas tecnológicas.
          </p>
          <p>
            Mi enfoque combina la excelencia técnica con habilidades de comunicación y 
            liderazgo, gestionando equipos multidisciplinares y colaborando en entornos 
            internacionales. Como divulgador científico, dirijo un canal de YouTube con 
            más de 16.000 seguidores, donde comparto contenido educativo sobre ciencia 
            y tecnología.
          </p>
          <p>
            <strong>Premios y reconocimientos:</strong> Finalista en los Premios Internet, 
            y formación avanzada en sistemas de automatización, domótica, ciberseguridad,
            IA, Data Science, Big Data, Cloud Computing, Azure AI Services y AWS. Mi 
            compromiso con la innovación y el aprendizaje continuo me permite adaptarme 
            rápidamente a nuevos retos y aportar valor en proyectos de alto impacto.
          </p>
          <p>
            <strong>Idiomas:</strong> Español (nativo), Inglés (C1), Valenciano (C1).
          </p>
        </div>
      </div>
    </section>
  );
}

export default SectionAboutMe;
