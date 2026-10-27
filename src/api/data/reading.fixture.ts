import { DocumentsClient } from '../clients/documents.client';
import { buildDocument } from '../../shared/data/document.factory';
import { verifyCreatedDocument } from '../verifiers/documents.verifier';
import type { DocumentFilters } from '../clients/documents.client';
import type {
  CreateDocumentInput,
  DocumentRecord
} from '../../shared/models/document';

export interface ReadingFixture {
  filters: DocumentFilters;
  expectedDocuments: DocumentRecord[];
  targetFolio: number;
}

type AttachEvidence = (
  body: string,
  mediaType: string
) => void | Promise<void>;

export async function prepareReadingDocuments(
  client: DocumentsClient,
  attach: AttachEvidence
): Promise<ReadingFixture> {
  const base = buildDocument({
    tipoDte: 'DTE 33',
    rutReceptor: 'único válido',
    monto: '450000',
    fechaEmision: '2026-09-28'
  });

  const inputs: CreateDocumentInput[] = [
    base,
    {
      ...base,
      folio: base.folio - 1,
      monto: 780000
    },
    {
      ...base,
      tipoDte: 'DTE 34',
      folio: base.folio - 2,
      monto: 120000
    }
  ];

  const documents: DocumentRecord[] = [];

  for (const input of inputs) {
    const response = await client.create(input);
    const document = await verifyCreatedDocument(response, input, attach);
    documents.push(document);
  }

  return {
    filters: {
      rut: base.rutReceptor.replace(/[.-]/g, ''),
      tipoDte: 'DTE 33'
    },
    expectedDocuments: documents
      .filter(document => document.tipoDte === 'DTE 33')
      .sort((a, b) => b.folio - a.folio),
    targetFolio: base.folio - 1
  };
}
