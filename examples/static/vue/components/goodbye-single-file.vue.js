let dummy = {
	template: `
		<div>
			{{message}}
		</div>
	`,
	data() {
		return {
			message: "Goodbye world!"
		}
	},
	created() {
		console.log(this.message);
	}
};
