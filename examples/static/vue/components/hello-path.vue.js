let dummy = {
	template: "path: ./static/vue/templates/hello.vue.html",
	data: () => ({
		message: "Hello world!"
	}),
	created() {
		console.log(this.message);
	}
};
