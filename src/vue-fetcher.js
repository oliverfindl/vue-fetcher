/**
 * vue-fetcher v1.0.6 (2018-02-22)
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
			console.error(this._errorTitle + "cannot set VueFetcher class as global variable to window.%s, please do it manually", this._options.globalName);
		}
	}

	/**
	 * Private getter.
	 * @param {string} componentName
	 * @returns {object}
	 */
	_get(componentName) {
		if(!componentName) {
			console.error(this._errorTitle + "missing required arguments");
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
			console.error(this._errorTitle + "missing required arguments");
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
			console.error(this._errorTitle + "missing required arguments");
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
			console.error(this._errorTitle + "missing required arguments");
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
			console.error(this._errorTitle + "missing required arguments");
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
	 * Wrapper method responsible for manual pushing Vue components into VueFetcher instance.
	 * @param {object} component
	 * @returns {boolean}
	 */
	push(component) {
		if(!component || !component.name) {
			console.error(this._errorTitle + "missing required arguments");
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
			console.error(this._errorTitle + "missing required arguments");
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
					let error = this._errorTitle + "component fetch failed";
					console.error(error + " [%s]", componentName);
					reject(error);
					return;
				}

			}).then(component => {

				if(!component) {
					let error = this._errorTitle + "component check failed";
					console.error(error + " [%s]", componentName);
					reject(error);
					return;
				}

				try {
					component = window.eval("new window.Object(" + this._trim(component.toString(), "COMPONENT-AS-STRING") + ")");
				} catch(error) {
					console.error(this._errorTitle + "component eval failed [%s]", componentName);
					console.error(error);
					reject(error);
					return;
				}

				if(!component.hasOwnProperty("name") || !component.name.length) {
					component.name = this._replace(componentName, "COMPONENT-NAME");
				}

				if(!component.hasOwnProperty("template") || !component.template.length) {

					this._method([this._options.base, this._options.templateDir, componentName].join("/") + this._options.templateExt).then(response => {

						if(this._axios && [200, 304].indexOf(response.status) > -1) {
							return response.data;
						} else if(response.ok) {
							return response.text();
						} else {
							let error = this._errorTitle + "template fetch failed";
							console.error(error + " [%s]", componentName);
							reject(error);
							return;
						}

					}).then(template => {

						if(!template) {
							let error = this._errorTitle + "template check failed";
							console.error(error + " [%s]", componentName);
							reject(error);
							return;
						}

						component.template = template.toString();

						this._set(component);
						resolve(component);
						return;

					}).catch(error => {
						console.error(this._errorTitle + "fetch template catch [%s]", componentName);
						console.error(error);
						reject(error);
						return;
					});

				} else {
					this._set(component);
					resolve(component);
					return;
				}

			}).catch(error => {
				console.error(this._errorTitle + "fetch component catch [%s]", componentName);
				console.error(error);
				reject(error);
				return;
			});

		};
	}

}
