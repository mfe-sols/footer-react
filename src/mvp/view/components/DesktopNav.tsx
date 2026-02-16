import type { FooterLocale } from "../types";
import type { FooterMenuGroup } from "../footer.config";
import { DesktopNavItem } from "./DesktopNavItem";
import { trFooter } from "../../../i18n/domain-messages";

type DesktopNavProps = {
  locale: FooterLocale;
  menu: FooterMenuGroup[];
};

export const DesktopNav = ({ locale, menu }: DesktopNavProps) => (
  <nav className="hdr-desktop-nav" aria-label={trFooter(locale, "mfe.footer.nav.primary", "common.nav.primary")}>
    {menu.map((item) => (
      <DesktopNavItem key={item.id} item={item} />
    ))}
  </nav>
);
