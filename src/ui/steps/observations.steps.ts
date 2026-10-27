import { When, Then } from '@cucumber/cucumber';
import { ObservationsPage } from '../pages/observations.page';
import {
  verifyPortalObservations
} from '../verifiers/observations.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

When(
  'escribo {int} carácter/caracteres en las observaciones',
  async function (this: TestWorld, length: number) {
    await new ObservationsPage(this.page).write(length);
  }
);

When(
  'intento escribir un carácter adicional en las observaciones',
  async function (this: TestWorld) {
    await new ObservationsPage(this.page).tryAdditionalCharacter();
  }
);

Then(
  'las observaciones conservan {int} carácter/caracteres y el contador coincide',
  async function (this: TestWorld, length: number) {
    await verifyPortalObservations(
      this.page,
      length,
      evidenceWriter(this)
    );
  }
);
