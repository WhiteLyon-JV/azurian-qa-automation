import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';

export class ContactErrorPage {
  constructor(private readonly page: Page) {}

  async verify(message: string): Promise<{
    campo: string;
    valor: string;
    ariaInvalid: string | null;
    mensaje: string;
  }> {
    const dialog = this.page.getByRole('dialog', {
      name: 'Emitir nuevo documento',
      exact: true
    });

    const email = dialog.getByLabel(/^Correo de contacto/);

    await expect(email).toBeEnabled();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription(message);

    const error = dialog.getByText(message, { exact: true });
    await expect(error).toHaveCount(1);
    await expect(error).toBeVisible();

    const validLabels = [
      'Tipo de documento tributario *',
      'Número de folio *',
      'RUT receptor *',
      'Monto total (CLP) *',
      'Fecha de emisión *'
    ];

    for (const label of validLabels) {
      await expect(
        dialog.getByLabel(label, { exact: true })
      ).not.toHaveAttribute('aria-invalid', 'true');
    }

    return {
      campo: 'contactEmail',
      valor: await email.inputValue(),
      ariaInvalid: await email.getAttribute('aria-invalid'),
      mensaje: await error.innerText()
    };
  }
}
