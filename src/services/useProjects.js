import { useQuery } from "@tanstack/react-query";

async function fetchProjects() {
  const data = await fetch(`/api/fetchNotion?id=${import.meta.env.VITE_DATABASE_PROJECTS_ID}&type=projects`).then((res) => res.json());
  if (data?.error) {
    throw new Error(data.error);
  }
  const results = data.results ?? [];
  return results.map((page) => {
    const { properties } = page;
    const { slug, title, img, description, demo, code, technologies, isShown } = properties;
    return {
      id: slug?.rich_text?.[0]?.plain_text ?? page.id,
      title: title?.title?.[0]?.plain_text ?? "Sin título",
      img:
        img?.files?.[0]?.file?.url ??
        img?.files?.[0]?.external?.url ??
        "",
      description: description?.rich_text?.[0]?.plain_text ?? "",
      demo: demo?.url ?? "#",
      code: code?.url ?? "#",
      isShown: isShown?.checkbox ?? false,
      technologies: technologies?.relation ?? [],
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
