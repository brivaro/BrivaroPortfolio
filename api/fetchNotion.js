import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const { NOTION_KEY, DATABASE_ID } = process.env;

    if (!NOTION_KEY) {
      return res.status(500).json({ error: "Falta NOTION_KEY en las variables de entorno." });
    }
    if (!DATABASE_ID) {
      return res.status(500).json({ error: "Falta DATABASE_ID en las variables de entorno." });
    }

    const notion = new Client({ auth: NOTION_KEY });

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { property: "isShown", checkbox: { equals: true } },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}


