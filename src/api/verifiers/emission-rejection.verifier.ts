import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { apiResponseEvidence } from '../../shared/reporting/api-evidence';

interface ExpectedRejection {
  status: number;
  body: {
    error: string;
    code: string;
  };
  wwwAuthenticate?: string;
}

async function verifyRejection(
  response: APIResponse,
  expected: ExpectedRejection,
  attach: EvidenceWriter
): Promise<void> {
  const text = await response.text();
  const wwwAuthenticate = response.headers()['www-authenticate'];

  await attach(JSON.stringify({
    esperado: expected,
    recibido: {
      ...apiResponseEvidence(response, text),
      wwwAuthenticate
    }
  }, null, 2), 'application/json');

  assert.equal(response.status(), expected.status);

  const body: unknown = JSON.parse(text);
  expect(body).toEqual(expected.body);

  if (expected.wwwAuthenticate !== undefined) {
    assert.equal(wwwAuthenticate, expected.wwwAuthenticate);
  }
}

export async function verifyDuplicateFolio(
  response: APIResponse,
  attach: EvidenceWriter
): Promise<void> {
  await verifyRejection(response, {
    status: 409,
    body: {
      error: 'Ya existe un documento con ese folio para esta ejecución.',
      code: 'DUPLICATE_FOLIO'
    }
  }, attach);
}

export async function verifyMissingAuthorization(
  response: APIResponse,
  attach: EvidenceWriter
): Promise<void> {
  await verifyRejection(response, {
    status: 401,
    body: {
      error: 'Falta el encabezado Authorization: Bearer <token>.',
      code: 'UNAUTHORIZED'
    },
    wwwAuthenticate: 'Bearer'
  }, attach);
}
