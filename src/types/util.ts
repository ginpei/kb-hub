import { BsPrefixProps, ReplaceProps } from "react-bootstrap/esm/helpers";

export type BootstrapComponentProps<
  As extends React.ElementType,
  P
> = React.PropsWithChildren<ReplaceProps<As, BsPrefixProps<As> & P>>;

export type Overwrite<T, U> = Omit<T, keyof U> & U;
