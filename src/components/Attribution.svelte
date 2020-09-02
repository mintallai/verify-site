<script lang="ts">
  import Icon from '../components/Icon.svelte';

  export let data: IClaimSummary;
</script>

<style lang="postcss">
  dt {
    @apply font-bold text-xs uppercase text-gray-500 float-left clear-left mb-2;
    line-height: 1.45rem;
    vertical-align: middle;
  }
  dd {
    @apply text-base float-right;
  }
  img.logo {
    @apply ml-1;
    width: 14px;
    height: 14px;
  }
</style>

<div>
  <h2>Attribution</h2>
  <dl>
    <dt>Creator</dt>
    <dd>{data.contributor}</dd>
    <dt>Creator Verified By</dt>
    <dd class="flex items-center">
      <span>{data.verifiedBy.organizationName}</span>
      <img
        src={data.verifiedBy.iconURL}
        class="logo"
        alt={data.verifiedBy.organizationName} />
    </dd>
    <dt>Created With</dt>
    <dd class="flex items-center">
      <span>{data.createdWith.programName}</span>
      <img
        src={data.createdWith.iconURL}
        class="logo"
        alt={data.createdWith.programName} />
    </dd>
  </dl>
</div>
