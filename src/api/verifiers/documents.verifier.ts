import { apiResponseEvidence } from '../../shared/reporting/api-evidence';
import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import type {
  CreateDocumentInput,
  DocumentRecord
} from '../../shared/models/document';

type AttachEvidence = (
  body: string,
  mediaType: string
) => void | Promise<void>;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const timestampPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export async function verifyCreatedDocument(
  response: APIResponse,
  input: CreateDocumentInput,
  attach: AttachEvidence
): Promise<DocumentRecord> {
  const text = await response.text();

  const fixedFields = {
    ...input,
    estado: 'PENDIENTE',
    contactEmail: null,
    sendCopy: false,
    deliveryChannel: 'PORTAL',
    observaciones: null,
    attachmentName: null
  };

  await attach(JSON.stringify({
    esperado: {
      status: 201,
      body: {
        ...fixedFields,
        id: 'UUID',
        createdAt: 'Fecha válida en formato ISO UTC',
        updatedAt: 'Fecha válida en formato ISO UTC'
      }
    },
    recibido: apiResponseEvidence(response, text)
  }, null, 2), 'application/json');

  assert.equal(response.status(), 201, 'La creación debe responder 201.');

  const body: unknown = JSON.parse(text);

  expect(body).toEqual({
    ...fixedFields,
    id: expect.stringMatching(uuidPattern),
    createdAt: expect.stringMatching(timestampPattern),
    updatedAt: expect.stringMatching(timestampPattern)
  });

  // La comparación completa anterior valida la estructura y sus tipos.
  const document = body as DocumentRecord;

  assert.ok(
    Number.isFinite(Date.parse(document.createdAt)),
    'createdAt debe representar una fecha válida.'
  );

  assert.ok(
    Number.isFinite(Date.parse(document.updatedAt)),
    'updatedAt debe representar una fecha válida.'
  );

  assert.ok(
    Date.parse(document.updatedAt) >= Date.parse(document.createdAt),
    'updatedAt no puede ser anterior a createdAt.'
  );

  return document;
}

export async function verifyRetrievedDocument(
  response: APIResponse,
  expected: DocumentRecord,
  attach: AttachEvidence
): Promise<void> {
  const text = await response.text();

  await attach(JSON.stringify({
    esperado: { status: 200, body: expected },
    recibido: apiResponseEvidence(response, text)
  }, null, 2), 'application/json');

  assert.equal(response.status(), 200, 'La consulta debe responder 200.');

  const body: unknown = JSON.parse(text);

  expect(body).toEqual(expected);
}

export async function verifyDocumentList(
  response: APIResponse,
  expected: DocumentRecord[],
  attach: AttachEvidence
): Promise<DocumentRecord[]> {
  const text = await response.text();
  const totalCount = response.headers()['x-total-count'];

  await attach(JSON.stringify({
    esperado: {
      status: 200,
      totalCount: String(expected.length),
      body: expected
    },
    recibido: { ...apiResponseEvidence(response, text), totalCount }
  }, null, 2), 'application/json');

  assert.equal(response.status(), 200, 'El listado debe responder 200.');
  assert.equal(
    totalCount,
    String(expected.length),
    'El total debe coincidir con los documentos filtrados.'
  );

  const body: unknown = JSON.parse(text);

  expect(body).toEqual(expected);

  return body as DocumentRecord[];
}

export async function verifyDocumentNotFound(
  response: APIResponse,
  attach: AttachEvidence
): Promise<void> {
  const expected = {
    error: 'El documento no existe en esta ejecución.',
    code: 'NOT_FOUND'
  };

  const text = await response.text();

  await attach(JSON.stringify({
    esperado: { status: 404, body: expected },
    recibido: apiResponseEvidence(response, text)
  }, null, 2), 'application/json');

  assert.equal(response.status(), 404, 'La consulta debe responder 404.');

  const body: unknown = JSON.parse(text);
  expect(body).toEqual(expected);
}

export async function verifyUpdatedDocument(
  response: APIResponse,
  previous: DocumentRecord,
  changes: import('../../shared/models/document').UpdateDocumentInput,
  attach: AttachEvidence
): Promise<DocumentRecord> {
  const text = await response.text();

  await attach(JSON.stringify({
    esperado: {
      status: 200,
      body: {
        ...previous,
        ...changes,
        updatedAt: 'Fecha ISO UTC válida, posterior a la actualización anterior'
      }
    },
    recibido: apiResponseEvidence(response, text)
  }, null, 2), 'application/json');

  assert.equal(response.status(), 200, 'La edición debe responder 200.');

  const body: unknown = JSON.parse(text);

  expect(body).toEqual({
    ...previous,
    ...changes,
    updatedAt: expect.stringMatching(timestampPattern)
  });

  const document = body as DocumentRecord;

  assert.ok(
    Number.isFinite(Date.parse(document.updatedAt)),
    'updatedAt debe representar una fecha válida.'
  );

  assert.ok(
    Date.parse(document.updatedAt) > Date.parse(previous.updatedAt),
    'updatedAt debe avanzar después de modificar el documento.'
  );

  return document;
}

export async function verifyDeletedDocument(
  response: APIResponse,
  attach: AttachEvidence
): Promise<void> {
  const body = await response.text();

  await attach(JSON.stringify({
    esperado: { status: 204, body: '' },
    recibido: apiResponseEvidence(response, body)
  }, null, 2), 'application/json');

  assert.equal(response.status(), 204, 'La eliminación debe responder 204.');
  assert.equal(body, '', 'La respuesta de eliminación no debe tener cuerpo.');
}
