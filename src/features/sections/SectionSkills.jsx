/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { BrainIcon } from "@phosphor-icons/react";
import { useDarkMode } from "../../hooks/useDarkMode";
import "./SectionSkills.css";

// 1. Convertimos las URLs simples en objetos { name, url }
const skillsData = [
  { 
    category: "AI/ML", 
    icons: [
      { name: "Python", url: "https://skillicons.dev/icons?i=python" },
      { name: "Scikit Learn", url: "https://skillicons.dev/icons?i=scikitlearn" },
      { name: "TensorFlow", url: "https://skillicons.dev/icons?i=tensorflow" },
      { name: "PyTorch", url: "https://skillicons.dev/icons?i=pytorch" },
      { name: "Jupyter", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
      { name: "Azure", url: "https://skillicons.dev/icons?i=azure" }
    ] 
  },
  { 
    category: "Programming Languages", 
    icons: [
      { name: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "Java", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Kotlin", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
      { name: "C", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
      { name: "Golang", url: "https://skillicons.dev/icons?i=go" },
      { name: "Matlab", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" }
    ] 
  },
  { 
    category: "Frontend", 
    icons: [
      { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", url: "https://skillicons.dev/icons?i=nextjs" },
      { name: "HTML5", url: "https://skillicons.dev/icons?i=html" },
      { name: "CSS3", url: "https://skillicons.dev/icons?i=css" },
      { name: "Tailwind", url: "https://skillicons.dev/icons?i=tailwind" },
      { name: "Figma", url: "https://skillicons.dev/icons?i=figma" }
    ] 
  },
  { 
    category: "DevOps", 
    icons: [
      { name: "Docker", url: "https://skillicons.dev/icons?i=docker" },
      { name: "Kubernetes", url: "https://skillicons.dev/icons?i=kubernetes" },
      { name: "Ansible", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg" },
      { name: "ArgoCD", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/argocd/argocd-original.svg" },
      { name: "Grafana", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
      { name: "Apache", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" }
    ] 
  },
  { 
    category: "Tools / IDEs", 
    icons: [
      { name: "Git", url: "https://skillicons.dev/icons?i=git" },
      { name: "GitHub", url: "https://skillicons.dev/icons?i=github" },
      { name: "VS Code", url: "https://skillicons.dev/icons?i=vscode" },
      { name: "IntelliJ", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" },
      { name: "Android Studio", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg" },
      { name: "Linux", url: "https://skillicons.dev/icons?i=linux" }
    ] 
  },
  { 
    category: "Game / 3D", 
    icons: [
      { name: "Godot", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg" },
      { name: "Blender", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg" },
      { name: "Three.js", url: "https://skillicons.dev/icons?i=threejs" },
      { name: "Unity", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" }
    ] 
  },
  { 
    category: "Databases", 
    icons: [
      { name: "MySQL", url: "https://skillicons.dev/icons?i=mysql" },
      { name: "PostgreSQL", url: "https://skillicons.dev/icons?i=postgresql" },
      { name: "SQLite", url: "https://skillicons.dev/icons?i=sqlite" },
      { name: "Firebase", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg" },
      { name: "MongoDB", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "Supabase", url: "https://skillicons.dev/icons?i=supabase" }
    ] 
  },
  { 
    category: "Backend", 
    icons: [
      { name: "Spring", url: "https://skillicons.dev/icons?i=spring" },
      { name: "FastAPI", url: "https://skillicons.dev/icons?i=fastapi" },
      { name: "Flask", url: "https://skillicons.dev/icons?i=flask" },
      { name: "Firebase", url: "https://skillicons.dev/icons?i=firebase" },
    ] 
  },
  { 
    category: "Testing", 
    icons: [
      { name: "JUnit", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/junit/junit-original.svg" },
      { name: "Pytest", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytest/pytest-original.svg" }
    ] 
  }
];

function SkillCarousel({ icons }) {
  const { iconsToShow, animationDuration } = useMemo(() => {
    const MIN_ICONS_FOR_VIEWPORT = 10;
    let baseIcons = [...icons];
    
    if (baseIcons.length < 5) {
       baseIcons = [...baseIcons, ...baseIcons, ...baseIcons];
    } else if (baseIcons.length < MIN_ICONS_FOR_VIEWPORT) {
       baseIcons = [...baseIcons, ...baseIcons];
    }
    const finalIcons = [...baseIcons, ...baseIcons];
    
    const DURATION_PER_ICON = 5; 
    const duration = finalIcons.length * DURATION_PER_ICON;
    
    return { iconsToShow: finalIcons, animationDuration: duration };
  }, [icons]);

  return (
    <div className="carousel-container group">
      <div
        className="carousel-track"
        style={{ '--animation-duration': `${animationDuration}s` }}
      >
        {iconsToShow.map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="skill-item group/tooltip">
            {/* TOOLTIP: Aparece encima de la imagen */}
            <span 
              className="
                pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 
                whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-bold text-white 
                opacity-0 shadow-lg transition-opacity duration-300 
                group-hover/tooltip:opacity-100 dark:bg-white dark:text-gray-900
              "
            >
              {item.name}
              {/* Triangulito del tooltip */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-white"></span>
            </span>

            <img
              src={item.url}
              alt={item.name}
              height={70} // Tamaño que pediste
              width={70}
              draggable={false}
              loading="eager" 
              decoding="async"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SectionSkills() {
  const { isDarkMode } = useDarkMode();

  return (
    <section className="skills-section mt-12" style={{ width: "100%", padding: "2rem 0" }}>
      <div className="flex items-center gap-3 mb-10">
        <BrainIcon size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Habilidades
        </h2>
      </div>

      <div className="space-y-12">
        {skillsData.map((skillCategory) => (
          <div key={skillCategory.category}>
            <h3 className="font-RedHat text-lg font-semibold mb-4 text-gray7 dark:text-gray4 ml-2">
              {skillCategory.category}
            </h3>
            <SkillCarousel icons={skillCategory.icons} />
          </div>
        ))}
      </div>
    </section>
  );
}