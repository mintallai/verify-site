<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Alert from '../Alert.svelte';
  import type { HierarchyTreeNode } from '../../stores';
  import { getManifest } from '../../lib/manifest';

  export let type: 'original' | 'secureCapture' = 'original';
  export let node: HierarchyTreeNode;

  $: generator = getManifest(node)?.data?.claimGenerator?.product ?? '';
</script>

<Alert severity="info">
  <div class="text-base flex-grow" data-test-id="original-creation">
    <div class="font-bold text-gray-900 mb-3">
      {$_('comp.originalCreation.title')}
    </div>
    <div>
      {#if type === 'original'}
        {$_('comp.originalCreation.generator', {
          values: {
            product: generator,
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
