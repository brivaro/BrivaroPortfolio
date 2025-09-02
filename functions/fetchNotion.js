const { Client } = require("@notionhq/client");

const { NOTION_KEY, DATABASE_ID } = process.env;

exports.handler = async function () {
  try {
    if (!NOTION_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Falta NOTION_KEY en las variables de entorno." }),
      };
    }
    if (!DATABASE_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Falta DATABASE_ID en las variables de entorno." }),
      };
    }

    const notion = new Client({ auth: NOTION_KEY });

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { property: "isShown", checkbox: { equals: true } },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, stack: error.stack }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
