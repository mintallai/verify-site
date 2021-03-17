<script lang="ts">
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
    <cai-icon name="ErrorCircle" width="20px" height="20px" />
  {:else if severity === 'info'}
    <cai-icon name="InfoCircle_Purple" width="20px" height="20px" />
  {/if}
  <div class="message">
    {@html message}
  </div>
</div>

<style lang="postcss">
  .alert {
    @apply flex border rounded text-base p-3 pr-4;
  }
  cai-icon {
    @apply mr-2;
    width: 20px;
    height: 20px;
  }
  .message {
    @apply leading-small;
  }
  .info {
    @apply border-blue-500;
  }
  .error {
    @apply border-red-500;
  }
</style>
