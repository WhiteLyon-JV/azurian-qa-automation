import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';
import type { DocumentFilters } from '../../api/clients/documents.client';
import type { DocumentRecord } from '../../shared/models/document';
import { DashboardPage } from './dashboard.page';

export class DocumentListPage extends DashboardPage {
  constructor(private readonly browserPage: Page) {
    super(browserPage);
  }

  async filterByReceiverAndType(filters: DocumentFilters): Promise<void> {
    await this.browserPage.getByLabel(
      'Tipo DTE:',
      { exact: true }
    ).selectOption(filters.tipoDte);

    await this.browserPage.getByLabel(
      'Buscar por RUT Receptor',
      { exact: true }
    ).fill(filters.rut);

    const [response] = await Promise.all([
      this.browserPage.waitForResponse(response => {
        const url = new URL(response.url());

        return response.request().method() === 'GET' &&
          url.pathname === '/api/documents' &&
          url.searchParams.get('rut') === filters.rut &&
          url.searchParams.get('tipoDte') === filters.tipoDte;
      }),
      this.browserPage.getByRole('button', {
        name: 'Buscar',
        exact: true
      }).click()
    ]);

    expect(response.status()).toBe(200);

    await expect(
      this.browserPage.getByRole('status', {
        name: 'Cargando documentos',
        exact: true
      })
    ).toBeHidden();
  }

  async verifyDocuments(documents: DocumentRecord[]): Promise<string[][]> {
    const table = this.browserPage.getByRole('table', {
      name: 'Tabla de Documentos Tributarios',
      exact: true
    });

    await expect(table.getByRole('row')).toHaveCount(
      documents.length + 1
    );

    const rows: string[][] = [];

    for (const document of documents) {
      rows.push(await this.verifyPendingRow(document));
    }

    return rows;
  }

  async openDetail(document: DocumentRecord): Promise<void> {
    const row = this.documentRow(document);

    await expect(row).toHaveCount(1);

    await row.getByRole('button', {
      name: `Ver detalle de folio ${document.folio}`,
      exact: true
    }).click();
  }
}
