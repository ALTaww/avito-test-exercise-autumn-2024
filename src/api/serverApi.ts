import { $serverHost } from ".";

class ServerApi {
  async uploadFile(
    formData: FormData,
    signal: AbortSignal
  ): Promise<{ url: string }> {
    const { data } = await $serverHost.post("/upload", formData, { signal });
    return data;
  }
}

export const serverApi = new ServerApi();
