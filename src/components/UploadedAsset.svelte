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
  import PopoverManifestRecov from './PopoverManifestRecov.svelte';
  import BreadcrumbAsset from './BreadcrumbAsset.svelte';
  export let mobile: boolean = false;
  $: placement = mobile ? 'bottom' : 'left-start';
</script>

<div class="mr-5">
  <BreadcrumbAsset value={null} />
</div>
<div class="self-center">
  <PopoverManifestRecov {placement} />
</div>
