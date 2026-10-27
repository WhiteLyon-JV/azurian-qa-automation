import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { apiResponseEvidence } from '../../shared/reporting/api-evidence';

export async function verifyInvalidDocument(
  response: APIResponse,
  field: string,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(
    field === 'monto' || field === 'rutReceptor',
    `Campo de validación no contemplado: ${field}`
  );

  const messages = {
    monto: 'El monto es obligatorio.',
    rutReceptor: 'El dígito verificador del RUT no es válido.'
  };

  const expected = {
    error: 'Datos de entrada inválidos. Revisa los campos indicados.',
    code: 'VALIDATION_ERROR',
    details: [
      {
        field,
        message: messages[field]
      }
    ]
  };

  const text = await response.text();

  await attach(JSON.stringify({
    esperado: {
      status: 400,
      body: expected
    },
    recibido: apiResponseEvidence(response, text)
  }, null, 2), 'application/json');

  assert.equal(
    response.status(),
    400,
    'Los datos inválidos deben responder 400.'
  );

  const body: unknown = JSON.parse(text);
  expect(body).toEqual(expected);
}
