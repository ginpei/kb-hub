/**
 * Join class names.
 * @example
 * const a = 'AAA';
 * const c = null;
 * const className = jcn(a, 'BBB', c); // => "AAA BBB"
 */
export function jcn(...names: string[]): string {
  return names.filter((v) => v).join(" ");
}
