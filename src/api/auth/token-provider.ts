export interface TokenProvider {
  getToken(): Promise<string>;
}

export type AccessToken = string | TokenProvider;

export async function authorizationHeaders(
  source: AccessToken
): Promise<{ Authorization: string }> {
  const token = typeof source === 'string'
    ? source
    : await source.getToken();

  return {
    Authorization: `Bearer ${token}`
  };
}
