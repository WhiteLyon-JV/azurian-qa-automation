import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';
import type { DocumentRecord } from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { preparePortalAcceptedDocument } from '../data/accepted.fixture';
import { AcceptedDocumentPage } from '../pages/accepted-document.page';
import { DocumentListPage } from '../pages/document-list.page';
import { verifyPortalDocumentDetail } from './reading.verifier';
import { verifyAndReport } from './evidence';

export async function prepareAcceptedPortalDocument(
  page: Page,
  runId: string,
  attach: EvidenceWriter
): Promise<DocumentRecord> {
  const document = await preparePortalAcceptedDocument(runId, attach);
  await new AcceptedDocumentPage(page).find(document);
  return document;
}

export async function verifyPortalAcceptedDetail(
  page: Page,
  document: DocumentRecord,
  attach: EvidenceWriter
): Promise<void> {
  assert.equal(document.estado, 'ACEPTADO');
  await new DocumentListPage(page).openDetail(document);
  await verifyPortalDocumentDetail(page, document, attach);
}

export async function verifyPortalAcceptedRow(
  page: Page,
  document: DocumentRecord,
  attach: EvidenceWriter
): Promise<void> {
  assert.equal(document.estado, 'ACEPTADO');

  await verifyAndReport(
    page,
    [
      `#${document.folio}`,
      document.tipoDte,
      document.rutReceptor,
      `$ ${document.monto.toLocaleString('es-CL')} CLP`,
      document.fechaEmision,
      'Aceptado'
    ],
    () => new AcceptedDocumentPage(page).verifyRow(document),
    attach
  );
}

export async function verifyPortalAcceptedActions(
  page: Page,
  document: DocumentRecord,
  attach: EvidenceWriter
): Promise<void> {
  assert.equal(document.estado, 'ACEPTADO');

  await verifyAndReport(
    page,
    [
      {
        accion: `Editar folio ${document.folio}`,
        habilitada: false
      },
      {
        accion: `Eliminar folio ${document.folio}`,
        habilitada: false
      },
      {
        accion: `Enviar al SII folio ${document.folio}`,
        habilitada: false
      },
      {
        accion: `Ver detalle de folio ${document.folio}`,
        habilitada: true
      }
    ],
    () => new AcceptedDocumentPage(page).verifyActions(document),
    attach
  );

  await attach(
    await page.screenshot({ fullPage: true }),
    'image/png'
  );
}
