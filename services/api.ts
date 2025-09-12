
import { getSession } from "next-auth/react";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  private async getHeaders(includeAuth = true) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const session = await getSession();
    /*  if (session?.accessToken) {
        headers["Authorization"] = `Bearer ${session.accessToken}`;
      }*/
    }

    return headers;
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, body: any, includeAuth = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, body: any, includeAuth = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<T> {
    const headers = await this.getHeaders(includeAuth);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
