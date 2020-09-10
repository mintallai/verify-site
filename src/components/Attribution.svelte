<script lang="ts">
  import size from 'lodash/size';
  import sum from 'lodash/sum';
  import toPairs from 'lodash/toPairs';
  import pullAllWith from 'lodash/pullAllWith';
  import parseISO from 'date-fns/parseISO';
  import Icon from './Icon.svelte';
  import { formatDate, formatTime } from '../lib/util/format';

  export let claim: IClaimSummary;
  let mostUsedTools = [];

  $: dateCreated = parseISO(claim.date_created);
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
    console.log('mostUsed', mostUsedTools);
  }
</script>

<style lang="postcss">
  img.logo {
    @apply ml-1;
    width: 14px;
    height: 14px;
  }
</style>

<div class="p-5">
  <h2 class="mb-5 flex items-center">
    <span>Attribution</span>
    <Icon size="m" name="workflow:HelpOutline" class="text-gray-400 ml-2" />
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
    <dt class="mb-2">Edit Type</dt>
    <dd>{Object.keys(claim.edits.categories).join(', ')}</dd>
  </dl>
  <dl class="attributes mt-3">
    <dt>Number of Tools</dt>
    <dd>{size(claim.edits.tool_usage)}</dd>
  </dl>
  <dl class="attributes multiline mt-3">
    <dt class="mb-2">Most Used Tools</dt>
    <dd class="ml-4">
      {#each mostUsedTools as tool}
        <div class="mb-2">
          {tool.name}
          <span class="text-gray-400 ml-1">{tool.percentage}%</span>
        </div>
      {/each}
    </dd>
    <dt class="mt-3 mb-2">Special Filters</dt>
    <dd>{claim.edits.special_filters.join(', ')}</dd>
  </dl>
</div>
