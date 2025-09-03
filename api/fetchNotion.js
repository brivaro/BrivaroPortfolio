import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const { NOTION_KEY } = process.env;
    // Permite pasar el id por query param
    const database_id = req.query.id;

    if (!NOTION_KEY) {
      return res.status(500).json({ error: "Falta la clave de NOTION en las variables de entorno." });
    }
    if (!database_id) {
      return res.status(500).json({ error: "Falta el id de la BD en las variables de entorno." });
    }

    const notion = new Client({ auth: NOTION_KEY });

    // El filtro isShown solo para proyectos y experiencia
    let filter = undefined;
    if (req.query.type === "projects" || req.query.type === "experience") {
      filter = { property: "isShown", checkbox: { equals: true } };
    }

    const response = await notion.databases.query({
      database_id,
      ...(filter ? { filter } : {}),
      sorts: [
        {
          property: "order", // Cambia esto por el nombre de la propiedad por la que quieres ordenar
          direction: "descending", // o "descending"
        },
      ],
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}


