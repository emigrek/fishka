import Vue from 'vue'
import VuetifyToast from 'vuetify-toast-snackbar'

export default (context, inject) => {
	Vue.use(VuetifyToast, {
		$vuetify: context.$vuetify,
		color: "black"
	})
}