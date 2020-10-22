<script lang="ts">
  import Icon from './Icon.svelte';
  import { tippy } from '../lib/tippy';

  export let content: string;
  export let size = 's';
</script>

<div
  class={$$props.class}
  use:tippy={{ content, placement: 'top-start', offset: [-10, 8] }}>
  <Icon {size} name="workflow:HelpOutline" class="text-gray-400" />
</div>
