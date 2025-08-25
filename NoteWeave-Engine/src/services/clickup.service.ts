import axios, { AxiosInstance } from 'axios';

export class ClickUpService {
  private api: AxiosInstance;

  constructor(apiToken: string) {
    this.api = axios.create({
      baseURL: 'https://api.clickup.com/api/v2/',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetches teams (workspaces) from ClickUp.
   * @returns A promise that resolves to an array of teams.
   */
  async getTeams(): Promise<any[]> {
    try {
      const response = await this.api.get('team');
      return response.data.teams;
    } catch (error) {
      console.error('Error fetching ClickUp teams:', error);
      throw new Error('Could not fetch ClickUp teams.');
    }
  }

  /**
   * Fetches tasks from a specific list in ClickUp.
   * @param listId The ID of the list.
   * @param archived Whether to include archived tasks.
   * @returns A promise that resolves to an array of tasks.
   */
  async getTasks(listId: string, archived = false): Promise<any[]> {
    try {
      const response = await this.api.get(`list/${listId}/task`, {
        params: {
          archived,
        },
      });
      return response.data.tasks;
    } catch (error) {
      console.error(`Error fetching tasks from list ${listId}:`, error);
      throw new Error('Could not fetch ClickUp tasks.');
    }
  }

  /**
   * Fetches a single task by its ID.
   * @param taskId The ID of the task.
   * @returns A promise that resolves to the task object.
   */
  async getTask(taskId: string): Promise<any> {
    try {
      const response = await this.api.get(`task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw new Error('Could not fetch ClickUp task.');
    }
  }
}