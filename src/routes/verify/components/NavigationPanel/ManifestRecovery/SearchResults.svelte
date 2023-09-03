<script lang="ts">
  import type { ReadableRecoveredManifestStore } from '../../../stores/recoveredManifest';
  import ManifestRecoveryItem from './ManifestRecoveryItem.svelte';

  export let results: ReadableRecoveredManifestStore[];
</script>

<div class="space-y-3">
  {#each results as result}
    <ManifestRecoveryItem recoveredManifestStore={result} />
  {/each}
</div>
