// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

// Legacy route: /verify redirects to / for backward compatibility.
// This redirect is maintained to support external applications that link to /verify.

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

export const prerender = true;
