import axios, {
  AxiosError,
  type AxiosInstance,
} from "axios";
import { HTTP_CLIENT_TIMEOUT_MS } from "../constants/http.js";

export class HttpClientError extends Error {
  public readonly statusCode: number | null;

  public constructor(message: string, statusCode: number | null = null) {
    super(message);

    this.statusCode = statusCode;
  }
}

class HttpClient {
  private readonly client: AxiosInstance;

  public constructor() {
    this.client = axios.create({
      headers: {
        Accept: "application/json",
      },
      timeout: HTTP_CLIENT_TIMEOUT_MS,
    });

    this.client.interceptors.response.use(
      (response) => response,
      this.handleError,
    );
  }

  public async get<ResponseBody>(url: string): Promise<ResponseBody> {
    const response = await this.client.get<ResponseBody>(url);

    return response.data;
  }

  private readonly handleError = (error: AxiosError): never => {
    const statusCode = error.response?.status ?? null;
    const method = error.config?.method?.toUpperCase() ?? "HTTP";
    const url = error.config?.url ?? "unknown URL";

    throw new HttpClientError(
      `${method} ${url} failed${statusCode ? ` with ${statusCode}` : ""}`,
      statusCode,
    );
  };
}

export const httpClient = new HttpClient();
