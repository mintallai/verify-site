<script lang="ts">
  import Router from '@sveltech/routify/runtime/Router.svelte';
  import { routes } from '../.routify/routes';
</script>

<style global>
  @import url('https://use.typekit.net/cfs0cth.css');
  @import 'tailwindcss/base';
  @import '../static/base.css';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
</style>

<Router {routes} />
