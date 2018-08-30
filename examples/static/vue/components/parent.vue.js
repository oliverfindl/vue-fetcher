let dummy = {
    components: {
        child: fetcher.fetch("parent/child")
    },
	data: () => ({
		message: "This is parent component."
	}),
	created() {
		console.log(this.message);
	}
};
