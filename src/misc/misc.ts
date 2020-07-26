import { ElementType } from "react";

export type HtmlProps<T extends ElementType> = React.ComponentPropsWithRef<T>;

export type HtmlComponent<T extends ElementType, U = unknown> = React.FC<
  HtmlProps<T> & U
>;

export const noop: () => void = () => {
  /* void */
};

/**
 * Join class names ignoring not-string items.
 * @example
 * jcn('A', undefined, true, 'Z'); => "A Z"
 */
export function jcn(...names: unknown[]): string {
  return names.filter((v) => typeof v === "string").join(" ");
}
