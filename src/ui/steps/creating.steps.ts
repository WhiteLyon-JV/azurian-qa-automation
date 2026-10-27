import { When, Then } from '@cucumber/cucumber';
import type { DataTable } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { evidenceWriter } from '../../shared/reporting/evidence';
import {
  createPortalDocument,
  verifyPortalCreationNotice,
  verifyPortalCreatedRow
} from '../verifiers/creating.verifier';
import { TestWorld } from '../../support/world';

When(
  'emito desde el portal un documento con los siguientes datos:',
  async function (this: TestWorld, table: DataTable) {
    this.documentInput = await createPortalDocument(
      this.page,
      table.rowsHash(),
      this.runId,
      evidenceWriter(this)
    );
  }
);

Then(
  'veo el aviso de creación exitosa',
  async function (this: TestWorld) {
    assert.ok(this.documentInput);

    await verifyPortalCreationNotice(
      this.page,
      this.documentInput.folio,
      evidenceWriter(this)
    );
  }
);

Then(
  'la fila del documento muestra todos sus datos y el estado pendiente',
  async function (this: TestWorld) {
    assert.ok(this.documentInput);

    await verifyPortalCreatedRow(
      this.page,
      this.documentInput,
      evidenceWriter(this)
    );
  }
);
