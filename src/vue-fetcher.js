/**
 * vue-fetcher v1.1.1 (2018-02-23)
 * Copyright 2018 Oliver Findl
 * @license MIT
 */

/**
 * Class responsible for fetching Vue components.
 */
class VueFetcher {

	/**
	 * Class constructor.
	 * @param {object} options
	 */
	constructor(options) {
		options = options || {};

		this._options = {
			base: this._trim(options.base || "static/vue", "BASE"),
			componentDir: this._trim(options.componentDir || "components", "DIR"),
			templateDir: this._trim(options.templateDir || "templates", "DIR"),
			componentExt: this._trim(options.componentExt || ".vue.js", "EXT"),
			templateExt: this._trim(options.templateExt || ".vue.html", "EXT"),
			globalName: options.globalName || "VueFetcher"
		};

		this._axios = window.hasOwnProperty("axios") ? true : false;
		this._method = (this._axios ? window.axios.get : window.fetch).bind(window);

		this._logTitle = "[vue-fetcher]: ";
		this._errorTitle = this._logTitle.replace(/\]/, " error]");

		this.components = {};

		if(!window.hasOwnProperty(this._options.globalName)) {
			window[this._options.globalName] = this;
		} else {
			this._error("cannot set VueFetcher class as global variable to window." + this._options.globalName + ", please do it manually");
		}
	}

	/**
	 * Private getter.
	 * @param {string} componentName
	 * @returns {object}
	 */
	_get(componentName) {
		if(!componentName) {
			this._error("missing required arguments");
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
		if(!component || !component.name) {
			this._error("missing required arguments");
			return;
		}

		return (this.components[component.name] = component) ? true : false;
	}

	/**
	 * Private trim method.
	 * @param {string} value
	 * @param {string} flag
	 * @returns {string}
	 */
	_trim(value, flag) {
		if(!value || !flag) {
			this._error("missing required arguments");
			return;
		}

		value = value.trim();

		if(this._canTrim(value, flag)) {

			switch(flag.toUpperCase()) {
				case "BASE": {
					return value.replace(/\/+$/g, "");
					break;
				}
				case "DIR": {
					return value.replace(/^\/+|\/+$/g, "");
					break;
				}
				case "EXT": {
					return value.replace(/^\.+/g, ".");
					break;
				}
				case "COMPONENT-AS-STRING": {
					return value.replace(/^[^{]+|[^}]+$/g, "");
					break;
				}
				default: {
					return value;
				}
			}

		} else {
			return value;
		}
	}

	/**
	 * Private support method for _trim method.
	 * @param {string} value
	 * @param {string} flag
	 * @returns {boolean}
	 */
	_canTrim(value, flag) {
		if(!value || !flag) {
			this._error("missing required arguments");
			return;
		}

		switch(flag.toUpperCase()) {
			case "BASE": case "DIR": case "EXT": {
				return value.match(/\w+/g) ? true : false;
				break;
			}
			default: {
				return true;
			}
		}
	}

	/**
	 * Private replace method.
	 * @param {string} value
	 * @param {string} flag
	 * @returns {string}
	 */
	_replace(value, flag) {
		if(!value || !flag) {
			this._error("missing required arguments");
			return;
		}

		switch(flag.toUpperCase()) {
			case "COMPONENT-NAME": {
				return value.replace(/\//g, "--");
				break;
			}
			default: {
				return value;
			}
		}
	}

	/**
	 * Private wrapper method for console.log().
	*/
	_log() {
		Array.prototype.unshift.call(arguments, this._logTitle);
		return console.log.apply(this, arguments);
	}

	/**
	 * Private wrapper method for this._error().
	*/
	_error() {
		Array.prototype.unshift.call(arguments, this._errorTitle);
		return console.error.apply(this, arguments);
	}

	/**
	 * Wrapper method responsible for manual pushing Vue components into VueFetcher instance.
	 * @param {object} component
	 * @returns {boolean}
	 */
	push(component) {
		if(!component || !component.name) {
			this._error("missing required arguments");
			return;
		}

		if(this._get(component.name)) {
			return false;
		} else {
			return this._set(component);
		}
	}

	/**
	 * Method responsible for fetching Vue components and templates into VueFetcher instance.
	 * @param {string} componentName
	 * @returns {Function}
	 */
	fetch(componentName) {
		if(!componentName) {
			this._error("missing required arguments");
			return;
		}

		return (resolve, reject) => {

			let component = this._get(componentName);
			if(component) {
				resolve(component);
				return;
			}

			this._method([this._options.base, this._options.componentDir, componentName].join("/") + this._options.componentExt).then(response => {

				if(this._axios && [200, 304].indexOf(response.status) > -1) {
					return response.data;
				} else if(response.ok) {
					return response.text();
				} else {
					let _error = "component fetch failed [" + componentName + "]";
					this._error(_error);
					reject(_error);
					return;
				}

			}).then(component => {

				if(!component) {
					let _error = "component check failed [" + componentName + "]";
					this._error(_error);
					reject(_error);
					return;
				}

				try {
					component = window.eval("new window.Object(" + this._trim(component.toString(), "COMPONENT-AS-STRING") + ")");
				} catch(error) {
					this._error(error);

					let _error = "component eval failed [" + componentName + "]";
					this._error(_error);
					reject(_error);
					return;
				}

				if(!component.hasOwnProperty("name") || !component.name.length) {
					component.name = this._replace(componentName, "COMPONENT-NAME");
				}

				let _test = null;
				const _pattern = /^\s*(path|file|url):\s*/i;
				if(!component.hasOwnProperty("template") || !component.template.length || (_test = _pattern.test(component.template))) {

					this._method(_test ? component.template.replace(_pattern, "") : [this._options.base, this._options.templateDir, componentName].join("/") + this._options.templateExt).then(response => {

						if(this._axios && [200, 304].indexOf(response.status) > -1) {
							return response.data;
						} else if(response.ok) {
							return response.text();
						} else {
							let _error = "template fetch failed [" + componentName + "]";
							this._error(_error);
							reject(_error);
							return;
						}

					}).then(template => {

						if(!template) {
							let _error = "template check failed [" + componentName + "]";
							this._error(_error);
							reject(_error);
							return;
						}

						component.template = template.toString();

						this._set(component);
						resolve(component);
						return;

					}).catch(error => {
						this._error(error);

						let _error = "fetch template catch [" + componentName + "]";
						this._error(_error);
						reject(_error);
						return;
					});

				} else {
					if(/^\s*!inline\s*/i.test(component.template)) {
						delete component.template;
					} else {
						component.template = component.template.replace(/^\s*(id|html):\s*/i, "");
					}

					this._set(component);
					resolve(component);
					return;
				}

			}).catch(error => {
				this._error(error);

				let _error = "fetch component catch [" + componentName + "]";
				this._error(_error);
				reject(_error);
				return;
			});

		};
	}

}