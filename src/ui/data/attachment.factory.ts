import assert from 'node:assert/strict';
import type { TestAttachment } from '../models/attachment';

export function buildTestAttachment(
  name: string,
  bytes: number
): TestAttachment {
  assert.ok(name.length > 0 && !/[\\/]/.test(name));
  assert.ok(
    Number.isInteger(bytes) && bytes > 0 && bytes <= 3 * 1024 * 1024
  );

  const extension = name.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    xml: 'application/xml',
    txt: 'text/plain'
  };

  return {
    name,
    mimeType: mimeTypes[extension ?? ''] ?? 'application/octet-stream',
    buffer: Buffer.alloc(bytes, 'a')
  };
}
