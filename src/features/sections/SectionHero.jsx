/* eslint-disable react/prop-types */
import React, { Suspense, useEffect, useState } from "react"; // Reactiva estos imports
import { EnvelopeIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import myImageDark from "../../assets/me-dark.webp";
import myImageLight from "../../assets/me-light.webp";
import { useDarkMode } from "../../hooks/useDarkMode";
import Button from "../ui/Button";

// Importación dinámica (Lazy Load)
const IA3D = React.lazy(() => import("../../models/IA3D"));

function SectionHero({ reference: ref }) {
  const { isDarkMode } = useDarkMode();
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  // Observer para activar el modelo 3D solo cuando la sección es visible
  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Solo actualizamos el estado si cambia para evitar re-renders innecesarios
        if (entry.isIntersecting !== isHeroVisible) {
             setIsHeroVisible(entry.isIntersecting);
        }
      },
      {
        rootMargin: "100px", // Un margen para que empiece a cargar un poco antes
        threshold: 0, 
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.disconnect();
      }
    };
  }, [ref, isHeroVisible]);

  return (
    <section
      ref={ref}
      className="relative mx-auto mt-20 flex flex-col items-center"
    >
      {/* El Suspense evita que la web se congele mientras carga el modelo */}
      <Suspense fallback={<div className="h-[500px] w-full" />}>
        {/* Pasamos isVisible al componente para que sepa cuándo detenerse */}
        <IA3D isVisible={isHeroVisible} />
      </Suspense>
      
      <picture>
        <img
          className=" aspect-square w-36 rounded-full"
          src={isDarkMode ? myImageDark : myImageLight}
          alt="Brian Valiente Rodenas Icon"
        />
      </picture>
      
      {/* ... RESTO DEL CONTENIDO (Texto, botones, etc) IGUAL ... */}
      <h1 className="mt-3 font-RedHat text-4xl font-bold text-gray9 sm:text-6xl dark:text-white text-center">
        Hola, soy Brian
      </h1>

      <p className="mt-4 text-center text-lg sm:w-2/3 sm:text-2xl dark:text-gray4">
        Ingeniero Informático especializado en{" "}
        <span className="font-medium text-green8">Inteligencia Artificial. </span>{" "}
        <span className="font-medium text-blue-800 dark:text-sky-400">+2 años de experiencia</span>{" "}en{" "}
        <span className="font-medium text-teal8">automatizaciones</span>, {" "}
        <span className="font-medium text-purple-700 dark:text-purple-400">modelos de ML</span>, {" "}
        <span className="font-medium text-orange-600 dark:text-orange-400">IA Generativa</span>{" "}y desarrollo de{" "}
        <span className="font-medium text-yellow-600 dark:text-yellow-300">soluciones estratégicas.</span>
      </p>

      <a
        href="https://www.linkedin.com/in/brian-valiente-rodenas/"
        rel="noopener"
        className="mt-4 flex items-center rounded-full outline-none transition focus:ring-2 focus:ring-offset-2 md:justify-center md:hover:scale-105"
      >
        <div className="flex items-center">
          <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#51E4B8_0%,#21554E_50%,#51E4B8_100%)] "></span>
            <div className="inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-green-100 px-4 py-2 text-base text-green-800 backdrop-blur-3xl transition-all duration-300 hover:bg-green-200 dark:bg-gray-800 dark:text-white/80 dark:hover:bg-gray-700">
              Disponible para trabajar
            </div>
          </span>
        </div>
      </a>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <Button href="https://www.linkedin.com/in/brian-valiente-rodenas/">
            <LinkedinLogoIcon size={24} weight="bold" />
            <span>Linkedin</span>
          </Button>
        </span>
        <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <Button href="https://github.com/brivaro">
            <GithubLogoIcon size={24} weight="bold" />
            <span>Github</span>
          </Button>
        </span>
        <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <Button href="mailto:brian.1613.bv@gmail.com?Subject=Contactar%20con%20Brian">
            <EnvelopeIcon size={24} weight="bold" />
            <span>Email</span>
          </Button>
        </span>
      </div>
    </section>
  );
}

export default SectionHero;