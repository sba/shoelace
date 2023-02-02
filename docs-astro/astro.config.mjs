import { defineConfig } from 'astro/config';
import chokidar from 'chokidar';
import colors from 'picocolors';

const reloadDebounce = 50;
let reloadTimeout;

// https://astro.build/config
export default defineConfig({
  root: './',
  vite: {
    logLevel: 'info',
    server: {
      open: true,
      watch: {
        ignored: ['**/public/shoelace', '**/public/shoelace/**/*']
      }
    },

    plugins: [
      {
        name: 'shoelace-autoreload',
        apply: 'serve',
        config: () => ({ server: { watch: { disableGlobbing: false } } }),
        configureServer({ ws, config: { logger } }) {
          function handleChange(file) {
            // When Shoelace's /dist is copied to /public/shoelace, a lot of files will be changed. This debounces it so
            // Astro's dev server doesn't reload to soon.
            clearTimeout(reloadTimeout);
            reloadTimeout = setTimeout(() => {
              logger.info(`${colors.green('page reload')} Shoelace was updated`, {
                clear: true,
                timestamp: true
              });

              ws.send({ type: 'full-reload', path: file });
            }, reloadDebounce);
          }

          chokidar
            .watch(
              [`**/public/shoelace/**/*.js`, `**/public/shoelace/**/*.css`, `**/public/shoelace/custom-elements.json`],
              {
                ignored: ['node_modules/**/*'],
                ignoreInitial: true
              }
            )
            .on('add', handleChange)
            .on('change', handleChange);
        }
      }
    ]
  }
});
