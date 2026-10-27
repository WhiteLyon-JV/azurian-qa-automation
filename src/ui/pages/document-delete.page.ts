import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';
import type { CreateDocumentInput } from '../../shared/models/document';
import { DashboardPage } from './dashboard.page';

export interface AbsenceEvidence {
  matchingRows: number;
  message: string;
  total: string;
}

export class DocumentDeletePage extends DashboardPage {
  constructor(private readonly browserPage: Page) {
    super(browserPage);
  }

  async deleteAndConfirm(input: CreateDocumentInput): Promise<void> {
    const row = this.documentRow(input);

    await expect(row).toHaveCount(1);

    await row.getByRole('button', {
      name: `Eliminar folio ${input.folio}`,
      exact: true
    }).click();

    const dialog = this.browserPage.getByRole('alertdialog', {
      name: 'Eliminar documento',
      exact: true
    });

    await expect(dialog).toBeVisible();

    const description =
      `¿Confirmas que deseas eliminar el documento ${input.tipoDte} ` +
      `folio #${input.folio} del RUT ${input.rutReceptor}? ` +
      'Esta acción no se puede deshacer.';

    await expect(
      dialog.getByText(description, { exact: true })
    ).toBeVisible();

    await dialog.getByRole('button', {
      name: 'Eliminar documento',
      exact: true
    }).click();

    await expect(dialog).toBeHidden();
  }

  async verifyNotice(folio: number): Promise<string> {
    const message = `Documento folio ${folio} eliminado correctamente.`;

    const notice = this.browserPage.getByRole('status').filter({
      hasText: message
    });

    await expect(notice).toHaveText(message);

    return await notice.innerText();
  }

  async verifyAbsent(input: CreateDocumentInput): Promise<AbsenceEvidence> {
    const row = this.documentRow(input);

    await expect(row).toHaveCount(0);

    const table = this.browserPage.getByRole('table', {
      name: 'Tabla de Documentos Tributarios',
      exact: true
    });

    const emptyMessage = table.getByRole('cell', {
      name: 'No se encontraron documentos DTE para los criterios seleccionados.',
      exact: true
    });

    await expect(emptyMessage).toBeVisible();
    await expect(table.getByRole('cell')).toHaveCount(1);

    const total = this.browserPage.getByText(
      '0 documentos encontrados',
      { exact: true }
    );

    await expect(total).toBeVisible();

    return {
      matchingRows: await row.count(),
      message: await emptyMessage.innerText(),
      total: await total.innerText()
    };
  }

  async verifyAfterReload(
    input: CreateDocumentInput
  ): Promise<AbsenceEvidence> {
    await this.browserPage.reload();
    await this.filterByRut(input.rutReceptor);

    return this.verifyAbsent(input);
  }
}
