/* eslint-disable react/prop-types */
import DarkModeToggle from "./DarkModeToggle";

function Nav({ isIntersecting }) {
  return (
    <header className="fixed top-0 z-10 mx-auto mt-2 flex w-full items-center justify-center">
      <nav
        className={`flex items-center justify-center gap-1 sm:gap-3 rounded-full px-2 text-[13px] sm:text-[15px] font-semibold text-inherit transition-all duration-300 sm:px-3 lg:text-xl dark:text-white max-w-[95vw] overflow-x-auto scrollbar-hide ${isIntersecting ? "bg-white/0 dark:bg-black/0" : "bg-white/40 shadow-lg backdrop-blur-md"}`}
      >
        <NavItem href="#experiencia">Experiencia</NavItem>
        <NavItem href="#proyectos">Proyectos</NavItem>
        <NavItem href="#educacion">Educación</NavItem>
        <NavItem href="#sobremi">Sobre mí</NavItem>
        <NavItem href="mailto:brian.1613.bv@gmail.com?Subject=Contactar%20con%20Brian">
          Contacto
        </NavItem>
        <DarkModeToggle />
      </nav>
    </header>
  );
}

export default Nav;

function NavItem({ href, children }) {  // children es el texto Proyectos, Educación, Sobre mí, Contacto
  return (
    <a
      className="relative block rounded-full px-1 sm:px-2 py-2 outline-none transition-all duration-300 hover:text-cyan focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/75 dark:hover:text-cyan whitespace-nowrap text-center"
      href={href}
    >
      {children}
    </a>
  );
}
