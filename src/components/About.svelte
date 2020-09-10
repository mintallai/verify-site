<script lang="ts" context="module">
  const translations = {
    AI_ASSISTED: 'AI Assisted',
    CAPTURE: 'Capture',
    COLORS_ADJUSTMENTS: 'Colors & Adjustments',
    IMPORTED_ASSETS: 'Imported Assets',
    PAINTING: 'Painting',
    STYLES_EFFECTS: 'Styles & Effects',
    TRANSFORMS: 'Transforms',
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import size from 'lodash/size';
  import sum from 'lodash/sum';
  import toPairs from 'lodash/toPairs';
  import pullAllWith from 'lodash/pullAllWith';
  import parseISO from 'date-fns/parseISO';
  import Icon from './Icon.svelte';
  import { formatDate, formatTime } from '../lib/util/format';

  export let claim: IClaimSummary;
  export let isComparing: boolean = false;
  let mostUsedTools = [];
  const dispatch = createEventDispatcher();

  $: dateCreated = parseISO(claim.date_created);
  $: categoryList = Object.keys(claim.edits.categories).map(
    (x) => translations[x],
  );
  $: {
    const totalEdits = sum(Object.values(claim.edits.tool_usage));
    const sorted = toPairs(claim.edits.tool_usage)
      .sort((a, b) => (a[1] < b[1] ? 1 : -1))
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalEdits) * 100),
      }));
    mostUsedTools = pullAllWith(
      sorted,
      claim.edits.special_filters,
      (a, b) => a.name === b,
    );
  }
</script>

<style lang="postcss">
  img.logo {
    @apply ml-1;
    width: 14px;
    height: 14px;
  }
  .category {
    @apply mr-2 mb-2 px-2 py-1 inline-block uppercase border border-gray-300 text-xs font-bold rounded-sm;
    padding-top: 3px;
  }
</style>

<div class="p-5">
  <h2 class="mb-5 flex items-center">
    <span>About This Image</span>
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
    <dt>Creator</dt>
    <dd>{claim.contributor}</dd>
    <dt>Creator Verified By</dt>
    <dd class="flex items-center">
      <span>{claim.verified_by}</span>
      <img
        src={`images/svg/logos/${claim.verified_by.toLowerCase()}.svg`}
        class="logo"
        alt="Adobe" />
    </dd>
    <dt>Created With</dt>
    <dd class="flex items-center">
      <span>{claim.created_with}</span>
      <img
        src={`images/svg/logos/${claim.created_with.toLowerCase()}.svg`}
        class="logo"
        alt={claim.created_with} />
    </dd>
    <dt>Date Created</dt>
    <dd class="text-right leading-tight">
      <span>{formatDate(dateCreated)}</span><br />
      <span class="text-gray-500">{formatTime(dateCreated)}</span>
    </dd>
  </dl>
  <dl class="attributes multiline border-t border-gray-200 mt-5 pt-4">
    <dt class="mb-2 flex items-center">
      <span>Edit Type</span>
      <Icon size="s" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
    </dt>
    <dd>
      {#each categoryList as category}
        <div class="category">{category}</div>
      {/each}
    </dd>
  </dl>
  <dl class="attributes multiline mt-3">
    <dt class="flex items-center">
      <span>Number of Tools</span>
      <Icon size="s" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
    </dt>
    <dd>{size(claim.edits.tool_usage)}</dd>
  </dl>
  <dl class="attributes multiline mt-3">
    <dt class="mb-2 flex items-center">
      <span>Most Used Tools</span>
      <Icon size="s" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
    </dt>
    <dd>
      {#if mostUsedTools.length}
        <div class="ml-4">
          {#each mostUsedTools as tool}
            <div class="mb-2">
              {tool.name}
              <span class="text-gray-400 ml-1">{tool.percentage}%</span>
            </div>
          {/each}
        </div>
      {:else}<span class="italic">None</span>{/if}
    </dd>
    <dt class="mt-3 mb-2 flex items-center">
      <span>Special Filters</span>
      <Icon size="s" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
    </dt>
    <dd>
      {#if claim.edits.special_filters.length}
        {claim.edits.special_filters.join(', ')}
      {:else}<span class="italic">None</span>{/if}
    </dd>
  </dl>
</div>
