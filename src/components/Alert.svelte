<script lang="ts">
  import AlertIcon from '../../assets/svg/monochrome/alert.svg';
  import '@contentauth/web-components/dist/icons/color/info-blue';

  type Severity = 'info' | 'error';

  export let severity: Severity;
</script>

<div
  class="alert"
  class:error={severity === 'error'}
  class:info={severity === 'info'}>
  {#if severity === 'error'}
    <AlertIcon width="17px" height="17px" class="icon mr-3" />
    <slot />
  {:else if severity === 'info'}
    <slot />
    <cai-icon-info-blue class="icon" />
  {/if}
</div>

<style lang="postcss">
  .alert {
    @apply w-full flex text-base text-white px-4 py-3 leading-small;
  }
  .icon {
    @apply text-white flex-shrink-0;
    --cai-icon-width: 16px;
    --cai-icon-height: 16px;
  }
  cai-icon-info-blue {
    @apply ml-3;
    --cai-icon-width: 20px;
    --cai-icon-height: 20px;
  }
  .info {
    @apply border-blue-500 border-2 rounded px-3 text-gray-700;
  }
  .error {
    @apply bg-red-500;
  }
</style>
