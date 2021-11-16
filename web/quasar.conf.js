// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: [
      'i18n',
      'axios',
      'lodash',
      'validate',
      'components',
      'utils',
      'moment',
      'notify-defaults',
      'apollo',
      'plugins'
    ],

    // /src/css/app.sass   앱 스타일 정의같음
    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.scss',
      'qcalendar.sass',
      'quasar.custom.scss',
      'wysiwyg.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v4',
      'fontawesome-v5', // https://fontawesome.com/icons?d=gallery
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      // 'roboto-font', // optional, you are not bound to it
      'material-icons' // https://material.io/resources/icons/?icon=library_add&style=baseline
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      // iconSet: 'ionicons-v4', // Quasar icon set
      // lang: 'de', // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)

      all: 'importStrategy', // Quasar가 자동으로 컴포넌트와 지시문을 가져옵니다
      // 컴파일 시간은 약간 증가하지만 quasar.conf.js에 컴포넌트와 지시문을 지정할 필요는 없습니다. Quasar 플러그인은 여전히 ​​지정해야합니다.

      // 머머가 있는지는 모르지만.. 나중에 쓰일것 같아서 예시 추가
      components: [ /* 'QBtn', 'QIcon',  ... */],
      directives: [ /* 'TouchSwipe',  ... */],

      // Quasar plugins
      plugins: [
        'Dialog',
        'Notify',
        'AppFullscreen'
      ]
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    // supportIE: true,

    // 나중에 쓸거같아서 미리 넣어둠.
    // preFetch: true,

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      // host: ??           // 개발 서버에 사용할 로컬 IP / 호스트
      // port: 8080,
      open: true, // opens browser window automatically
      // public: '공개주소(프록시와 함꼐 사용)'
      proxy: {
        '/': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },

    // 사용할 에니메이션 정의
    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    // https://daneden.github.io/animate.css/ 이거 샘플인데 여기서 확인하고 쓸것 가져오자.
    animations: [
      // 'bounce',
      // 'bounceInLeft'
    ],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar App',
        // description: 'A Quasar Framework app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [{
          'src': 'icons/icon-128x128.png',
          'sizes': '128x128',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-192x192.png',
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-256x256.png',
          'sizes': '256x256',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-384x384.png',
          'sizes': '384x384',
          'type': 'image/png'
        },
        {
          'src': 'icons/icon-512x512.png',
          'sizes': '512x512',
          'type': 'image/png'
        }
        ]
      }
    },

    // https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'web'
      }
    }
  }
}
