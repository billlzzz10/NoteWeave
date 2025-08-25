import { Client } from '@notionhq/client';
import { NotionLoader } from "@langchain/community/document_loaders/fs/notion";

export class NotionService {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ auth: apiKey });
  }

  /**
   * Fetches pages from a Notion database.
   * @param databaseId The ID of the Notion database.
   * @returns A promise that resolves to an array of pages.
   */
  async getPagesFromDatabase(databaseId: string): Promise<any[]> {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
      });
      return response.results;
    } catch (error) {
      console.error('Error fetching pages from Notion database:', error);
      throw new Error('Could not fetch pages from Notion.');
    }
  }

  /**
   * Fetches the content of a specific page as markdown.
   * @param pageId The ID of the Notion page.
   * @returns A promise that resolves to the markdown content of the page.
   */
  async getPageContent(pageId: string): Promise<string> {
    try {
      // Using NotionLoader from langchain to simplify markdown conversion
      const loader = new NotionLoader({
        client: this.client,
        id: pageId,
        type: "page",
      });

      const docs = await loader.load();
      return docs.map(doc => doc.pageContent).join('\n\n');
     } catch (error) {
      console.error('Error fetching page content from Notion:', error);
      throw new Error('Could not fetch page content.');
    }
  }

  /**
   * Searches for pages and databases in Notion.
   * @param query The search query.
   * @returns A promise that resolves to the search results.
   */
  async search(query: string): Promise<any[]> {
    try {
      const response = await this.client.search({ query });
      return response.results;
    } catch (error) {
      console.error('Error searching Notion:', error);
      throw new Error('Could not perform search in Notion.');
    }
  }
}