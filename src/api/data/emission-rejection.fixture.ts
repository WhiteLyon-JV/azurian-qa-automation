import type { APIResponse } from '@playwright/test';
import type {
  CreateDocumentInput,
  DocumentRecord
} from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { buildDocument } from '../../shared/data/document.factory';
import { DocumentsValidationClient } from '../clients/documents-validation.client';

async function submitCandidate(
  client: DocumentsValidationClient,
  payload: CreateDocumentInput,
  runId: string,
  authenticated: boolean,
  attach: EvidenceWriter
): Promise<APIResponse> {
  await attach(JSON.stringify({
    solicitud: {
      metodo: 'POST',
      ruta: '/api/documents',
      runId,
      autenticada: authenticated,
      datosEnviados: payload
    }
  }, null, 2), 'application/json');

  return client.createCandidate(payload);
}

export async function submitDuplicateDocument(
  client: DocumentsValidationClient,
  existing: DocumentRecord,
  runId: string,
  attach: EvidenceWriter
): Promise<APIResponse> {
  const payload: CreateDocumentInput = {
    tipoDte: existing.tipoDte,
    folio: existing.folio,
    rutReceptor: existing.rutReceptor,
    monto: existing.monto,
    fechaEmision: existing.fechaEmision
  };

  return submitCandidate(client, payload, runId, true, attach);
}

export async function submitUnauthenticatedDocument(
  client: DocumentsValidationClient,
  runId: string,
  attach: EvidenceWriter
): Promise<APIResponse> {
  const payload = buildDocument({
    tipoDte: 'DTE 33',
    rutReceptor: 'único válido',
    monto: '450000',
    fechaEmision: '2026-09-28'
  });

  return submitCandidate(client, payload, runId, false, attach);
}
