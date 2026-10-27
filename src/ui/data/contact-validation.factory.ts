import assert from 'node:assert/strict';
import { buildDocument } from '../../shared/data/document.factory';
import { buildDeliveryOptions } from './contact.factory';
import type { DeliveryOptions } from '../models/contact';
import type { DocumentFormValues } from '../models/document-form';

export interface ContactValidationCase {
  options: DeliveryOptions;
  values: DocumentFormValues;
  email: string;
}

export function buildContactValidationCase(
  channel: string,
  copy: string,
  email: string
): ContactValidationCase {
  const options = buildDeliveryOptions(channel, copy);

  assert.ok(
    options.channel === 'EMAIL' || options.sendCopy,
    'Este caso debe utilizar una configuración que requiera correo.'
  );

  const document = buildDocument({
    tipoDte: 'DTE 33',
    rutReceptor: 'único válido',
    monto: '450000',
    fechaEmision: '2026-09-28'
  });

  return {
    options,
    email,
    values: {
      tipoDte: document.tipoDte,
      folio: String(document.folio),
      rutReceptor: document.rutReceptor,
      monto: String(document.monto),
      fechaEmision: document.fechaEmision
    }
  };
}
