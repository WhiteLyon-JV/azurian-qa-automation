import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';
import type { DocumentRecord } from '../../shared/models/document';
import { DashboardPage } from './dashboard.page';

export class AcceptedDocumentPage extends DashboardPage {
  constructor(private readonly browserPage: Page) {
    super(browserPage);
  }

  async find(document: DocumentRecord): Promise<void> {
    await this.filterByRut(document.rutReceptor);
  }

  async reloadAndFind(document: DocumentRecord): Promise<void> {
    await this.browserPage.reload();
    await this.find(document);
  }

  async verifyRow(document: DocumentRecord): Promise<string[]> {
    const row = this.documentRow(document);
    await expect(row).toHaveCount(1);

    const expectedCells = [
      `#${document.folio}`,
      document.tipoDte,
      document.rutReceptor,
      `$ ${document.monto.toLocaleString('es-CL')} CLP`,
      document.fechaEmision,
      'Aceptado'
    ];

    const actual: string[] = [];

    for (const text of expectedCells) {
      const cell = row.getByRole('cell', {
        name: text,
        exact: true
      });

      await expect(cell).toBeVisible();
      actual.push(await cell.innerText());
    }

    return actual;
  }

  async verifyActions(document: DocumentRecord): Promise<{
    accion: string;
    habilitada: boolean;
  }[]> {
    const row = this.documentRow(document);
    await expect(row).toHaveCount(1);

    const actions = [
      {
        name: `Editar folio ${document.folio}`,
        enabled: false
      },
      {
        name: `Eliminar folio ${document.folio}`,
        enabled: false
      },
      {
        name: `Enviar al SII folio ${document.folio}`,
        enabled: false
      },
      {
        name: `Ver detalle de folio ${document.folio}`,
        enabled: true
      }
    ];

    const actual: {
      accion: string;
      habilitada: boolean;
    }[] = [];

    for (const action of actions) {
      const button = row.getByRole('button', {
        name: action.name,
        exact: true
      });

      await expect(button).toBeVisible();

      if (action.enabled) {
        await expect(button).toBeEnabled();
      } else {
        await expect(button).toBeDisabled();
      }

      actual.push({
        accion: action.name,
        habilitada: await button.isEnabled()
      });
    }

    return actual;
  }
}
