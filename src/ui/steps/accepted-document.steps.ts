import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { AcceptedDocumentPage } from '../pages/accepted-document.page';
import {
  prepareAcceptedPortalDocument,
  verifyPortalAcceptedDetail,
  verifyPortalAcceptedRow,
  verifyPortalAcceptedActions
} from '../verifiers/accepted-document.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

Given(
  'que tengo un documento propio aceptado en el portal',
  async function (this: TestWorld) {
    this.createdDocument = await prepareAcceptedPortalDocument(
      this.page,
      this.runId,
      evidenceWriter(this)
    );
  }
);

Then(
  'su fila muestra el estado aceptado y sus datos',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await verifyPortalAcceptedRow(
      this.page,
      this.createdDocument,
      evidenceWriter(this)
    );
  }
);

Then(
  'sus acciones de editar, eliminar y enviar al SII están deshabilitadas',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await verifyPortalAcceptedActions(
      this.page,
      this.createdDocument,
      evidenceWriter(this)
    );
  }
);

Then(
  'puedo consultar el detalle completo del documento aceptado',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await verifyPortalAcceptedDetail(
      this.page,
      this.createdDocument,
      evidenceWriter(this)
    );
  }
);

When(
  'recargo el portal y busco el documento aceptado',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await new AcceptedDocumentPage(this.page).reloadAndFind(
      this.createdDocument
    );
  }
);
