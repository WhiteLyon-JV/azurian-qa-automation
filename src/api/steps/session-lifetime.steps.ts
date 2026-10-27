import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { prepareSessionLifetimeFixture } from '../data/session-lifetime.fixture';
import type { SessionLifetimeFixture } from '../data/session-lifetime.fixture';
import {
  reachSessionCondition,
  querySessionDocument,
  verifySessionDocuments,
  verifySessionRenewals
} from '../verifiers/session-lifetime.verifier';
import { evidenceWriter } from '../../shared/reporting/evidence';
import { TestWorld } from '../../support/world';

interface SessionLifetimeWorld extends TestWorld {
  sessionLifetime?: SessionLifetimeFixture;
}

Given(
  'que tengo un documento propio y una sesión autenticada',
  async function (this: SessionLifetimeWorld) {
    this.sessionLifetime = await prepareSessionLifetimeFixture(
      this.request,
      evidenceWriter(this)
    );
  }
);

When(
  'la sesión {string}',
  async function (this: SessionLifetimeWorld, condition: string) {
    assert.ok(this.sessionLifetime);
    await reachSessionCondition(
      this.sessionLifetime,
      condition,
      evidenceWriter(this)
    );
  }
);

When(
  'consulto el documento en {int} ocasiones',
  async function (this: SessionLifetimeWorld, count: number) {
    assert.ok(this.sessionLifetime);
    await querySessionDocument(
      this.sessionLifetime,
      count,
      'secuencial',
      evidenceWriter(this)
    );
  }
);

When(
  'consulto nuevamente el documento',
  async function (this: SessionLifetimeWorld) {
    assert.ok(this.sessionLifetime);
    await querySessionDocument(
      this.sessionLifetime,
      1,
      'secuencial',
      evidenceWriter(this)
    );
  }
);

When(
  '{int} consultas simultáneas necesitan acceder al documento',
  async function (this: SessionLifetimeWorld, count: number) {
    assert.ok(this.sessionLifetime);
    await querySessionDocument(
      this.sessionLifetime,
      count,
      'simultánea',
      evidenceWriter(this)
    );
  }
);

Then(
  'recibo el documento completo en cada consulta',
  async function (this: SessionLifetimeWorld) {
    assert.ok(this.sessionLifetime);
    await verifySessionDocuments(this.sessionLifetime, evidenceWriter(this));
  }
);

Then(
  'puedo seguir consultando sin volver a iniciar sesión',
  async function (this: SessionLifetimeWorld) {
    assert.ok(this.sessionLifetime);
    await verifySessionRenewals(
      this.sessionLifetime,
      0,
      evidenceWriter(this)
    );
  }
);

Then(
  'puedo seguir consultando con una única renovación de sesión',
  async function (this: SessionLifetimeWorld) {
    assert.ok(this.sessionLifetime);
    await verifySessionRenewals(
      this.sessionLifetime,
      1,
      evidenceWriter(this)
    );
  }
);
