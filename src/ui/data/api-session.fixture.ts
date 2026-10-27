import { request } from '@playwright/test';
import { AuthSession } from '../../api/auth/auth-session';
import { DocumentsClient } from '../../api/clients/documents.client';
import { DocumentSendClient } from '../../api/clients/document-send.client';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { environment } from '../../config/environment';
import { timeouts } from '../../config/timeouts';

interface PortalApiClients {
  documents: DocumentsClient;
  send: DocumentSendClient;
}

export async function withPortalApiSession<T>(
  runId: string,
  attach: EvidenceWriter,
  prepare: (clients: PortalApiClients) => Promise<T>
): Promise<T> {
  const context = await request.newContext({
    baseURL: environment.baseUrl,
    extraHTTPHeaders: {
      'x-lab-run-id': runId
    },
    timeout: timeouts.apiRequest
  });

  try {
    const session = new AuthSession(context, attach);

    return await prepare({
      documents: new DocumentsClient(context, session),
      send: new DocumentSendClient(context, session)
    });
  } finally {
    await context.dispose();
  }
}
