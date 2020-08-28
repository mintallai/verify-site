<script>
  import { Router } from '@sveltech/routify';
  import { routes } from '../.routify/routes';
</script>

<style global>
  @import url('https://use.typekit.net/cfs0cth.css');
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';
  @import '../static/global.css';
</style>

<Router {routes} />
