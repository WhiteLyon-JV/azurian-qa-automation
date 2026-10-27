import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';
import type {
  CreateDocumentInput,
  DocumentRecord,
  UpdateDocumentInput
} from '../../shared/models/document';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { preparePortalPendingDocument } from '../data/pending.fixture';
import { DashboardPage } from '../pages/dashboard.page';
import { DocumentEditPage } from '../pages/document-edit.page';
import { verifyAndReport } from './evidence';

export async function preparePendingPortalDocument(
  page: Page,
  runId: string,
  attach: EvidenceWriter
): Promise<DocumentRecord> {
  const document = await preparePortalPendingDocument(runId, attach);
  await verifyPortalUpdatedRow(page, document, attach);
  return document;
}

export async function editPortalDocument(
  page: Page,
  original: DocumentRecord,
  changes: UpdateDocumentInput,
  attach: EvidenceWriter
): Promise<CreateDocumentInput> {
  await attach(JSON.stringify({
    documentoOriginal: original,
    cambiosSolicitados: changes
  }, null, 2), 'application/json');

  await new DocumentEditPage(page).edit(original, changes);

  return {
    tipoDte: original.tipoDte,
    folio: original.folio,
    rutReceptor: changes.rutReceptor ?? original.rutReceptor,
    monto: changes.monto ?? original.monto,
    fechaEmision: changes.fechaEmision ?? original.fechaEmision
  };
}

export async function verifyPortalEditNotice(
  page: Page,
  folio: number,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    `Documento folio ${folio} actualizado correctamente.`,
    () => new DocumentEditPage(page).verifyNotice(folio),
    attach
  );
}

export async function verifyPortalUpdatedRow(
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
}

export async function verifyPortalEditPersistence(
  page: Page,
  input: CreateDocumentInput,
  changes: UpdateDocumentInput,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(typeof changes.observaciones === 'string');

  const observations = changes.observaciones;

  await verifyAndReport(
    page,
    {
      folio: input.folio,
      tipoDte: input.tipoDte,
      rutReceptor: input.rutReceptor,
      monto: String(input.monto),
      fechaEmision: input.fechaEmision,
      observaciones: observations,
      estado: 'Pendiente'
    },
    () => new DocumentEditPage(page).verifyAfterReload(input, observations),
    attach
  );

  await attach(
    await page.screenshot({ fullPage: true }),
    'image/png'
  );
}
