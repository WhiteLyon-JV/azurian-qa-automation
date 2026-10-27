import {
  Before,
  After,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import { environment } from '../config/environment';
import { timeouts } from '../config/timeouts';
import { TestWorld } from './world';

setDefaultTimeout(timeouts.step);

Before({ tags: '@api' }, async function (this: TestWorld) {
  this.apiRequest = await request.newContext({
    baseURL: environment.baseUrl,
    extraHTTPHeaders: {
      'x-lab-run-id': this.runId
    },
    timeout: timeouts.apiRequest
  });
});

After({ tags: '@api' }, async function (this: TestWorld) {
  await this.apiRequest?.dispose();
});

Before({ tags: '@ui' }, async function (this: TestWorld) {
  this.browser = await chromium.launch({
    headless: environment.headless
  });

  this.browserContext = await this.browser.newContext({
    baseURL: environment.baseUrl
  });

  this.browserContext.setDefaultTimeout(timeouts.uiAction);
  this.browserContext.setDefaultNavigationTimeout(timeouts.navigation);

  await this.browserContext.addInitScript((runId: string) => {
    window.localStorage.setItem('azurian_lab_run_id', runId);
  }, this.runId);

  this.uiPage = await this.browserContext.newPage();
});

After({ tags: '@ui' }, async function (this: TestWorld, scenario) {
  try {
    if (
      scenario.result?.status === Status.FAILED &&
      this.uiPage &&
      !this.uiPage.isClosed()
    ) {
      const screenshot = await this.uiPage.screenshot({
        fullPage: true
      });

      await this.attach(screenshot, 'image/png');
    }
  } finally {
    await this.browser?.close();
  }
});
