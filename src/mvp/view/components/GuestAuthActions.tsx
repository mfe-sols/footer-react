import type { FooterLocale } from "../types";
import { IconSignIn, IconUserPlus } from "./icons";
import { trFooter } from "../../../i18n/domain-messages";

type GuestAuthActionsProps = {
  locale: FooterLocale;
};

export const GuestAuthActions = ({ locale }: GuestAuthActionsProps) => {
  const registerLabel = trFooter(locale, "mfe.footer.auth.register", "common.auth.register");
  const loginLabel = trFooter(locale, "mfe.footer.auth.login", "common.auth.login");

  return (
    <div className="hdr-auth-actions">
      <a
        href="/auth/register"
        className="hdr-auth-btn is-register is-icon"
        aria-label={registerLabel}
        title={registerLabel}
      >
        <IconUserPlus />
      </a>
      <a
        href="/auth/login"
        className="hdr-auth-btn is-login is-icon"
        aria-label={loginLabel}
        title={loginLabel}
      >
        <IconSignIn />
      </a>
    </div>
  );
};
