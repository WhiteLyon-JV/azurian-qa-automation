import type { Page } from '@playwright/test';
import type { CreateDocumentInput } from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { DocumentDeletePage } from '../pages/document-delete.page';
import { verifyAndReport } from './evidence';

export async function verifyPortalDeleteNotice(
  page: Page,
  folio: number,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    `Documento folio ${folio} eliminado correctamente.`,
    () => new DocumentDeletePage(page).verifyNotice(folio),
    attach
  );
}

export async function verifyPortalDocumentAbsence(
  page: Page,
  input: CreateDocumentInput,
  afterReload: boolean,
  attach: EvidenceWriter
): Promise<void> {
  const portal = new DocumentDeletePage(page);

  await verifyAndReport(
    page,
    {
      folioEliminado: input.folio,
      receptorFiltrado: input.rutReceptor,
      despuesDeRecargar: afterReload,
      matchingRows: 0,
      message: 'No se encontraron documentos DTE para los criterios seleccionados.',
      total: '0 documentos encontrados'
    },
    () => afterReload
      ? portal.verifyAfterReload(input)
      : portal.verifyAbsent(input),
    attach
  );

  if (afterReload) {
    await attach(
      await page.screenshot({ fullPage: true }),
      'image/png'
    );
  }
}
