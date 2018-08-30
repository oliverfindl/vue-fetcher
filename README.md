# vue-fetcher

[![npm](https://img.shields.io/npm/v/vue-fetcher.svg?style=flat)](https://www.npmjs.com/package/vue-fetcher)
[![npm](https://img.shields.io/npm/dt/vue-fetcher.svg?style=flat)](https://www.npmjs.com/package/vue-fetcher)
[![npm](https://img.shields.io/npm/l/vue-fetcher.svg?style=flat)](https://www.npmjs.com/package/vue-fetcher)
[![paypal](https://img.shields.io/badge/donate-paypal-blue.svg?colorB=0070ba&style=flat)](https://paypal.me/oliverfindl)

Simple javascript class used for asynchronous fetching [Vue](https://github.com/vuejs/vue) components and templates, without need to setup and use webpack or other tools.

> vue-fetcher 1.x works with [Vue](https://github.com/vuejs/vue) 1.x and 2.x. It's also compatible with [vue-router](https://github.com/vuejs/vue-router) 2.x and 3.x and also with [axios](https://github.com/axios/axios), which fallbacks to window.fetch if [axios](https://github.com/axios/axios) is not detected.

> vue-fetcher does not follow [Single File Component](https://vuejs.org/guide/single-file-components.html) approach. It's using 2 separate files for component logic and component template (optional - can be defined in component logic file) instead.

---

## Notice

With update to version 1.1.3 (2018-03-10) vue-fetcher was refactored and some options was renamed and some removed. So if you are upgrading, rename them according [this](#configuration) readme file.

---

## Install

Via [npm](https://npmjs.com/) [[package](https://www.npmjs.com/package/vue-fetcher)]:
```bash
$ npm install vue-fetcher
```

Via [yarn](https://yarnpkg.com/en/) [[package](https://yarnpkg.com/en/package/vue-fetcher)]:
```bash
$ yarn add vue-fetcher
```

From [unpkg](https://unpkg.com/):
```html
<script src="//unpkg.com/vue-fetcher"></script>
```

From [jsDelivr](https://jsdelivr.com/) [[package](https://www.jsdelivr.com/package/npm/vue-fetcher)]:
```html
<script src="//cdn.jsdelivr.net/npm/vue-fetcher"></script>
```

## Basic usage

```javascript
// init vue-fetcher
const fetcher = new VueFetcher();

// fetch all components
let components = {};
["hello", "goodbye", /* ... */ ].forEach(component => components[component] = fetcher.fetch(component));

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
	routes: ["hello", "goodbye", /* ... */ ].map(route => ({
		path: "/" + route,
		component: fetcher.fetch(route)
	})),
	// ...
});

// init vue
const app = new Vue({
	router,
	// ...
}).$mount("#app");
```

## Configuration

It's possible to configure vue-fetcher with options object passed to vue-fetcher at initialization.

Default options:
```javascript
let options = {
	base: "static/vue",
	componentDirectory: "components",
	templateDirectory: "templates",
	componentExtension: "vue.js",
	templateExtension: "vue.html"
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

Template files are basic HTML files, whereas component files are JSON-like javascript files.

Example component:
```javascript
{
	template: "...",
	data(): {
		// ...
	},
	methods: {
		// ...
	},
	// ...
}
```

There are multiple custom template definitions supported:
```javascript
{
	// basic definitions (same as Vue)
	template: "<div> ... </div>",
	template: `
		<div>
			...
		</div>
	`,

	// x-template definition (same as Vue)
	template: "#my-id",

	// inline-template definition
	template: "!inline",

	// id and html are optional, will get removed and will be handled like basic Vue template definition
	template: "id: #my-id",
	template: "html: <div> ... </div>",

	// with path, file and url, vue-fetcher will fetch template file based on value in this attribute (all three variants have same internal functionality)
	template: "path: ./static/vue/...",
	template: "file: /my-vue-project/static/vue/...",
	template: "url: https://.../static/vue/...",

	// if empty or omitted, vue-fetcher will fetch template file based on vue-fetcher options set at initialization
	template: ""
}
```

It's possible to use a dummy variable in your component logic file, so the syntax will be valid for editors with javascript syntax highlight:
```javascript
let dummy = {
	// ...
};
```

It's also possible to use vue-fetcher from fetched components, but it's necessary to save reference of vue-fetcher as global variable.

---

## License

[MIT](http://opensource.org/licenses/MIT)
