function e(e) {
	return e === undefined || null === e
}

function t(e) {
	return e !== undefined && null !== e
}

function n(e) {
	return null !== e && 'object' === (void 0 === e ? 'undefined' : l(e))
}

function r(e) {
	return (
		'object' === (void 0 === e ? 'undefined' : l(e)) && e instanceof HTMLElement
	)
}

function o(e) {
	var t = e && e.toString().match(/^\s*function (\w+)/)
	return t ? t[1] : ''
}

function i() {
	return (
		new RegExp('MSIE (\\d+\\.\\d+);').test(navigator.userAgent),
		parseFloat(RegExp.$1) || Infinity
	)
}

function c(e, t) {
	for (var n in t) e[n] = t[n]
	return e
}

function a(e) {
	var t = Object.create(null)
	return function(n) {
		return t[n] || (t[n] = e(n))
	}
}

function u(e) {
	return d.call(e).slice(8, -1)
}

function s(e) {
	throw new Error('Vaptcha error: ' + e)
}

function Promise(e) {
	var t = this
	;(this.state = 'pending'),
		(this.value = undefined),
		(this.reason = undefined),
		(this.onResolveAsyncCallbacks = []),
		(this.onRejectAsyncCallbacks = [])
	var n = function(e) {
			'pending' === t.state &&
				((t.state = 'fulfilled'),
				(t.value = e),
				t.onResolveAsyncCallbacks.map(function(e) {
					return e()
				}))
		},
		r = function(e) {
			'pending' === t.state &&
				((t.state = 'rejected'),
				(t.reason = e),
				t.onRejectAsyncCallbacks.map(function(t) {
					return t(e)
				}))
		}
	try {
		e(n, r)
	} catch (o) {
		r(o)
	}
}
;(window.HTMLElement = window.HTMLElement || Element),
	Array.prototype.map ||
		(Array.prototype.map = function(e, t) {
			var n, r, o
			if (null == this) throw new TypeError(' this is null or not defined')
			var i = Object(this),
				c = i.length >>> 0
			if ('[object Function]' != Object.prototype.toString.call(e))
				throw new TypeError(e + ' is not a function')
			for (t && (n = t), r = new Array(c), o = 0; o < c; ) {
				var a, u
				o in i && ((a = i[o]), (u = e.call(n, a, o, i)), (r[o] = u)), o++
			}
			return r
		}),
	Array.prototype.includes ||
		(Array.prototype.includes = function(e, t) {
			if (null == this) throw new TypeError('"this" is null or not defined')
			var n = Object(this),
				r = n.length >>> 0
			if (0 === r) return !1
			for (
				var o = 0 | t, i = Math.max(o >= 0 ? o : r - Math.abs(o), 0);
				i < r;

			) {
				if (n[i] === e) return !0
				i++
			}
			return !1
		}),
	Array.prototype.findIndex ||
		(Array.prototype.findIndex = function(e) {
			if (null == this) throw new TypeError('"this" is null or not defined')
			var t = Object(this),
				n = t.length >>> 0
			if ('function' != typeof e)
				throw new TypeError('predicate must be a function')
			for (var r = arguments[1], o = 0; o < n; ) {
				if (e.call(r, t[o], o, t)) return o
				o++
			}
			return -1
		}),
	Object.create ||
		(Object.create = function(e) {
			var t = function() {}
			return (t.prototype = e), new t()
		})
var f = {
		vid: null,
		scene: 0,
		container: null,
		type: 'float',
		style: 'dark',
		lang: 'zh-CN',
		ai: !0,
		https: !0,
		guide: !0,
		aiAnimation: !1,
		protocol: 'https://',
		css_version: '2.2.5',
		cdn_servers: ['statics.vaptcha.net'],
		api_server: 'api.vaptcha.com/v3',
		canvas_path: '/canvas.min.js',
		offline_server: ''
	},
	l =
		'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
			? function(e) {
					return typeof e
			  }
			: function(e) {
					return e &&
						'function' == typeof Symbol &&
						e.constructor === Symbol &&
						e !== Symbol.prototype
						? 'symbol'
						: typeof e
			  },
	d = Object.prototype.toString,
	p =
		(a(function(e) {
			for (
				var t = {},
					n =
						(e && -1 !== e.indexOf('?') && e.split('?')[1]) ||
						window.location.search.substring(1),
					r = n.split('&'),
					o = 0;
				o < r.length;
				o++
			) {
				var i = r[o].split('=')
				t[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
			}
			return t
		}),
		a(function(e) {
			return e.charAt(0).toUpperCase() + e.slice(1)
		})),
	h = function(t) {
		;(this.data = t),
			(this.valiudateFuns = []),
			(this.ruleFuns = {
				required: function(t, n) {
					return e(t) || 0 === t.length ? n : null
				}
			})
	}
h.prototype = {
	constructor: h,
	addValidateRules: function(e) {
		c(this.ruleFuns, e)
	},
	add: function(e, t, n) {
		var r = this,
			o = t.split(':'),
			i = o.shift(),
			c = this.ruleFuns[i]
		o.unshift(this.data[e]),
			o.push(n),
			c &&
				this.valiudateFuns.push(function() {
					return c.apply(r, o)
				})
	},
	validate: function() {
		for (var e, t = 0; (e = this.valiudateFuns[t++]); ) {
			var n = e()
			if (n) return s(n), !1
		}
		return !0
	}
}
var v = {
	AccessDenied: '0101',
	RefreshAgain: '0102',
	Success: '0103',
	Fail: '0104',
	RefreshTooFast: '0105',
	RefreshTanto: '0106',
	DrawTanto: '0107',
	Attack: '0108',
	jsonpTimeOut: '0703',
	challengeExpire: '1002'
}
;(Promise.prototype.then = function(e) {
	var t = this
	if ('fulfilled' === this.state) {
		var r = e(this.value)
		if (n(r) && 'Promise' === o(r.constructor)) return r
	}
	return 'pending' === this.state
		? new Promise(function(r) {
				t.onResolveAsyncCallbacks.push(function() {
					var i = e(t.value)
					if (n(i) && 'Promise' === o(i.constructor)) return i.then(r)
					r(i)
				})
		  })
		: this
}),
	(Promise.prototype['catch'] = function(e) {
		return (
			'rejected' === this.state && e(this.reason),
			'pending' === this.state && this.onRejectAsyncCallbacks.push(e),
			this
		)
	}),
	(Promise.resolve = function(e) {
		return new Promise(function(t) {
			t(e)
		})
	}),
	(Promise.reject = function(e) {
		return new Promise(function(t, n) {
			n(e)
		})
	})
var m = (function() {
		var e = f.protocol,
			t = f.api_server,
			n = function(e) {
				var t = ''
				for (var n in e)
					Object.prototype.hasOwnProperty.call(e, n) &&
						(t += '&' + n + '=' + encodeURIComponent(e[n]))
				return t
			},
			r = function(r, o) {
				var i = n(o),
					c = r.indexOf('http://') > -1 || r.indexOf('https://') > -1
				return (
					r.indexOf('?') < 0 && (i = '?' + i.slice(1)),
					c ? '' + r + i : '' + e + t + r + i
				)
			},
			o = function(e) {
				var t = document.getElementsByTagName('head')[0],
					n = document.createElement('script')
				return (
					(n.charset = 'UTF-8'),
					(n.src = e),
					t.appendChild(n),
					{
						remove: function() {
							t.removeChild(n)
						}
					}
				)
			},
			i = function(e, t, n) {
				return (
					(t = t || {}),
					(n = n || !1),
					new Promise(function(i) {
						if (n) {
							c(t, {
								vp: 'static',
								t: new Date().valueOf()
							}),
								(e = r(e, t))
							var a = o(e),
								u = setTimeout(function() {
									clearTimeout(u), (window['static'] = null), i()
								}, 5e3)
							window['static'] = function() {
								i.apply(this, arguments), a.remove(), (window['static'] = null)
							}
						} else {
							var s = 'VaptchaJsonp' + new Date().valueOf()
							window[s] && (s += '1'),
								c(t, {
									callback: s
								}),
								(e = r(e, t))
							var f = o(e),
								l = setTimeout(function() {
									clearTimeout(l),
										(window[s] = null),
										f.remove(),
										i({
											code: '0703',
											msg: 'Time out,Refresh Again!'
										})
								}, 1e4)
							window[s] = function() {
								clearTimeout(l),
									i.apply(this, arguments),
									f.remove(),
									(window[s] = null)
							}
						}
					})
				)
			}
		return (
			(i.setConfig = function(n) {
				;(e = n.protocol || e), (t = n.api_server || t)
			}),
			i
		)
	})(),
	y = {
		getConfig: function(e) {
			return m('/config', {
				id: e.vid,
				type: e.type,
				scene: e.scene || 0
			})
		},
		refresh: function(e) {
			return m('/refresh', e)
		},
		click: function(e) {
			return m('/click', e)
		},
		get: function(e) {
			return m('/get', e)
		},
		verify: function(e) {
			return m('/verify', e)
		},
		userbehavior: function(e) {
			return m('/userbehavior', e)
		},
		staticConfig: function(e) {
			return m(e.protocol + 'channel.vaptcha.net/config/' + e.id, {}, !0)
		}
	},
	g = {
		en: {
			'0201': 'id empty',
			'0202': 'id error',
			'0208': 'scene error',
			'0209': 'request used up',
			'0906': 'params error',
			'0702': 'domain does not match'
		},
		'zh-CN': {
			'0702': '验证单元与域名不匹配'
		}
	},
	w = (function() {
		var o = !1,
			a = function(e) {
				var t = new h(e)
				return (
					t.add(
						'offline_server',
						'required',
						'please configure offline_server'
					),
					t.validate(),
					c(e, {
						js_path: 'vaptcha-sdk-downtime.2.0.3.js',
						api_server: window.location.host,
						protocol: window.location.protocol + '//',
						mode: 'offline'
					}),
					m.setConfig(e),
					m(e.offline_server, {
						offline_action: 'get',
						vid: e.vid
					}).then(function(t) {
						return t.code !== v.Success
							? (s(g[t.msg] || t.msg), Promise.reject(t.code))
							: (c(e, t), Promise.resolve())
					})
				)
			},
			f = function(e) {
				return y
					.staticConfig({
						protocol: e.protocol,
						id: 'offline' == e.mode ? 'offline' : e.vid
					})
					.then(function(e) {
						return Promise.resolve(e)
					})
			},
			l = function(e) {
				return e.offline_server && '' != e.offline_server
					? f(e)
							.then(function(t) {
								return t.state
									? Promise.reject('5001: VAPTCHA cell error')
									: t.offline_state
									? '' == e.offline_server
										? Promise.reject('5002: offline_server not configured')
										: (c(e, {
												mode: 'offline',
												offline_key: t.offline_key
										  }),
										  a(e))
									: '' == t.api
									? Promise.reject('5003: error about channel')
									: (c(e, {
											api_server: t.api,
											offline_key: t.offline_key
									  }),
									  m.setConfig(e),
									  y.getConfig(e))
							})
							.then(function(t) {
								if (!t) return Promise.resolve()
								if (t.code !== v.Success) {
									var n = g[e.lang] || g['zh-CN']
									return (
										'0702' === t.msg && alert('Vaptcha error: ' + n[t.msg]),
										s(n[t.msg] || t.msg),
										Promise.reject(t.code)
									)
								}
								return c(e, t.data), Promise.resolve()
							})
					: Promise.reject('5002: offline_server not configured')
			},
			d = function(e, t) {
				return '' + e.protocol + e.cdn_servers[0] + '/' + t
			},
			w = function(t) {
				var n = document.getElementsByTagName('head')[0],
					r = document.getElementById('vaptcha_style')
				return new Promise(function(o) {
					e(r)
						? ((r = document.createElement('link')),
						  c(r, {
								rel: 'stylesheet',
								type: 'text/css',
								href: t,
								id: 'vaptcha_style',
								onload: o
						  }),
						  n && n.appendChild(r))
						: o()
				})
			},
			b = function C(e) {
				var n = document.getElementsByTagName('head')[0],
					r = document.querySelector("script[src='" + e + "']")
				return new Promise(function(o) {
					if (t(r))
						return void (r.loaded
							? o()
							: setTimeout(function() {
									return C(e).then(o)
							  }))
					r = document.createElement('script')
					var i = function() {
						;(r.readyState &&
							'loaded' !== r.readyState &&
							'complete' !== r.readyState) ||
							(o(),
							(r.loaded = !0),
							(r.onload = null),
							(r.onreadystatechange = null))
					}
					c(r, {
						async: !0,
						charset: 'utf-8',
						src: e,
						onerror: function() {
							return s('load sdk timeout')
						},
						onload: i,
						onreadystatechange: i
					}),
						n.appendChild(r)
				})
			},
			_ = function T(e) {
				var t = e.sdkName,
					n = e.config,
					r = d(n, 'js/' + n.js_path)
				return b(r).then(function() {
					var e = 'downtime' == t ? 'DownTime' : p(t),
						r = window['_' + e + 'Vaptcha'],
						o = new r(n)
					return (
						(o.vaptcha.resetCaptcha = function(e, t) {
							c(n, t),
								T({
									sdkName: e,
									config: n
								}).then(function(e) {
									o.destroy(),
										(o.options = e.options),
										(o.vaptcha = e.vaptcha),
										e.render(),
										'character' === n.mode &&
											['click', 'float', 'popup'].includes(n.type) &&
											e.vaptcha.dtClickCb({
												target: e.vaptcha.btnDiv
											})
								})
						}),
						Promise.resolve(o)
					)
				})
			},
			j = function(e) {
				;(o = !0),
					(e.https = !0),
					(e.protocol = 'https://'),
					m.setConfig(e),
					!['embed', 'popup', 'invisible'].includes(e.type) &&
						(e.type = 'popup'),
					i() < 9 && b(d(e, e.canvas_path))
				var t = new h(e)
				if (
					(t.addValidateRules({
						elementOrSelector: function(t, o) {
							if (
								('String' === u(e.container) &&
									(e.container = document.querySelector(e.container)),
								n(e.container) &&
									r(e.container[0]) &&
									(e.container = e.container[0]),
								!r(e.container))
							)
								return o
						}
					}),
					t.add('vid', 'required', 'please configure vid'),
					t.add(
						'offline_server',
						'required',
						'5002: offline_server not configured'
					),
					'invisible' !== e.type &&
						t.add(
							'container',
							'elementOrSelector',
							'5004: please configure container with element or selector'
						),
					t.validate())
				)
					return l(e)
						.then(function() {
							var t = e.https
									? 'css/theme_https.' + e.css_version + '.css'
									: 'css/theme.' + e.css_version + '.css',
								n = d(e, t)
							return w(n)
						})
						.then(function() {
							var t = 'offline' == e.mode ? 'downTime' : e.mode,
								n = t || e.type
							return (
								(o = !1),
								_({
									sdkName: n,
									config: e
								})
							)
						})
			}
		return function A(e) {
			return new Promise(function(t) {
				o
					? setTimeout(function() {
							A(e).then(t)
					  }, 1e3)
					: j(e).then(t)
			})['catch'](function(e) {
				return (o = !1), s(e), Promise.reject(e)
			})
		}
	})(),
	b = (function() {
		var e = function(e) {
				var n = e.getAttribute('data-config'),
					r = {}
				if (t(n))
					try {
						r = JSON.parse(n)
					} catch (o) {
						s('dom config format error')
					}
				return r
			},
			n = function(e) {
				var n = e.getAttribute('data-vid')
				return t(n)
					? {
							vid: n
					  }
					: {}
			},
			r = function(e, n) {
				var r = Object.create(f)
				;(r.container = e),
					c(r, n),
					t(r.vid) &&
						w(r).then(function(e) {
							e.renderTokenInput(), e.render()
						})
			}
		return function() {
			for (
				var t = document.querySelectorAll('[data-vid]'),
					o = document.querySelectorAll('[data-config]'),
					i = 0;
				i < o.length;
				i++
			) {
				var c = e(o[i])
				r(o[i], c)
			}
			for (var a = 0; a < t.length; a++)
				if (!Array.prototype.includes.call(o, t[a])) {
					var u = n(t[a])
					r(t[a], u)
				}
		}
	})()

// window.onload = b, window.vaptcha = function (e) {
//   var t = Object.create(f);
//   return c(t, e), w(t)
// }

function vaptcha(e) {
	var t = Object.create(f)
	return c(t, e), w(t)
}

// export { vaptcha }

module.exports = {vaptcha}
