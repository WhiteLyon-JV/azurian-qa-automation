import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { DocumentDeletePage } from '../pages/document-delete.page';
import {
  verifyPortalDeleteNotice,
  verifyPortalDocumentAbsence
} from '../verifiers/deleting.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

When(
  'elimino el documento desde el portal y confirmo la acción',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await new DocumentDeletePage(
      this.page
    ).deleteAndConfirm(this.createdDocument);
  }
);

Then(
  'veo el aviso de eliminación exitosa',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await verifyPortalDeleteNotice(
      this.page,
      this.createdDocument.folio,
      evidenceWriter(this)
    );
  }
);

Then(
  'la fila del documento desaparece y el listado filtrado queda vacío',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await verifyPortalDocumentAbsence(
      this.page,
      this.createdDocument,
      false,
      evidenceWriter(this)
    );
  }
);

Then(
  'el documento sigue ausente después de recargar el portal',
  async function (this: TestWorld) {
    assert.ok(this.createdDocument);

    await verifyPortalDocumentAbsence(
      this.page,
      this.createdDocument,
      true,
      evidenceWriter(this)
    );
  }
);
