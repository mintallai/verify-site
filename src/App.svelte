<script lang="ts">
  import Router from '@roxi/routify/runtime/Router.svelte';
  import { routes } from '../.routify/routes';

  console.debug(`Verify site running revision ${process.env.GIT_REVISION}`);

</script>

<Router {routes} />

<style global>
  @import '../static/spectrum-vars.css';
  @import 'tailwindcss/base';
  @import '../static/base.css';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  @import 'tippy.js/dist/tippy.css';

</style>
