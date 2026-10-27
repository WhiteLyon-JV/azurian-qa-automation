import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface Credentials {
  email: string;
  password: string;
}

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/api/auth/login', {
      data: credentials
    });
  }
}
