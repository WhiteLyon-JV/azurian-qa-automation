import { Given, When, Then } from '@cucumber/cucumber';
import type { DataTable } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { DocumentsClient } from '../clients/documents.client';
import { preparePendingDocument } from '../data/pending.fixture';
import { buildDocumentChanges } from '../../shared/data/document.factory';
import {
  verifyUpdatedDocument
} from '../verifiers/documents.verifier';
import { verifyPersistedDocument } from '../verifiers/consultation.verifier';
import { TestWorld } from '../../support/world';

Given(
  'que tengo un documento propio pendiente',
  async function (this: TestWorld) {
    assert.ok(this.token, 'Debe existir una sesión válida.');

    this.createdDocument = await preparePendingDocument(
      new DocumentsClient(this.request, this.token),
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);

When(
  'actualizo sus datos:',
  async function (this: TestWorld, table: DataTable) {
    assert.ok(this.token);
    assert.ok(this.createdDocument);

    this.documentChanges = buildDocumentChanges(table.rowsHash());

    this.updateResponse = await new DocumentsClient(
      this.request,
      this.token
    ).update(this.createdDocument.id, this.documentChanges);
  }
);

Then(
  'el documento refleja los cambios y conserva los demás datos',
  async function (this: TestWorld) {
    assert.ok(this.updateResponse);
    assert.ok(this.createdDocument);
    assert.ok(this.documentChanges);

    this.updatedDocument = await verifyUpdatedDocument(
      this.updateResponse,
      this.createdDocument,
      this.documentChanges,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);

Then(
  'al consultarlo nuevamente los cambios persisten',
  async function (this: TestWorld) {
    assert.ok(this.token);
    assert.ok(this.updatedDocument);

    await verifyPersistedDocument(
      new DocumentsClient(this.request, this.token),
      this.updatedDocument,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);
