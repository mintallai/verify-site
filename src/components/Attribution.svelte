<script lang="ts">
  import Icon from '../components/Icon.svelte';
</script>

<style lang="postcss">
  dl {
    dt {
      @apply font-bold text-xs uppercase text-gray-500 float-left clear-left mb-2;
      line-height: 1.45rem;
      vertical-align: middle;
    }
    dd {
      @apply text-base float-right;
    }
  }
  img.logo {
    @apply ml-1;
    width: 14px;
    height: 14px;
  }
</style>

<div>
  <h2>Attribution</h2>
  <dl>
    <dt>Creator</dt>
    <dd>Pia Blumenthal</dd>
    <dt>Creator Verified By</dt>
    <dd class="flex items-center">
      <span>Adobe</span>
      <img src="images/svg/logos/adobe.svg" class="logo" alt="Adobe" />
    </dd>
    <dt>Created With</dt>
    <dd class="flex items-center">
      <span>Photoshop</span>
      <img src="images/svg/logos/photoshop.svg" class="logo" alt="Photoshop" />
    </dd>
  </dl>
</div>
