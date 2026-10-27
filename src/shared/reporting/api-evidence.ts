import type { APIResponse } from '@playwright/test';

export function apiResponseEvidence(
  response: APIResponse,
  text: string
): {
  status: number;
  url: string;
  diagnostico: {
    requestId: string | null;
    delayMs: string | null;
  };
  body: unknown;
} {
  let body: unknown = text;

  if (text !== '') {
    try {
      body = JSON.parse(text);
    } catch {
      // Si la respuesta no es JSON válido, conservamos el texto original.
    }
  }

  const headers = response.headers();

  return {
    status: response.status(),
    url: response.url(),
    diagnostico: {
      requestId: headers['x-request-id'] ?? null,
      delayMs: headers['x-lab-delay-ms'] ?? null
    },
    body
  };
}
