import { useQuery } from "@tanstack/react-query";

export async function getEducation() {
  const data = await fetch(`/api/fetchNotion?id=${import.meta.env.VITE_DATABASE_EDUCATION_ID}&type=education`).then((res) => res.json());
  if (data?.error) throw new Error(data.error);
  const results = data.results ?? [];
  return results.map((page) => {
    const { properties } = page;
    return {
      title: properties.title?.title?.[0]?.plain_text ?? "Sin título",
      institution: properties.institution?.rich_text?.[0]?.plain_text ?? "",
      date: properties.date?.rich_text?.[0]?.plain_text ?? "",
      description: properties.description?.rich_text?.[0]?.plain_text ?? "",
    };
  });
}

export function useEducation() {
  const { isLoading, data: education, error } = useQuery({
    queryKey: ["education"],
    queryFn: getEducation,
    retry: false,
  });
  return { isLoading, education, error };
}
