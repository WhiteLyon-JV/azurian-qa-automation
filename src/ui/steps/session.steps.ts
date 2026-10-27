import { Given } from '@cucumber/cucumber';
import { verifyPortalLogin } from '../verifiers/session.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

Given(
  'que he iniciado sesión en el portal',
  async function (this: TestWorld) {
    await verifyPortalLogin(
      this.page,
      this.runId,
      evidenceWriter(this)
    );
  }
);
