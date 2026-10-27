import type { Page } from '@playwright/test';
import type { CreateDocumentInput } from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { buildDocument } from '../../shared/data/document.factory';
import { DashboardPage } from '../pages/dashboard.page';
import { DocumentFormPage } from '../pages/document-form.page';
import { verifyAndReport } from './evidence';

export async function createPortalDocument(
  page: Page,
  fields: Record<string, string>,
  runId: string,
  attach: EvidenceWriter
): Promise<CreateDocumentInput> {
  const input = buildDocument(fields);

  await attach(JSON.stringify({
    datosDelDocumento: input,
    runId
  }, null, 2), 'application/json');

  await new DashboardPage(page).openNewDocument();
  await new DocumentFormPage(page).create(input);

  return input;
}

export async function verifyPortalCreationNotice(
  page: Page,
  folio: number,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    `Documento folio ${folio} emitido correctamente.`,
    () => new DashboardPage(page).verifyCreationNotice(folio),
    attach
  );
}

export async function verifyPortalCreatedRow(
  page: Page,
  input: CreateDocumentInput,
  attach: EvidenceWriter
): Promise<void> {
  const dashboard = new DashboardPage(page);

  await verifyAndReport(
    page,
    {
      folio: input.folio,
      tipoDte: input.tipoDte,
      rutReceptor: input.rutReceptor,
      monto: input.monto,
      fechaEmision: input.fechaEmision,
      estado: 'Pendiente'
    },
    async () => {
      await dashboard.filterByRut(input.rutReceptor);
      return dashboard.verifyPendingRow(input);
    },
    attach
  );

  await attach(
    await page.screenshot({ fullPage: true }),
    'image/png'
  );
}
