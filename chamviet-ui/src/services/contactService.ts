import { buildApiUrl } from "../utils/apiBase";
import type { ApiResponseEnvelope } from "../types/productApi";
import type { ContactRequestPayload, ContactSubmissionResponse } from "../types/contact";

export async function submitContactRequest(
  payload: ContactRequestPayload,
): Promise<ContactSubmissionResponse> {
  const response = await fetch(
    buildApiUrl(
      import.meta.env.VITE_API_BASE_URL as string | undefined,
      "/api/public/contact/requests",
    ),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = (await response.json()) as ApiResponseEnvelope<ContactSubmissionResponse>;
  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.error || data.message || "Không gửi được thông tin. Vui lòng thử lại.");
  }

  return data.data;
}
