import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import type { DocumentRecord } from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { apiResponseEvidence } from '../../shared/reporting/api-evidence';

export async function verifyAcceptedDocument(
  response: APIResponse,
  previous: DocumentRecord,
  attach: EvidenceWriter
): Promise<DocumentRecord> {
  assert.equal(previous.estado, 'PENDIENTE');
  assert.ok(previous.monto <= 10_000_000);

  const text = await response.text();

  await attach(JSON.stringify({
    esperado: {
      status: 200,
      body: {
        ...previous,
        estado: 'ACEPTADO',
        updatedAt: 'Fecha ISO UTC válida y posterior a la anterior'
      }
    },
    recibido: apiResponseEvidence(response, text)
  }, null, 2), 'application/json');

  assert.equal(
    response.status(),
    200,
    'El envío al SII debe responder 200.'
  );

  const body: unknown = JSON.parse(text);

  expect(body).toEqual({
    ...previous,
    estado: 'ACEPTADO',
    updatedAt: expect.stringMatching(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    )
  });

  const document = body as DocumentRecord;

  assert.ok(
    Number.isFinite(Date.parse(document.updatedAt)),
    'updatedAt debe representar una fecha válida.'
  );

  assert.ok(
    Date.parse(document.updatedAt) > Date.parse(previous.updatedAt),
    'updatedAt debe avanzar después del envío.'
  );

  return document;
}
