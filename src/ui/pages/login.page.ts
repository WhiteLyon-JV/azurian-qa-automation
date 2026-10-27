import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/login');

    await expect(
      this.page.getByRole('button', {
        name: 'Iniciar Sesión',
        exact: true
      })
    ).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByLabel(
      'Usuario o Correo Electrónico',
      { exact: true }
    ).fill(email);

    await this.page.getByLabel(
      'Contraseña',
      { exact: true }
    ).fill(password);

    await this.page.getByRole('button', {
      name: 'Iniciar Sesión',
      exact: true
    }).click();

    await expect(this.page).toHaveURL(/\/dashboard$/);

    await expect(
      this.page.getByRole('heading', {
        name: 'Documentos Tributarios Electrónicos',
        exact: true
      })
    ).toBeVisible();
  }
}
