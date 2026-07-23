// Tiny shared empty-input guard used by every node in this package. Kept
// trivial and dependency-free on purpose. Size/resource limits are the
// platform's concern, not this package's — see ADR on node purity.

export interface GuardError {
  code: string;
  message: string;
}

export function checkEmpty(text: string, fieldName: string): GuardError | null {
  if (!text || !text.trim()) {
    return { code: 'EMPTY_INPUT', message: `\`${fieldName}\` must not be empty.` };
  }
  return null;
}
