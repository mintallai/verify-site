<script lang="ts">
  import '@spectrum-web-components/progress-circle/sp-progress-circle.js';

  export let size: 's' | 'm' | 'l' = 's';
</script>

<sp-theme color="lightest" scale="medium">
  <sp-progress-circle
    label="Loading asset data"
    indeterminate="true"
    {size}
    class="loader" />
</sp-theme>
