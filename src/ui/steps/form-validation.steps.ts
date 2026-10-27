import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { InvalidFormCase } from '../models/document-form';
import { buildInvalidFormCase } from '../data/invalid-form.factory';
import {
  submitInvalidPortalForm,
  verifyPortalFormError,
  verifyPortalFormAvailable
} from '../verifiers/form-validation.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

interface FormValidationWorld extends TestWorld {
  invalidFormCase?: InvalidFormCase;
}

When(
  'intento emitir desde el portal un documento con {string}',
  async function (this: FormValidationWorld, condition: string) {
    this.invalidFormCase = buildInvalidFormCase(condition);

    await submitInvalidPortalForm(
      this.page,
      this.invalidFormCase,
      evidenceWriter(this)
    );
  }
);

Then(
  'el formulario muestra el error correspondiente junto a {string}',
  async function (this: FormValidationWorld, field: string) {
    assert.ok(this.invalidFormCase);

    await verifyPortalFormError(
      this.page,
      this.invalidFormCase,
      field,
      evidenceWriter(this)
    );
  }
);

Then(
  'el formulario permanece abierto para corregir los datos',
  async function (this: TestWorld) {
    await verifyPortalFormAvailable(
      this.page,
      evidenceWriter(this)
    );
  }
);
