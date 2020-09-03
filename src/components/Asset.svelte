<script lang="ts">
  import cssVars from 'svelte-css-vars';
  import { formatDate } from '../lib/util/format';

  export let asset: Asset;
</script>

<style lang="postcss">
  .thumbnail {
    @apply border border-gray-350 rounded-sm bg-contain bg-center bg-no-repeat;
    width: 94px;
    height: 94px;
    background-image: var(--backgroundImage);
  }
</style>

{#if asset.type === 'parent'}
  <div
    class="thumbnail"
    use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }} />
  <dl class="attributes multiline self-center">
    <dt>Creator</dt>
    <dd>{asset.contributor}</dd>
    <dt>Date Created</dt>
    <dd>{formatDate(asset.date_created)}</dd>
  </dl>
{:else if asset.type === 'ingredient' && asset.claim}
  <div
    class="thumbnail"
    use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }} />
  <dl class="attributes multiline overflow-hidden self-center">
    <dt>Creator</dt>
    <dd>{asset.claim.contributor}</dd>
    <dt>Date Created</dt>
    <dd>{formatDate(asset.claim.date_created)}</dd>
  </dl>
{:else}
  <div
    class="thumbnail"
    use:cssVars={{ backgroundImage: `url('${asset.thumbnail_url}')` }} />
  <dl class="attributes multiline overflow-hidden self-center">
    <dt>File Name</dt>
    <dd class="truncate">{asset.title}</dd>
  </dl>
{/if}
