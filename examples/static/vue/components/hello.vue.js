let dummy = {
	data: () => ({
		message: "Hello world!"
	}),
	created() {
		console.log(this.message);
	}
};
