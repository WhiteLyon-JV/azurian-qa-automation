import assert from 'node:assert/strict';
import type { DeliveryOptions } from '../models/contact';

export const contactExampleEmail = 'contacto@ejemplo.cl';

export function buildDeliveryOptions(
  channel: string,
  copy: string
): DeliveryOptions {
  assert.ok(channel === 'Portal' || channel === 'Correo electrónico');
  assert.ok(copy === 'sí' || copy === 'no');

  return {
    channel: channel === 'Portal' ? 'PORTAL' : 'EMAIL',
    sendCopy: copy === 'sí'
  };
}
