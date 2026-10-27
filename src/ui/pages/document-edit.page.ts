import assert from 'node:assert/strict';
import { expect } from '../../support/ui-expect';
import type { Locator, Page } from '@playwright/test';
import type {
  CreateDocumentInput,
  UpdateDocumentInput
} from '../../shared/models/document';
import { DashboardPage } from './dashboard.page';

export class DocumentEditPage extends DashboardPage {
  constructor(private readonly browserPage: Page) {
    super(browserPage);
  }

  private async openEditor(input: CreateDocumentInput): Promise<Locator> {
    const row = this.documentRow(input);
    await expect(row).toHaveCount(1);

    await row.getByRole('button', {
      name: `Editar folio ${input.folio}`,
      exact: true
    }).click();

    const dialog = this.browserPage.getByRole('dialog', {
      name: `Editar documento - Folio #${input.folio}`,
      exact: true
    });

    await expect(dialog).toBeVisible();

    return dialog;
  }

  async edit(
    input: CreateDocumentInput,
    changes: UpdateDocumentInput
  ): Promise<void> {
    assert.ok(typeof changes.monto === 'number');
    assert.ok(typeof changes.observaciones === 'string');

    const dialog = await this.openEditor(input);

    await expect(
      dialog.getByLabel('Número de folio *', { exact: true })
    ).toBeDisabled();

    await expect(
      dialog.getByLabel('Tipo de documento tributario *', { exact: true })
    ).toBeDisabled();

    await dialog.getByLabel(
      'Monto total (CLP) *',
      { exact: true }
    ).fill(String(changes.monto));

    await dialog.getByLabel(
      'Observaciones',
      { exact: true }
    ).fill(changes.observaciones);

    await dialog.getByRole('button', {
      name: 'Guardar cambios',
      exact: true
    }).click();

    await expect(dialog).toBeHidden();
  }

  async verifyNotice(folio: number): Promise<string> {
    const message = `Documento folio ${folio} actualizado correctamente.`;

    const notice = this.browserPage.getByRole('status').filter({
      hasText: message
    });

    await expect(notice).toHaveText(message);

    return await notice.innerText();
  }

  async verifyAfterReload(
    input: CreateDocumentInput,
    observations: string
  ): Promise<{
    cells: string[];
    monto: string;
    observaciones: string;
  }> {
    await this.browserPage.reload();
    await this.filterByRut(input.rutReceptor);

    const cells = await this.verifyPendingRow(input);
    const dialog = await this.openEditor(input);

    const amountField = dialog.getByLabel(
      'Monto total (CLP) *',
      { exact: true }
    );

    const observationsField = dialog.getByLabel(
      'Observaciones',
      { exact: true }
    );

    await expect(amountField).toHaveValue(String(input.monto));
    await expect(observationsField).toHaveValue(observations);

    await expect(
      dialog.getByLabel('Número de folio *', { exact: true })
    ).toHaveValue(String(input.folio));

    await expect(
      dialog.getByLabel('Tipo de documento tributario *', { exact: true })
    ).toHaveValue(input.tipoDte);

    const evidence = {
      cells,
      monto: await amountField.inputValue(),
      observaciones: await observationsField.inputValue()
    };

    await dialog.getByRole('button', {
      name: 'Cerrar modal',
      exact: true
    }).click();

    await expect(dialog).toBeHidden();

    return evidence;
  }
}
