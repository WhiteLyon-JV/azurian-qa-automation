import { expect as playwrightExpect } from '@playwright/test';
import { timeouts } from '../config/timeouts';

export const expect = playwrightExpect.configure({
  timeout: timeouts.uiExpectation
});
