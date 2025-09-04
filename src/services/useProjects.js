import { useQuery } from "@tanstack/react-query";
import { getFullTextFromRichText, getFullTextFromTitle } from "./utils";

async function fetchProjects() {
  const data = await fetch(`/api/fetchNotion?id=${import.meta.env.VITE_DATABASE_PROJECTS_ID}&type=projects`).then((res) => res.json());
  if (data?.error) {
    throw new Error(data.error);
  }
  const results = data.results ?? [];
  return results.map((page) => {
    const { properties } = page;
    const { title, img, description, demo, code, technologies, isShown } = properties;
    return {
      title: getFullTextFromTitle(title),
      img:
        img?.files?.[0]?.file?.url ??
        img?.files?.[0]?.external?.url ??
        "",
      description: getFullTextFromRichText(description),
      demo: demo?.url ?? "#",
      code: code?.url ?? "#",
      isShown: isShown?.checkbox ?? false,
      technologies: getFullTextFromRichText(technologies),
    };
  });
}

export function useProjects() {
  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects, retry: false });
  return { isLoading, projects, error };
}