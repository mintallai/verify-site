<script lang="ts">
  import { url } from '@sveltech/routify';
</script>

<style lang="postcss">
  footer {
    @apply border-gray-200 border-t items-center justify-center px-8;
    height: 114px;
  }
  .content {
    @apply text-xs;
  }
  .content > span:not(:last-child)::after {
    @apply inline-block px-2;
    content: '/';
  }
</style>

<footer class="flex">
  <div class="content flex flex-wrap justify-center">
    <span>Copyright © __year__ Adobe. All rights reserved.</span>
    <span><a href="#">Privacy</a></span>
    <span><a href="#">Terms of Use</a></span>
    <span><a href="#">Cookies</a></span>
    <span><a href="#">Do not sell my personal information</a></span>
  </div>
</footer>
