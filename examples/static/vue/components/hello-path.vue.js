let dummy = {
	template: "path: ./static/vue/templates/hello.vue.html",
	data() {
		return {
			message: "Hello world!"
		}
	},
	created() {
		console.log(this.message);
	}
};