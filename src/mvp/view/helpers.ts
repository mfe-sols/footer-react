export const getInitials = (value: string) => {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!parts.length) return "HD";
  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

export const isExternalHttpHref = (href: string): boolean => {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    const target = new URL(href);
    if (typeof window === "undefined") return true;
    return target.origin !== window.location.origin;
  } catch {
    return false;
  }
};

export const getSafeHref = (value: string, fallback = "#"): string => {
  const next = value.trim();
  if (!next || next.startsWith("//")) return fallback;
  if (/^(javascript|data|vbscript|file):/i.test(next)) return fallback;

  if (
    next.startsWith("/") ||
    next.startsWith("./") ||
    next.startsWith("../") ||
    next.startsWith("#") ||
    next.startsWith("?")
  ) {
    return next;
  }

  try {
    const baseOrigin =
      typeof window === "undefined" ? "http://localhost" : window.location.origin;
    const resolved = new URL(next, baseOrigin);
    const protocol = resolved.protocol.toLowerCase();

    if (
      protocol !== "http:" &&
      protocol !== "https:" &&
      protocol !== "mailto:" &&
      protocol !== "tel:"
    ) {
      return fallback;
    }

    if (!/^[a-z][a-z0-9+.-]*:/i.test(next)) {
      return `${resolved.pathname}${resolved.search}${resolved.hash}` || "/";
    }

    return resolved.toString();
  } catch {
    return fallback;
  }
};

export const getSafeImageSrc = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const next = value.trim();
  if (!next) return null;

  // Keep avatar sources strict to avoid unsafe protocols.
  if (/^data:image\//i.test(next)) return next;

  try {
    const baseOrigin =
      typeof window === "undefined" ? "http://localhost" : window.location.origin;
    const resolved = new URL(next, baseOrigin);
    if (resolved.protocol === "http:" || resolved.protocol === "https:") {
      return resolved.toString();
    }
  } catch {
    return null;
  }

  return null;
};
