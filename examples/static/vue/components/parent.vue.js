let dummy = {
    components: {
        child: fetcher.fetch("parent/child")
    },
	data() {
		return {
			message: "This is parent component."
		}
	},
	created() {
		console.log(this.message);
	}
};
