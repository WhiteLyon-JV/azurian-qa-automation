import assert from 'node:assert/strict';
import type { APIRequestContext } from '@playwright/test';
import { AuthClient } from '../clients/auth.client';
import { verifyLogin } from '../verifiers/auth.verifier';
import type { TokenProvider } from './token-provider';
import type { EvidenceWriter } from '../../shared/reporting/evidence';
import { environment } from '../../config/environment';

export class AuthSession implements TokenProvider {
  private token?: string;
  private expiresAt = 0;
  private refreshAt = 0;
  private loginCount = 0;
  private pendingLogin?: Promise<string>;

  constructor(
    private readonly request: APIRequestContext,
    private readonly attach: EvidenceWriter,
    private readonly now: () => number = Date.now
  ) {}

  get snapshot(): {
    expiresAt: number;
    refreshAt: number;
    loginCount: number;
  } {
    return {
      expiresAt: this.expiresAt,
      refreshAt: this.refreshAt,
      loginCount: this.loginCount
    };
  }

  async getToken(): Promise<string> {
    if (this.token && this.now() < this.refreshAt) {
      return this.token;
    }

    if (this.pendingLogin) {
      return this.pendingLogin;
    }

    this.pendingLogin = this.login();

    try {
      return await this.pendingLogin;
    } finally {
      this.pendingLogin = undefined;
    }
  }

  private async login(): Promise<string> {
    const requestedAt = this.now();

    const response = await new AuthClient(this.request).login({
      email: environment.username,
      password: environment.password
    });

    const token = await verifyLogin(
      response,
      environment.username,
      this.attach
    );

    const body: unknown = JSON.parse(await response.text());

    assert.ok(
      typeof body === 'object' &&
      body !== null &&
      'expiresIn' in body
    );

    assert.ok(
      typeof body.expiresIn === 'number' &&
      Number.isInteger(body.expiresIn) &&
      body.expiresIn > 0
    );

    const lifetimeMs = body.expiresIn * 1_000;
    const renewalMarginMs = Math.min(30_000, lifetimeMs / 2);

    this.token = token;
    this.expiresAt = requestedAt + lifetimeMs;
    this.refreshAt = this.expiresAt - renewalMarginMs;
    this.loginCount += 1;

    await this.attach(JSON.stringify({
      sesion: {
        loginCount: this.loginCount,
        vigenciaSegundos: body.expiresIn,
        margenRenovacionMs: renewalMarginMs,
        renovacionDesde: this.refreshAt,
        vencimientoEstimado: this.expiresAt
      }
    }, null, 2), 'application/json');

    return token;
  }
}
