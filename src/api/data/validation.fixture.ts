import type { APIResponse } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { DocumentsValidationClient } from '../clients/documents-validation.client';
import { buildInvalidDocument } from './invalid-document.factory';

export async function submitInvalidDocument(
  client: DocumentsValidationClient,
  condition: string,
  runId: string,
  attach: EvidenceWriter
): Promise<APIResponse> {
  const payload = buildInvalidDocument(condition);

  await attach(JSON.stringify({
    solicitud: {
      metodo: 'POST',
      ruta: '/api/documents',
      runId,
      datosEnviados: payload
    },
    condicion: condition
  }, null, 2), 'application/json');

  return client.createCandidate(payload);
}
