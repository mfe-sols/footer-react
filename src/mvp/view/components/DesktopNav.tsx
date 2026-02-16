import type { FooterLocale } from "../types";
import type { FooterMenuGroup } from "../footer.config";
import { DesktopNavItem } from "./DesktopNavItem";

type DesktopNavProps = {
  locale: FooterLocale;
  menu: FooterMenuGroup[];
};

export const DesktopNav = ({ locale, menu }: DesktopNavProps) => (
  <nav className="hdr-desktop-nav" aria-label={locale === "vi" ? "Điều hướng chính" : "Primary navigation"}>
    {menu.map((item) => (
      <DesktopNavItem key={item.id} item={item} />
    ))}
  </nav>
);
