let dummy = {
	template: `
		<div>
			{{message}}
		</div>
	`,
	data() {
		return {
			message: "Hello world!"
		}
	},
	created() {
		console.log(this.message);
	}
};
