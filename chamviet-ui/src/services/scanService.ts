import axiosClient from "../api/axiosClient";
import type { AiResponse } from "../types/scan";

/**
 * Send an image to the AI backend for wooden card recognition.
 *
 * @param file     - The (preferably compressed) image file.
 * @param signal   - Optional AbortSignal to cancel the request on unmount.
 * @returns          Parsed AI response containing predictions.
 */
export async function scanImage(
  file: File,
  signal?: AbortSignal,
): Promise<AiResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post<AiResponse>(
    "/ai/ai-connection",
    formData,
    { signal },
  );

  return data;
}
