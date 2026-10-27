import type { DocumentsClient, DocumentFilters } from '../clients/documents.client';
import type { DocumentRecord } from '../../shared/models/document';
import {
  verifyRetrievedDocument,
  verifyDocumentNotFound,
  verifyDocumentList
} from './documents.verifier';

type AttachEvidence = Parameters<typeof verifyRetrievedDocument>[2];

export async function verifyPersistedDocument(
  client: DocumentsClient,
  expected: DocumentRecord,
  attach: AttachEvidence
): Promise<void> {
  const response = await client.getById(expected.id);
  await verifyRetrievedDocument(response, expected, attach);
}

export async function verifyMissingDocument(
  client: DocumentsClient,
  id: string,
  attach: AttachEvidence
): Promise<void> {
  const response = await client.getById(id);
  await verifyDocumentNotFound(response, attach);
}

export async function verifyEmptyDocumentList(
  client: DocumentsClient,
  filters: DocumentFilters,
  attach: AttachEvidence
): Promise<void> {
  const response = await client.list(filters);
  await verifyDocumentList(response, [], attach);
}
