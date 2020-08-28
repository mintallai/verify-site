<script lang="ts">
  import html from 'html-parse-stringify';

  let elements = '';
  export let svg = '';
  export let size = '20px';
  export let width = size;
  export let height = size;
  export let color = 'currentColor';
  export let stroke = color;
  export let fill = color;
  $: {
    let [parsed] = html.parse(svg);
    parsed.attrs = {
      ...parsed.attrs,
      width,
      height,
      color,
      stroke,
      fill,
    };
    elements = html.stringify([parsed]);
  }
</script>

{@html elements}
