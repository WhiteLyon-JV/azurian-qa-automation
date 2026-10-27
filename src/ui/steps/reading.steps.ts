import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { preparePortalReadingDocuments } from '../data/reading.fixture';
import { DocumentListPage } from '../pages/document-list.page';
import {
  verifyPortalDocumentList,
  verifyPortalDocumentDetail
} from '../verifiers/reading.verifier';
import { selectDocumentByFolio } from '../../shared/verifiers/document-selection';
import { TestWorld } from '../../support/world';
import { evidenceWriter } from '../../shared/reporting/evidence';

Given(
  'que tengo varios documentos propios del mismo receptor en el portal',
  async function (this: TestWorld) {
    this.readingFixture = await preparePortalReadingDocuments(
      this.runId,
      evidenceWriter(this)
    );
  }
);

When(
  'filtro en el portal por su receptor y tipo',
  async function (this: TestWorld) {
    assert.ok(this.readingFixture);

    await new DocumentListPage(
      this.page
    ).filterByReceiverAndType(this.readingFixture.filters);
  }
);

Then(
  'la tabla muestra los documentos esperados',
  async function (this: TestWorld) {
    assert.ok(this.readingFixture);

    await verifyPortalDocumentList(
      this.page,
      this.readingFixture.expectedDocuments,
      evidenceWriter(this)
    );
  }
);

When(
  'abro el detalle del documento elegido por su folio',
  async function (this: TestWorld) {
    assert.ok(this.readingFixture);

    this.selectedDocument = selectDocumentByFolio(
      this.readingFixture.expectedDocuments,
      this.readingFixture.targetFolio
    );

    await new DocumentListPage(
      this.page
    ).openDetail(this.selectedDocument);
  }
);

Then(
  'veo los datos esperados en el detalle del documento',
  async function (this: TestWorld) {
    assert.ok(this.selectedDocument);

    await verifyPortalDocumentDetail(
      this.page,
      this.selectedDocument,
      evidenceWriter(this)
    );
  }
);
