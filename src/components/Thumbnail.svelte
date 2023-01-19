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
  import type { BadgeProps } from '../lib/node';
  import { thumbnail, ThumbnailEvent } from '../lib/thumbnail';
  import type { HierarchyTreeNode } from '../stores';

  export let node: HierarchyTreeNode;
  export let isSelected = false;
  export let badgeType: BadgeProps['badgeType'] = 'none';
  export let badgeHelpText: BadgeProps['badgeHelpText'] = null;
  let src = '';

  function handleThumbnail(evt: CustomEvent<ThumbnailEvent>) {
    src = evt.detail.url;
  }
</script>

<cai-thumbnail
  use:thumbnail={node}
  on:thumbnail={handleThumbnail}
  {src}
  selected={isSelected}
  badge={badgeType}
  badge-help-text={badgeHelpText ? $_(badgeHelpText) : null}
  class="theme-spectrum" />
