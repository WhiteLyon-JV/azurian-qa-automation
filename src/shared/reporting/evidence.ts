import type { World } from '@cucumber/cucumber';

export type EvidenceWriter = (
  body: string | Buffer,
  mediaType: string
) => void | Promise<void>;

export function evidenceWriter(world: World): EvidenceWriter {
  return (body, mediaType) => {
    if (typeof body === 'string') {
      return world.attach(body, mediaType);
    }

    return world.attach(body, mediaType);
  };
}
