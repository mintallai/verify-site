<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Alert from '../Alert.svelte';
  import { Claim, RecorderFormat } from '../../lib/sdk';

  export let type: 'original' | 'secureCapture' = 'original';
  export let claim: Claim;
</script>

<Alert severity="info">
  <div class="text-base flex-grow">
    <div class="font-bold text-gray-900 mb-3">
      {$_('comp.originalCreation.title')}
    </div>
    <div>
      {#if type === 'original'}
        {$_('comp.originalCreation.recorder', {
          values: {
            application: claim.formatRecorder(
              RecorderFormat.ProgramNameAndVersion,
            ),
          },
        })}
      {:else if type === 'secureCapture'}
        <div>
          {$_('comp.originalCreation.secureCapture')}
          <a
            href="https://contentauthenticity.org/faq#block-yui_3_17_2_1_1607115018705_17736"
            class="link"
            target="_blank">{$_('comp.originalCreation.learnMore')}</a>
        </div>
      {/if}
    </div>
  </div>
</Alert>
