<script lang="ts" context="module">
  const translations = {
    AI_ASSISTED: 'AI Assisted',
    CAPTURE: 'Capture',
    COLOR_ADJUSTMENTS: 'Color & Adjustments',
    EFFECTS_STYLING: 'Effects & Styling',
    IMPORTED_ASSETS: 'Imported Assets',
    PAINTING: 'Painting',
    SHAPES_PATHS: 'Shapes & Paths',
    TRANSFORMED: 'Transformed',
    TYPE: 'Type',
    UPLOADED: 'Uploaded',
    VIDEO: 'Video',
  };
  const iconMapping = {
    AI_ASSISTED: 'Algorithm',
    CAPTURE: 'Camera',
    COLOR_ADJUSTMENTS: 'ColorPalette',
    EFFECTS_STYLING: 'Actions',
    IMPORTED_ASSETS: 'FolderOpenOutline',
    PAINTING: 'Brush',
    SHAPES_PATHS: 'Shapes',
    TRANSFORMED: 'Group',
    TYPE: 'Text',
    UPLOADED: 'UploadToCloud',
    VIDEO: 'VideoOutline',
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import parseISO from 'date-fns/parseISO';
  import Icon from './Icon.svelte';
  import { assetsByIdentifier } from '../stores';
  import { getAssetList } from '../lib/claim';
  import { tippy } from '../lib/tippy';
  import type { TippyProps } from '../lib/tippy';
  import { formatDate, formatTime, asFilename } from '../lib/util/format';

  export let claim: IClaimSummary;
  export let isComparing: boolean = false;
  const dispatch = createEventDispatcher();
  const tippyProps: Partial<TippyProps> = {
    content: 'This asset has attribution<br/>and history data.',
    placement: 'top-start',
    offset: [-10, 8],
  };

  $: signedOn = parseISO(claim.signed_on);
  $: assetList = getAssetList(claim, $assetsByIdentifier);
</script>

<style lang="postcss">
  img.logo {
    @apply ml-1;
    width: 14px;
    height: 14px;
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

<div class="p-5">
  <h2 class="mb-2 flex items-center">
    {#if isComparing}
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
    {:else}
      <div>About this content</div>
    {/if}
  </h2>
  {#if isComparing}
    <div
      class="compare-thumbnail"
      style={`background-image: url("${claim.thumbnail_url}");`} />
  {/if}
  <dl class="attributes mt-3">
    <dt>Produced by</dt>
    <dd>{claim.produced_by}</dd>
    <dt>Produced with</dt>
    <dd class="flex items-center">
      <span>{claim.produced_with}</span>
      <img
        src={`images/svg/logos/${asFilename(claim.produced_with)}.svg`}
        class="logo"
        alt={claim.produced_with} />
    </dd>
    <dt>Signed by</dt>
    <dd class="flex items-center">
      <span>{claim.signed_by}</span>
      <img
        src={`images/svg/logos/${asFilename(claim.signed_by)}.svg`}
        class="logo"
        alt="Adobe" />
    </dd>
    <dt>Signed on</dt>
    <dd class="text-right leading-tight">
      {formatDate(signedOn)}, {formatTime(signedOn)}
    </dd>
  </dl>
  <dl class="attributes multiline border-t border-gray-200 mt-5 pt-4">
    <dt class="mb-2 items-center">Edits and activity</dt>
    <dd>
      {#each claim.edits.categories as category}
        <div class="category">
          <Icon
            size="s"
            name={`workflow:${iconMapping[category]}`}
            class="mr-2" />
          <div class="flex-grow">{translations[category]}</div>
        </div>
      {/each}
    </dd>
    {#if claim.camera_info?.camera}
      <dt>Camera</dt>
      <dd>{claim.camera_info.camera}</dd>
    {/if}
    {#if claim.camera_info?.lens}
      <dt>Lens</dt>
      <dd>{claim.camera_info.lens}</dd>
    {/if}
    {#if claim.camera_info?.focal_length}
      <dt>Focal Length</dt>
      <dd>{claim.camera_info.focal_length}</dd>
    {/if}
    {#if claim.camera_info?.exposure}
      <dt>Exposure</dt>
      <dd>{claim.camera_info.exposure}</dd>
    {/if}
    {#if claim.location}
      <dt>Location</dt>
      <dd>{claim.location}</dd>
    {/if}
  </dl>
  {#if claim.stock}
    <dl class="attributes border-t border-gray-200 mt-5 pt-4">
      {#if claim.stock.license_type}
        <dt>Source</dt>
        <dd>{claim.stock.source}</dd>
      {/if}
      {#if claim.stock.license_type}
        <dt>License type</dt>
        <dd>{claim.stock.license_type}</dd>
      {/if}
    </dl>
  {/if}
  {#if isComparing && assetList}
    <dl class="attributes multiline border-t border-gray-200 mt-5 pt-4">
      <dt>Assets used</dt>
      <dd>
        {#each assetList as asset}
          <div
            class="asset-thumbnail"
            style={`background-image: url("${asset.thumbnail_url}");`}>
            {#if asset.claim_id}
              <div class="info-container" use:tippy={tippyProps}>
                <div class="info">
                  <Icon size="m" name="workflow:Info" class="text-white" />
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </dd>
    </dl>
  {/if}
</div>
