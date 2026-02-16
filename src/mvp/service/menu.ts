import type { FooterMenuGroupInput } from "../view/footer.config";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeEndpoint = (value: string): string | null => {
  try {
    const resolved = new URL(value, window.location.origin);
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
    return resolved.toString();
  } catch {
    return null;
  }
};

const parseMenuResponse = (value: unknown): FooterMenuGroupInput[] | null => {
  if (Array.isArray(value)) {
    return value as FooterMenuGroupInput[];
  }
  if (!isRecord(value)) return null;

  if (Array.isArray(value.menu)) return value.menu as FooterMenuGroupInput[];
  if (Array.isArray(value.sections)) return value.sections as FooterMenuGroupInput[];

  return null;
};

export const fetchFooterMenuFromApi = async (
  endpoint: string,
  timeoutMs = 3500
): Promise<FooterMenuGroupInput[] | null> => {
  const url = normalizeEndpoint(endpoint);
  if (!url) return null;

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId =
    controller !== null
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      signal: controller?.signal,
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as unknown;
    return parseMenuResponse(payload);
  } catch {
    return null;
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
};
