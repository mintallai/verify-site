<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import cssVars from 'svelte-css-vars';
  import Icon from './Icon.svelte';

  export let ingredient: IReference;
  export let isComparing: boolean = false;
  const dispatch = createEventDispatcher();
</script>

<style lang="postcss">
  .close {
    @apply bg-gray-200 rounded-full cursor-pointer flex items-center justify-center;
    width: 28px;
    height: 28px;
  }
  .item {
    @apply grid gap-5 max-w-full;
    grid-template-columns: 64px auto;
    min-height: 0;
    min-width: 0;
  }
  .thumbnail {
    @apply border border-gray-350 bg-gray-100 rounded bg-no-repeat flex items-center justify-center;
    width: 64px;
    height: 64px;
  }
</style>

<div class="p-5">
  <h2 class="mb-5 flex items-center">
    <span>About this content</span>
    {#if isComparing}
      <div class="flex-grow flex justify-end">
        <div class="close" on:click={() => dispatch('close')}>
          <Icon size="m" name="workflow:Close" class="text-gray-400" />
        </div>
      </div>
    {/if}
  </h2>
  <dl class="attributes">
    <dt>File Name</dt>
    <dd>{ingredient.title}</dd>
    <dt>File Type</dt>
    <dd>JPG</dd>
  </dl>
  <dl class="attributes multiline border-t border-gray-200 mt-5 pt-4">
    <dt class="mb-2 items-center">Assets Used</dt>
    <dd>
      <div class="item">
        <div class="thumbnail">
          <Icon size="l" name="workflow:Alert" class="text-black" />
        </div>
        <div class="flex items-center">
          <div>Unverified Asset</div>
        </div>
      </div>
    </dd>
  </dl>
</div>
