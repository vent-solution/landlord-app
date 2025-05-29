export interface NavLinkModel {
  icon: string;
  name: string;
  link: string;
  active: boolean;
  childLinks?: NavLinkModel[];
}
