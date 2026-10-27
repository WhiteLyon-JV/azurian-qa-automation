import { Given } from '@cucumber/cucumber';
import { AuthSession } from '../auth/auth-session';
import { verifyRunId } from '../../shared/verifiers/run-id.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

Given(
  'que tengo una sesión válida del laboratorio',
  async function (this: TestWorld) {
    this.token = new AuthSession(
      this.request,
      evidenceWriter(this)
    );

    await this.token.getToken();
  }
);

Given(
  'una ejecución aislada para mis documentos',
  async function (this: TestWorld) {
    await verifyRunId(this.runId, evidenceWriter(this));
  }
);
