<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import parseISO from 'date-fns/parseISO';
  import Icon from './Icon.svelte';
  import HelpIcon from './HelpIcon.svelte';
  import { assetsByIdentifier } from '../stores';
  import { getAssetList } from '../lib/claim';
  import { tippy } from '../lib/tippy';
  import type { TippyProps } from '../lib/tippy';
  import { formatDate, formatTime, asFilename } from '../lib/util/format';
  import '@contentauth/web-components/dist/ClaimInfo';

  export let claim: IClaimSummary;
  export let isComparing: boolean = false;
  export let isPopup: boolean = false;
  const dispatch = createEventDispatcher();
  const tippyProps: Partial<TippyProps> = {
    content: 'This asset has attribution<br/>and history data.',
    placement: 'top-start',
    offset: [-10, 8],
  };

  $: signedOn = parseISO(claim.signed_on);
  $: assetList = getAssetList(claim, $assetsByIdentifier);
  $: alternate = isComparing || isPopup;
  $: helpSize = isComparing ? 'xs' : 's';
</script>

<style lang="postcss">
  img.logo {
    @apply ml-1;
    width: 14px;
    height: 14px;
  }
  h2.filename {
    @apply mt-0 mb-3;
  }
  h2:first-child {
    @apply mt-0;
  }
  h2.alternate {
    @apply text-sm pt-4 mb-3;
  }
  h2.alternate:not(:first-child) {
    @apply border-t border-gray-200 mt-4;
  }
  h2.alternate .icon {
    top: 1px;
  }
  .category {
    @apply flex items-center mb-1;
  }
  .close {
    @apply bg-gray-200 rounded-full cursor-pointer flex items-center justify-center;
    width: 28px;
    height: 28px;
  }
  dl.multiline dd {
    @apply my-2;
  }
  dl.multiline dt {
    @apply mt-2;
  }
  .compare-title {
    @apply font-bold text-xl truncate mb-1;
    max-width: 240px;
  }
  .compare-thumbnail {
    @apply w-full border border-gray-350 bg-white rounded bg-contain bg-center bg-no-repeat;
    height: 280px;
  }
  .asset-thumbnail {
    @apply inline-block relative mr-2 mb-2 border border-gray-350 bg-white rounded-sm bg-contain bg-center bg-no-repeat;
    width: 64px;
    height: 64px;
  }
  .info-container {
    @apply bg-black border-gray-350 border rounded-full overflow-hidden absolute cursor-pointer;
    width: 16px;
    height: 16px;
    right: 1px;
    bottom: 1px;
  }
  .info {
    @apply absolute;
    top: -1px;
    left: -1px;
  }
</style>

<div>
  <!-- Compare header -->
  {#if alternate}
    {#if isComparing}
      <h2 class="filename">
        <div>
          <div class="font-bold text-xs uppercase text-gray-500 leading-none">
            File name
          </div>
          <div class="compare-title">{claim.title}</div>
        </div>
        <div class="flex-grow flex justify-end">
          <div class="close" on:click={() => dispatch('close', { claim })}>
            <Icon size="m" name="workflow:Close" class="text-gray-400" />
          </div>
        </div>
      </h2>
    {/if}
    <div
      class="compare-thumbnail"
      style={`background-image: url("${claim.thumbnail_url}");`} />
  {/if}

  <claim-info {claim} variant="lg" />
</div>
