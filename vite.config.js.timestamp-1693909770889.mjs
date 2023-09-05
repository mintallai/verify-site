// vite.config.js
import { sveltekit } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/@sveltejs+kit@1.15.1_svelte@3.58.0_vite@4.2.1/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import fs from "fs";
import path2 from "path";
import { replaceCodePlugin } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/vite-plugin-replace@0.1.1_vite@4.2.1/node_modules/vite-plugin-replace/index.js";

// etc/rollup/plugins/svelte-svg.js
import { createFilter } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/@rollup+pluginutils@4.2.1/node_modules/@rollup/pluginutils/dist/es/index.js";
import { readFile } from "fs/promises";
import lodash from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp.js";
import path from "path";
import { compile } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/svelte@3.58.0/node_modules/svelte/compiler.mjs";
import { optimize } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/svgo@3.0.2/node_modules/svgo/lib/svgo-node.js";
var { flow, camelCase, upperFirst } = lodash;
var classCase = flow([camelCase, upperFirst]);
var colorOverrides = [
  {
    name: "preset-default",
    params: {
      overrides: {
        removeViewBox: false,
        mergePaths: false,
        convertShapeToPath: false,
        convertPathData: false,
        convertColors: false,
        removeUselessStrokeAndFill: false,
        cleanupIds: false
      }
    }
  },
  {
    name: "addAttributesToSVGElement",
    params: {
      attributes: [
        {
          preserveAspectRatio: "xMidYMid meet"
        },
        {
          part: "svg"
        }
      ]
    }
  }
];
var monochromeOverrides = [
  ...colorOverrides,
  "removeStyleElement",
  {
    name: "removeAttrs",
    params: {
      attrs: ["id", "stroke", "fill"]
    }
  }
];
function renderElement({ isMonochrome, name, svg, id, ssr }) {
  const className = classCase(name);
  const code = `
    <script lang="ts">
      export let width = 16;
      export let height = 16;
    </script>

    <div class={$$props.class} style="width: {width}; height: {height};">
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
  const { js } = compile(code, {
    name: className,
    generate: ssr ? "ssr" : "dom",
    hydratable: true,
    filename: id
  });
  return js;
}
function rollupSvelteSvg(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: "rollup-svelte-svg",
    async transform(svg, id, opts) {
      const ssr = !!(opts == null ? void 0 : opts.ssr);
      if (!filter(id) || path.extname(id) !== ".svg?component") {
        return null;
      }
      try {
        const { name, dir } = path.parse(id);
        const isMonochrome = dir.split(path.sep).includes("monochrome");
        const filename = id.replace(/\.svg(\?.*)$/, ".svg");
        const svgFile = await readFile(filename, { encoding: "utf-8" });
        const overrides = isMonochrome ? monochromeOverrides : colorOverrides;
        const config2 = { path: id, plugins: overrides };
        const optimized = optimize(svgFile, config2);
        const { code, map } = renderElement({
          name,
          isMonochrome,
          svg: optimized.data,
          id,
          ssr
        });
        return { code, map };
      } catch (err) {
        const message = "Could not process SVG file";
        const position = parseInt(/[\d]/.exec(err.message)[0], 10);
        this.warn({ message, id, position });
        return null;
      }
    }
  };
}

// vite.config.js
var __vite_injected_original_dirname = "/Users/dkozma/Projects/contentcredentials.org";
function getSupportedLocales() {
  const dictPath = path2.resolve(__vite_injected_original_dirname, "./locales/");
  return fs.readdirSync(dictPath).map((file) => path2.basename(file, ".json"));
}
var config = {
  server: {
    fs: {
      allow: ["assets", "locales"]
    }
  },
  build: {
    minify: "terser",
    terserOptions: {
      // Added since error names were being mangled, resulting in incorrect error handling (CAI-3792)
      keep_classnames: true,
      // image-blob-reduce breaks unless this is disabled
      compress: { evaluate: false }
    }
  },
  plugins: [
    sveltekit(),
    rollupSvelteSvg(),
    replaceCodePlugin({
      replacements: [
        {
          from: "__SUPPORTED_LOCALES__",
          // type defined in global.d.ts
          to: JSON.stringify(getSupportedLocales())
        },
        {
          from: "__OVERRIDE_MANIFEST_RECOVERY_BASE_URL__",
          // type defined in global.d.ts
          to: JSON.stringify(
            process.env.OVERRIDE_MANIFEST_RECOVERY_BASE_URL ?? ""
          )
        }
      ]
    })
  ],
  test: {
    include: ["src/**/*.spec.ts"],
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    setupFilesAfterEnv: ["./src/test/setupAfterEnv.ts"]
  }
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiZXRjL3JvbGx1cC9wbHVnaW5zL3N2ZWx0ZS1zdmcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGtvem1hL1Byb2plY3RzL2NvbnRlbnRjcmVkZW50aWFscy5vcmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ka296bWEvUHJvamVjdHMvY29udGVudGNyZWRlbnRpYWxzLm9yZy92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGtvem1hL1Byb2plY3RzL2NvbnRlbnRjcmVkZW50aWFscy5vcmcvdml0ZS5jb25maWcuanNcIjsvLyBBRE9CRSBDT05GSURFTlRJQUxcbi8vIENvcHlyaWdodCAyMDIzIEFkb2JlXG4vLyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy9cbi8vIE5PVElDRTogQWxsIGluZm9ybWF0aW9uIGNvbnRhaW5lZCBoZXJlaW4gaXMsIGFuZCByZW1haW5zXG4vLyB0aGUgcHJvcGVydHkgb2YgQWRvYmUgYW5kIGl0cyBzdXBwbGllcnMsIGlmIGFueS4gVGhlIGludGVsbGVjdHVhbFxuLy8gYW5kIHRlY2huaWNhbCBjb25jZXB0cyBjb250YWluZWQgaGVyZWluIGFyZSBwcm9wcmlldGFyeSB0byBBZG9iZVxuLy8gYW5kIGl0cyBzdXBwbGllcnMgYW5kIGFyZSBwcm90ZWN0ZWQgYnkgYWxsIGFwcGxpY2FibGUgaW50ZWxsZWN0dWFsXG4vLyBwcm9wZXJ0eSBsYXdzLCBpbmNsdWRpbmcgdHJhZGUgc2VjcmV0IGFuZCBjb3B5cmlnaHQgbGF3cy5cbi8vIERpc3NlbWluYXRpb24gb2YgdGhpcyBpbmZvcm1hdGlvbiBvciByZXByb2R1Y3Rpb24gb2YgdGhpcyBtYXRlcmlhbFxuLy8gaXMgc3RyaWN0bHkgZm9yYmlkZGVuIHVubGVzcyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24gaXMgb2J0YWluZWRcbi8vIGZyb20gQWRvYmUuXG5cbmltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyByZXBsYWNlQ29kZVBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXJlcGxhY2UnO1xuaW1wb3J0IHN2ZWx0ZVN2ZyBmcm9tICcuL2V0Yy9yb2xsdXAvcGx1Z2lucy9zdmVsdGUtc3ZnJztcblxuZnVuY3Rpb24gZ2V0U3VwcG9ydGVkTG9jYWxlcygpIHtcbiAgY29uc3QgZGljdFBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9sb2NhbGVzLycpO1xuXG4gIHJldHVybiBmcy5yZWFkZGlyU3luYyhkaWN0UGF0aCkubWFwKChmaWxlKSA9PiBwYXRoLmJhc2VuYW1lKGZpbGUsICcuanNvbicpKTtcbn1cblxuLyoqIEB0eXBlIHtpbXBvcnQoJ3ZpdGUnKS5Vc2VyQ29uZmlnfSAqL1xuY29uc3QgY29uZmlnID0ge1xuICBzZXJ2ZXI6IHtcbiAgICBmczoge1xuICAgICAgYWxsb3c6IFsnYXNzZXRzJywgJ2xvY2FsZXMnXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgLy8gQWRkZWQgc2luY2UgZXJyb3IgbmFtZXMgd2VyZSBiZWluZyBtYW5nbGVkLCByZXN1bHRpbmcgaW4gaW5jb3JyZWN0IGVycm9yIGhhbmRsaW5nIChDQUktMzc5MilcbiAgICAgIGtlZXBfY2xhc3NuYW1lczogdHJ1ZSxcbiAgICAgIC8vIGltYWdlLWJsb2ItcmVkdWNlIGJyZWFrcyB1bmxlc3MgdGhpcyBpcyBkaXNhYmxlZFxuICAgICAgY29tcHJlc3M6IHsgZXZhbHVhdGU6IGZhbHNlIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHN2ZWx0ZWtpdCgpLFxuICAgIHN2ZWx0ZVN2ZygpLFxuICAgIHJlcGxhY2VDb2RlUGx1Z2luKHtcbiAgICAgIHJlcGxhY2VtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgZnJvbTogJ19fU1VQUE9SVEVEX0xPQ0FMRVNfXycsIC8vIHR5cGUgZGVmaW5lZCBpbiBnbG9iYWwuZC50c1xuICAgICAgICAgIHRvOiBKU09OLnN0cmluZ2lmeShnZXRTdXBwb3J0ZWRMb2NhbGVzKCkpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZnJvbTogJ19fT1ZFUlJJREVfTUFOSUZFU1RfUkVDT1ZFUllfQkFTRV9VUkxfXycsIC8vIHR5cGUgZGVmaW5lZCBpbiBnbG9iYWwuZC50c1xuICAgICAgICAgIHRvOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk9WRVJSSURFX01BTklGRVNUX1JFQ09WRVJZX0JBU0VfVVJMID8/ICcnLFxuICAgICAgICAgICksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICBdLFxuICB0ZXN0OiB7XG4gICAgaW5jbHVkZTogWydzcmMvKiovKi5zcGVjLnRzJ10sXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy90ZXN0L3NldHVwLnRzJ10sXG4gICAgc2V0dXBGaWxlc0FmdGVyRW52OiBbJy4vc3JjL3Rlc3Qvc2V0dXBBZnRlckVudi50cyddLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGtvem1hL1Byb2plY3RzL2NvbnRlbnRjcmVkZW50aWFscy5vcmcvZXRjL3JvbGx1cC9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGtvem1hL1Byb2plY3RzL2NvbnRlbnRjcmVkZW50aWFscy5vcmcvZXRjL3JvbGx1cC9wbHVnaW5zL3N2ZWx0ZS1zdmcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2Rrb3ptYS9Qcm9qZWN0cy9jb250ZW50Y3JlZGVudGlhbHMub3JnL2V0Yy9yb2xsdXAvcGx1Z2lucy9zdmVsdGUtc3ZnLmpzXCI7Ly8gQURPQkUgQ09ORklERU5USUFMXG4vLyBDb3B5cmlnaHQgMjAyMyBBZG9iZVxuLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vXG4vLyBOT1RJQ0U6IEFsbCBpbmZvcm1hdGlvbiBjb250YWluZWQgaGVyZWluIGlzLCBhbmQgcmVtYWluc1xuLy8gdGhlIHByb3BlcnR5IG9mIEFkb2JlIGFuZCBpdHMgc3VwcGxpZXJzLCBpZiBhbnkuIFRoZSBpbnRlbGxlY3R1YWxcbi8vIGFuZCB0ZWNobmljYWwgY29uY2VwdHMgY29udGFpbmVkIGhlcmVpbiBhcmUgcHJvcHJpZXRhcnkgdG8gQWRvYmVcbi8vIGFuZCBpdHMgc3VwcGxpZXJzIGFuZCBhcmUgcHJvdGVjdGVkIGJ5IGFsbCBhcHBsaWNhYmxlIGludGVsbGVjdHVhbFxuLy8gcHJvcGVydHkgbGF3cywgaW5jbHVkaW5nIHRyYWRlIHNlY3JldCBhbmQgY29weXJpZ2h0IGxhd3MuXG4vLyBEaXNzZW1pbmF0aW9uIG9mIHRoaXMgaW5mb3JtYXRpb24gb3IgcmVwcm9kdWN0aW9uIG9mIHRoaXMgbWF0ZXJpYWxcbi8vIGlzIHN0cmljdGx5IGZvcmJpZGRlbiB1bmxlc3MgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uIGlzIG9idGFpbmVkXG4vLyBmcm9tIEFkb2JlLlxuXG5pbXBvcnQgeyBjcmVhdGVGaWx0ZXIgfSBmcm9tICdAcm9sbHVwL3BsdWdpbnV0aWxzJztcbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMvcHJvbWlzZXMnO1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gvZnAnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBjb21waWxlIH0gZnJvbSAnc3ZlbHRlL2NvbXBpbGVyJztcbmltcG9ydCB7IG9wdGltaXplIH0gZnJvbSAnc3Znbyc7XG5cbmNvbnN0IHsgZmxvdywgY2FtZWxDYXNlLCB1cHBlckZpcnN0IH0gPSBsb2Rhc2g7XG5cbmNvbnN0IGNsYXNzQ2FzZSA9IGZsb3coW2NhbWVsQ2FzZSwgdXBwZXJGaXJzdF0pO1xuXG5jb25zdCBjb2xvck92ZXJyaWRlcyA9IFtcbiAge1xuICAgIG5hbWU6ICdwcmVzZXQtZGVmYXVsdCcsXG4gICAgcGFyYW1zOiB7XG4gICAgICBvdmVycmlkZXM6IHtcbiAgICAgICAgcmVtb3ZlVmlld0JveDogZmFsc2UsXG4gICAgICAgIG1lcmdlUGF0aHM6IGZhbHNlLFxuICAgICAgICBjb252ZXJ0U2hhcGVUb1BhdGg6IGZhbHNlLFxuICAgICAgICBjb252ZXJ0UGF0aERhdGE6IGZhbHNlLFxuICAgICAgICBjb252ZXJ0Q29sb3JzOiBmYWxzZSxcbiAgICAgICAgcmVtb3ZlVXNlbGVzc1N0cm9rZUFuZEZpbGw6IGZhbHNlLFxuICAgICAgICBjbGVhbnVwSWRzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIG5hbWU6ICdhZGRBdHRyaWJ1dGVzVG9TVkdFbGVtZW50JyxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGF0dHJpYnV0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByZXNlcnZlQXNwZWN0UmF0aW86ICd4TWlkWU1pZCBtZWV0JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhcnQ6ICdzdmcnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuXTtcblxuY29uc3QgbW9ub2Nocm9tZU92ZXJyaWRlcyA9IFtcbiAgLi4uY29sb3JPdmVycmlkZXMsXG4gICdyZW1vdmVTdHlsZUVsZW1lbnQnLFxuICB7XG4gICAgbmFtZTogJ3JlbW92ZUF0dHJzJyxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGF0dHJzOiBbJ2lkJywgJ3N0cm9rZScsICdmaWxsJ10sXG4gICAgfSxcbiAgfSxcbl07XG5cbmZ1bmN0aW9uIHJlbmRlckVsZW1lbnQoeyBpc01vbm9jaHJvbWUsIG5hbWUsIHN2ZywgaWQsIHNzciB9KSB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGNsYXNzQ2FzZShuYW1lKTtcbiAgY29uc3QgY29kZSA9IGBcbiAgICA8c2NyaXB0IGxhbmc9XCJ0c1wiPlxuICAgICAgZXhwb3J0IGxldCB3aWR0aCA9IDE2O1xuICAgICAgZXhwb3J0IGxldCBoZWlnaHQgPSAxNjtcbiAgICA8L3NjcmlwdD5cblxuICAgIDxkaXYgY2xhc3M9eyQkcHJvcHMuY2xhc3N9IHN0eWxlPVwid2lkdGg6IHt3aWR0aH07IGhlaWdodDoge2hlaWdodH07XCI+XG4gICAgICAke3N2Z31cbiAgICA8L2Rpdj5cblxuICAgIDxzdHlsZSBsYW5nPVwicG9zdGNzc1wiPlxuICAgICAgc3ZnIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZmlsbDogY3VycmVudENvbG9yO1xuICAgICAgfVxuXG4gICAgICBwYXRoIHsgXG4gICAgICAgICR7aXNNb25vY2hyb21lID8gYGZpbGw6IGluaGVyaXQ7YCA6IGBgfVxuICAgICAgfVxuICAgIDwvc3R5bGU+XG4gIGA7XG4gIGNvbnN0IHsganMgfSA9IGNvbXBpbGUoY29kZSwge1xuICAgIG5hbWU6IGNsYXNzTmFtZSxcbiAgICBnZW5lcmF0ZTogc3NyID8gJ3NzcicgOiAnZG9tJyxcbiAgICBoeWRyYXRhYmxlOiB0cnVlLFxuICAgIGZpbGVuYW1lOiBpZCxcbiAgfSk7XG5cbiAgcmV0dXJuIGpzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByb2xsdXBTdmVsdGVTdmcob3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGZpbHRlciA9IGNyZWF0ZUZpbHRlcihvcHRpb25zLmluY2x1ZGUsIG9wdGlvbnMuZXhjbHVkZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncm9sbHVwLXN2ZWx0ZS1zdmcnLFxuICAgIGFzeW5jIHRyYW5zZm9ybShzdmcsIGlkLCBvcHRzKSB7XG4gICAgICBjb25zdCBzc3IgPSAhIW9wdHM/LnNzcjtcblxuICAgICAgaWYgKCFmaWx0ZXIoaWQpIHx8IHBhdGguZXh0bmFtZShpZCkgIT09ICcuc3ZnP2NvbXBvbmVudCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgbmFtZSwgZGlyIH0gPSBwYXRoLnBhcnNlKGlkKTtcbiAgICAgICAgY29uc3QgaXNNb25vY2hyb21lID0gZGlyLnNwbGl0KHBhdGguc2VwKS5pbmNsdWRlcygnbW9ub2Nocm9tZScpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gaWQucmVwbGFjZSgvXFwuc3ZnKFxcPy4qKSQvLCAnLnN2ZycpO1xuICAgICAgICBjb25zdCBzdmdGaWxlID0gYXdhaXQgcmVhZEZpbGUoZmlsZW5hbWUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG5cbiAgICAgICAgY29uc3Qgb3ZlcnJpZGVzID0gaXNNb25vY2hyb21lID8gbW9ub2Nocm9tZU92ZXJyaWRlcyA6IGNvbG9yT3ZlcnJpZGVzO1xuICAgICAgICBjb25zdCBjb25maWcgPSB7IHBhdGg6IGlkLCBwbHVnaW5zOiBvdmVycmlkZXMgfTtcbiAgICAgICAgY29uc3Qgb3B0aW1pemVkID0gb3B0aW1pemUoc3ZnRmlsZSwgY29uZmlnKTtcbiAgICAgICAgY29uc3QgeyBjb2RlLCBtYXAgfSA9IHJlbmRlckVsZW1lbnQoe1xuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgaXNNb25vY2hyb21lLFxuICAgICAgICAgIHN2Zzogb3B0aW1pemVkLmRhdGEsXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgc3NyLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4geyBjb2RlLCBtYXAgfTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0NvdWxkIG5vdCBwcm9jZXNzIFNWRyBmaWxlJztcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwYXJzZUludCgvW1xcZF0vLmV4ZWMoZXJyLm1lc3NhZ2UpWzBdLCAxMCk7XG4gICAgICAgIHRoaXMud2Fybih7IG1lc3NhZ2UsIGlkLCBwb3NpdGlvbiB9KTtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQWFBLFNBQVMsaUJBQWlCO0FBQzFCLE9BQU8sUUFBUTtBQUNmLE9BQU9BLFdBQVU7QUFDakIsU0FBUyx5QkFBeUI7OztBQ0hsQyxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZTtBQUN4QixTQUFTLGdCQUFnQjtBQUV6QixJQUFNLEVBQUUsTUFBTSxXQUFXLFdBQVcsSUFBSTtBQUV4QyxJQUFNLFlBQVksS0FBSyxDQUFDLFdBQVcsVUFBVSxDQUFDO0FBRTlDLElBQU0saUJBQWlCO0FBQUEsRUFDckI7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLFdBQVc7QUFBQSxRQUNULGVBQWU7QUFBQSxRQUNmLFlBQVk7QUFBQSxRQUNaLG9CQUFvQjtBQUFBLFFBQ3BCLGlCQUFpQjtBQUFBLFFBQ2pCLGVBQWU7QUFBQSxRQUNmLDRCQUE0QjtBQUFBLFFBQzVCLFlBQVk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixZQUFZO0FBQUEsUUFDVjtBQUFBLFVBQ0UscUJBQXFCO0FBQUEsUUFDdkI7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTSxzQkFBc0I7QUFBQSxFQUMxQixHQUFHO0FBQUEsRUFDSDtBQUFBLEVBQ0E7QUFBQSxJQUNFLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLE9BQU8sQ0FBQyxNQUFNLFVBQVUsTUFBTTtBQUFBLElBQ2hDO0FBQUEsRUFDRjtBQUNGO0FBRUEsU0FBUyxjQUFjLEVBQUUsY0FBYyxNQUFNLEtBQUssSUFBSSxJQUFJLEdBQUc7QUFDM0QsUUFBTSxZQUFZLFVBQVUsSUFBSTtBQUNoQyxRQUFNLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU9QO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQVdFLGVBQWUsbUJBQW1CO0FBQUE7QUFBQTtBQUFBO0FBSTFDLFFBQU0sRUFBRSxHQUFHLElBQUksUUFBUSxNQUFNO0FBQUEsSUFDM0IsTUFBTTtBQUFBLElBQ04sVUFBVSxNQUFNLFFBQVE7QUFBQSxJQUN4QixZQUFZO0FBQUEsSUFDWixVQUFVO0FBQUEsRUFDWixDQUFDO0FBRUQsU0FBTztBQUNUO0FBRWUsU0FBUixnQkFBaUMsVUFBVSxDQUFDLEdBQUc7QUFDcEQsUUFBTSxTQUFTLGFBQWEsUUFBUSxTQUFTLFFBQVEsT0FBTztBQUU1RCxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixNQUFNLFVBQVUsS0FBSyxJQUFJLE1BQU07QUFDN0IsWUFBTSxNQUFNLENBQUMsRUFBQyw2QkFBTTtBQUVwQixVQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssS0FBSyxRQUFRLEVBQUUsTUFBTSxrQkFBa0I7QUFDeEQsZUFBTztBQUFBLE1BQ1Q7QUFFQSxVQUFJO0FBQ0YsY0FBTSxFQUFFLE1BQU0sSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQ25DLGNBQU0sZUFBZSxJQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsU0FBUyxZQUFZO0FBRTlELGNBQU0sV0FBVyxHQUFHLFFBQVEsZ0JBQWdCLE1BQU07QUFDbEQsY0FBTSxVQUFVLE1BQU0sU0FBUyxVQUFVLEVBQUUsVUFBVSxRQUFRLENBQUM7QUFFOUQsY0FBTSxZQUFZLGVBQWUsc0JBQXNCO0FBQ3ZELGNBQU1DLFVBQVMsRUFBRSxNQUFNLElBQUksU0FBUyxVQUFVO0FBQzlDLGNBQU0sWUFBWSxTQUFTLFNBQVNBLE9BQU07QUFDMUMsY0FBTSxFQUFFLE1BQU0sSUFBSSxJQUFJLGNBQWM7QUFBQSxVQUNsQztBQUFBLFVBQ0E7QUFBQSxVQUNBLEtBQUssVUFBVTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsUUFDRixDQUFDO0FBRUQsZUFBTyxFQUFFLE1BQU0sSUFBSTtBQUFBLE1BQ3JCLFNBQVMsS0FBUDtBQUNBLGNBQU0sVUFBVTtBQUNoQixjQUFNLFdBQVcsU0FBUyxPQUFPLEtBQUssSUFBSSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUU7QUFDekQsYUFBSyxLQUFLLEVBQUUsU0FBUyxJQUFJLFNBQVMsQ0FBQztBQUVuQyxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBRDNJQSxJQUFNLG1DQUFtQztBQW1CekMsU0FBUyxzQkFBc0I7QUFDN0IsUUFBTSxXQUFXQyxNQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUVyRCxTQUFPLEdBQUcsWUFBWSxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVNBLE1BQUssU0FBUyxNQUFNLE9BQU8sQ0FBQztBQUM1RTtBQUdBLElBQU0sU0FBUztBQUFBLEVBQ2IsUUFBUTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsT0FBTyxDQUFDLFVBQVUsU0FBUztBQUFBLElBQzdCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBO0FBQUEsTUFFYixpQkFBaUI7QUFBQTtBQUFBLE1BRWpCLFVBQVUsRUFBRSxVQUFVLE1BQU07QUFBQSxJQUM5QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLGdCQUFVO0FBQUEsSUFDVixrQkFBa0I7QUFBQSxNQUNoQixjQUFjO0FBQUEsUUFDWjtBQUFBLFVBQ0UsTUFBTTtBQUFBO0FBQUEsVUFDTixJQUFJLEtBQUssVUFBVSxvQkFBb0IsQ0FBQztBQUFBLFFBQzFDO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBO0FBQUEsVUFDTixJQUFJLEtBQUs7QUFBQSxZQUNQLFFBQVEsSUFBSSx1Q0FBdUM7QUFBQSxVQUNyRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUyxDQUFDLGtCQUFrQjtBQUFBLElBQzVCLGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQyxxQkFBcUI7QUFBQSxJQUNsQyxvQkFBb0IsQ0FBQyw2QkFBNkI7QUFBQSxFQUNwRDtBQUNGO0FBRUEsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFsicGF0aCIsICJjb25maWciLCAicGF0aCJdCn0K
