let dummy = {
	template: "path: ./static/vue/templates/goodbye.vue.html",
	data() {
		return {
			message: "Goodbye world!"
		}
	},
	created() {
		console.log(this.message);
	}
};
