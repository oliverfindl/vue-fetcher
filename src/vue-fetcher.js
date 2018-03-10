/**
 * vue-fetcher v1.1.4 (2018-03-10)
 * Copyright 2018 Oliver Findl
 * @license MIT
 */

/**
 * Class responsible for asynchronous fetching of Vue components and templates.
 */
class VueFetcher {

	/**
	 * Class constructor.
	 * @param {object} options
	 */
	constructor(options) {
		options = options || {};

		this._axios = window.hasOwnProperty("axios");
		this._method = (this._axios ? window.axios.get : window.fetch).bind(window);
		this._ok = [200, 304];

		this._patterns = {
			trimBase: /\/+$/,
			trimDirectory: /^\/+|\/+$/g,
			trimExtension: /^\.+/,
			testComponentString: /{[\s\S]*}/,
			trimComponentString: /^[^{]+|[^}]+$/g,
			testComponentName: /^[\w-]+$/,
			testTemplateString: /<[\s\S]+>/,
			testTemplateBasic: /^\s*(id|html):\s*/i,
			testTemplateInline: /^\s*!inline\s*/i,
			testTemplatePath: /^\s*(path|file|url):\s*/i,
			replaceWhitespace: /\s+/g,
			replaceSpecial: /[^\w\-]+/g,
			replaceSlash: /\/+/g,
			trimDash: /^-+|-+$/g
		};

		this._options = {
			base: (options.base || "static/vue").replace(this._patterns.trimBase, ""),
			componentDirectory: (options.componentDirectory || "components").replace(this._patterns.trimDirectory, ""),
			templateDirectory: (options.templateDirectory || "templates").replace(this._patterns.trimDirectory, ""),
			componentExtension: (options.componentExtension || "vue.js").replace(this._patterns.trimExtension, ""),
			templateExtension: (options.templateExtension || "vue.html").replace(this._patterns.trimExtension, "")
		};

		this.components = {};
	}

	/**
	 * Private getter.
	 * @param {string} componentName
	 * @returns {object}
	 */
	_get(componentName) {
		if(!componentName || !componentName.length) {
			this._console("error", "missing required arguments");
			return;
		}

		return this.components.hasOwnProperty(componentName) ? this.components[componentName] : null;
	}

	/**
	 * Private setter.
	 * @param {object} component
	 * @returns {boolean}
	 */
	_set(component) {
		if(!component || !component.hasOwnProperty("name") || !component.name.length) {
			this._console("error", "missing required arguments");
			return;
		}

		return (this.components[component.name] = component) ? true : false;
	}

	/**
	 * Private method for slug generation.
	 * @param {string} string
	 * @returns {string}
	 */
	_slug(string) {
		if(!string || !string.length) {
			this._console("error", "missing required arguments");
			return;
		}

		return string.toLowerCase().replace(this._patterns.replaceWhitespace, "-").replace(this._patterns.replaceSlash, "--").replace(this._patterns.replaceSpecial, "").replace(this._patterns.trimDash, "");
	}

	/**
	 * Private wrapper method for window.console.
	*/
	_console() {
		let _level = window.Array.prototype.shift.call(arguments);
		if(!_level || !_level.length || ["info", "log" ,"error", "trace", "warn"].indexOf(_level) === -1 || !window.console.hasOwnProperty(_level)) {
			return;
		}

		window.Array.prototype.unshift.call(arguments, "[vue-fetcher][" + _level + "]");
		return window.console[_level].apply(null, arguments);
	}

	/**
	 * Wrapper method responsible for manual pushing Vue components into VueFetcher instance.
	 * @param {object} component
	 * @returns {boolean}
	 */
	push(component) {
		if(!component || !component.hasOwnProperty("name") || !component.name.length) {
			this._console("error", "missing required arguments");
			return;
		}

		return this._get(component.name) ? false : this._set(component);
	}

	/**
	 * Method responsible for asynchronous fetching Vue components and templates into VueFetcher instance.
	 * @param {string} componentName
	 * @returns {Function}
	 */
	fetch(componentName) {
		if(!componentName || !componentName.length) {
			this._console("error", "missing required arguments");
			return;
		}

		return (resolve, reject) => {

			let component = this._get(componentName);
			if(component && component.hasOwnProperty("name") && component.name.length) {
				resolve(component);
				return;
			}

			this._method([[this._options.base, this._options.componentDirectory, componentName].join("/"), this._options.componentExtension].join(".")).then(response => {

				if(this._ok.indexOf(response.status) > -1) {
					if(this._axios) {
						return response.data.toString();
					} else {
						return response.text();
					}
				} else {
					let _error = "component fetch failed [" + componentName + "]";
					this._console("error", _error);
					reject(_error);
					return;
				}

			}).then(component => {

				if(!component || !component.length || !this._patterns.testComponentString.test(component)) {
					let _error = "component check failed [" + componentName + "]";
					this._console("error", _error);
					reject(_error);
					return;
				}

				try {
					component = window.eval.call(null, "new window.Object(" + component.replace(this._patterns.trimComponentString, "") + ");");
				} catch(error) {
					this._console("error", error);

					let _error = "component eval failed [" + componentName + "]";
					this._console("error", _error);
					reject(_error);
					return;
				}

				if(!component.hasOwnProperty("name") || !component.name.length || !this._patterns.testComponentName.test(component.name)) {
					component.name = this._slug(componentName);
				}

				let _path = null;
				if(!component.hasOwnProperty("template") || !component.template.length || (_path = this._patterns.testTemplatePath.test(component.template))) {

					this._method(_path ? component.template.replace(this._patterns.testTemplatePath, "") : [[this._options.base, this._options.templateDirectory, componentName].join("/"), this._options.templateExtension].join(".")).then(response => {

						if(this._ok.indexOf(response.status) > -1) {
							if(this._axios) {
								return response.data.toString();
							} else {
								return response.text();
							}
						} else {
							let _error = "template fetch failed [" + componentName + "]";
							this._console("error", _error);
							reject(_error);
							return;
						}

					}).then(template => {

						if(!template || !template.length || !this._patterns.testTemplateString.test(template)) {
							let _error = "template check failed [" + componentName + "]";
							this._console("error", _error);
							reject(_error);
							return;
						}

						component.template = template;

						this._set(component);
						resolve(component);
						return;

					}).catch(error => {
						this._console("error", error);

						let _error = "fetch template catch [" + componentName + "]";
						this._console("error", _error);
						reject(_error);
						return;
					});

				} else {
					if(this._patterns.testTemplateInline.test(component.template)) {
						delete component.template;
					} else {
						component.template = component.template.replace(this._patterns.testTemplateBasic, "");
					}

					this._set(component);
					resolve(component);
					return;
				}

			}).catch(error => {
				this._console("error", error);

				let _error = "fetch component catch [" + componentName + "]";
				this._console("error", _error);
				reject(_error);
				return;
			});

		};

	}

}
