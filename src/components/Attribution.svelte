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
      <span>{data.verified_by}</span>
      <img
        src={`images/svg/logos/${data.verified_by.toLowerCase()}.svg`}
        class="logo"
        alt="Adobe" />
    </dd>
    <dt>Created With</dt>
    <dd class="flex items-center">
      <span>{data.created_with}</span>
      <img
        src={`images/svg/logos/${data.created_with.toLowerCase()}.svg`}
        class="logo"
        alt={data.created_with} />
    </dd>
  </dl>
</div>
