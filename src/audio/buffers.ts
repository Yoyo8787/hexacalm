import * as Tone from "tone";

const decodedBuffers = new Map<string, Promise<Tone.ToneAudioBuffer>>();

function decodeAmbientBuffer(url: string): Promise<Tone.ToneAudioBuffer> {
  const pending = Tone.ToneAudioBuffer.fromUrl(url);

  decodedBuffers.set(url, pending);
  pending.catch(() => {
    decodedBuffers.delete(url);
  });

  return pending;
}

/**
 * Decoding is shared per url; each caller receives its own buffer handle so
 * that disposing a player never invalidates the cached entry.
 */
export async function loadAmbientBuffer(url: string): Promise<Tone.ToneAudioBuffer> {
  const shared = decodedBuffers.get(url) ?? decodeAmbientBuffer(url);

  const buffer = await shared;
  return new Tone.ToneAudioBuffer(buffer);
}
