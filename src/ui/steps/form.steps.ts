import { Given } from '@cucumber/cucumber';
import { DashboardPage } from '../pages/dashboard.page';
import { TestWorld } from '../../support/world';

Given(
  'que he abierto el formulario de nuevo documento',
  async function (this: TestWorld) {
    await new DashboardPage(this.page).openNewDocument();
  }
);
