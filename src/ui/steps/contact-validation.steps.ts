import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import {
  buildContactValidationCase
} from '../data/contact-validation.factory';
import type {
  ContactValidationCase
} from '../data/contact-validation.factory';
import {
  submitInvalidContactForm,
  verifyInvalidContactEmail
} from '../verifiers/contact-validation.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

interface ContactValidationWorld extends TestWorld {
  contactValidationCase?: ContactValidationCase;
}

When(
  'intento emitir desde el portal con canal {string}, copia {string} y correo {string}',
  async function (
    this: ContactValidationWorld,
    channel: string,
    copy: string,
    email: string
  ) {
    this.contactValidationCase = buildContactValidationCase(
      channel,
      copy,
      email
    );

    await submitInvalidContactForm(
      this.page,
      this.contactValidationCase,
      evidenceWriter(this)
    );
  }
);

Then(
  'veo el error {string} asociado al correo de contacto',
  async function (this: ContactValidationWorld, reason: string) {
    assert.ok(this.contactValidationCase);

    await verifyInvalidContactEmail(
      this.page,
      this.contactValidationCase,
      reason,
      evidenceWriter(this)
    );
  }
);
