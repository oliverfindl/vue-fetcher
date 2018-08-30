let dummy = {
	data: () => ({
		message: "This is child component."
	}),
	created() {
		console.log(this.message);
	}
};
