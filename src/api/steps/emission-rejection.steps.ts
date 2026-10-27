import { When, Then } from '@cucumber/cucumber';
import type { APIResponse } from '@playwright/test';
import assert from 'node:assert/strict';
import { DocumentsValidationClient } from '../clients/documents-validation.client';
import {
  submitDuplicateDocument,
  submitUnauthenticatedDocument
} from '../data/emission-rejection.fixture';
import {
  verifyDuplicateFolio,
  verifyMissingAuthorization
} from '../verifiers/emission-rejection.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

interface EmissionRejectionWorld extends TestWorld {
  rejectionResponse?: APIResponse;
}

When(
  'intento emitir otro documento con el mismo folio',
  async function (this: EmissionRejectionWorld) {
    assert.ok(this.token);
    assert.ok(this.createdDocument);

    this.rejectionResponse = await submitDuplicateDocument(
      new DocumentsValidationClient(this.request, this.token),
      this.createdDocument,
      this.runId,
      evidenceWriter(this)
    );
  }
);

Then(
  'se rechaza la emisión por folio duplicado',
  async function (this: EmissionRejectionWorld) {
    assert.ok(this.rejectionResponse);

    await verifyDuplicateFolio(
      this.rejectionResponse,
      evidenceWriter(this)
    );
  }
);

When(
  'intento emitir un documento sin autenticar la petición',
  async function (this: EmissionRejectionWorld) {
    this.rejectionResponse = await submitUnauthenticatedDocument(
      new DocumentsValidationClient(this.request),
      this.runId,
      evidenceWriter(this)
    );
  }
);

Then(
  'se rechaza la emisión por falta de autenticación',
  async function (this: EmissionRejectionWorld) {
    assert.ok(this.rejectionResponse);

    await verifyMissingAuthorization(
      this.rejectionResponse,
      evidenceWriter(this)
    );
  }
);
