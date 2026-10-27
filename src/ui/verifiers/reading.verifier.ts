import { timeouts } from '../../config/timeouts';
import type { Page } from '@playwright/test';
import type { DocumentRecord } from '../../shared/models/document';
import { DocumentListPage } from '../pages/document-list.page';
import { DocumentDetailPage } from '../pages/document-detail.page';

type AttachEvidence = (
  body: string | Buffer,
  mediaType: string
) => void | Promise<void>;

export async function verifyPortalDocumentList(
  page: Page,
  documents: DocumentRecord[],
  attach: AttachEvidence
): Promise<void> {
  const expected = documents.map(document => ({
    folio: document.folio,
    tipoDte: document.tipoDte,
    rutReceptor: document.rutReceptor,
    monto: document.monto,
    fechaEmision: document.fechaEmision,
    estado: 'Pendiente'
  }));

  try {
    await new DocumentListPage(page).verifyDocuments(documents);
  } finally {
    const actual = await page.getByRole('table', {
      name: 'Tabla de Documentos Tributarios',
      exact: true
    }).innerText({ timeout: timeouts.evidence }).catch(() => 'Tabla no disponible');

    await attach(JSON.stringify({
      esperado: expected,
      recibido: actual
    }, null, 2), 'application/json');
  }
}

export async function verifyPortalDocumentDetail(
  page: Page,
  document: DocumentRecord,
  attach: AttachEvidence
): Promise<void> {
  try {
    const evidence = await new DocumentDetailPage(page).verify(document);

    await attach(JSON.stringify({
      esperado: evidence.expected,
      recibido: evidence.actual
    }, null, 2), 'application/json');

    await attach(
      await page.screenshot({ fullPage: true }),
      'image/png'
    );
  } catch (error) {
    const actual = await page.getByRole('dialog').innerText({
      timeout: timeouts.evidence
    }).catch(() => 'Diálogo no disponible');

    await attach(JSON.stringify({
      esperado: document,
      recibido: actual
    }, null, 2), 'application/json');

    throw error;
  }
}
