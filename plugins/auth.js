import extend from '~/utils/extend-vue-app'

export default async function ({ app }) {
	extend(app, {
		mounted () {
			// this.$store.dispatch('login');
		},
	})
}