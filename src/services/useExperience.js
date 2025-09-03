import { useQuery } from "@tanstack/react-query";

export async function getExperience() {
  const data = await fetch(`/api/fetchNotion?id=${import.meta.env.VITE_DATABASE_EXPERIENCE_ID}&type=experience`).then((res) => res.json());
  if (data?.error) throw new Error(data.error);
  const results = data.results ?? [];
  return results.map((page) => {
    const { properties } = page;
    return {
      title: properties.title?.title?.[0]?.plain_text ?? "Sin título",
      company: properties.company?.rich_text?.[0]?.plain_text ?? "",
      date: properties.date?.rich_text?.[0]?.plain_text ?? "",
      location: properties.location?.rich_text?.[0]?.plain_text ?? "",
      description: properties.description?.rich_text?.[0]?.plain_text ?? "",
      isShown: properties.isShown?.checkbox ?? false,
    };
  });
}

export function useExperience() {
  const { isLoading, data: experience, error } = useQuery({
    queryKey: ["experience"],
    queryFn: getExperience,
    retry: false,
  });
  return { isLoading, experience, error };
}
