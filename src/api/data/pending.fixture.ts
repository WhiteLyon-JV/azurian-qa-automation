import { DocumentsClient } from '../clients/documents.client';
import { buildDocument } from '../../shared/data/document.factory';
import { verifyCreatedDocument } from '../verifiers/documents.verifier';
import type { DocumentRecord } from '../../shared/models/document';

type AttachEvidence = (
  body: string,
  mediaType: string
) => void | Promise<void>;

export async function preparePendingDocument(
  client: DocumentsClient,
  attach: AttachEvidence
): Promise<DocumentRecord> {
  const input = buildDocument({
    tipoDte: 'DTE 33',
    rutReceptor: 'único válido',
    monto: '450000',
    fechaEmision: '2026-09-28'
  });

  const response = await client.create(input);

  return verifyCreatedDocument(response, input, attach);
}
