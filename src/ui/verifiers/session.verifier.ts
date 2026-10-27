import { expect } from '../../support/ui-expect';
import type { Page } from '@playwright/test';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { environment } from '../../config/environment';
import { LoginPage } from '../pages/login.page';
import { verifyAndReport } from './evidence';

export async function verifyPortalLogin(
  page: Page,
  runId: string,
  attach: EvidenceWriter
): Promise<void> {
  const title = 'Documentos Tributarios Electrónicos';
  const expectedUrl = new URL('/dashboard', environment.baseUrl).href;

  await verifyAndReport(
    page,
    {
      url: expectedUrl,
      titulo: title,
      usuario: environment.username,
      runId
    },
    async () => {
      const login = new LoginPage(page);

      await login.open();
      await login.login(environment.username, environment.password);

      const actualRunId = await page.evaluate(
        () => window.localStorage.getItem('azurian_lab_run_id')
      );

      expect(actualRunId).toBe(runId);

      const user = page.getByText(environment.username, { exact: true });
      await expect(user).toBeVisible();

      return {
        url: page.url(),
        titulo: await page.getByRole('heading', {
          name: title,
          exact: true
        }).innerText(),
        usuario: await user.innerText(),
        runId: actualRunId
      };
    },
    attach
  );
}
