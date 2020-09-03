<script lang="ts">
  import parseISO from 'date-fns/parseISO';
  import { formatDate, formatTime } from '../lib/util/format';

  export let claim: IClaimSummary;

  $: dateCreated = parseISO(claim.date_created);
</script>

<style lang="postcss">
  img.logo {
    @apply ml-1;
    width: 14px;
    height: 14px;
  }
</style>

<div>
  <h2 class="mb-5">Attribution</h2>
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
</div>
