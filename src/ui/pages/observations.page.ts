import assert from 'node:assert/strict';
import { expect } from '../../support/ui-expect';
import type { Locator, Page } from '@playwright/test';

interface ObservationsEvidence {
  valor: string;
  cantidad: number;
  contador: string;
  limite: string | null;
}

export class ObservationsPage {
  constructor(private readonly page: Page) {}

  private get dialog(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Emitir nuevo documento',
      exact: true
    });
  }

  private get input(): Locator {
    return this.dialog.getByLabel('Observaciones', {
      exact: true
    });
  }

  async write(length: number): Promise<void> {
    assert.ok(
      Number.isInteger(length) && length >= 0 && length <= 300,
      'La cantidad debe ser un entero entre 0 y 300.'
    );

    await this.input.fill('A'.repeat(length));
  }

  async tryAdditionalCharacter(): Promise<void> {
    await expect(this.input).toHaveValue('A'.repeat(300));
    await this.input.focus();
    await this.input.press('End');
    await this.input.pressSequentially('B');
  }

  async verify(length: number): Promise<ObservationsEvidence> {
    const expectedValue = 'A'.repeat(length);
    const counter = this.dialog.getByText(`${length}/300`, {
      exact: true
    });

    await expect(this.input).toHaveValue(expectedValue);
    await expect(this.input).toHaveAttribute('maxlength', '300');
    await expect(this.input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(counter).toHaveCount(1);
    await expect(counter).toBeVisible();

    const value = await this.input.inputValue();

    return {
      valor: value,
      cantidad: value.length,
      contador: await counter.innerText(),
      limite: await this.input.getAttribute('maxlength')
    };
  }
}
