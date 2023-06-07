<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
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
  import '@spectrum-web-components/radio/sp-radio-group.js';

  export let selected: string;
  export let name: string;
</script>

<sp-theme color="lightest" scale="medium" class="w-full">
  <sp-radio-group {selected} {name}>
    <slot />
  </sp-radio-group>
</sp-theme>
