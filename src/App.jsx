/* eslint-disable react/no-unknown-property */
import SectionProjects from "./features/sections/SectionProjects";
import SectionExperience from "./features/sections/SectionExperience";
import SectionEducation from "./features/sections/SectionEducation";
import SectionHero from "./features/sections/SectionHero";
import SectionAboutMe from "./features/sections/SectionAboutMe";
import Nav from "./features/ui/Nav";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import SectionSkills from "./features/sections/SectionSkills";
import { DarkModeProvider } from "./context/DarkModeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // staleTime: 0,
    },
  },
});

const year = new Date().getFullYear();

function App() {
  const [isIntersecting, setIsIntersecting] = useState(false); // isIntersecting es un booleano que se inicializa en false

  const ref = useRef(null); // ref se le pasa a SectionHero para que sepa qué elemento observar

  useEffect(() => {
    const observer = new IntersectionObserver( // IntersectionObserver es una API que permite observar si un elemento está dentro del viewport o no
      ([entry]) => { // entry es un array que contiene información sobre la intersección del elemento observado
        setIsIntersecting(entry.isIntersecting); // entry.isIntersecting es un booleano que indica si el elemento está dentro del viewport o no
      },
      { rootMargin: "-430px" }, // rootMargin define un margen adicional alrededor del viewport, el callback se activará cuando el elemento esté a 430px de entrar al viewport.
    );

    if (ref.current) {
      observer.observe(ref.current); // se evita que se creen múltiples observadores
    }

    return () => observer.disconnect();
  }, []); // Array vacío para que solo se ejecute una vez
  
  //observer.observe(ref.current);
  //return () => observer.disconnect();
//}, [isIntersecting]);

  return ( // ref es una referencia al elemento que se está observando para que 430 píxeles antes de que entre al viewport se active el callback
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="relative">
          <div className="absolute bottom-0 top-0 z-[-2] min-h-screen w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-black/95"></div>
          <Nav isIntersecting={isIntersecting} />
          <main className="mx-auto max-w-4xl  px-4 py-8">
            <SectionHero reference={ref} />
            <SectionExperience />
            <SectionProjects />
            <SectionEducation />
            <SectionAboutMe />
            <SectionSkills />
          </main>
          <footer className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6 text-xs text-gray-500 md:text-base">
            <p className="w-1/2 md:w-full">
              &copy; {year}{" "}
              <a href="https://www.linkedin.com/in/brian-valiente-rodenas/" target="_blank" rel="noopener noreferrer">
                Brian Valiente Rodenas
              </a>{" "}
              | <a href="mailto:brian.1613.bv@gmail.com">Contáctame</a>
              <br />
              Casi todos los derechos reservados
            </p>

            <div className="flex gap-3">
              <a
                className="font-bold transition-all duration-300 hover:underline"
                href="#proyectos"
              >
                Proyectos
              </a>
              <a
                className="font-bold transition-all duration-300 hover:underline"
                href="#experiencia"
              >
                Experiencia
              </a>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
