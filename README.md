
# vue-fetcher

Simple class used for asynchronous fetching [Vue](https://github.com/vuejs/vue) components and templates, without need to setup and use webpack or other tools.

> vue-fetcher 1.x works with [Vue](https://github.com/vuejs/vue) 1.x and 2.x. It's also compatible with [vue-router](https://github.com/vuejs/vue-router) 2.x and 3.x and also with [axios](https://github.com/axios/axios), which fallbacks to window.fetch if [axios](https://github.com/axios/axios) is not detected.

> vue-fetcher does not follow [Single File Component](https://vuejs.org/guide/single-file-components.html) approach. It's using 2 separate files for component logic and component template instead.

---

## Basic usage

```javascript
// init vue-fetcher
const fetcher = new VueFetcher();

// fetch all components
let components = {};
["hello", "goodbye", /* ... */].forEach(component => {
	components[component] = fetcher.fetch(component);
});

// init vue
const app = new Vue({
	components,
	// ...
}).$mount("#app");
```

## Basic usage with vue-router

```javascript
// init vue-fetcher
const fetcher = new VueFetcher();

// init vue-router
const router = new VueRouter({
	routes: ["hello", "goodbye", /* ... */].map(route => {
		return {
			path: "/" + route,
			component: fetcher.fetch(route)
		};
	}),
	// ...
});

// init vue
const app = new Vue({
	router,
	// ...
}).$mount("#app");
```

## Configuration

It's possible to configure vue-fetcher with options object passed to vue-fetcher at initialization. Default options are:
```javascript
let options = {
	base: "static/vue",
	componentDir: "components",
	templateDir: "templates",
	componentExt: ".vue.js",
	templateExt: ".vue.html",
	globalName: "VueFetcher"
};
```

Which translates into folder structure, where components are stored in:
```
static/vue/components/<component-name>.vue.js
```
And templates in:
```
static/vue/templates/<component-name>.vue.html
```

Template files are basic HTML files, whereas component files are JSON-like files.

Example component:
```javascript
{
	template: "", // if omitted or empty, vue-fetcher will fetch template file
	data(): {
		// ...
	}
	methods: {
		// ...
	},
	// ...
}
```
It's possible to use a dummy variable, so the file will be valid for editors with javascript syntax highlight:
```javascript
let dummy = {
	// ...
};
```

It's also possible to use vue-fetcher from fetched components, but it's necessary to save reference of vue-fetcher as global variable. By default, vue-fetcher tries to set itself as window.VueFetcher if this variable is unused. So it's possible to use shorthand syntax like:
```javascript
new VueFetcher({ /* ... */ });
// and call it like: window.VueFetcher.fetch(...);
```
Otherwise you need to set it as global variable via options or manually like:
```javascript
let options = {
	// ...
};
const fetcher = new VueFetcher(options);
window.<my-global-variable-name> = fetcher;
```
Or just like one-liner:
```javascript
window.<my-global-variable-name> = new VueFetcher({ /* ... */ });
```

---

## License

[MIT](http://opensource.org/licenses/MIT)