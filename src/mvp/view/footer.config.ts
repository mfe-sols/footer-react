export type FooterLocaleText = {
  live: string;
  operational: string;
  navigation: string;
  profile: string;
  signOut: string;
  openNavigation: string;
  closeNavigation: string;
  openUserMenu: string;
  login: string;
  register: string;
};

export type FooterPalette = {
  accent: string;
  brandA: string;
  brandB: string;
};

export type FooterLayout = {
  desktopMaxWidth: string;
};

export type FooterMenuLinkInput = {
  text: string;
  desc?: string;
  href?: string;
  variant?: "default" | "accent" | "subtle";
  external?: boolean;
  disabled?: boolean;
};

export type FooterMenuColumnInput = {
  title: string;
  links: FooterMenuLinkInput[];
};

export type FooterMenuGroupInput = {
  label: string;
  columns: FooterMenuColumnInput[];
};

export type FooterMenuLink = {
  id: string;
  text: string;
  desc: string;
  href: string;
  variant: "default" | "accent" | "subtle";
  external: boolean;
  disabled: boolean;
};

export type FooterMenuColumn = {
  id: string;
  title: string;
  links: FooterMenuLink[];
};

export type FooterMenuGroup = {
  id: string;
  label: string;
  columns: FooterMenuColumn[];
};

export type FooterConfig = {
  logoFallback: string;
  marqueeFallback: string;
  marqueeMaxItems: number;
  layout: FooterLayout;
  palette: FooterPalette;
  locale: {
    en: FooterLocaleText;
    vi: FooterLocaleText;
  };
  menu: FooterMenuGroup[];
};

export type FooterMenuSourceConfig = {
  mode: "mock" | "api";
  endpoint: string;
  timeoutMs: number;
};

type FooterRuntimeConfig = {
  logoFallback?: string;
  marqueeFallback?: string;
  marqueeMaxItems?: number;
  palette?: Partial<FooterPalette>;
  layout?: {
    desktopMaxWidth?: string | number;
  };
  locale?: {
    en?: Partial<FooterLocaleText>;
    vi?: Partial<FooterLocaleText>;
  };
  menu?: FooterMenuGroupInput[];
  menuSource?: Partial<FooterMenuSourceConfig>;
};

const DEFAULT_CONFIG = {
  logoFallback: "FT",
  marqueeFallback: "Reliable platform  ·  Secure workflows  ·  Unified operations",
  marqueeMaxItems: 6,
  layout: {
    desktopMaxWidth: "1440px",
  },
  palette: {
    accent: "#3b82f6",
    brandA: "#0f172a",
    brandB: "#334155",
  },
  locale: {
    en: {
      live: "Live",
      operational: "Operational",
      navigation: "Navigation",
      profile: "My profile",
      signOut: "Sign out",
      openNavigation: "Open navigation",
      closeNavigation: "Close navigation",
      openUserMenu: "Open user menu",
      login: "Login",
      register: "Register",
    },
    vi: {
      live: "Live",
      operational: "Đang hoạt động",
      navigation: "Điều hướng",
      profile: "Hồ sơ cá nhân",
      signOut: "Đăng xuất",
      openNavigation: "Mở điều hướng",
      closeNavigation: "Đóng điều hướng",
      openUserMenu: "Mở menu người dùng",
      login: "Đăng nhập",
      register: "Đăng ký",
    },
  },
} satisfies Omit<FooterConfig, "menu">;

const DEFAULT_MENU_SOURCE: FooterMenuSourceConfig = {
  mode: "mock",
  endpoint: "",
  timeoutMs: 3500,
};

const pickString = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  const next = value.trim();
  return next ? next : fallback;
};

const pickNumber = (value: unknown, fallback: number, min = 1, max = 12) => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  if (value < min) return min;
  if (value > max) return max;
  return Math.floor(value);
};

const pickDesktopMaxWidth = (value: unknown, fallback: string) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const clamped = Math.min(Math.max(Math.round(value), 960), 3840);
    return `${clamped}px`;
  }

  if (typeof value !== "string") return fallback;
  const next = value.trim();
  if (!next) return fallback;

  const simpleLength = /^\d+(\.\d+)?(px|rem|em|vw|%)$/i;
  const functionLength = /^(clamp|min|max)\(.+\)$/i;
  if (simpleLength.test(next)) return next;
  if (next.length <= 96 && functionLength.test(next)) return next;

  return fallback;
};

const pickSafeHref = (value: unknown, fallback = "#") => {
  if (typeof value !== "string") return fallback;
  const next = value.trim();
  if (!next) return fallback;

  if (/^(javascript|data|vbscript|file):/i.test(next)) return fallback;
  if (next.startsWith("//")) return fallback;

  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(next);
  if (!hasScheme) return next;

  try {
    const parsed = new URL(next);
    if (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:" ||
      parsed.protocol === "mailto:" ||
      parsed.protocol === "tel:"
    ) {
      return next;
    }
  } catch {
    return fallback;
  }

  return fallback;
};

const pickBoolean = (value: unknown, fallback = false) => {
  if (typeof value !== "boolean") return fallback;
  return value;
};

const pickLinkVariant = (value: unknown): FooterMenuLink["variant"] => {
  if (value === "accent" || value === "subtle") return value;
  return "default";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const makeId = (value: string, index: number) => {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return cleaned ? cleaned : `group-${index + 1}`;
};

const mergeLocaleText = (
  fallback: FooterLocaleText,
  override?: Partial<FooterLocaleText>
): FooterLocaleText => ({
  live: pickString(override?.live, fallback.live),
  operational: pickString(override?.operational, fallback.operational),
  navigation: pickString(override?.navigation, fallback.navigation),
  profile: pickString(override?.profile, fallback.profile),
  signOut: pickString(override?.signOut, fallback.signOut),
  openNavigation: pickString(override?.openNavigation, fallback.openNavigation),
  closeNavigation: pickString(override?.closeNavigation, fallback.closeNavigation),
  openUserMenu: pickString(override?.openUserMenu, fallback.openUserMenu),
  login: pickString(override?.login, fallback.login),
  register: pickString(override?.register, fallback.register),
});

const fallbackMenuFromHeadings = (headings: string[]): FooterMenuGroupInput[] => {
  const items = headings.filter(Boolean);
  const safe = (index: number, fallback: string) => items[index] || fallback;
  const sectionLabels = [
    safe(0, "Heading 1"),
    safe(2, "Heading 3"),
    safe(4, "Heading 5"),
    "Legal",
  ];

  return [
    {
      label: sectionLabels[0],
      columns: [
        {
          title: "Products",
          links: [
            { text: safe(1, "Overview"), desc: "Architecture and capabilities", href: "/", variant: "accent" },
            { text: safe(2, "Modules"), desc: "Deploy and manage microfrontends", href: "/" },
            { text: safe(3, "Integrations"), desc: "Connect data and services", href: "/" },
          ],
        },
      ],
    },
    {
      label: sectionLabels[1],
      columns: [
        {
          title: "About",
          links: [
            { text: safe(4, "About us"), desc: "Team, mission and roadmap", href: "/", variant: "accent" },
            { text: safe(5, "Careers"), desc: "Open roles and culture", href: "/" },
            { text: "Contact", desc: "Partnership and support", href: "/" },
          ],
        },
      ],
    },
    {
      label: sectionLabels[2],
      columns: [
        {
          title: "Developers",
          links: [
            { text: "Documentation", desc: "Guides and API references", href: "/", variant: "accent" },
            { text: "Release notes", desc: "Latest product updates", href: "/" },
            { text: "Community", desc: "Forum and best practices", href: "/" },
          ],
        },
      ],
    },
    {
      label: sectionLabels[3],
      columns: [
        {
          title: "Compliance",
          links: [
            { text: "Privacy", desc: "How we handle data", href: "/", variant: "accent" },
            { text: "Terms", desc: "Usage terms and policies", href: "/" },
            { text: "Security", desc: "Security and trust center", href: "/" },
          ],
        },
      ],
    },
  ];
};

const normalizeMenu = (groups: FooterMenuGroupInput[]): FooterMenuGroup[] => {
  return groups
    .map((group, groupIndex) => {
      const label = pickString(group?.label, `Group ${groupIndex + 1}`);
      const groupId = makeId(label, groupIndex);
      const columns = Array.isArray(group?.columns) ? group.columns : [];

      const normalizedColumns: FooterMenuColumn[] = columns
        .map((column, columnIndex) => {
          const title = pickString(column?.title, `Section ${columnIndex + 1}`);
          const links = Array.isArray(column?.links) ? column.links : [];

          const normalizedLinks: FooterMenuLink[] = links
            .map((link, linkIndex) => {
              const text = pickString(link?.text, "");
              if (!text) return null;
              const desc = pickString(link?.desc, "");
              const href = pickSafeHref(link?.href, "#");
              const external = pickBoolean(link?.external, false);
              const disabled = pickBoolean(link?.disabled, false);
              return {
                id: `${groupId}-link-${columnIndex + 1}-${linkIndex + 1}`,
                text,
                desc,
                href,
                variant: pickLinkVariant(link?.variant),
                external,
                disabled,
              };
            })
            .filter((value): value is FooterMenuLink => Boolean(value));

          if (!normalizedLinks.length) return null;

          return {
            id: `${groupId}-col-${columnIndex + 1}`,
            title,
            links: normalizedLinks,
          };
        })
        .filter((value): value is FooterMenuColumn => Boolean(value));

      if (!normalizedColumns.length) return null;

      return {
        id: groupId,
        label,
        columns: normalizedColumns,
      };
    })
    .filter((value): value is FooterMenuGroup => Boolean(value));
};

const resolveRuntimeMenu = (value: unknown): FooterMenuGroupInput[] | null => {
  if (!Array.isArray(value)) return null;
  const groups = value.filter((item): item is FooterMenuGroupInput => isRecord(item));
  if (!groups.length) return null;
  return groups;
};

const readRuntimeConfig = (): FooterRuntimeConfig => {
  const runtimeRaw =
    typeof window !== "undefined"
      ? (window as any).__MFE_FOOTER_CONFIG__
      : undefined;
  if (!isRecord(runtimeRaw)) return {};
  return runtimeRaw as FooterRuntimeConfig;
};

const resolveMenuSource = (runtime: FooterRuntimeConfig): FooterMenuSourceConfig => {
  const override = isRecord(runtime.menuSource) ? runtime.menuSource : undefined;
  const modeRaw = pickString(override?.mode, DEFAULT_MENU_SOURCE.mode);
  const mode = modeRaw === "api" ? "api" : "mock";
  return {
    mode,
    endpoint: pickString(override?.endpoint, DEFAULT_MENU_SOURCE.endpoint),
    timeoutMs: pickNumber(override?.timeoutMs, DEFAULT_MENU_SOURCE.timeoutMs, 500, 15000),
  };
};

export const resolveFooterRuntimeOptions = () => {
  const runtime = readRuntimeConfig();
  return {
    menuSource: resolveMenuSource(runtime),
  };
};

export const resolveFooterConfig = (
  title: string,
  headings: string[],
  menuOverride?: FooterMenuGroupInput[] | null
): FooterConfig => {
  const runtime = readRuntimeConfig();

  const paletteOverride = isRecord(runtime.palette) ? runtime.palette : undefined;
  const layoutOverride = isRecord(runtime.layout) ? runtime.layout : undefined;
  const localeOverride = isRecord(runtime.locale) ? runtime.locale : undefined;
  const enOverride = localeOverride && isRecord(localeOverride.en) ? localeOverride.en : undefined;
  const viOverride = localeOverride && isRecord(localeOverride.vi) ? localeOverride.vi : undefined;

  const externalMenu =
    Array.isArray(menuOverride) && menuOverride.length > 0 ? menuOverride : null;
  const menuFromRuntime = resolveRuntimeMenu(runtime.menu);
  const menuFallback = fallbackMenuFromHeadings(headings);
  const menu = normalizeMenu(externalMenu || menuFromRuntime || menuFallback);

  return {
    logoFallback: pickString(
      runtime.logoFallback,
      title.slice(0, 2).toUpperCase() || DEFAULT_CONFIG.logoFallback
    ),
    marqueeFallback: pickString(runtime.marqueeFallback, DEFAULT_CONFIG.marqueeFallback),
    marqueeMaxItems: pickNumber(runtime.marqueeMaxItems, DEFAULT_CONFIG.marqueeMaxItems),
    layout: {
      desktopMaxWidth: pickDesktopMaxWidth(
        layoutOverride?.desktopMaxWidth,
        DEFAULT_CONFIG.layout.desktopMaxWidth
      ),
    },
    palette: {
      accent: pickString(paletteOverride?.accent, DEFAULT_CONFIG.palette.accent),
      brandA: pickString(paletteOverride?.brandA, DEFAULT_CONFIG.palette.brandA),
      brandB: pickString(paletteOverride?.brandB, DEFAULT_CONFIG.palette.brandB),
    },
    locale: {
      en: mergeLocaleText(DEFAULT_CONFIG.locale.en, enOverride),
      vi: mergeLocaleText(DEFAULT_CONFIG.locale.vi, viOverride),
    },
    menu,
  };
};
