import { useQuery } from "@tanstack/react-query";
import { getFullTextFromRichText } from "./utils";

export async function getExperience() {
  const data = await fetch(`/api/fetchNotion?id=${import.meta.env.VITE_DATABASE_EXPERIENCE_ID}&type=experience`).then((res) => res.json());
  if (data?.error) throw new Error(data.error);
  const results = data.results ?? [];
  return results.map((page) => {
    const { properties } = page;
    return {
      title: properties.title?.title?.[0]?.plain_text ?? "Sin título",
      company: getFullTextFromRichText(properties.company),
      date: getFullTextFromRichText(properties.date),
      location: getFullTextFromRichText(properties.location),
      description: getFullTextFromRichText(properties.description),
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