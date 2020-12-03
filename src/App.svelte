<script lang="ts">
  import Router from '@roxi/routify/runtime/Router.svelte';
  import { routes } from '../.routify/routes';
  import '@contentauth/web-components/dist/ClaimInfo';
</script>

<style global>
  @import 'tailwindcss/base';
  @import '../static/base.css';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  @import 'tippy.js/dist/tippy.css';
</style>

<Router {routes} />
