let dummy = {
	template: `
		<div>
			{{ message }}
		</div>
	`,
	data: () => ({
		message: "Hello world!"
	}),
	created() {
		console.log(this.message);
	}
};
