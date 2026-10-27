import assert from 'node:assert/strict';
import type { Page } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import type { TestAttachment } from '../models/attachment';
import { AttachmentPage } from '../pages/attachment.page';
import { verifyAndReport } from './evidence';

export async function selectPortalAttachment(
  page: Page,
  file: TestAttachment,
  attach: EvidenceWriter
): Promise<void> {
  await attach(JSON.stringify({
    archivo: file.name,
    bytes: file.buffer.byteLength,
    mimeType: file.mimeType
  }, null, 2), 'application/json');

  await new AttachmentPage(page).select(file);
}

export async function verifyPortalAttachmentAccepted(
  page: Page,
  file: TestAttachment,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    [{
      name: file.name,
      size: file.buffer.byteLength,
      mimeType: file.mimeType
    }],
    () => new AttachmentPage(page).verifyAccepted(file),
    attach
  );

  await attach(await page.screenshot({
    fullPage: true
  }), 'image/png');
}

export async function verifyPortalAttachmentError(
  page: Page,
  reason: string,
  attach: EvidenceWriter
): Promise<void> {
  assert.ok(
    reason === 'extensión no permitida' ||
    reason === 'tamaño excedido',
    `Motivo de rechazo desconocido: ${reason}`
  );

  const messages = {
    'extensión no permitida':
      'El documento de respaldo debe ser un archivo .pdf, .xml o .txt.',
    'tamaño excedido':
      'El documento de respaldo no puede superar los 2 MB.'
  };

  const message = messages[reason];

  await verifyAndReport(
    page,
    {
      campo: 'attachmentName',
      mensaje: message,
      ariaInvalid: 'true'
    },
    () => new AttachmentPage(page).verifyError(message),
    attach
  );
}

export async function verifyPortalAttachmentEmpty(
  page: Page,
  attach: EvidenceWriter
): Promise<void> {
  await verifyAndReport(
    page,
    {
      valor: '',
      archivosSeleccionados: []
    },
    () => new AttachmentPage(page).verifyEmpty(),
    attach
  );
}
