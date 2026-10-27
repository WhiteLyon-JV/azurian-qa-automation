import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';
import type { CreateDocumentInput } from '../../shared/models/document';

export class DocumentFormPage {
  constructor(private readonly page: Page) {}

  async create(input: CreateDocumentInput): Promise<void> {
    const dialog = this.page.getByRole('dialog', {
      name: 'Emitir nuevo documento',
      exact: true
    });

    await expect(dialog).toBeVisible();

    await dialog.getByLabel(
      'Tipo de documento tributario *',
      { exact: true }
    ).selectOption(input.tipoDte);

    await dialog.getByLabel(
      'Número de folio *',
      { exact: true }
    ).fill(String(input.folio));

    await dialog.getByLabel(
      'RUT receptor *',
      { exact: true }
    ).fill(input.rutReceptor);

    await dialog.getByLabel(
      'Monto total (CLP) *',
      { exact: true }
    ).fill(String(input.monto));

    await dialog.getByLabel(
      'Fecha de emisión *',
      { exact: true }
    ).fill(input.fechaEmision);

    await dialog.getByRole('button', {
      name: 'Guardar y emitir',
      exact: true
    }).click();

    await expect(dialog).toBeHidden();
  }
}
