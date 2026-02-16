import type { AuthUserInfo, FooterLocale } from "../types";
import { GuestAuthActions } from "./GuestAuthActions";
import { IconClose, IconMenu, IconMoon, IconSearch, IconSun } from "./icons";
import { UserMenu } from "./UserMenu";
import { trFooter } from "../../../i18n/domain-messages";

type FooterActionsProps = {
  locale: FooterLocale;
  searchPlaceholder: string;
  searchShortcut: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchInputRef: { current: HTMLInputElement | null };
  isDark: boolean;
  onToggleTheme: () => void;
  onLocaleChange: (next: FooterLocale) => void;
  authUser?: AuthUserInfo | null;
  onSignOut?: () => void;
  userMenuText: {
    profile: string;
    signOut: string;
    openUserMenu: string;
  };
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  closeNavigationLabel: string;
  openNavigationLabel: string;
};

export const FooterActions = ({
  locale,
  searchPlaceholder,
  searchShortcut,
  searchValue,
  onSearchValueChange,
  searchInputRef,
  isDark,
  onToggleTheme,
  onLocaleChange,
  authUser,
  onSignOut,
  userMenuText,
  mobileMenuOpen,
  onToggleMobileMenu,
  closeNavigationLabel,
  openNavigationLabel,
}: FooterActionsProps) => {
  const themeAriaLabel = isDark
    ? trFooter(locale, "mfe.footer.theme.switchToLight", "common.theme.switchToLight")
    : trFooter(locale, "mfe.footer.theme.switchToDark", "common.theme.switchToDark");
  const themeTitle = isDark
    ? trFooter(locale, "mfe.footer.theme.lightMode", "common.theme.lightMode")
    : trFooter(locale, "mfe.footer.theme.darkMode", "common.theme.darkMode");
  const localeSwitchAria = trFooter(
    locale,
    "mfe.footer.locale.switchAria",
    "common.locale.switchAria",
  );

  return (
    <div className="hdr-actions">
    <label className="hdr-search hdr-actions-search">
      <span className="icon"><IconSearch /></span>
      <input
        ref={searchInputRef}
        type="search"
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        value={searchValue}
        onChange={(event) => onSearchValueChange((event.target as HTMLInputElement).value)}
      />
      <kbd>{searchShortcut}</kbd>
    </label>

    <div className="hdr-actions-group hdr-actions-utility">
      <button
        type="button"
        className="hdr-icon-btn"
        onClick={onToggleTheme}
        aria-label={themeAriaLabel}
        title={themeTitle}
      >
        {isDark ? <IconSun /> : <IconMoon />}
      </button>

      <div className="hdr-locale-switch" role="group" aria-label={localeSwitchAria}>
        <button
          type="button"
          className={locale === "en" ? "is-active" : ""}
          onClick={() => onLocaleChange("en")}
        >
          EN
        </button>
        <button
          type="button"
          className={locale === "vi" ? "is-active" : ""}
          onClick={() => onLocaleChange("vi")}
        >
          VI
        </button>
      </div>
    </div>

    <div className="hdr-actions-group hdr-actions-account">
      {authUser ? (
        <UserMenu
          user={authUser}
          text={userMenuText}
          onSignOut={onSignOut}
        />
      ) : (
        <GuestAuthActions locale={locale} />
      )}
    </div>

    <button
      type="button"
      className="hdr-icon-btn hdr-menu-btn"
      onClick={onToggleMobileMenu}
      aria-label={mobileMenuOpen ? closeNavigationLabel : openNavigationLabel}
      aria-expanded={mobileMenuOpen}
    >
      {mobileMenuOpen ? <IconClose /> : <IconMenu />}
    </button>
  </div>
  );
};
