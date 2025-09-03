// Función auxiliar para unir los fragmentos de rich_text
function getFullTextFromRichText(property) {
  if (!property || !property.rich_text) {
    return "";
  }
  return property.rich_text.map((t) => t.plain_text).join("");
}

export { getFullTextFromRichText };