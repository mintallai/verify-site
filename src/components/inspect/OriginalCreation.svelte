<script lang="ts">
  import Alert from '../Alert.svelte';

  export let type: 'original' | 'secureCapture' = 'original';
  export let claim: IClaimSummary;
</script>

<Alert severity="info">
  <div class="text-base flex-grow">
    <div class="font-bold text-gray-900 mb-3">Original creation</div>
    <div>
      {#if type === 'original'}
        This photo was first produced in {claim.produced_with}.
      {:else if type === 'secureCapture'}
        <div>
          This photo was captured by a secure device. <a
            href="https://contentauthenticity.org/faq#block-yui_3_17_2_1_1607115018705_17736"
            class="link"
            target="_blank">Learn more</a
          >
        </div>
      {/if}
    </div>
  </div></Alert
>
