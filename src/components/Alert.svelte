<script lang="ts">
  type Severity = 'info' | 'error';

  export let message: string;
  export let severity: Severity;
</script>

<style lang="postcss">
  .alert {
    @apply flex border rounded text-sm p-3;
  }
  cai-icon {
    @apply mr-2;
    width: 20px;
    height: 20px;
  }
  .message {
    @apply leading-snug;
  }
  .info {
    @apply border-purple-500;
  }
  .error {
    @apply border-red-500;
  }
</style>

<div
  class="alert"
  class:error={severity === 'error'}
  class:info={severity === 'info'}>
  {#if severity === 'error'}
    <cai-icon name="ErrorCircle" width="20px" height="20px" />
  {:else if severity === 'info'}
    <cai-icon name="InfoCircle_Purple" width="20px" height="20px" />
  {/if}
  <div class="message">
    {@html message}
  </div>
</div>
