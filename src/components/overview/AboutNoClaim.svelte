<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Thumbnail from '../Thumbnail.svelte';
  import { getBadgeProps } from '../../lib/claim';
  import { Ingredient, Source } from '../../lib/sdk';
  import { getFaqUrl } from '../../stores';

  export let primary: Ingredient | Source;

  $: title =
    primary instanceof Ingredient
      ? primary.data.title
      : primary?.metadata?.filename ?? '';
  $: badgeProps =
    primary instanceof Ingredient
      ? getBadgeProps({
          claim: primary.claim,
          errors: primary.errors,
        })
      : null;
  $: showInfo =
    primary instanceof Ingredient &&
    (!primary.claim || badgeProps?.badgeHelpText);
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
            <Thumbnail asset={primary} {...badgeProps} />
          </div>
          <div>
            <h6>File name</h6>
            <div>{title}</div>
          </div>
        </dd>
      </dl>
    </div>
    {#if showInfo}
      <div>
        {#if primary instanceof Ingredient && !primary.claim}
          {$_('comp.contentCredentialsError.noneForFile')}
        {:else if primary instanceof Ingredient && badgeProps?.badgeHelpText}
          <span>{$_(badgeProps.badgeHelpText)}</span>
          <a href={getFaqUrl()} class="link" target="_blank">
            {$_('comp.contentCredentialsError.learnMore')}
          </a>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .info > div {
    @apply py-4 border-b border-gray-300;
  }
  .info > div:first-child {
    @apply pt-0;
  }
  .info > div:last-child {
    @apply border-none;
  }
</style>
