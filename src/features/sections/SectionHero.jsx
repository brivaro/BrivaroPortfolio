/* eslint-disable react/prop-types */
import { Envelope, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import myImage from "../../assets/face.webp";
//import DarkImg from "../../assets/heroimg-dark.webp";
//import LightImg from "../../assets/heroimg-light.webp";
import { useDarkMode } from "../../hooks/useDarkMode";
import Button from "../ui/Button";
import IA3D from "../../models/IA3D";

function SectionHero({ reference: ref }) {
  const { isDarkMode } = useDarkMode();

  return (
    <section
      ref={ref}
      className="mx-auto mt-20 flex flex-col items-center md:w-4/5"
    >
      <IA3D />
      
      <picture>
        <img
          className=" aspect-square w-36 rounded-full"
          src={isDarkMode ? myImage : myImage}
          alt="Santiago Sepúlveda Icon"
        />
      </picture>
      <h1 className="mt-3 font-RedHat text-4xl font-bold text-gray9 sm:text-6xl dark:text-white">
        Hola, soy Santiago
      </h1>

      <p className="mt-4 text-center text-lg sm:w-2/3 sm:text-2xl dark:text-gray4">
        Ingeniero Multimedia.{" "}
        <span className="font-medium text-cyan8">
          {" "}
          Desarrollador Web y Animador 3D.
        </span>{" "}
        <span className="font-medium text-teal8">
          De Cúcuta, Colombia.
        </span>{" "}
        Apasionado por la creatividad.
      </p>

      <a
        href="https://www.linkedin.com/in/santiago-sepúlveda-022a8a217/"
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
          <Button href="https://www.linkedin.com/in/santiago-sepúlveda-022a8a217/">
            <LinkedinLogo size={24} weight="bold" />
            <span>Linkedin</span>
          </Button>
        </span>
        
        <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <Button href="https://github.com/SantiagoS2109">
            <GithubLogo size={24} weight="bold" />
            <span>Github</span>
          </Button>
        </span>

        <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <Button href="mailto:santiagosepul2109@gmail.com?Subject=Interesado%20en%20contactarte">
            <Envelope size={24} weight="bold" />
            <span>Email</span>
          </Button>
        </span>
      </div>
    </section>
  );
}

export default SectionHero;
