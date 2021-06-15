<script lang="ts">
	import { onMount } from 'svelte'
	import '@contentauth/web-components/dist/components/Thumbnail';

	export let src: Blob | null;
	let blobUrl: string;

	onMount(() => {
		if (src) {
			blobUrl = URL.createObjectURL(src);
		}

		return () => {
			if (blobUrl) {
				URL.revokeObjectURL(blobUrl);
			}
		}
	})
</script>

<cai-thumbnail
	class="theme-spectrum"
	{...$$restProps}	
	src={blobUrl}
/>