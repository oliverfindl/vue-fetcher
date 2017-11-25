let dummy = {
	data() {
		return {
			message: "This is child component."
		}
	},
	created() {
		console.log(this.message);
	}
};