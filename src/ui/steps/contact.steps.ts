import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { DeliveryOptions } from '../models/contact';
import {
  configurePortalContact,
  disablePortalContact,
  verifyPortalContactAvailability,
  fillPortalContactEmail,
  verifyPortalContactEmpty
} from '../verifiers/contact.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

interface ContactWorld extends TestWorld {
  deliveryOptions?: DeliveryOptions;
}

When(
  'configuro el formulario con canal {string} y envío de copia {string}',
  async function (this: ContactWorld, channel: string, copy: string) {
    this.deliveryOptions = await configurePortalContact(
      this.page,
      channel,
      copy
    );
  }
);

Then(
  'el correo de contacto queda {string}',
  async function (this: ContactWorld, state: string) {
    assert.ok(this.deliveryOptions);

    await verifyPortalContactAvailability(
      this.page,
      this.deliveryOptions,
      state,
      evidenceWriter(this)
    );
  }
);

When(
  'escribo un correo de contacto válido',
  async function (this: TestWorld) {
    await fillPortalContactEmail(
      this.page,
      evidenceWriter(this)
    );
  }
);

When(
  'cambio a entrega por portal sin enviar copia',
  async function (this: ContactWorld) {
    this.deliveryOptions = await disablePortalContact(this.page);
  }
);

Then(
  'el campo de correo de contacto queda vacío',
  async function (this: TestWorld) {
    await verifyPortalContactEmpty(
      this.page,
      evidenceWriter(this)
    );
  }
);
