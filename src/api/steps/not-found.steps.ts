import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { DocumentsClient } from '../clients/documents.client';
import { verifyDocumentNotFound } from '../verifiers/documents.verifier';
import { TestWorld } from '../../support/world';

When(
  'consulto un documento que no existe en mi ejecución',
  async function (this: TestWorld) {
    assert.ok(this.token, 'Debe existir una sesión válida.');

    this.detailResponse = await new DocumentsClient(
      this.request,
      this.token
    ).getById(randomUUID());
  }
);

Then(
  'recibo el error completo de documento inexistente',
  async function (this: TestWorld) {
    assert.ok(this.detailResponse, 'Debe existir una respuesta de consulta.');

    await verifyDocumentNotFound(
      this.detailResponse,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);
