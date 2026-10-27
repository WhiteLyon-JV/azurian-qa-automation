import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { DocumentsClient } from '../clients/documents.client';
import {
  verifyDeletedDocument
} from '../verifiers/documents.verifier';
import {
  verifyMissingDocument,
  verifyEmptyDocumentList
} from '../verifiers/consultation.verifier';
import { TestWorld } from '../../support/world';

interface DeletingWorld extends TestWorld {
  deleteResponse?: import('@playwright/test').APIResponse;
}

When(
  'elimino el documento',
  async function (this: DeletingWorld) {
    assert.ok(this.token);
    assert.ok(this.createdDocument);

    this.deleteResponse = await new DocumentsClient(
      this.request,
      this.token
    ).deleteById(this.createdDocument.id);
  }
);

Then(
  'la eliminación se confirma sin contenido',
  async function (this: DeletingWorld) {
    assert.ok(this.deleteResponse);

    await verifyDeletedDocument(
      this.deleteResponse,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);

Then(
  'al consultar el documento eliminado recibo el error completo de documento inexistente',
  async function (this: TestWorld) {
    assert.ok(this.token);
    assert.ok(this.createdDocument);

    await verifyMissingDocument(
      new DocumentsClient(this.request, this.token),
      this.createdDocument.id,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);

Then(
  'el documento ya no aparece en el listado de su receptor y tipo',
  async function (this: TestWorld) {
    assert.ok(this.token);
    assert.ok(this.createdDocument);

    await verifyEmptyDocumentList(
      new DocumentsClient(this.request, this.token),
      {
        rut: this.createdDocument.rutReceptor,
        tipoDte: this.createdDocument.tipoDte
      },
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);
