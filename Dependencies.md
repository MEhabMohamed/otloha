# Welcome to Evaluation app, an app used to do the following:

1- Create new users (Admins, Teachers or students).
2- Admins can add new admins.
3- Students can share their recited verses.
4- Teachers can correct the recited verses.

# To activate the app with no errors you need to install:

npm --save i redux react-redux redux-thunk react-router-dom jquery
npm i @mui/material @emotion/react @emotion/styled
npm i @mui/material @mui/styled-engine-sc styled-components
npm i @fontsource/roboto
npm i @mui/icons-material
npm i react-svg-worldmap --save
npm i geojson
npm i @mui/x-charts
npm i --save-dev @babel/plugin-proposal-private-property-in-object --legacy-peer-deps

# If you face this issue:

(node:1548) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.

## Go to node_modules/react-scripts/config/webpackDevServer.Config.js:

### Modify:

onBeforeSetupMiddleware(devServer) {
      // Keep `evalSourceMapMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }
    },
    onAfterSetupMiddleware(devServer) {
      // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },

### To:

setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app)
      }

      middlewares.push(
        evalSourceMapMiddleware(devServer),
        redirectServedPath(paths.publicUrlOrPath),
        noopServiceWorkerMiddleware(paths.publicUrlOrPath)
      )

      return middlewares;
    },