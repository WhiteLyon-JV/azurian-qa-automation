import assert from 'node:assert/strict';
import type { DocumentRecord } from '../models/document';

export function selectDocumentByFolio(
  documents: DocumentRecord[],
  folio: number
): DocumentRecord {
  const matches = documents.filter(
    document => document.folio === folio
  );

  assert.equal(
    matches.length,
    1,
    `Debe existir exactamente un documento con folio ${folio}.`
  );

  const document = matches.find(item => item.folio === folio);
  assert.ok(document);

  return document;
}
