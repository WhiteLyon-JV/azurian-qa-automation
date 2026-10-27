import { When, Then } from '@cucumber/cucumber';
import type { APIResponse } from '@playwright/test';
import assert from 'node:assert/strict';
import { DocumentsValidationClient } from '../clients/documents-validation.client';
import { submitInvalidDocument } from '../data/validation.fixture';
import { verifyInvalidDocument } from '../verifiers/validation.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

interface ValidationWorld extends TestWorld {
  validationResponse?: APIResponse;
}

When(
  'intento emitir un documento con {string}',
  async function (this: ValidationWorld, condition: string) {
    assert.ok(this.token, 'Debe existir una sesión válida.');

    this.validationResponse = await submitInvalidDocument(
      new DocumentsValidationClient(this.request, this.token),
      condition,
      this.runId,
      evidenceWriter(this)
    );
  }
);

Then(
  'se rechaza la emisión por datos inválidos en {string}',
  async function (this: ValidationWorld, field: string) {
    assert.ok(this.validationResponse);

    await verifyInvalidDocument(
      this.validationResponse,
      field,
      evidenceWriter(this)
    );
  }
);
