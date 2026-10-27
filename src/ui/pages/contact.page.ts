import { expect } from '../../support/ui-expect';
import type { Locator, Page } from '@playwright/test';
import type {
  DeliveryOptions,
  ContactStateEvidence
} from '../models/contact';

export class ContactPage {
  constructor(private readonly page: Page) {}

  private get dialog(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Emitir nuevo documento',
      exact: true
    });
  }

  private get email(): Locator {
    return this.dialog.getByLabel(/^Correo de contacto/);
  }

  async configure(options: DeliveryOptions): Promise<void> {
    await expect(this.dialog).toBeVisible();

    await this.dialog.getByRole('radio', {
      name: options.channel === 'PORTAL' ? 'Portal' : 'Correo electrónico',
      exact: true
    }).check();

    await this.dialog.getByRole('checkbox', {
      name: 'Enviar copia al contacto',
      exact: true
    }).setChecked(options.sendCopy);
  }

  async fillEmail(value: string): Promise<string> {
    await expect(this.email).toBeEnabled();
    await this.email.fill(value);
    await expect(this.email).toHaveValue(value);

    return await this.email.inputValue();
  }

  async verifyAvailability(
    options: DeliveryOptions,
    enabled: boolean
  ): Promise<ContactStateEvidence> {
    const portal = this.dialog.getByRole('radio', {
      name: 'Portal',
      exact: true
    });

    const emailChannel = this.dialog.getByRole('radio', {
      name: 'Correo electrónico',
      exact: true
    });

    const copy = this.dialog.getByRole('checkbox', {
      name: 'Enviar copia al contacto',
      exact: true
    });

    if (options.channel === 'PORTAL') {
      await expect(portal).toBeChecked();
      await expect(emailChannel).not.toBeChecked();
    } else {
      await expect(emailChannel).toBeChecked();
      await expect(portal).not.toBeChecked();
    }

    if (options.sendCopy) {
      await expect(copy).toBeChecked();
    } else {
      await expect(copy).not.toBeChecked();
    }

    if (enabled) {
      await expect(this.email).toBeEnabled();
      await expect(this.email).toHaveAccessibleName('Correo de contacto *');
    } else {
      await expect(this.email).toBeDisabled();
      await expect(this.email).toHaveAccessibleName(
        'Correo de contacto (opcional)'
      );
    }

    return {
      portalSeleccionado: await portal.isChecked(),
      correoSeleccionado: await emailChannel.isChecked(),
      copiaSeleccionada: await copy.isChecked(),
      correoHabilitado: await this.email.isEnabled(),
      valor: await this.email.inputValue()
    };
  }

  async verifyEmpty(): Promise<string> {
    await expect(this.email).toHaveValue('');
    return await this.email.inputValue();
  }
}
