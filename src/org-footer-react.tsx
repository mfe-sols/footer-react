import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { defineDesignSystem, ensureTokens } from "@mfe-sols/ui-kit";
import Root from "./root.component";
import { initMfeErrorReporter } from "./mfe-error-reporter";

// Load design system styles and tokens before first React paint.
defineDesignSystem({ tailwind: true });
ensureTokens();

const reporter = initMfeErrorReporter("@org/footer-react");

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Root,
  errorBoundary(err, info) {
    const detail = [err?.stack || String(err), info?.componentStack]
      .filter(Boolean)
      .join("\n");
    reporter.report("error", "React render error", detail);
    return null;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
