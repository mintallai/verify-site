# verify-site

This project generates the CAI verify site front end.

### Get started

### Scripts

| Syntax             | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| `yarn dev`         | Development (port 5000)                                                |
| `yarn dev:nollup`  | Development with crazy fast rebuilds (port 5000)                       |
| `yarn dev-dynamic` | Development with dynamic imports                                       |
| `yarn build`       | Build a bundled app with SSR + prerendering and dynamic imports        |
| `yarn serve`       | Run after a build to preview. Serves SPA on 5000 and SSR on 5005       |
| `yarn export`      | Create static pages from content in dist folder (used by `yarn build`) |

### SSR and pre-rendering

SSR and pre-rendering are included in the default build process.

To render async data, call the `$ready()` helper whenever your data is ready.

If \$ready() is present, rendering will be delayed till the function has been called.

Otherwise it will be rendered instantly.

### Production

- Please make sure that url rewrite is enabled on the server.
- Redirect to `__dynamic.html`.
