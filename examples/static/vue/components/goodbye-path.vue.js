let dummy = {
	template: "path: ./static/vue/templates/goodbye.vue.html",
	data: () => ({
		message: "Goodbye world!"
	}),
	created() {
		console.log(this.message);
	}
};
