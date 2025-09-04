/* eslint-disable react/prop-types */

import React, { Suspense, useEffect, useState } from "react";
import { EnvelopeIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
//import myImage from "../../assets/face.webp";
import myImage from "../../assets/me2.webp";
//import DarkImg from "../../assets/heroimg-dark.webp";
//import LightImg from "../../assets/heroimg-light.webp";
import { useDarkMode } from "../../hooks/useDarkMode";
import Button from "../ui/Button";

// Hacemos la importación dinámica con React.lazy
const IA3D = React.lazy(() => import("../../models/IA3D"));

function SectionHero({ reference: ref }) {
  const { isDarkMode } = useDarkMode();
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  // Observer para activar el modelo 3D solo cuando la sección es visible
  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        rootMargin: "0px",
        threshold: 0.1, 
      }
    );

    // Usamos la variable local para observar el elemento.
    if (element) {
      observer.observe(element);
    }

    // Usamos LA MISMA variable local en la limpieza.
    // Esto garantiza que dejamos de observar el mismo elemento que empezamos a observar.
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref]); // La dependencia sigue siendo ref.

  return ( //border-4 border-blue-40
    <section
      ref={ref}
      className="relative mx-auto mt-20 flex flex-col items-center"
    >
      {/* Esto asegura que solo se monte y renderice cuando la sección Hero es visible */}
      <Suspense fallback={null}>
        <IA3D isVisible={isHeroVisible} />
      </Suspense>
      
      <picture>
        <img
          className=" aspect-square w-36 rounded-full"
          src={isDarkMode ? myImage : myImage}
          alt="Brian Valiente Rodenas Icon"
        />
      </picture>
      <h1 className="mt-3 font-RedHat text-4xl font-bold text-gray9 sm:text-6xl dark:text-white text-center">
        Hola, soy Brian
      </h1>

      <p className="mt-4 text-center text-lg sm:w-2/3 sm:text-2xl dark:text-gray4">
        Ingeniero Informático especializado en{" "}
        <span className="font-medium text-green8">Inteligencia Artificial. </span>{" "}
        <span className="font-medium text-blue-800 dark:text-blue-400">+2 años de experiencia</span>
        {" "}
        en
        {" "}
        <span className="font-medium text-teal8">automatizaciones</span>
        , modelos de
        {" "}
        <span className="font-medium text-teal8">ML</span>
        {" "}
        y desarrollo de
        {" "}
        <span className="font-medium text-teal8">soluciones estratégicas.</span>
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
/*
<span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
  <Button href="https://www.youtube.com/@mrryanoficial">
    <YoutubeLogo size={24} weight="bold" />
    <span>YT</span>
  </Button>
</span>
 */
export default SectionHero;
