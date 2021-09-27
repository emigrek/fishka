import colors from 'vuetify/es5/util/colors'

export default {
  head: {
    title: 'Fishka',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-icon-57x57.png'},
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/apple-icon-60x60.png'},
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-icon-72x72.png'},
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-icon-76x76.png'},
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/apple-icon-114x114.png'},
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-icon-120x120.png'},
      { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-icon-144x144.png'},
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-icon-152x152.png'},
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png'},
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { name: 'msapplication-TileColor', content: '#000' },
      { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' },
      { name: 'theme-color', content: '#000' }
    ]
  },

  router: {
    trailingSlash: false
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: 'plugins/vuetify-snackbar', ssr: false },
    { src: "plugins/vue-shortkey.js", mode: "client" }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'vuetify-dialog/nuxt'
  ],
  
  vuetifyDialog: {
    prompt: {
      actions: {
        false: 'Anuluj',
        true: {
          text: 'Dodaj',
          color: 'primary'
        }
      },
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
