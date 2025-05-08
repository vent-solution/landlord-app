import { ReactElement } from "react";

export interface NavLinkModel {
  icon?: ReactElement;
  name?: string;
  link?: string;
  active?: boolean;
  childLinks?: NavLinkModel[];
}
