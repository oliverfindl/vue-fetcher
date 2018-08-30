let dummy = {
	data: () => ({
		message: "Goodbye world!"
	}),
	created() {
		console.log(this.message);
	}
};
