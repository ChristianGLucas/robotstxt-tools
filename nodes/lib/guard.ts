// Tiny shared input-size/emptiness guards used by every node in this
// package. Kept trivial and dependency-free on purpose.

export interface GuardError {
  code: string;
  message: string;
}

export function byteLength(s: string): number {
  return Buffer.byteLength(s || '', 'utf8');
}

/**
 * Reject oversized input BEFORE any parsing/allocation work touches it.
 * 3 MiB leaves headroom under the platform's ~4 MiB gRPC message cap.
 */
export function checkSize(text: string, maxBytes: number, fieldName: string): GuardError | null {
  const len = byteLength(text);
  if (len > maxBytes) {
    return {
      code: 'INPUT_TOO_LARGE',
      message: `\`${fieldName}\` is ${len} bytes, exceeding the ${maxBytes}-byte cap.`,
    };
  }
  return null;
}

export function checkEmpty(text: string, fieldName: string): GuardError | null {
  if (!text || !text.trim()) {
    return { code: 'EMPTY_INPUT', message: `\`${fieldName}\` must not be empty.` };
  }
  return null;
}
