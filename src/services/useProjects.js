import { useQuery } from "@tanstack/react-query";
import { getProjects } from "./apiNotion";

export function useProjects() {
  const {
    isLoading,
    data: projects,
    error,
  } = useQuery({ queryKey: ["projects"], queryFn: getProjects, retry: false, initialData: [], });
  // *TODO: quitar el initialData cuando esté listo el fetchNotion
  return { isLoading, projects, error };
}
