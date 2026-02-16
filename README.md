# @mfe-sols/footer-react

Footer microfrontend module built with React + single-spa.

## Scripts

- `pnpm start`: run standalone dev server on `http://localhost:9013`
- `pnpm start:standalone`: same as `start`
- `pnpm typecheck`: TypeScript check
- `pnpm build:webpack`: production build
- `pnpm build:verify`: build + bundle size check

## Runtime config

Set runtime overrides before loading `org-footer-react.js`:

```html
<script>
  window.__MFE_FOOTER_CONFIG__ = {
    layout: { desktopMaxWidth: "1440px" },
    palette: {
      accent: "#3b82f6",
      brandA: "#0f172a",
      brandB: "#334155"
    },
    locale: {
      en: { login: "Login", register: "Register" },
      vi: { login: "Đăng nhập", register: "Đăng ký" }
    },
    menuSource: {
      mode: "mock"
    }
  };
</script>
```

## Import map (root-config)

```json
{
  "imports": {
    "@org/footer-react": "http://localhost:9013/org-footer-react.js"
  }
}
```
