import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { DocumentsClient } from '../clients/documents.client';
import { prepareReadingDocuments } from '../data/reading.fixture';
import {
  verifyDocumentList,
  verifyRetrievedDocument
} from '../verifiers/documents.verifier';
import { selectDocumentByFolio } from '../../shared/verifiers/document-selection';
import { TestWorld } from '../../support/world';

Given(
  'que tengo varios documentos propios del mismo receptor y distintos tipos',
  async function (this: TestWorld) {
    assert.ok(this.token, 'Debe existir una sesión válida.');

    this.readingFixture = await prepareReadingDocuments(
      new DocumentsClient(this.request, this.token),
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);

When(
  'busco sus documentos por receptor y tipo',
  async function (this: TestWorld) {
    assert.ok(this.token);
    assert.ok(this.readingFixture);

    this.listResponse = await new DocumentsClient(
      this.request,
      this.token
    ).list(this.readingFixture.filters);
  }
);

Then(
  'el listado contiene exactamente los documentos esperados',
  async function (this: TestWorld) {
    assert.ok(this.listResponse);
    assert.ok(this.readingFixture);

    const documents = await verifyDocumentList(
      this.listResponse,
      this.readingFixture.expectedDocuments,
      (body, mediaType) => this.attach(body, mediaType)
    );

    this.selectedDocument = selectDocumentByFolio(
      documents,
      this.readingFixture.targetFolio
    );
  }
);

When(
  'consulto uno de ellos por su folio',
  async function (this: TestWorld) {
    assert.ok(this.token);
    assert.ok(this.selectedDocument);

    this.detailResponse = await new DocumentsClient(
      this.request,
      this.token
    ).getById(this.selectedDocument.id);
  }
);

Then(
  'el detalle coincide completamente con el documento esperado',
  async function (this: TestWorld) {
    assert.ok(this.detailResponse);
    assert.ok(this.selectedDocument);

    await verifyRetrievedDocument(
      this.detailResponse,
      this.selectedDocument,
      (body, mediaType) => this.attach(body, mediaType)
    );
  }
);
