import { apiResponseEvidence } from '../../shared/reporting/api-evidence';
import assert from 'node:assert/strict';
import type { APIResponse } from '@playwright/test';

type AttachEvidence = (
  body: string,
  mediaType: string
) => void | Promise<void>;

export async function verifyLogin(
  response: APIResponse,
  email: string,
  attach: AttachEvidence
): Promise<string> {
  const expectedUser = {
    id: 'user-azurian-01',
    email,
    name: 'Administrador Azurian',
    role: 'QA Lab Participant'
  };

  const text = await response.text();

  await attach(JSON.stringify({
    esperado: {
      status: 200,
      body: {
        token: 'JWT con tres segmentos no vacíos',
        expiresIn: 'Número entero positivo de segundos',
        user: expectedUser
      }
    },
    recibido: apiResponseEvidence(response, text)
  }, null, 2), 'application/json');

  assert.equal(response.status(), 200, 'El login debe responder 200.');

  const body: unknown = JSON.parse(text);

  assert.ok(
    typeof body === 'object' && body !== null && !Array.isArray(body),
    'La respuesta debe ser un objeto.'
  );

  assert.ok('token' in body);
  assert.ok('expiresIn' in body);
  assert.ok('user' in body);

  assert.deepEqual(
    Object.keys(body).sort(),
    ['expiresIn', 'token', 'user'],
    'La respuesta debe contener exactamente los campos del contrato.'
  );

  assert.equal(typeof body.token, 'string');
  assert.ok(typeof body.token === 'string');
  assert.match(body.token, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);

  assert.ok(
    typeof body.expiresIn === 'number' &&
    Number.isInteger(body.expiresIn) &&
    body.expiresIn > 0,
    'La vigencia debe ser un entero positivo.'
  );

  assert.deepEqual(body.user, expectedUser, 'El usuario debe coincidir completo.');

  return body.token;
}
