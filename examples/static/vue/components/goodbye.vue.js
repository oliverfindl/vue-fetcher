let dummy = {
	data() {
		return {
			message: "Goodbye world!"
		}
	},
	created() {
		console.log(this.message);
	}
};
