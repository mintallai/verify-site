<!--
 Legacy redirect: This page redirects /verify to / for backward compatibility.
 This redirect is maintained to support external applications that link to /verify.
-->

<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const url = new URL($page.url.origin);

  const params = new URLSearchParams($page.url.searchParams);

  params.entries().forEach(([key, val]) => {
    url.searchParams.append(key, val);
  });

  goto(url);
</script>
