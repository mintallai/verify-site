<script lang="ts">
  import '@contentauth/web-components/dist/icons/monochrome/alert-circle';

  type Severity = 'info' | 'error';

  export let message: string;
  export let severity: Severity;
</script>

<div
  class="alert"
  class:error={severity === 'error'}
  class:info={severity === 'info'}
>
  {#if severity === 'error'}
    <cai-icon-alert-circle />
  {:else if severity === 'info'}
    <cai-icon name="InfoCircle_Purple" width="20px" height="20px" />
  {/if}
  <div class="message">
    {@html message}
  </div>
</div>

<style lang="postcss">
  .alert {
    @apply flex text-base text-white px-4 py-3;
  }
  cai-icon-alert-circle {
    @apply text-white mr-3;
    --cai-icon-width: 16px;
    --cai-icon-height: 16px;
  }
  cai-icon {
    @apply mr-2;
  }
  .message {
    @apply leading-small;
  }
  .info {
    @apply border-blue-500;
  }
  .error {
    @apply bg-red-500;
  }
</style>
