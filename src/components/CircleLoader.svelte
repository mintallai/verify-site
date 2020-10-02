<script lang="ts">
  import '@spectrum-web-components/circle-loader/sp-circle-loader.js';
</script>

<style lang="postcss">
  .loader {
    --spectrum-loader-circle-medium-track-fill-color: theme(
      'colors.purple.500'
    );
  }
</style>

<sp-theme color="lightest" scale="large">
  <sp-circle-loader indeterminate="true" size="large" class="loader" />
</sp-theme>
