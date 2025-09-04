/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { BrainIcon } from "@phosphor-icons/react";
import { useDarkMode } from "../../hooks/useDarkMode";
import "./css/SectionSkills.css";

const skillsData = [
  // ... (tu array de skillsData sigue igual)
    { category: "AI/ML", icons: [
    "https://skillicons.dev/icons?i=python",
    "https://skillicons.dev/icons?i=scikitlearn",
    "https://skillicons.dev/icons?i=tensorflow",
    "https://skillicons.dev/icons?i=pytorch",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
    "https://skillicons.dev/icons?i=azure"
  ] },
  { category: "Programming Languages", icons: [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    "https://skillicons.dev/icons?i=go",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg"
  ] },
  { category: "Frontend", icons: [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "https://skillicons.dev/icons?i=nextjs",
    "https://skillicons.dev/icons?i=html",
    "https://skillicons.dev/icons?i=css",
    "https://skillicons.dev/icons?i=tailwind",
    "https://skillicons.dev/icons?i=figma"
  ] },
  { category: "DevOps", icons: [
    "https://skillicons.dev/icons?i=docker",
    "https://skillicons.dev/icons?i=kubernetes",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/argocd/argocd-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg"
  ] },
  { category: "Tools / IDEs", icons: [
    "https://skillicons.dev/icons?i=git",
    "https://skillicons.dev/icons?i=github",
    "https://skillicons.dev/icons?i=vscode",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg",
    "https://skillicons.dev/icons?i=linux"
  ] },
  { category: "Game / 3D", icons: [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg"
  ] },
  { category: "Databases", icons: [
    "https://skillicons.dev/icons?i=mysql",
    "https://skillicons.dev/icons?i=postgresql",
    "https://skillicons.dev/icons?i=sqlite",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    "https://skillicons.dev/icons?i=supabase"
  ] },
  { category: "Backend", icons: [
    "https://skillicons.dev/icons?i=spring",
    "https://skillicons.dev/icons?i=fastapi",
    "https://skillicons.dev/icons?i=flask",
    "https://skillicons.dev/icons?i=firebase",
  ] },
  { category: "Testing", icons: [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/junit/junit-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytest/pytest-original.svg"
  ] }
];

function SkillCarousel({ icons }) {
  const { iconsToShow, animationDuration } = useMemo(() => {
    const MIN_ICONS_FOR_VIEWPORT = 15;
    let baseIcons = [...icons];
    if (baseIcons.length > 0 && baseIcons.length < MIN_ICONS_FOR_VIEWPORT) {
      const repeatCount = Math.ceil(MIN_ICONS_FOR_VIEWPORT / baseIcons.length);
      baseIcons = Array(repeatCount).fill(icons).flat();
    }
    const finalIcons = [...baseIcons, ...baseIcons];
    const DURATION_PER_ICON = 2.5;
    const duration = finalIcons.length * DURATION_PER_ICON;
    return { iconsToShow: finalIcons, animationDuration: duration };
  }, [icons]);

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        // 2. Pasamos la duración dinámica como una variable CSS
        style={{ '--animation-duration': `${animationDuration}s` }}
      >
        {iconsToShow.map((icon, idx) => (
          <img
            key={idx}
            src={icon}
            alt="tech logo"
            height={56}
            width={56}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

export default function SectionSkills() {
  const { isDarkMode } = useDarkMode();

  return (
    <section className="skills-section" style={{ width: "100%", padding: "2rem 0" }}>
      <div className="flex items-center gap-3 mb-10">
        <BrainIcon size={36} weight="bold" color={isDarkMode ? "white" : "black"} />
        <h2 className="font-RedHat text-3xl font-bold text-gray9 sm:text-5xl dark:text-white">
          Habilidades
        </h2>
      </div>

      <div className="space-y-12">
        {skillsData.map((skillCategory) => (
          <div key={skillCategory.category}>
            <h3 className="font-RedHat text-2xl font-semibold mb-4 text-gray9 dark:text-white">
              {skillCategory.category}
            </h3>
            <SkillCarousel icons={skillCategory.icons} />
          </div>
        ))}
      </div>
    </section>
  );
}