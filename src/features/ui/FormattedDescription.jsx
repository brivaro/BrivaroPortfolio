/* eslint-disable react/prop-types */

function FormattedDescription({ text }) {
  // Si no hay texto, no renderizar nada.
  if (!text) {
    return null;
  }

  // 1. Divide el texto por el caracter '●' para obtener cada punto.
  // 2. Filtra cualquier elemento vacío que pueda resultar del split.
  // 3. Mapea cada parte para darle formato.
  // 4. Une todo con saltos de línea.
  const formattedHtml = text
    .split('●')
    .filter(part => part.trim() !== '')
    .map(part => {
      const trimmedPart = part.trim();
      const colonIndex = trimmedPart.indexOf(':');

      // Si se encuentra un ':', separa el título del cuerpo
      if (colonIndex !== -1) {
        const title = trimmedPart.substring(0, colonIndex).trim();
        const body = trimmedPart.substring(colonIndex + 1).trim();
        // Envuelve el título en <strong> y reconstruye el string
        return `<strong>● ${title}:</strong> ${body}`;
      }
      
      // Si no hay ':', devuelve la parte tal cual (como fallback)
      return `● ${trimmedPart}`;
    })
    .join('<br /><br />'); // Une cada punto con un doble salto de línea

  return (
    <div
      className="text-sm text-gray7 lg:text-base dark:text-gray4"
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}

export default FormattedDescription;