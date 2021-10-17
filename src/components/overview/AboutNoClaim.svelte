<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Thumbnail from '../Thumbnail.svelte';
  import { getBadgeProps } from '../../lib/claim';
  import { Ingredient, Source } from '../../lib/sdk';

  export let primary: Ingredient | Source;

  $: title =
    primary instanceof Ingredient
      ? primary.data.title
      : primary?.metadata?.filename ?? '';
</script>

<div class="w-full flex justify-center">
  <div class="info w-full max-w-xs">
    <div>
      <dl class="attributes">
        <dt>
          <div>{$_('comp.about.contentCredentials.header')}</div>
          <cai-tooltip placement="left" class="theme-spectrum">
            <div slot="content" class="text-gray-900" style="width: 200px;">
              {$_('comp.about.contentCredentials.helpText')}
            </div>
          </cai-tooltip>
        </dt>
        <dd class="flex space-x-2 items-center mt-1">
          <div class="w-12 h-12">
            <Thumbnail asset={primary} />
          </div>
          <div>
            <h6>File name</h6>
            <div>{title}</div>
          </div>
        </dd>
      </dl>
    </div>
  </div>
</div>
