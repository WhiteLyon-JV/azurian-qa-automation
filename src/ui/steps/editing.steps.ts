import { Given, When, Then } from '@cucumber/cucumber';
import type { DataTable } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { buildDocumentChanges } from '../../shared/data/document.factory';
import { evidenceWriter } from '../../shared/reporting/evidence';
import {
  preparePendingPortalDocument,
  editPortalDocument,
  verifyPortalEditNotice,
  verifyPortalUpdatedRow,
  verifyPortalEditPersistence
} from '../verifiers/editing.verifier';
import { TestWorld } from '../../support/world';

Given(
  'que tengo un documento propio pendiente en el portal',
  async function (this: TestWorld) {
    this.createdDocument = await preparePendingPortalDocument(
      this.page,
      this.runId,
      evidenceWriter(this)
    );
  }
);

When(
  'modifico sus datos desde el portal:',
  async function (this: TestWorld, table: DataTable) {
    assert.ok(this.createdDocument);

    this.documentChanges = buildDocumentChanges(table.rowsHash());

    this.documentInput = await editPortalDocument(
      this.page,
      this.createdDocument,
      this.documentChanges,
      evidenceWriter(this)
    );
  }
);

Then(
  'veo el aviso de edición exitosa',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await verifyPortalEditNotice(
      this.page,
      this.createdDocument.folio,
      evidenceWriter(this)
    );
  }
);

Then(
  'la fila muestra los datos actualizados',
  async function (this: TestWorld) {
    assert.ok(this.documentInput);

    await verifyPortalUpdatedRow(
      this.page,
      this.documentInput,
      evidenceWriter(this)
    );
  }
);

Then(
  'los cambios permanecen después de recargar el portal',
  async function (this: TestWorld) {
    assert.ok(this.documentInput);
    assert.ok(this.documentChanges);

    await verifyPortalEditPersistence(
      this.page,
      this.documentInput,
      this.documentChanges,
      evidenceWriter(this)
    );
  }
);
