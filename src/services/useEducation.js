import { useQuery } from "@tanstack/react-query";
import { getFullTextFromRichText } from "./utils";

export async function getEducation() {
  const data = await fetch(`/api/fetchNotion?id=${import.meta.env.VITE_DATABASE_EDUCATION_ID}&type=education`).then((res) => res.json());
  if (data?.error) throw new Error(data.error);
  const results = data.results ?? [];
  return results.map((page) => {
    const { properties } = page;
    return {
      title: properties.title?.title?.[0]?.plain_text ?? "Sin título",
      institution: getFullTextFromRichText(properties.institution),
      date: getFullTextFromRichText(properties.date),
      description: getFullTextFromRichText(properties.description),
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