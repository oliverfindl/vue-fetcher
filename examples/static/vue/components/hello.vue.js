let dummy = {
	data() {
		return {
			message: "Hello world!"
		}
	},
	created() {
		console.log(this.message);
	}
};
