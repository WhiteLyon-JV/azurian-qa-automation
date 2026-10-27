import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';
import type { DocumentRecord } from '../../shared/models/document';

export class DocumentDetailPage {
  constructor(private readonly page: Page) {}

  async verify(document: DocumentRecord): Promise<{
    expected: string[];
    actual: string;
  }> {
    const dialog = this.page.getByRole('dialog', {
      name: `Detalle DTE - Folio #${document.folio}`,
      exact: true
    });

    await expect(dialog).toBeVisible();

    const dates = await this.page.evaluate(
      ({ createdAt, updatedAt }) => ({
        created: new Date(createdAt).toLocaleString('es-CL'),
        updated: new Date(updatedAt).toLocaleString('es-CL')
      }),
      {
        createdAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    );

    const states = {
      PENDIENTE: 'Pendiente',
      ACEPTADO: 'Aceptado',
      RECHAZADO: 'Rechazado'
    };

    const expected = [
      `Tipo: ${document.tipoDte}`,
      `RUT Receptor: ${document.rutReceptor}`,
      `Monto: $ ${document.monto.toLocaleString('es-CL')} CLP`,
      `Fecha Emisión: ${document.fechaEmision}`,
      `Estado: ${states[document.estado]}`,
      `Canal: ${document.deliveryChannel}`,
      `Copia al contacto: ${document.sendCopy ? 'Sí' : 'No'}`,
      `Creado: ${dates.created}`,
      `Última modificación: ${dates.updated}`
    ];

    const optionalFields = [
      { label: 'Correo de contacto:', value: document.contactEmail },
      { label: 'Adjunto:', value: document.attachmentName },
      { label: 'Observaciones:', value: document.observaciones }
    ];

    for (const field of optionalFields) {
      if (field.value !== null) {
        expected.push(`${field.label} ${field.value}`);
      } else {
        await expect(
          dialog.getByText(field.label, { exact: true })
        ).toHaveCount(0);
      }
    }

    for (const text of expected) {
      await expect(
        dialog.getByText(text, { exact: true })
      ).toBeVisible();
    }

    return {
      expected,
      actual: await dialog.innerText()
    };
  }
}
