import { When, Then } from '@cucumber/cucumber';
import type { DataTable } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { DocumentsClient } from '../clients/documents.client';
import { buildDocument } from '../../shared/data/document.factory';
import {
  verifyCreatedDocument
} from '../verifiers/documents.verifier';
import { verifyPersistedDocument } from '../verifiers/consultation.verifier';
import { TestWorld } from '../../support/world';

When(
  'emito un documento tributario con los siguientes datos:',
  async function (this: TestWorld, table: DataTable) {
    assert.ok(this.token, 'Debe existir una sesión válida.');

    this.documentInput = buildDocument(table.rowsHash());

    this.createResponse = await new DocumentsClient(
      this.request,
      this.token
    ).create(this.documentInput);
  }
);

Then(
  'el documento se crea correctamente en estado pendiente',
  async function (this: TestWorld) {
    assert.ok(this.createResponse, 'Debe existir una respuesta de creación.');
    assert.ok(this.documentInput, 'Deben existir los datos enviados.');

    this.createdDocument = await verifyCreatedDocument(
      this.createResponse,
      this.documentInput,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);

Then(
  'al consultarlo obtengo exactamente el documento creado',
  async function (this: TestWorld) {
    assert.ok(this.token, 'Debe existir una sesión válida.');
    assert.ok(this.createdDocument, 'Debe existir el documento creado.');

    await verifyPersistedDocument(
      new DocumentsClient(this.request, this.token),
      this.createdDocument,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);
