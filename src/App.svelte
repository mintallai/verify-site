<script lang="ts">
  import Router from '@sveltech/routify/runtime/Router.svelte';
  import { routes } from '../.routify/routes';
</script>

<style global>
  @import 'tailwindcss/base';
  @import '../static/base.css';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  @import 'tippy.js/dist/tippy.css';
</style>

<Router {routes} />
