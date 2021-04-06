import { optimize, extendDefaultPlugins } from 'svgo';
import { flow, camelCase, upperFirst } from 'lodash/fp';
import path from 'path';
import svelte from 'svelte/compiler';
import { createFilter } from '@rollup/pluginutils';

const classCase = flow([camelCase, upperFirst]);

const colorOverrides = [
  'removeDimensions',
  {
    name: 'removeViewBox',
    active: false,
  },
  {
    name: 'addAttributesToSVGElement',
    params: {
      attributes: [
        {
          preserveAspectRatio: 'xMidYMid meet',
        },
        {
          part: 'svg',
        },
      ],
    },
  },
];

const monochromeOverrides = [
  ...colorOverrides,
  'removeStyleElement',
  {
    name: 'removeAttrs',
    params: {
      attrs: ['id', 'stroke', 'fill'],
    },
  },
];

function renderElement({ isMonochrome, name, svg }) {
  const className = classCase(name);
  const code = `
    <script lang="ts">
      export let width = 16;
      export let height = 16;
    </script>

    <div class={$$props.class} style="width: {width}px; height: {height}px;">
      ${svg}
    </div>

    <style lang="postcss">
      svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }

      path { 
        ${isMonochrome ? `fill: inherit;` : ``}
      }
    </style>
  `;
  const { js } = svelte.compile(code, { name: className });
  return js.code;
}

export default function rollupSvelteSvg(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'rollup-svelte-svg',
    transform(svg, id) {
      if (!filter(id) || path.extname(id) !== '.svg') {
        return null;
      }

      try {
        const { name, dir } = path.parse(id);
        const isMonochrome = dir.split(path.sep).includes('monochrome');
        const overrides = isMonochrome ? monochromeOverrides : colorOverrides;
        const config = { path: id, plugins: extendDefaultPlugins(overrides) };
        const optimized = optimize(svg.trim(), config);
        const code = renderElement({
          name,
          isMonochrome,
          svg: optimized.data,
        });

        return { code };
      } catch (err) {
        const message = 'Could not process SVG file';
        const position = parseInt(/[\d]/.exec(err.message)[0], 10);
        this.warn({ message, id, position });
        return null;
      }
    },
  };
}
