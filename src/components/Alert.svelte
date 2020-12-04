<script lang="ts">
  type Severity = 'info' | 'error';

  export let message: string;
  export let severity: Severity;
</script>

<style lang="postcss">
  .alert {
    @apply flex items-center border rounded text-sm p-3;
  }
  cai-icon {
    @apply mr-2;
    width: 20px;
    height: 20px;
  }
  .info {
  }
  .error {
    @apply border-red-500;
  }
</style>

<div
  class="alert"
  class:error={severity === 'error'}
  class:info={severity === 'info'}>
  <cai-icon name="ErrorCircle" width="20px" height="20px" />
  {message}
</div>
