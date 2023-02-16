<!--
  ADOBE CONFIDENTIAL
  Copyright 2022 Adobe
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
  import { tippy } from '$lib/tippy';
  import type { TippyProps } from '$lib/tippy';
  import EthereumLogo from '../../assets/svg/color/logos/crypto-eth.svg?component';
  import SolanaLogo from '../../assets/svg/color/logos/crypto-sol.svg?component';

  export let type: string;
  export let address: string;

  let tippyOpts: Partial<TippyProps> = {
    trigger: 'click',
    appendTo: document.body,
    placement: 'right',
    onShow(instance) {
      setTimeout(() => {
        instance.hide();
      }, 5000);
    },
  };

  $: truncatedAddress = `${address.slice(0, 6)}...${address.slice(-5)}`;

  function handleClick(address: string) {
    navigator.clipboard.writeText(address);
  }
</script>

<dd class="flex items-center" data-test-id="about.crypto-address">
  <div class="mr-1.5">
    {#if type === 'ethereum'}
      <EthereumLogo width="16px" height="16px" />
    {:else if type === 'solana'}
      <SolanaLogo width="16px" height="16px" />
    {/if}
  </div>
  <button
    use:tippy={{
      content: $_('web3Address.copiedPopover'),
      ...tippyOpts,
    }}
    class="break-all bg-gray-200 rounded-full px-2 cursor-pointer"
    on:click={() => handleClick(address)}>
    {truncatedAddress}
  </button>
</dd>
