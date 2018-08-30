let dummy = {
	template: `
		<div>
			{{ message }}
		</div>
	`,
	data: () => ({
		message: "Goodbye world!"
	}),
	created() {
		console.log(this.message);
	}
};
