<script>
  import { page } from '$app/stores';
</script>

<div class="error">
  <div class="huge">{$page.status}</div>
  <div class="big">
    {$page.error.message}.
    <a href="/">Go back</a>
  </div>
</div>

<style>
  .huge {
    font-size: 12rem;
  }
  .error {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
</style>
