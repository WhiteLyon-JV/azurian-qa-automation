import { expect } from '../../support/ui-expect';
import type { Locator, Page } from '@playwright/test';
import type { CreateDocumentInput } from '../../shared/models/document';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async openNewDocument(): Promise<void> {
    await this.page.getByRole('button', {
      name: 'Nuevo documento',
      exact: true
    }).click();
  }

  async verifyCreationNotice(folio: number): Promise<string> {
    const message = `Documento folio ${folio} emitido correctamente.`;
    const notice = this.page.getByRole('status').filter({
      hasText: message
    });

    await expect(notice).toHaveText(message);

    return await notice.innerText();
  }

  async filterByRut(rut: string): Promise<void> {
    await this.page.getByLabel(
      'Buscar por RUT Receptor',
      { exact: true }
    ).fill(rut);

    const [response] = await Promise.all([
      this.page.waitForResponse(response => {
        const url = new URL(response.url());

        return response.request().method() === 'GET' &&
          url.pathname === '/api/documents' &&
          url.searchParams.get('rut') === rut;
      }),
      this.page.getByRole('button', {
        name: 'Buscar',
        exact: true
      }).click()
    ]);

    expect(response.status()).toBe(200);

    await expect(
      this.page.getByRole('status', {
        name: 'Cargando documentos',
        exact: true
      })
    ).toBeHidden();
  }

  documentRow(input: CreateDocumentInput): Locator {
    const amount = `$ ${input.monto.toLocaleString('es-CL')} CLP`;

    return this.page.getByRole('table', {
      name: 'Tabla de Documentos Tributarios',
      exact: true
    }).getByRole('row')
      .filter({
        has: this.page.getByRole('cell', {
          name: `#${input.folio}`,
          exact: true
        })
      })
      .filter({
        has: this.page.getByRole('cell', {
          name: input.rutReceptor,
          exact: true
        })
      })
      .filter({
        has: this.page.getByRole('cell', {
          name: amount,
          exact: true
        })
      });
  }

  async verifyPendingRow(input: CreateDocumentInput): Promise<string[]> {
    const row = this.documentRow(input);

    await expect(row).toHaveCount(1);

    const expectedCells = [
      `#${input.folio}`,
      input.tipoDte,
      input.rutReceptor,
      `$ ${input.monto.toLocaleString('es-CL')} CLP`,
      input.fechaEmision,
      'Pendiente'
    ];

    for (const text of expectedCells) {
      await expect(
        row.getByRole('cell', { name: text, exact: true })
      ).toBeVisible();
    }

    return await row.getByRole('cell').allTextContents();
  }
}
