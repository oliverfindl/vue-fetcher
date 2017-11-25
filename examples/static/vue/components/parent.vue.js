let dummy = {
    components: {
        child: window.VueFetcher.fetch("parent/child")
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