export type ContactRequestType = "info_request" | "preorder_request";

export interface ContactRequestPayload {
  name: string;
  email: string;
  message: string;
  type: ContactRequestType;
}

export interface ContactSubmissionResponse {
  type: ContactRequestType;
  recipient: string;
}
