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
  import { date, time, _ } from 'svelte-i18n';
  export let sigDate;
  export let noTime: boolean = false;
</script>

<p class="text-gray-700">
  {#if sigDate.toString() === 'Invalid Date'}
    {$_('comp.date.invalid')}
  {:else if noTime}
    {$date(sigDate, { format: 'medium' })}
  {:else}{$date(sigDate, { format: 'medium' })}{' at '}
    {$time(sigDate, {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    })}
  {/if}
</p>
