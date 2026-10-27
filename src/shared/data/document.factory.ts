import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import type { CreateDocumentInput } from '../models/document';

function generateRut(): string {
  const number = randomInt(10_000_000, 100_000_000);
  let sum = 0;
  let multiplier = 2;

  for (const digit of String(number).split('').reverse()) {
    sum += Number(digit) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const checkDigit =
    remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);

  const formatted = String(number).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formatted}-${checkDigit}`;
}

export function buildDocument(
  fields: Record<string, string>
): CreateDocumentInput {
  assert.deepEqual(
    Object.keys(fields).sort(),
    ['fechaEmision', 'monto', 'rutReceptor', 'tipoDte'],
    'La tabla debe contener exactamente los datos previstos.'
  );

  const tipoDte = fields.tipoDte;

  assert.ok(
    tipoDte === 'DTE 33' || tipoDte === 'DTE 34' || tipoDte === 'DTE 39',
    'El tipo de documento debe ser válido.'
  );

  assert.equal(fields.rutReceptor, 'único válido');

  const monto = Number(fields.monto);
  assert.ok(Number.isInteger(monto) && monto >= 1 && monto <= 999_999_999);

  return {
    tipoDte,
    folio: randomInt(9_000_000, 10_000_000),
    rutReceptor: generateRut(),
    monto,
    fechaEmision: fields.fechaEmision
  };
}

export function buildDocumentChanges(
  fields: Record<string, string>
): import('../models/document').UpdateDocumentInput {
  assert.deepEqual(
    Object.keys(fields).sort(),
    ['monto', 'observaciones'],
    'La tabla debe contener monto y observaciones.'
  );

  const monto = Number(fields.monto);

  assert.ok(
    Number.isInteger(monto) && monto >= 1 && monto <= 999_999_999,
    'El monto debe ser un entero dentro del rango permitido.'
  );

  assert.ok(
    fields.observaciones.length <= 300,
    'Las observaciones no deben superar los 300 caracteres.'
  );

  return {
    monto,
    observaciones: fields.observaciones
  };
}
