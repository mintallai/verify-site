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
  import NoCredentials from '../../../assets/svg/monochrome/no-credentials.svg';
  import Otgp from '../../../assets/svg/monochrome/otgp.svg';
  import { unknownLearnMoreUrl } from '../../stores';
  export let status: 'missing' | 'none' = 'none';
  export let isComparing: boolean = false;
</script>

<div class:comparing={isComparing} class="cc-container">
  {#if status === 'missing'}
    <Otgp
      width="126"
      height="90"
      class="text-gray-500 mb-4 hidden lg:block mt-0 lg:mt-5" />
    <div class="message-heading">
      {$_('comp.contentCredentialsError.missing')}
    </div>
    <div class="message-text">
      {$_('comp.contentCredentialsError.missingText')}
      <a class="link" href={$unknownLearnMoreUrl} target="_blank"
        >{$_('comp.contentCredentialsError.learnMore')}</a>
    </div>
  {:else if status === 'none'}
    <NoCredentials
      width="126"
      height="90"
      class="text-gray-500 mb-4 hidden lg:block mt-0 lg:mt-5" />
    <div class="message-heading">{$_('comp.contentCredentialsError.none')}</div>
    <div class="message-text">
      {$_('comp.contentCredentialsError.noneText')}
    </div>
  {/if}
</div>

<style lang="postcss">
  .cc-container {
    @apply h-full flex flex-col justify-center items-center p-4 mx-auto;
  }
  .comparing.cc-container {
    @apply sticky top-0 h-screen;
  }
  @screen lgHeight {
    .comparing.cc-container {
      @apply h-auto pt-0;
      top: 150px;
    }
  }
  @screen lg {
    .comparing.cc-container {
      @apply relative h-full pt-4;
      top: 0;
    }
  }
</style>
