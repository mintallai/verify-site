<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Thumbnail from '../Thumbnail.svelte';
  import { getBadgeProps } from '../../lib/claim';
  import { Ingredient, Source, IError } from '../../lib/sdk';
  import { getFaqUrl } from '../../stores';

  export let primary: Ingredient | Source;
  export let isComparing: boolean = false;
  export let errors: IError[] = [];

  $: title =
    primary instanceof Ingredient
      ? primary.data.title
      : primary?.metadata?.filename ?? '';
  $: badgeProps =
    primary instanceof Ingredient
      ? getBadgeProps({
          claim: primary.claim,
          errors: errors.length ? errors : primary.errors,
        })
      : getBadgeProps({
          errors,
        });
  $: showInfo =
    primary instanceof Source ||
    (primary instanceof Ingredient &&
      (!primary.claim || badgeProps?.badgeHelpText));
</script>

<div data-test-id="about" class="w-full flex justify-center">
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
        <dd
          class="flex space-x-2 items-center mt-1"
          data-test-id="about.file-name">
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
        {:else if badgeProps?.badgeHelpText}
          <span>{$_(badgeProps.badgeHelpText)}</span>
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
