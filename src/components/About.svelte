<script lang="ts" context="module">
  const translations = {
    AI_ASSISTED: 'AI Assisted',
    CAPTURE: 'Capture',
    COLOR_ADJUSTMENTS: 'Color & Adjustments',
    EFFECTS_STYLING: 'Effects & Styling',
    IMPORT_GROUPING: 'Import & Grouping',
    PAINTING: 'Painting',
    SHAPES_PATHS: 'Shapes & Paths',
    TRANSFORMS: 'Transforms',
    TYPE: 'Type',
    VIDEO: 'Video',
    // TODO: Remove (Legacy)
    IMPORTED_ASSETS: 'Import & Grouping',
  };
  const iconMapping = {
    AI_ASSISTED: 'Actions',
    CAPTURE: 'Camera',
    COLOR_ADJUSTMENTS: 'ColorPalette',
    EFFECTS_STYLING: 'Actions',
    IMPORT_GROUPING: 'FolderOpenOutline',
    PAINTING: 'Brush',
    SHAPES_PATHS: 'Shapes',
    TRANSFORMS: 'Group',
    TYPE: 'Text',
    VIDEO: 'VideoOutline',
    // TODO: Remove (Legacy)
    IMPORTED_ASSETS: 'FolderOpenOutline',
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import toPairs from 'lodash/toPairs';
  import pullAllWith from 'lodash/pullAllWith';
  import parseISO from 'date-fns/parseISO';
  import Icon from './Icon.svelte';
  import { tippy } from '../lib/tippy';
  import { formatDate, formatTime } from '../lib/util/format';

  export let claim: IClaimSummary;
  export let isComparing: boolean = false;
  let mostUsedTools = [];
  const dispatch = createEventDispatcher();

  $: dateCreated = parseISO(claim.date_created);
  $: categoryList = Object.keys(claim.edits.categories);
  $: {
    const sorted = toPairs(claim.edits.tool_usage)
      .sort((a, b) => (a[1] < b[1] ? 1 : -1))
      .map(([name]) => name);
    mostUsedTools = pullAllWith(sorted, claim.edits.special_filters);
  }
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
</style>

<div class="p-5">
  <h2 class="mb-5 flex items-center">
    <span>About This Content</span>
    <Icon size="m" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
    {#if isComparing}
      <div
        class="flex-grow flex justify-end cursor-pointer"
        on:click={() => dispatch('close', { claim })}>
        <Icon size="m" name="workflow:Close" class="text-gray-400 ml-2" />
      </div>
    {/if}
  </h2>
  <dl class="attributes">
    <dt>Edited By</dt>
    <dd>{claim.contributor}</dd>
    <dt>Signed In With</dt>
    <dd class="flex items-center">
      <span>{claim.verified_by}</span>
      <img
        src={`images/svg/logos/${claim.verified_by?.toLowerCase()}.svg`}
        class="logo"
        alt="Adobe" />
    </dd>
    <dt>Edited In</dt>
    <dd class="flex items-center">
      <span>{claim.created_with}</span>
      <img
        src={`images/svg/logos/${claim.created_with?.toLowerCase()}.svg`}
        class="logo"
        alt={claim.created_with} />
    </dd>
    <dt>Export Date</dt>
    <dd class="text-right leading-tight">
      {formatDate(dateCreated)}, {formatTime(dateCreated)}
    </dd>
  </dl>
  <dl class="attributes multiline border-t border-gray-200 mt-5 pt-4">
    <dt class="mb-2 items-center">Edit Type</dt>
    <dd>
      {#each categoryList as category}
        <div class="category">
          <Icon
            size="m"
            name={`workflow:${iconMapping[category]}`}
            class="mr-2" />
          <div class="flex-grow">{translations[category]}</div>
          <div
            use:tippy={{ content: 'This is some filler text.' }}
            class="cursor-pointer">
            <Icon size="s" name="workflow:HelpOutline" class="text-gray-400" />
          </div>
        </div>
      {/each}
    </dd>
  </dl>
  <dl class="attributes multiline mt-3">
    <dt class="mb-2 items-center"><span>Most Used</span></dt>
    <dd>
      {#if mostUsedTools.length}
        <div>
          {#each mostUsedTools as tool}
            <div class="mb-2">{tool}</div>
          {/each}
        </div>
      {:else}<span class="italic">None</span>{/if}
    </dd>
    <dt class="mt-3 mb-2 items-center">Specialized</dt>
    <dd>
      {#if claim.edits.special_filters?.length}
        {claim.edits.special_filters.join(', ')}
      {:else}<span>None</span>{/if}
    </dd>
  </dl>
</div>
