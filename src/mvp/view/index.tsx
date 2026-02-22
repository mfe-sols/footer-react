import {
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./footer.css";
import {
  resolveFooterConfig,
  type FooterMenuGroupInput,
} from "./footer.config";
import { getInitials, getSafeHref, isExternalHttpHref } from "./helpers";
import { useEscapeKey } from "./hooks/useEscapeKey";
import type { AuthUserInfo, FooterLocale } from "./types";
import {
  IconArrowRight,
  IconCategories,
  IconClose,
  IconGithub,
  IconLinkedIn,
  IconMenu,
  IconMyPage,
  IconNews,
  IconHome,
  IconX,
  IconYouTube,
} from "./components/icons";
import { trFooter } from "../../i18n/domain-messages";

type Props = {
  title: string;
  headings: string[];
  locale: FooterLocale;
  themeMode: "light" | "dark";
  authUser?: AuthUserInfo | null;
  onSignOut?: () => void;
  menuOverride?: FooterMenuGroupInput[] | null;
};

const currentYear = new Date().getFullYear();
const EMAIL_MAX_LENGTH = 254;
const SOCIAL_LINKS = [
  { id: "github", label: "GitHub", href: "https://github.com/mfe-sols", Icon: IconGithub },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com", Icon: IconLinkedIn },
  { id: "x", label: "X", href: "https://x.com", Icon: IconX },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com", Icon: IconYouTube },
] as const;

const getExternalAnchorProps = (href: string, enabled = true) => {
  if (!enabled || !isExternalHttpHref(href)) return {};
  return {
    target: "_blank" as const,
    rel: "noopener noreferrer nofollow",
    referrerPolicy: "no-referrer" as const,
  };
};

export const AppView = ({
  title,
  headings,
  locale,
  themeMode,
  authUser,
  menuOverride,
}: Props): React.JSX.Element => {
  const isDark = themeMode === "dark";
  const config = useMemo(
    () => resolveFooterConfig(title, headings, menuOverride),
    [headings, menuOverride, title],
  );
  const localized = locale === "vi" ? config.locale.vi : config.locale.en;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileGroup, setActiveMobileGroup] = useState(config.menu[0]?.id || "");

  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "invalid" | "success">("idle");

  useEffect(() => {
    if (!config.menu.find((group) => group.id === activeMobileGroup)) {
      setActiveMobileGroup(config.menu[0]?.id || "");
    }
  }, [activeMobileGroup, config.menu]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const desktop = window.matchMedia("(min-width: 1025px)");
    const closeOnDesktop = (event: MediaQueryList | MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false);
    };

    closeOnDesktop(desktop);
    if (typeof desktop.addEventListener === "function") {
      desktop.addEventListener("change", closeOnDesktop);
      return () => desktop.removeEventListener("change", closeOnDesktop);
    }

    desktop.addListener(closeOnDesktop);
    return () => desktop.removeListener(closeOnDesktop);
  }, []);

  useEscapeKey(() => setMobileMenuOpen(false), mobileMenuOpen);

  useEffect(() => {
    if (!mobileMenuOpen || typeof document === "undefined") return;

    const body = document.body;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    body.setAttribute("data-ftr-lock-scroll-y", String(scrollY));
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      const lockedY = Number(body.getAttribute("data-ftr-lock-scroll-y") || "0");
      body.removeAttribute("data-ftr-lock-scroll-y");
      body.style.removeProperty("position");
      body.style.removeProperty("top");
      body.style.removeProperty("left");
      body.style.removeProperty("right");
      body.style.removeProperty("width");
      body.style.removeProperty("overflow");
      window.scrollTo(0, Number.isFinite(lockedY) ? lockedY : 0);
    };
  }, [mobileMenuOpen]);

  const activeGroup = useMemo(
    () => config.menu.find((group) => group.id === activeMobileGroup) || config.menu[0],
    [activeMobileGroup, config.menu]
  );
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const isPathActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath === path || currentPath.startsWith(`${path}/`);
  const mobileTabs = useMemo(
    () => ({
      home: trFooter(locale, "mfe.footer.mobile.home", "footer.mobile.home"),
      categories: trFooter(locale, "mfe.footer.mobile.categories", "footer.mobile.categories"),
      lastNews: trFooter(locale, "mfe.footer.mobile.lastNews", "footer.mobile.lastNews"),
      myPage: trFooter(locale, "mfe.footer.mobile.myPage", "footer.mobile.myPage"),
      logo: trFooter(locale, "mfe.footer.mobile.logo", "footer.mobile.logo"),
    }),
    [locale]
  );

  const brandDescription = trFooter(locale, "mfe.footer.brand.primary", "footer.brand.primary");
  const brandDescriptionExtended = trFooter(
    locale,
    "mfe.footer.brand.secondary",
    "footer.brand.secondary",
  );
  const subscriptionText = useMemo(
    () => ({
      aria: trFooter(locale, "mfe.footer.subscription.aria", "footer.subscription.aria"),
      title: trFooter(locale, "mfe.footer.subscription.title", "footer.subscription.title"),
      description: trFooter(
        locale,
        "mfe.footer.subscription.description",
        "footer.subscription.description",
      ),
      placeholder: trFooter(
        locale,
        "mfe.footer.subscription.placeholder",
        "footer.subscription.placeholder",
      ),
      action: trFooter(locale, "mfe.footer.subscription.action", "footer.subscription.action"),
      success: trFooter(locale, "mfe.footer.subscription.success", "footer.subscription.success"),
      invalid: trFooter(locale, "mfe.footer.subscription.invalid", "footer.subscription.invalid"),
    }),
    [locale]
  );

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = subscriberEmail.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail || email.length > EMAIL_MAX_LENGTH) {
      setSubscriptionStatus("invalid");
      return;
    }
    setSubscriberEmail(email);
    setSubscriptionStatus("success");
  };

  const rootStyle = useMemo(
    () =>
      ({
        "--ftr-surface": isDark ? "#0b1220" : "#f4f7fb",
        "--ftr-surface-muted": isDark ? "#111827" : "#edf2f8",
        "--ftr-surface-raised": isDark ? "#0f172a" : "#f0f5fa",
        "--ftr-border": isDark ? "#273449" : "#dfe5ef",
        "--ftr-text": isDark ? "#e2e8f0" : "#0f172a",
        "--ftr-text-muted": isDark ? "#9fb0c9" : "#5b6472",
        "--ftr-text-subtle": isDark ? "#8190a8" : "#94a3b8",
        "--ftr-brand-a": isDark ? "#34d399" : config.palette.brandA,
        "--ftr-brand-b": isDark ? "#22d3ee" : config.palette.brandB,
        "--ftr-accent": "#0f766e",
        "--ftr-desktop-max": config.layout.desktopMaxWidth,
        "--ftr-shadow": isDark ? "0 20px 44px rgba(2, 6, 23, 0.42)" : "0 18px 40px rgba(15, 23, 42, 0.14)",
      }) as CSSProperties,
    [config.layout.desktopMaxWidth, config.palette.brandA, config.palette.brandB, isDark]
  );

  return (
    <footer className="ftr-shell" style={rootStyle}>
      <div className="ftr-frame">
        <div className="ftr-main is-with-subscription">
          <section className="ftr-brand" aria-label="Brand block">
            <div className="ftr-logo" aria-hidden="true">
              <span>{getInitials(title || config.logoFallback)}</span>
              <span className="ftr-logo-ring" />
              <span className="ftr-logo-glint" />
            </div>
            <div className="ftr-brand-copy ftr-brand-copy-minimal">
              <p className="ftr-brand-primary">{brandDescription}</p>
              <p className="ftr-brand-secondary">{brandDescriptionExtended}</p>
            </div>
          </section>

          <nav
            className="ftr-nav-grid"
            aria-label={trFooter(locale, "mfe.footer.nav.footer", "footer.nav.footer")}
          >
            {config.menu.map((group) => (
              <section key={group.id} className="ftr-nav-group">
                {group.columns.map((column) => (
                  <div key={column.id} className="ftr-nav-column">
                    <strong>{column.title}</strong>
                    <ul>
                      {column.links.map((link) => {
                        const safeHref = getSafeHref(link.href);
                        const isExternal = link.external || isExternalHttpHref(safeHref);
                        const linkClassName = [
                          "ftr-nav-link",
                          link.variant === "subtle" ? "is-subtle" : "",
                          link.disabled ? "is-disabled" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <li key={link.id}>
                            <a
                              className={linkClassName}
                              href={safeHref}
                              {...getExternalAnchorProps(safeHref, isExternal && !link.disabled)}
                              aria-disabled={link.disabled || undefined}
                              tabIndex={link.disabled ? -1 : undefined}
                              onClick={(event) => {
                                if (link.disabled || safeHref === "#") event.preventDefault();
                              }}
                            >
                              <span>{link.text}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
          </nav>

          <section className="ftr-subscribe" aria-label={subscriptionText.aria}>
            <h3>{subscriptionText.title}</h3>
            <p>{subscriptionText.description}</p>
            <form className="ftr-subscribe-form" onSubmit={handleSubscribe} noValidate>
              <input
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="email"
                placeholder={subscriptionText.placeholder}
                value={subscriberEmail}
                maxLength={EMAIL_MAX_LENGTH}
                onChange={(event) => {
                  setSubscriberEmail(event.target.value.slice(0, EMAIL_MAX_LENGTH));
                  if (subscriptionStatus !== "idle") setSubscriptionStatus("idle");
                }}
                aria-label={subscriptionText.placeholder}
                aria-invalid={subscriptionStatus === "invalid"}
              />
              <button type="submit" className="ftr-primary-btn">
                {subscriptionText.action}
                <IconArrowRight />
              </button>
            </form>
            {subscriptionStatus === "success" ? (
              <small className="ftr-subscribe-feedback is-success" role="status" aria-live="polite">
                {subscriptionText.success}
              </small>
            ) : null}
            {subscriptionStatus === "invalid" ? (
              <small className="ftr-subscribe-feedback is-error" role="alert">
                {subscriptionText.invalid}
              </small>
            ) : null}
          </section>
        </div>

        <div className="ftr-bottom">
          <p>
            {currentYear} {title}. All rights reserved.
          </p>
          <nav className="ftr-socials" aria-label="Social networks">
            {SOCIAL_LINKS.map(({ id, label, href, Icon }) => {
              const safeHref = getSafeHref(href);
              return (
                <a
                  key={id}
                  href={safeHref}
                  {...getExternalAnchorProps(safeHref)}
                  aria-label={label}
                  title={label}
                  onClick={(event) => {
                    if (safeHref === "#") event.preventDefault();
                  }}
                >
                  <Icon />
                </a>
              );
            })}
          </nav>
          <button
            type="button"
            className="ftr-icon-btn ftr-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? localized.closeNavigation : localized.openNavigation}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div className={`ftr-drawer-overlay ${mobileMenuOpen ? "is-open" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      <aside className={`ftr-drawer ${mobileMenuOpen ? "is-open" : ""}`} aria-hidden={!mobileMenuOpen}>
        <div className="ftr-drawer-head">
          <strong>{localized.navigation}</strong>
          <button type="button" className="ftr-icon-btn" onClick={() => setMobileMenuOpen(false)} aria-label={localized.closeNavigation}>
            <IconClose />
          </button>
        </div>

        <div className="ftr-drawer-tabs" role="tablist" aria-label={localized.navigation}>
          {config.menu.map((group) => (
            <button
              key={`tab-${group.id}`}
              type="button"
              className={group.id === activeMobileGroup ? "is-active" : ""}
              aria-selected={group.id === activeMobileGroup}
              onClick={() => setActiveMobileGroup(group.id)}
            >
              {group.columns[0]?.title || group.label}
            </button>
          ))}
        </div>

        <div className="ftr-drawer-content">
          {activeGroup?.columns.map((column) => (
            <section key={`drawer-${column.id}`} className="ftr-drawer-section">
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => {
                  const safeHref = getSafeHref(link.href);
                  const isExternal = link.external || isExternalHttpHref(safeHref);
                  const linkClassName = [
                    "ftr-nav-link",
                    link.variant === "subtle" ? "is-subtle" : "",
                    link.disabled ? "is-disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <li key={`drawer-link-${link.id}`}>
                      <a
                        className={linkClassName}
                        href={safeHref}
                        {...getExternalAnchorProps(safeHref, isExternal && !link.disabled)}
                        aria-disabled={link.disabled || undefined}
                        tabIndex={link.disabled ? -1 : undefined}
                        onClick={(event) => {
                          if (link.disabled || safeHref === "#") event.preventDefault();
                        }}
                      >
                        <span>{link.text}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </aside>

      <nav
        className={`ftr-mobile-tabs ${mobileMenuOpen ? "is-hidden" : ""}`}
        aria-label={trFooter(locale, "mfe.footer.nav.quick", "footer.nav.quick")}
      >
        <a className={`ftr-mobile-tab ${isPathActive("/") ? "is-active" : ""}`} href="/">
          <IconHome />
          <span>{mobileTabs.home}</span>
        </a>
        <button
          type="button"
          className={`ftr-mobile-tab ${mobileMenuOpen ? "is-active" : ""}`}
          onClick={() => setMobileMenuOpen(true)}
          aria-label={mobileTabs.categories}
        >
          <IconCategories />
          <span>{mobileTabs.categories}</span>
        </button>

        <a className="ftr-mobile-tab ftr-mobile-tab-logo" href="/" aria-label={mobileTabs.logo}>
          <span className="ftr-mobile-tab-logo-core">{getInitials(title || config.logoFallback)}</span>
          <span className="ftr-mobile-tab-logo-ring" />
        </a>

        <a className={`ftr-mobile-tab ${isPathActive("/news") ? "is-active" : ""}`} href="/news">
          <IconNews />
          <span>{mobileTabs.lastNews}</span>
        </a>
        <a className={`ftr-mobile-tab ${isPathActive("/my-page") ? "is-active" : ""}`} href="/my-page">
          <IconMyPage />
          <span>{mobileTabs.myPage}</span>
        </a>
      </nav>
    </footer>
  );
};
