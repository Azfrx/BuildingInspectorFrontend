if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _imports_0$8 = "/static/image/loginLogo.jpg";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$H = {
    __name: "LoginPage",
    setup(__props, { expose: __expose }) {
      __expose();
      const username = vue.ref("");
      const password = vue.ref("");
      const rememberPassword = vue.ref(false);
      const offlineLogin = vue.ref(false);
      const showPassword = vue.ref(false);
      const toggleRememberPassword = () => {
        rememberPassword.value = !rememberPassword.value;
      };
      const toggleOfflineLogin = () => {
        offlineLogin.value = !offlineLogin.value;
      };
      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
      };
      const handleLogin = () => {
        if (username.value === "admin" && password.value === "123456") {
          uni.navigateTo({
            url: "/pages/home/home"
          });
        } else {
          uni.showToast({
            title: "用户名或密码错误",
            icon: "none"
          });
        }
      };
      const __returned__ = { username, password, rememberPassword, offlineLogin, showPassword, toggleRememberPassword, toggleOfflineLogin, togglePasswordVisibility, handleLogin, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$G(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "loginPage" }, [
      vue.createElementVNode("view", { class: "logo" }, [
        vue.createElementVNode("view", { class: "logo-container" }, [
          vue.createElementVNode("image", {
            src: _imports_0$8,
            mode: "widthFix",
            style: { "width": "100%", "background-color": "#ffffff" }
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "form" }, [
        vue.createElementVNode("view", { class: "item_1" }, [
          vue.createElementVNode("view", { class: "name" }, "用户名"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "uni-input",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.username = $event),
              placeholder: "请输入用户名"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.username]
          ])
        ]),
        vue.createElementVNode("view", { class: "item_2" }, [
          vue.createElementVNode("view", { class: "name" }, "密码"),
          vue.createElementVNode("view", { class: "container" }, [
            vue.createElementVNode("view", { class: "container_1" }, [
              vue.withDirectives(vue.createElementVNode("input", {
                class: "uni-input",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.password = $event),
                type: $setup.showPassword ? "text" : "password",
                placeholder: "请输入密码"
              }, null, 8, ["type"]), [
                [vue.vModelDynamic, $setup.password]
              ]),
              vue.createElementVNode("view", { class: "password-icons" }, [
                vue.createElementVNode("image", {
                  src: $setup.showPassword ? "/static/image/EyeOutline.png" : "/static/image/open.png",
                  mode: "widthFix",
                  style: { "width": "5%" },
                  class: "password-icon",
                  onClick: $setup.togglePasswordVisibility
                }, null, 8, ["src"])
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "item_3" }, [
          vue.createElementVNode("radio-group", { name: "radio" }, [
            vue.createElementVNode("label", { onClick: $setup.toggleRememberPassword }, [
              vue.createElementVNode("radio", { checked: $setup.rememberPassword }, null, 8, ["checked"]),
              vue.createTextVNode("记住密码 ")
            ]),
            vue.createElementVNode("label", { onClick: $setup.toggleOfflineLogin }, [
              vue.createElementVNode("radio", { checked: $setup.offlineLogin }, null, 8, ["checked"]),
              vue.createTextVNode("离线登录 ")
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "item_4" }, [
          vue.createElementVNode("button", {
            size: "default",
            type: "default",
            style: { "color": "#ffffff", "backgroundColor": "#0F4687", "borderColor": "#1AAD19" },
            "hover-class": "is-hover",
            onClick: $setup.handleLogin
          }, "登录")
        ])
      ])
    ]);
  }
  const PagesLoginPageLoginPage = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$G], ["__scopeId", "data-v-314e8b73"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/LoginPage/LoginPage.vue"]]);
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom2) {
    return typeof component === "string" ? easycom2 : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const _sfc_main$G = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const username = vue.ref("");
      const password = vue.ref("");
      const rememberPassword = vue.ref(false);
      const autoLogin = vue.ref(false);
      onLoad(() => {
        const isLoggedIn = uni.getStorageSync("isLoggedIn");
        if (isLoggedIn) {
          uni.redirectTo({
            url: "/pages/home/home"
          });
        }
        rememberPassword.value = uni.getStorageSync("rememberPassword") || false;
        autoLogin.value = uni.getStorageSync("autoLogin") || false;
        if (rememberPassword.value) {
          username.value = uni.getStorageSync("username") || "";
          password.value = uni.getStorageSync("password") || "";
        }
        if (autoLogin.value && username.value && password.value) {
          login();
        }
      });
      const login = () => {
        if (!username.value || !password.value) {
          uni.showToast({
            title: "请输入用户名和密码",
            icon: "none"
          });
          return;
        }
        const correctUsername = "admin";
        const correctPassword = "123456";
        if (username.value === correctUsername && password.value === correctPassword) {
          uni.showToast({
            title: "登录成功",
            icon: "success"
          });
          uni.setStorageSync("isLoggedIn", true);
          if (rememberPassword.value) {
            uni.setStorageSync("username", username.value);
            uni.setStorageSync("password", password.value);
          } else {
            uni.removeStorageSync("username");
            uni.removeStorageSync("password");
          }
          uni.setStorageSync("rememberPassword", rememberPassword.value);
          uni.setStorageSync("autoLogin", autoLogin.value);
          uni.setStorageSync("isOnline", true);
          uni.redirectTo({
            url: "/pages/home/home"
          });
        } else {
          uni.showToast({
            title: "用户名或密码错误",
            icon: "none"
          });
        }
      };
      const toggleRememberPassword = (event) => {
        rememberPassword.value = event.detail.value.length > 0;
        uni.setStorageSync("rememberPassword", rememberPassword.value);
        if (!rememberPassword.value) {
          autoLogin.value = false;
          uni.setStorageSync("autoLogin", false);
        }
      };
      const toggleAutoLogin = (event) => {
        autoLogin.value = event.detail.value.length > 0;
        uni.setStorageSync("autoLogin", autoLogin.value);
        if (autoLogin.value) {
          rememberPassword.value = true;
          uni.setStorageSync("rememberPassword", true);
        }
      };
      const offlineLogin = () => {
        uni.showToast({
          title: "离线登录成功",
          icon: "success"
        });
        uni.setStorageSync("isLoggedIn", true);
        uni.setStorageSync("isOnline", false);
        uni.redirectTo({
          url: "/pages/home/home"
        });
      };
      const __returned__ = { username, password, rememberPassword, autoLogin, login, toggleRememberPassword, toggleAutoLogin, offlineLogin, ref: vue.ref, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$F(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login" }, [
      vue.createElementVNode("view", { class: "login-box" }, [
        vue.createElementVNode("view", { class: "login-box-title" }, "登录"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "login-box-username",
            placeholder: "请输入账号",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.username = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.username]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "login-box-password",
            placeholder: "请输入密码",
            password: "",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.password = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.password]
        ]),
        vue.createElementVNode("view", { class: "login-box-option" }, [
          vue.createElementVNode(
            "checkbox-group",
            { onChange: $setup.toggleRememberPassword },
            [
              vue.createElementVNode("label", { class: "login-box-option-rememberPassword" }, [
                vue.createElementVNode("checkbox", { checked: $setup.rememberPassword }, null, 8, ["checked"]),
                vue.createElementVNode("text", null, "记住密码")
              ])
            ],
            32
            /* NEED_HYDRATION */
          ),
          vue.createElementVNode(
            "checkbox-group",
            { onChange: $setup.toggleAutoLogin },
            [
              vue.createElementVNode("label", { class: "login-box-option-autoLogin" }, [
                vue.createElementVNode("checkbox", { checked: $setup.autoLogin }, null, 8, ["checked"]),
                vue.createElementVNode("text", null, "自动登录")
              ])
            ],
            32
            /* NEED_HYDRATION */
          )
        ]),
        vue.createElementVNode("view", {
          class: "login-box-button",
          onClick: _cache[2] || (_cache[2] = ($event) => $setup.login())
        }, "登录"),
        vue.createElementVNode("view", { class: "login-box-offline" }, [
          vue.createElementVNode("view", {
            class: "login-box-offline-box",
            onClick: $setup.offlineLogin
          }, "离线登录")
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$F], ["__scopeId", "data-v-e4e4508d"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/login/login.vue"]]);
  const _imports_0$7 = "/static/image/loginLogo.png";
  const _imports_1$3 = "/static/image/bridgenew.png";
  const _imports_2$2 = "/static/image/setting.png";
  const _sfc_main$F = {
    __name: "home",
    setup(__props, { expose: __expose }) {
      __expose();
      const activeSection = vue.ref("");
      const handleClick = (section) => {
        activeSection.value = section;
        if (section === "bridge") {
          uni.navigateTo({
            url: "/pages/bridge/bridge"
          });
        } else if (section === "setting") {
          uni.navigateTo({
            url: "/pages/SystemSetting/SystemSetting"
          });
        }
      };
      const __returned__ = { activeSection, handleClick, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { id: "homePage" }, [
      vue.createElementVNode("view", { class: "logo" }, [
        vue.createElementVNode("image", {
          src: _imports_0$7,
          mode: "widthFix",
          style: { "width": "100%" }
        })
      ]),
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "content" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["section", { "active": $setup.activeSection === "bridge" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.handleClick("bridge"))
            },
            [
              vue.createElementVNode("view", { class: "icon-item" }, [
                vue.createElementVNode("view", { class: "icon-box" }, [
                  vue.createElementVNode("image", {
                    src: _imports_1$3,
                    mode: "widthFix",
                    class: "home-icon"
                  })
                ]),
                vue.createElementVNode("text", { class: "leftText" }, "桥梁定检")
              ])
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["section", { "active": $setup.activeSection === "setting" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $setup.handleClick("setting"))
            },
            [
              vue.createElementVNode("view", { class: "icon-item" }, [
                vue.createElementVNode("view", { class: "icon-box" }, [
                  vue.createElementVNode("image", {
                    src: _imports_2$2,
                    mode: "widthFix",
                    class: "home-icon"
                  })
                ]),
                vue.createElementVNode("text", { class: "leftText" }, "系统设置")
              ])
            ],
            2
            /* CLASS */
          )
        ])
      ])
    ]);
  }
  const PagesHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$E], ["__scopeId", "data-v-07e72d3c"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/home/home.vue"]]);
  const noMessage = "/static/image/noMessage.svg";
  const _sfc_main$E = {
    __name: "message",
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = { get noMessage() {
        return noMessage;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "message" }, [
      vue.createElementVNode("view", { class: "message-none" }, [
        vue.createElementVNode("image", {
          class: "message-none-icon",
          src: $setup.noMessage
        }, null, 8, ["src"]),
        vue.createElementVNode("view", { class: "message-none-text" }, "没有相关数据哦")
      ])
    ]);
  }
  const PagesMessageMessage = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$D], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/message/message.vue"]]);
  const _sfc_main$D = {
    __name: "infoItem",
    props: {
      infoKey: String,
      infoValue: String
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const __returned__ = { props, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "infoItem" }, [
      vue.createElementVNode(
        "view",
        { class: "infoItem-key" },
        vue.toDisplayString($setup.props.infoKey),
        1
        /* TEXT */
      ),
      vue.createElementVNode(
        "view",
        { class: "infoItem-value" },
        vue.toDisplayString($setup.props.infoValue),
        1
        /* TEXT */
      )
    ]);
  }
  const infoItem = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$C], ["__scopeId", "data-v-e152a2e4"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/infoItem.vue"]]);
  const _sfc_main$C = {
    __name: "userinfo",
    setup(__props, { expose: __expose }) {
      __expose();
      const userinfo = vue.ref([{
        key: "姓名",
        value: "西工院检测05"
      }, {
        key: "编号",
        value: "xigy05"
      }, {
        key: "手机号码",
        value: "12345678901"
      }, {
        key: "权属单位",
        value: "陕西交控工程技术有限公司"
      }]);
      const photoSrc = vue.ref("/static/image/zjl.png");
      const changePhoto = () => {
        uni.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            photoSrc.value = res.tempFilePaths[0];
          },
          fail: (err) => {
            formatAppLog("error", "at pages/userinfo/userinfo.vue:38", "头像选择失败", err);
          }
        });
      };
      const __returned__ = { userinfo, photoSrc, changePhoto, ref: vue.ref, infoItem };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "userinfo" }, [
      vue.createElementVNode("view", { class: "userinfo-photoBox" }, [
        vue.createElementVNode("image", {
          class: "userinfo-photoBox-photo",
          src: $setup.photoSrc,
          onClick: $setup.changePhoto
        }, null, 8, ["src"])
      ]),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.userinfo, (item, index) => {
          return vue.openBlock(), vue.createBlock($setup["infoItem"], {
            key: index,
            infoKey: item.key,
            infoValue: item.value
          }, null, 8, ["infoKey", "infoValue"]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesUserinfoUserinfo = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$B], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/userinfo/userinfo.vue"]]);
  const _imports_0$6 = "/static/image/exclamation.svg";
  const _imports_1$2 = "/static/image/rightArrow.svg";
  const _sfc_main$B = {
    __name: "setting",
    setup(__props, { expose: __expose }) {
      __expose();
      const toVersionInfo = () => {
        uni.navigateTo({
          url: "/pages/versionInfo/versionInfo"
        });
      };
      const logout = () => {
        uni.removeStorageSync("isLoggedIn");
        uni.removeStorageSync("autoLogin");
        uni.redirectTo({ url: "/pages/login/login" });
      };
      const __returned__ = { toVersionInfo, logout };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "setting" }, [
      vue.createElementVNode("view", {
        class: "setting-versionInfo",
        onClick: $setup.toVersionInfo
      }, [
        vue.createElementVNode("view", { class: "setting-versionInfo-left" }, [
          vue.createElementVNode("image", {
            class: "setting-versionInfo-left-icon",
            src: _imports_0$6
          }),
          vue.createElementVNode("view", { class: "setting-versionInfo-left-text" }, "版本信息")
        ]),
        vue.createElementVNode("image", {
          class: "setting-versionInfo-rightArrow",
          src: _imports_1$2
        })
      ]),
      vue.createElementVNode("view", {
        class: "setting-logout",
        onClick: $setup.logout
      }, " 注销登录 ")
    ]);
  }
  const PagesSettingSetting = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$A], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/setting/setting.vue"]]);
  const popup = {
    data() {
      return {};
    },
    created() {
      this.popup = this.getParent();
    },
    methods: {
      /**
       * 获取父元素实例
       */
      getParent(name = "uniPopup") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en$3 = {
    "uni-popup.cancel": "cancel",
    "uni-popup.ok": "ok",
    "uni-popup.placeholder": "pleace enter",
    "uni-popup.title": "Hint",
    "uni-popup.shareTitle": "Share to"
  };
  const zhHans$2 = {
    "uni-popup.cancel": "取消",
    "uni-popup.ok": "确定",
    "uni-popup.placeholder": "请输入",
    "uni-popup.title": "提示",
    "uni-popup.shareTitle": "分享到"
  };
  const zhHant$2 = {
    "uni-popup.cancel": "取消",
    "uni-popup.ok": "確定",
    "uni-popup.placeholder": "請輸入",
    "uni-popup.title": "提示",
    "uni-popup.shareTitle": "分享到"
  };
  const messages$2 = {
    en: en$3,
    "zh-Hans": zhHans$2,
    "zh-Hant": zhHant$2
  };
  const {
    t: t$3
  } = initVueI18n(messages$2);
  const _sfc_main$A = {
    name: "uniPopupDialog",
    mixins: [popup],
    emits: ["confirm", "close", "update:modelValue", "input"],
    props: {
      inputType: {
        type: String,
        default: "text"
      },
      showClose: {
        type: Boolean,
        default: true
      },
      modelValue: {
        type: [Number, String],
        default: ""
      },
      placeholder: {
        type: [String, Number],
        default: ""
      },
      type: {
        type: String,
        default: "error"
      },
      mode: {
        type: String,
        default: "base"
      },
      title: {
        type: String,
        default: ""
      },
      content: {
        type: String,
        default: ""
      },
      beforeClose: {
        type: Boolean,
        default: false
      },
      cancelText: {
        type: String,
        default: ""
      },
      confirmText: {
        type: String,
        default: ""
      },
      maxlength: {
        type: Number,
        default: -1
      },
      focus: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dialogType: "error",
        val: ""
      };
    },
    computed: {
      okText() {
        return this.confirmText || t$3("uni-popup.ok");
      },
      closeText() {
        return this.cancelText || t$3("uni-popup.cancel");
      },
      placeholderText() {
        return this.placeholder || t$3("uni-popup.placeholder");
      },
      titleText() {
        return this.title || t$3("uni-popup.title");
      }
    },
    watch: {
      type(val) {
        this.dialogType = val;
      },
      mode(val) {
        if (val === "input") {
          this.dialogType = "info";
        }
      },
      value(val) {
        if (this.maxlength != -1 && this.mode === "input") {
          this.val = val.slice(0, this.maxlength);
        } else {
          this.val = val;
        }
      },
      val(val) {
        this.$emit("update:modelValue", val);
      }
    },
    created() {
      this.popup.disableMask();
      if (this.mode === "input") {
        this.dialogType = "info";
        this.val = this.value;
        this.val = this.modelValue;
      } else {
        this.dialogType = this.type;
      }
    },
    methods: {
      /**
       * 点击确认按钮
       */
      onOk() {
        if (this.mode === "input") {
          this.$emit("confirm", this.val);
        } else {
          this.$emit("confirm");
        }
        if (this.beforeClose)
          return;
        this.popup.close();
      },
      /**
       * 点击取消按钮
       */
      closeDialog() {
        this.$emit("close");
        if (this.beforeClose)
          return;
        this.popup.close();
      },
      close() {
        this.popup.close();
      }
    }
  };
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-popup-dialog" }, [
      vue.createElementVNode("view", { class: "uni-dialog-title" }, [
        vue.createElementVNode(
          "text",
          {
            class: vue.normalizeClass(["uni-dialog-title-text", ["uni-popup__" + $data.dialogType]])
          },
          vue.toDisplayString($options.titleText),
          3
          /* TEXT, CLASS */
        )
      ]),
      $props.mode === "base" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "uni-dialog-content"
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createElementVNode(
            "text",
            { class: "uni-dialog-content-text" },
            vue.toDisplayString($props.content),
            1
            /* TEXT */
          )
        ], true)
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "uni-dialog-content"
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.withDirectives(vue.createElementVNode("input", {
            class: "uni-dialog-input",
            maxlength: $props.maxlength,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.val = $event),
            type: $props.inputType,
            placeholder: $options.placeholderText,
            focus: $props.focus
          }, null, 8, ["maxlength", "type", "placeholder", "focus"]), [
            [vue.vModelDynamic, $data.val]
          ])
        ], true)
      ])),
      vue.createElementVNode("view", { class: "uni-dialog-button-group" }, [
        $props.showClose ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-dialog-button",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.closeDialog && $options.closeDialog(...args))
        }, [
          vue.createElementVNode(
            "text",
            { class: "uni-dialog-button-text" },
            vue.toDisplayString($options.closeText),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-dialog-button", $props.showClose ? "uni-border-left" : ""]),
            onClick: _cache[2] || (_cache[2] = (...args) => $options.onOk && $options.onOk(...args))
          },
          [
            vue.createElementVNode(
              "text",
              { class: "uni-dialog-button-text uni-button-color" },
              vue.toDisplayString($options.okText),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ])
    ]);
  }
  const __easycom_0$7 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$z], ["__scopeId", "data-v-d78c88b7"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.vue"]]);
  class MPAnimation {
    constructor(options, _this) {
      this.options = options;
      this.animation = uni.createAnimation({
        ...options
      });
      this.currentStepAnimates = {};
      this.next = 0;
      this.$ = _this;
    }
    _nvuePushAnimates(type, args) {
      let aniObj = this.currentStepAnimates[this.next];
      let styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = "";
        }
        let unit = "";
        if (type === "rotate") {
          unit = "deg";
        }
        styles.styles.transform += `${type}(${args + unit}) `;
      } else {
        styles.styles[type] = `${args}`;
      }
      this.currentStepAnimates[this.next] = styles;
    }
    _animateRun(styles = {}, config = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, {
          styles,
          ...config
        }, (res) => {
          resolve();
        });
      });
    }
    _nvueNextAnimate(animates, step = 0, fn) {
      let obj = animates[step];
      if (obj) {
        let {
          styles,
          config
        } = obj;
        this._animateRun(styles, config).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config = {}) {
      this.animation.step(config);
      return this;
    }
    run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(() => {
        typeof fn === "function" && fn();
      }, this.$.durationTime);
    }
  }
  const animateTypes1 = [
    "matrix",
    "matrix3d",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ"
  ];
  const animateTypes2 = ["opacity", "backgroundColor"];
  const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
  animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
    MPAnimation.prototype[type] = function(...args) {
      this.animation[type](...args);
      return this;
    };
  });
  function createAnimation(option, _this) {
    if (!_this)
      return;
    clearTimeout(_this.timer);
    return new MPAnimation(option, _this);
  }
  const _sfc_main$z = {
    name: "uniTransition",
    emits: ["click", "change"],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      modeClass: {
        type: [Array, String],
        default() {
          return "fade";
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      styles: {
        type: Object,
        default() {
          return {};
        }
      },
      customClass: {
        type: String,
        default: ""
      },
      onceRender: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        transform: "",
        opacity: 1,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler(newVal) {
          if (newVal) {
            this.open();
          } else {
            if (this.isShow) {
              this.close();
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      // 生成样式数据
      stylesObject() {
        let styles = {
          ...this.styles,
          "transition-duration": this.duration / 1e3 + "s"
        };
        let transform = "";
        for (let i2 in styles) {
          let line = this.toLine(i2);
          transform += line + ":" + styles[i2] + ";";
        }
        return transform;
      },
      // 初始化动画条件
      transformStyles() {
        return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
      }
    },
    created() {
      this.config = {
        duration: this.duration,
        timingFunction: "ease",
        transformOrigin: "50% 50%",
        delay: 0
      };
      this.durationTime = this.duration;
    },
    methods: {
      /**
       *  ref 触发 初始化动画
       */
      init(obj = {}) {
        if (obj.duration) {
          this.durationTime = obj.duration;
        }
        this.animation = createAnimation(Object.assign(this.config, obj), this);
      },
      /**
       * 点击组件触发回调
       */
      onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      /**
       * ref 触发 动画分组
       * @param {Object} obj
       */
      step(obj, config = {}) {
        if (!this.animation)
          return;
        for (let i2 in obj) {
          try {
            if (typeof obj[i2] === "object") {
              this.animation[i2](...obj[i2]);
            } else {
              this.animation[i2](obj[i2]);
            }
          } catch (e2) {
            formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `方法 ${i2} 不存在`);
          }
        }
        this.animation.step(config);
        return this;
      },
      /**
       *  ref 触发 执行动画
       */
      run(fn) {
        if (!this.animation)
          return;
        this.animation.run(fn);
      },
      // 开始过度动画
      open() {
        clearTimeout(this.timer);
        this.transform = "";
        this.isShow = true;
        let { opacity, transform } = this.styleInit(false);
        if (typeof opacity !== "undefined") {
          this.opacity = opacity;
        }
        this.transform = transform;
        this.$nextTick(() => {
          this.timer = setTimeout(() => {
            this.animation = createAnimation(this.config, this);
            this.tranfromInit(false).step();
            this.animation.run();
            this.$emit("change", {
              detail: this.isShow
            });
          }, 20);
        });
      },
      // 关闭过度动画
      close(type) {
        if (!this.animation)
          return;
        this.tranfromInit(true).step().run(() => {
          this.isShow = false;
          this.animationData = null;
          this.animation = null;
          let { opacity, transform } = this.styleInit(false);
          this.opacity = opacity || 1;
          this.transform = transform;
          this.$emit("change", {
            detail: this.isShow
          });
        });
      },
      // 处理动画开始前的默认样式
      styleInit(type) {
        let styles = {
          transform: ""
        };
        let buildStyle = (type2, mode) => {
          if (mode === "fade") {
            styles.opacity = this.animationType(type2)[mode];
          } else {
            styles.transform += this.animationType(type2)[mode] + " ";
          }
        };
        if (typeof this.modeClass === "string") {
          buildStyle(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildStyle(type, mode);
          });
        }
        return styles;
      },
      // 处理内置组合动画
      tranfromInit(type) {
        let buildTranfrom = (type2, mode) => {
          let aniNum = null;
          if (mode === "fade") {
            aniNum = type2 ? 0 : 1;
          } else {
            aniNum = type2 ? "-100%" : "0";
            if (mode === "zoom-in") {
              aniNum = type2 ? 0.8 : 1;
            }
            if (mode === "zoom-out") {
              aniNum = type2 ? 1.2 : 1;
            }
            if (mode === "slide-right") {
              aniNum = type2 ? "100%" : "0";
            }
            if (mode === "slide-bottom") {
              aniNum = type2 ? "100%" : "0";
            }
          }
          this.animation[this.animationMode()[mode]](aniNum);
        };
        if (typeof this.modeClass === "string") {
          buildTranfrom(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildTranfrom(type, mode);
          });
        }
        return this.animation;
      },
      animationType(type) {
        return {
          fade: type ? 0 : 1,
          "slide-top": `translateY(${type ? "0" : "-100%"})`,
          "slide-right": `translateX(${type ? "0" : "100%"})`,
          "slide-bottom": `translateY(${type ? "0" : "100%"})`,
          "slide-left": `translateX(${type ? "0" : "-100%"})`,
          "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
          "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
        };
      },
      // 内置动画类型与实际动画对应字典
      animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      // 驼峰转中横线
      toLine(name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
      ref: "ani",
      animation: $data.animationData,
      class: vue.normalizeClass($props.customClass),
      style: vue.normalizeStyle($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 14, ["animation"])), [
      [vue.vShow, $data.isShow]
    ]);
  }
  const __easycom_0$6 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$y = {
    name: "uniPopup",
    components: {},
    emits: ["change", "maskClick"],
    props: {
      // 开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
      // message: 消息提示 ; dialog : 对话框
      type: {
        type: String,
        default: "center"
      },
      // maskClick
      isMaskClick: {
        type: Boolean,
        default: null
      },
      // TODO 2 个版本后废弃属性 ，使用 isMaskClick
      maskClick: {
        type: Boolean,
        default: null
      },
      backgroundColor: {
        type: String,
        default: "none"
      },
      safeArea: {
        type: Boolean,
        default: true
      },
      maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        type: String
      }
    },
    watch: {
      /**
       * 监听type类型
       */
      type: {
        handler: function(type) {
          if (!this.config[type])
            return;
          this[this.config[type]](true);
        },
        immediate: true
      },
      isDesktop: {
        handler: function(newVal) {
          if (!this.config[newVal])
            return;
          this[this.config[this.type]](true);
        },
        immediate: true
      },
      /**
       * 监听遮罩是否可点击
       * @param {Object} val
       */
      maskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      isMaskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      // H5 下禁止底部滚动
      showPopup(show) {
      }
    },
    data() {
      return {
        duration: 300,
        ani: [],
        showPopup: false,
        showTrans: false,
        popupWidth: 0,
        popupHeight: 0,
        config: {
          top: "top",
          bottom: "bottom",
          center: "center",
          left: "left",
          right: "right",
          message: "top",
          dialog: "center",
          share: "bottom"
        },
        maskClass: {
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        transClass: {
          backgroundColor: "transparent",
          borderRadius: this.borderRadius || "0",
          position: "fixed",
          left: 0,
          right: 0
        },
        maskShow: true,
        mkclick: true,
        popupstyle: "top"
      };
    },
    computed: {
      getStyles() {
        let res = { backgroundColor: this.bg };
        if (this.borderRadius || "0") {
          res = Object.assign(res, { borderRadius: this.borderRadius });
        }
        return res;
      },
      isDesktop() {
        return this.popupWidth >= 500 && this.popupHeight >= 500;
      },
      bg() {
        if (this.backgroundColor === "" || this.backgroundColor === "none") {
          return "transparent";
        }
        return this.backgroundColor;
      }
    },
    mounted() {
      const fixSize = () => {
        const {
          windowWidth,
          windowHeight,
          windowTop,
          safeArea,
          screenHeight,
          safeAreaInsets
        } = uni.getSystemInfoSync();
        this.popupWidth = windowWidth;
        this.popupHeight = windowHeight + (windowTop || 0);
        if (safeArea && this.safeArea) {
          this.safeAreaInsets = safeAreaInsets.bottom;
        } else {
          this.safeAreaInsets = 0;
        }
      };
      fixSize();
    },
    // TODO vue3
    unmounted() {
      this.setH5Visible();
    },
    activated() {
      this.setH5Visible(!this.showPopup);
    },
    deactivated() {
      this.setH5Visible(true);
    },
    created() {
      if (this.isMaskClick === null && this.maskClick === null) {
        this.mkclick = true;
      } else {
        this.mkclick = this.isMaskClick !== null ? this.isMaskClick : this.maskClick;
      }
      if (this.animation) {
        this.duration = 300;
      } else {
        this.duration = 0;
      }
      this.messageChild = null;
      this.clearPropagation = false;
      this.maskClass.backgroundColor = this.maskBackgroundColor;
    },
    methods: {
      setH5Visible(visible = true) {
      },
      /**
       * 公用方法，不显示遮罩层
       */
      closeMask() {
        this.maskShow = false;
      },
      /**
       * 公用方法，遮罩层禁止点击
       */
      disableMask() {
        this.mkclick = false;
      },
      // TODO nvue 取消冒泡
      clear(e2) {
        e2.stopPropagation();
        this.clearPropagation = true;
      },
      open(direction) {
        if (this.showPopup) {
          return;
        }
        let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
        if (!(direction && innerType.indexOf(direction) !== -1)) {
          direction = this.type;
        }
        if (!this.config[direction]) {
          formatAppLog("error", "at uni_modules/uni-popup/components/uni-popup/uni-popup.vue:310", "缺少类型：", direction);
          return;
        }
        this[this.config[direction]]();
        this.$emit("change", {
          show: true,
          type: direction
        });
      },
      close(type) {
        this.showTrans = false;
        this.$emit("change", {
          show: false,
          type: this.type
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showPopup = false;
        }, 300);
      },
      // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
      touchstart() {
        this.clearPropagation = false;
      },
      onTap() {
        if (this.clearPropagation) {
          this.clearPropagation = false;
          return;
        }
        this.$emit("maskClick");
        if (!this.mkclick)
          return;
        this.close();
      },
      /**
       * 顶部弹出样式处理
       */
      top(type) {
        this.popupstyle = this.isDesktop ? "fixforpc-top" : "top";
        this.ani = ["slide-top"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
        this.$nextTick(() => {
          this.showPoptrans();
          if (this.messageChild && this.type === "message") {
            this.messageChild.timerClose();
          }
        });
      },
      /**
       * 底部弹出样式处理
       */
      bottom(type) {
        this.popupstyle = "bottom";
        this.ani = ["slide-bottom"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: this.safeAreaInsets + "px",
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      /**
       * 中间弹出样式处理
       */
      center(type) {
        this.popupstyle = "center";
        this.ani = ["zoom-out", "fade"];
        this.transClass = {
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      left(type) {
        this.popupstyle = "left";
        this.ani = ["slide-left"];
        this.transClass = {
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      right(type) {
        this.popupstyle = "right";
        this.ani = ["slide-right"];
        this.transClass = {
          position: "fixed",
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      showPoptrans() {
        this.$nextTick(() => {
          this.showPopup = true;
          this.showTrans = true;
        });
      }
    }
  };
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0$6);
    return $data.showPopup ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]])
      },
      [
        vue.createElementVNode(
          "view",
          {
            onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
          },
          [
            $data.maskShow ? (vue.openBlock(), vue.createBlock(_component_uni_transition, {
              key: "1",
              name: "mask",
              "mode-class": "fade",
              styles: $data.maskClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, null, 8, ["styles", "duration", "show", "onClick"])) : vue.createCommentVNode("v-if", true),
            vue.createVNode(_component_uni_transition, {
              key: "2",
              "mode-class": $data.ani,
              name: "content",
              styles: $data.transClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["uni-popup__wrapper", [$data.popupstyle]]),
                    style: vue.normalizeStyle($options.getStyles),
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ],
                  6
                  /* CLASS, STYLE */
                )
              ]),
              _: 3
              /* FORWARDED */
            }, 8, ["mode-class", "styles", "duration", "show", "onClick"])
          ],
          32
          /* NEED_HYDRATION */
        )
      ],
      2
      /* CLASS */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-4dd3c44b"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const _imports_0$5 = "/static/image/bridge.svg";
  const _sfc_main$x = {
    __name: "versionInfo",
    setup(__props, { expose: __expose }) {
      __expose();
      const versionPopup = vue.ref(null);
      const togglePopup = () => {
        versionPopup.value.open();
      };
      const handleConfirm = () => {
        versionPopup.value.close();
      };
      const handleClose = () => {
      };
      const __returned__ = { versionPopup, togglePopup, handleConfirm, handleClose, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup_dialog = resolveEasycom(vue.resolveDynamicComponent("uni-popup-dialog"), __easycom_0$7);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_2$1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "versionInfo" }, [
          vue.createElementVNode("view", { class: "versionInfo-version" }, [
            vue.createElementVNode("image", {
              class: "versionInfo-version-icon",
              src: _imports_0$5
            }),
            vue.createElementVNode("view", { class: "versionInfo-version-text" }, "当前版本: v3.1")
          ]),
          vue.createElementVNode("view", {
            class: "versionInfo-check",
            onClick: $setup.togglePopup
          }, "检查版本更新"),
          vue.createElementVNode("view", { class: "versionInfo-company" }, "©2023~2025 陕西交控工程技术有限公司")
        ]),
        vue.createVNode(
          _component_uni_popup,
          {
            ref: "versionPopup",
            type: "dialog"
          },
          {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_popup_dialog, {
                title: "更新提示",
                content: "已经是最新版本",
                showClose: false,
                confirmText: "确定",
                onConfirm: $setup.handleConfirm,
                onClose: $setup.handleClose
              })
            ]),
            _: 1
            /* STABLE */
          },
          512
          /* NEED_PATCH */
        )
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesVersionInfoVersionInfo = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/versionInfo/versionInfo.vue"]]);
  let __currentFilePath$1 = null;
  function getFullPath$2(path) {
    const docPath = plus.io.convertLocalFileSystemURL(path);
    return docPath;
  }
  function saveData$1(data2) {
    return new Promise((resolve, reject) => {
      if (!__currentFilePath$1) {
        return reject(new Error("请先执行读取操作获取文件路径"));
      }
      const fullPath = getFullPath$2(__currentFilePath$1);
      formatAppLog("log", "at utils/reviseJson.js:18", "准备保存文件到路径:", fullPath);
      plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs2) => {
        formatAppLog("log", "at utils/reviseJson.js:21", "获取文件系统成功");
        fs2.root.getFile(fullPath, { create: true }, (fileEntry) => {
          formatAppLog("log", "at utils/reviseJson.js:23", "获取文件入口成功");
          fileEntry.createWriter((writer) => {
            const wait = plus.nativeUI.showWaiting("正在保存信息");
            writer.seek(0);
            const jsonString = JSON.stringify(data2, null, 2);
            formatAppLog("log", "at utils/reviseJson.js:29", "准备写入数据:", data2);
            writer.onwrite = () => {
              wait.close();
              formatAppLog("log", "at utils/reviseJson.js:33", "写入成功");
              plus.nativeUI.toast("保存成功");
              resolve(true);
            };
            writer.onerror = (e2) => {
              wait.close();
              formatAppLog("error", "at utils/reviseJson.js:40", "写入失败:", e2.message);
              plus.nativeUI.toast("保存失败");
              reject(e2);
            };
            writer.write(jsonString);
          }, (error) => {
            formatAppLog("error", "at utils/reviseJson.js:47", "创建写入器失败:", error);
            reject(error);
          });
        }, (error) => {
          formatAppLog("error", "at utils/reviseJson.js:51", "获取文件入口失败:", error);
          reject(error);
        });
      }, (error) => {
        formatAppLog("error", "at utils/reviseJson.js:55", "获取文件系统失败:", error);
        reject(error);
      });
    });
  }
  function trackPath$1(path) {
    formatAppLog("log", "at utils/reviseJson.js:64", "设置文件路径:", path);
    __currentFilePath$1 = path;
  }
  const DOC_BASE_PATH$2 = "_doc/";
  const FILE_NAMING$2 = {
    project: (userId2) => `${userId2}/project/projects.json`,
    task: (userId2, projectId) => `${userId2}/project/${projectId}/task.json`,
    property: (userId2, buildingId2) => `${userId2}/building/${buildingId2}/property.json`,
    disease: (userId2, buildingId2, yearId) => `${userId2}/building/${buildingId2}/disease/${yearId}.json`,
    Object: (userId2, buildingId2) => `${userId2}/building/${buildingId2}/object.json`
  };
  async function getJsonData$1(path) {
    return new Promise((resolve, reject) => {
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs2) => {
        fs2.root.getFile(path, { create: false }, (fileEntry) => {
          fileEntry.file((file) => {
            const reader = new plus.io.FileReader();
            reader.onload = () => {
              try {
                resolve(JSON.parse(reader.result));
              } catch (e2) {
                reject(`JSON解析失败: ${path}`);
              }
            };
            reader.onerror = () => reject(`文件读取失败: ${path}`);
            reader.readAsText(file);
          }, reject);
        }, reject);
      }, reject);
    });
  }
  function getProject(userId2) {
    const path = DOC_BASE_PATH$2 + FILE_NAMING$2.project(userId2);
    trackPath$1(path);
    return getJsonData$1(path);
  }
  function getTask(userId2, projectId) {
    const path = DOC_BASE_PATH$2 + FILE_NAMING$2.task(userId2, projectId);
    trackPath$1(path);
    return getJsonData$1(path);
  }
  function getProperty(userId2, buildingId2) {
    const path = DOC_BASE_PATH$2 + FILE_NAMING$2.property(userId2, buildingId2);
    trackPath$1(path);
    return getJsonData$1(path);
  }
  function getDisease(userId2, buildingId2, yearId) {
    const path = DOC_BASE_PATH$2 + FILE_NAMING$2.disease(userId2, buildingId2, yearId);
    trackPath$1(path);
    return getJsonData$1(path);
  }
  function getObject(userId2, buildingId2) {
    const path = DOC_BASE_PATH$2 + FILE_NAMING$2.Object(userId2, buildingId2);
    trackPath$1(path);
    return getJsonData$1(path);
  }
  const DOC_BASE_PATH$1 = "_doc/";
  const FILE_NAMING$1 = {
    project: (userId2) => `${userId2}/project/projects.json`,
    task: (userId2, projectId) => `${userId2}/project/${projectId}/task.json`,
    property: (userId2, buildingId2) => `${userId2}/building/${buildingId2}/property.json`,
    disease: (userId2, buildingId2, yearId) => `${userId2}/building/${buildingId2}/disease/${yearId}.json`,
    diseaseImages: (userId2, buildingId2) => `${userId2}/building/${buildingId2}/disease/images`,
    ADImages: (userId2, buildingId2, yearId) => `${userId2}/building/${buildingId2}/ADImages`
  };
  let __currentFilePath = null;
  function getFullPath$1(path) {
    const docPath = plus.io.convertLocalFileSystemURL(path);
    return docPath;
  }
  async function setJsonData(path, data2) {
    return new Promise((resolve, reject) => {
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs2) => {
        fs2.root.getFile(path, { create: true }, (fileEntry) => {
          fileEntry.createWriter((writer) => {
            writer.onwriteend = () => {
              resolve();
            };
            writer.onerror = () => {
              reject(`文件写入失败: ${path}`);
            };
            const jsonData = JSON.stringify(data2, null, 2);
            writer.write(jsonData);
          }, reject);
        }, reject);
      }, reject);
    });
  }
  function saveData(data2) {
    return new Promise((resolve, reject) => {
      if (!__currentFilePath) {
        return reject(new Error("请先执行读取操作获取文件路径"));
      }
      const fullPath = getFullPath$1(__currentFilePath);
      formatAppLog("log", "at utils/reviseNew.js:52", "准备保存文件到路径:", fullPath);
      const wait = plus.nativeUI.showWaiting("正在保存信息");
      setJsonData(fullPath, data2).then(() => {
        wait.close();
        formatAppLog("log", "at utils/reviseNew.js:59", "写入成功");
        plus.nativeUI.toast("保存成功");
        resolve(true);
      }).catch((error) => {
        wait.close();
        formatAppLog("error", "at utils/reviseNew.js:65", "写入失败:", error);
        plus.nativeUI.toast("保存失败");
        reject(error);
      });
    });
  }
  function trackPath(path) {
    formatAppLog("log", "at utils/reviseNew.js:74", "设置文件路径:", path);
    __currentFilePath = path;
  }
  function setDisease(userId2, buildingId2, yearId, data2) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.disease(userId2, buildingId2, yearId);
    trackPath(path);
    return saveData(data2);
  }
  function saveDiseaseImages(userId2, buildingId2, tempImagePaths) {
    return new Promise((resolve, reject) => {
      const targetDirPath = DOC_BASE_PATH$1 + FILE_NAMING$1.diseaseImages(userId2, buildingId2);
      const fullTargetPath = getFullPath$1(targetDirPath);
      formatAppLog("log", "at utils/reviseNew.js:110", "准备保存图片到目录:", fullTargetPath);
      const wait = plus.nativeUI.showWaiting("正在保存图片");
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs2) => {
        fs2.root.getDirectory(targetDirPath, { create: true }, (dirEntry) => {
          formatAppLog("log", "at utils/reviseNew.js:119", "目标目录已创建或已存在");
          const savePromises = tempImagePaths.map((tempPath, index) => {
            return new Promise((resolveFile, rejectFile) => {
              const fileName = `disease_${Date.now()}_${index}.jpg`;
              plus.io.resolveLocalFileSystemURL(tempPath, (fileEntry) => {
                fileEntry.copyTo(dirEntry, fileName, (newFile) => {
                  formatAppLog("log", "at utils/reviseNew.js:131", `图片 ${index + 1} 保存成功:`, newFile.fullPath);
                  resolveFile(newFile.fullPath);
                }, (error) => {
                  formatAppLog("error", "at utils/reviseNew.js:134", `图片 ${index + 1} 保存失败:`, error);
                  rejectFile(error);
                });
              }, (error) => {
                formatAppLog("error", "at utils/reviseNew.js:138", `无法访问临时文件 ${tempPath}:`, error);
                rejectFile(error);
              });
            });
          });
          Promise.all(savePromises).then((savedPaths) => {
            wait.close();
            formatAppLog("log", "at utils/reviseNew.js:148", "所有图片保存成功:", savedPaths);
            plus.nativeUI.toast("图片保存成功");
            resolve(savedPaths);
          }).catch((error) => {
            wait.close();
            formatAppLog("error", "at utils/reviseNew.js:154", "图片保存失败:", error);
            plus.nativeUI.toast("图片保存失败");
            reject(error);
          });
        }, (error) => {
          wait.close();
          formatAppLog("error", "at utils/reviseNew.js:160", "创建目录失败:", error);
          plus.nativeUI.toast("创建图片目录失败");
          reject(error);
        });
      }, (error) => {
        wait.close();
        formatAppLog("error", "at utils/reviseNew.js:166", "文件系统访问失败:", error);
        plus.nativeUI.toast("文件系统访问失败");
        reject(error);
      });
    });
  }
  const _sfc_main$w = {
    __name: "testWrite",
    setup(__props, { expose: __expose }) {
      __expose();
      const writeResult = vue.ref(null);
      const readResult = vue.ref(null);
      const testData = {
        test: {
          name: "测试项目",
          description: "这是一个测试项目"
        }
      };
      const testProject = async () => {
        try {
          const userId2 = "1";
          const path = `_doc/${userId2}/project/projects.json`;
          trackPath(path);
          const data2 = await getProject(userId2);
          readResult.value = data2;
          await saveData(testData.test);
          writeResult.value = "项目文件操作成功";
        } catch (error) {
          writeResult.value = "项目文件操作失败: " + error.message;
        }
      };
      const testTask = async () => {
        try {
          const userId2 = "1";
          const projectId = "1";
          const path = `_doc/${userId2}/project/${projectId}/task.json`;
          trackPath(path);
          const data2 = await getTask(userId2, projectId);
          readResult.value = data2;
          await saveData(testData.test);
          writeResult.value = "任务文件操作成功";
        } catch (error) {
          writeResult.value = "任务文件操作失败: " + error.message;
        }
      };
      const testProperty = async () => {
        try {
          const userId2 = "1";
          const buildingId2 = "5";
          const path = `_doc/${userId2}/building/${buildingId2}/property.json`;
          trackPath(path);
          const data2 = await getProperty(userId2, buildingId2);
          readResult.value = data2;
          await saveData(testData.test);
          writeResult.value = "属性文件操作成功";
        } catch (error) {
          writeResult.value = "属性文件操作失败: " + error.message;
        }
      };
      const testDisease = async () => {
        try {
          const userId2 = "1";
          const buildingId2 = "5";
          const yearId = "2023";
          const path = `_doc/${userId2}/building/${buildingId2}/disease/${yearId}.json`;
          trackPath(path);
          const data2 = await getDisease(userId2, buildingId2, yearId);
          readResult.value = data2;
          await saveData(testData.test);
          writeResult.value = "病害文件操作成功";
        } catch (error) {
          writeResult.value = "病害文件操作失败: " + error.message;
        }
      };
      const __returned__ = { writeResult, readResult, testData, testProject, testTask, testProperty, testDisease, ref: vue.ref, get getProject() {
        return getProject;
      }, get getTask() {
        return getTask;
      }, get getProperty() {
        return getProperty;
      }, get getDisease() {
        return getDisease;
      }, get saveData() {
        return saveData;
      }, get trackPath() {
        return trackPath;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "button-group" }, [
        vue.createElementVNode("button", { onClick: $setup.testProject }, "测试项目文件"),
        vue.createElementVNode("button", { onClick: $setup.testTask }, "测试任务文件"),
        vue.createElementVNode("button", { onClick: $setup.testProperty }, "测试属性文件"),
        vue.createElementVNode("button", { onClick: $setup.testDisease }, "测试病害文件")
      ]),
      $setup.writeResult ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createElementVNode("text", null, "写入结果: "),
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($setup.writeResult),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      $setup.readResult ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
        vue.createElementVNode("text", null, "读取结果: "),
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString(JSON.stringify($setup.readResult, null, 2)),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesTestWriteTestWrite = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-5a80cfda"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/testWrite/testWrite.vue"]]);
  const _imports_0$4 = "/static/image/RightOutline.svg";
  const _sfc_main$v = {
    __name: "bridge",
    setup(__props, { expose: __expose }) {
      __expose();
      const detectUnit = vue.ref("");
      const detectPerson = vue.ref("");
      const years = vue.ref([2024, 2023, 2022]);
      const selectedYearIndex = vue.ref(0);
      const fileData = vue.ref(null);
      const getData = async () => {
        try {
          const response = await getProject(3);
          formatAppLog("log", "at pages/bridge/bridge.vue:81", "获取到的原始数据:", JSON.stringify(response));
          if (!response || response.code !== 0) {
            formatAppLog("error", "at pages/bridge/bridge.vue:85", "获取数据失败:", (response == null ? void 0 : response.msg) || "未知错误");
            fileData.value = null;
            return;
          }
          fileData.value = {
            data: {
              projects: response.data.projects || []
            }
          };
          formatAppLog("log", "at pages/bridge/bridge.vue:96", "处理后的数据:", JSON.stringify(fileData.value));
          if (fileData.value.data.projects && fileData.value.data.projects.length > 0) {
            const projectYear = fileData.value.data.projects[0].year;
            formatAppLog("log", "at pages/bridge/bridge.vue:101", "项目年份:", projectYear);
            const index = years.value.findIndex((year) => year === projectYear);
            if (index !== -1) {
              selectedYearIndex.value = index;
              formatAppLog("log", "at pages/bridge/bridge.vue:107", "设置年份索引:", index);
            } else {
              formatAppLog("log", "at pages/bridge/bridge.vue:109", "未找到匹配的年份，使用默认索引 0");
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/bridge/bridge.vue:113", "获取数据失败:", error);
          fileData.value = null;
        }
      };
      const changeYear = (e2) => {
        selectedYearIndex.value = e2.detail.value;
      };
      const back = () => {
        uni.navigateBack();
      };
      const goToList = (item) => {
        uni.navigateTo({
          url: `/pages/List/List?projectId=${item.code || ""}&projectName=${encodeURIComponent(item.projectName || "")}&company=${encodeURIComponent(item.company || "")}&status=${encodeURIComponent(item.status || "")}&progress=${encodeURIComponent(item.progress || "")}`
        });
      };
      const getInspectorNames = (inspectors) => {
        if (!inspectors || !Array.isArray(inspectors))
          return "暂无数据";
        return inspectors.map((inspector) => inspector.userName).join(" / ");
      };
      const getStatusText = (status) => {
        switch (status) {
          case "0":
            return "未完成";
          case "1":
            return "已完成";
          default:
            return "未知状态";
        }
      };
      vue.onMounted(() => {
        getData();
      });
      const __returned__ = { detectUnit, detectPerson, years, selectedYearIndex, fileData, getData, changeYear, back, goToList, getInspectorNames, getStatusText, ref: vue.ref, onMounted: vue.onMounted, get getProject() {
        return getProject;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 内容区 "),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createCommentVNode(" 信息卡片 "),
          $setup.fileData && $setup.fileData.data && $setup.fileData.data.projects && $setup.fileData.data.projects.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "info-card"
          }, [
            vue.createElementVNode("view", { class: "info-boxes" }, [
              vue.createElementVNode("view", { class: "info-box" }, [
                vue.createElementVNode("text", { class: "label" }, "检测单位"),
                vue.createElementVNode(
                  "text",
                  { class: "value" },
                  vue.toDisplayString($setup.fileData.data.projects[0].dept.deptName || "暂无数据"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-box" }, [
                vue.createElementVNode("text", { class: "label" }, "检测人员"),
                vue.createCommentVNode(` <text class="value">{{ getInspectorNames(fileData.data.projects[0].inspectors) || '暂无数据' }}</text> `),
                vue.createElementVNode("text", { class: "value" }, "张三三")
              ]),
              vue.createElementVNode("view", { class: "info-box" }, [
                vue.createElementVNode("text", { class: "label" }, "检测年度"),
                vue.createElementVNode("picker", {
                  class: "year-picker",
                  value: $setup.selectedYearIndex,
                  range: $setup.years,
                  onChange: $setup.changeYear
                }, [
                  vue.createElementVNode("view", { class: "picker-content" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "value" },
                      vue.toDisplayString($setup.years[$setup.selectedYearIndex]) + "年度",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("image", {
                      src: _imports_0$4,
                      mode: "scaleToFill"
                    })
                  ])
                ], 40, ["value", "range"])
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 项目列表 "),
          $setup.fileData && $setup.fileData.data && $setup.fileData.data.projects && $setup.fileData.data.projects.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "bridge-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.fileData.data.projects, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "bridge-item",
                  key: index,
                  onClick: ($event) => $setup.goToList(item)
                }, [
                  vue.createElementVNode("view", { class: "bridge-info" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "bridge-code" },
                      vue.toDisplayString(item.code || "暂无编号"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "bridge-name" },
                      vue.toDisplayString(item.name || "暂无名称"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "bridge-location" },
                      vue.toDisplayString(item.ownerDept.deptName || "暂无公司"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "bridge-meta" }, [
                    vue.createElementVNode("view", { class: "text-group" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["bridge-status", { "completed": item.status === "1" }])
                        },
                        vue.toDisplayString($setup.getStatusText(item.status)),
                        3
                        /* TEXT, CLASS */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "bridge-progress" },
                        vue.toDisplayString(item.number || "0/0"),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("image", {
                      src: _imports_0$4,
                      mode: "scaleToFill"
                    })
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : !$setup.fileData ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 2 },
            [
              vue.createCommentVNode(" 加载状态 "),
              vue.createElementVNode("view", { class: "loading" }, [
                vue.createElementVNode("text", null, "加载中...")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 3 },
            [
              vue.createCommentVNode(" 无数据状态 "),
              vue.createElementVNode("view", { class: "no-data" }, [
                vue.createElementVNode("text", null, "暂无数据")
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesBridgeBridge = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/bridge/bridge.vue"]]);
  const _sfc_main$u = {
    __name: "List",
    setup(__props, { expose: __expose }) {
      __expose();
      const back = () => {
        uni.navigateBack();
      };
      const projectInfo = vue.ref({});
      const searchText = vue.ref("");
      const bridges = vue.ref([]);
      const getProjectData = async () => {
        var _a, _b, _c;
        try {
          const response = await getProject(3);
          formatAppLog("log", "at pages/List/List.vue:82", "获取到的原始数据:", JSON.stringify(response));
          if (!response || response.code !== 0) {
            formatAppLog("error", "at pages/List/List.vue:86", "获取数据失败:", (response == null ? void 0 : response.msg) || "未知错误");
            return;
          }
          if (response.data && response.data.projects && response.data.projects.length > 0) {
            const project = response.data.projects[0];
            projectInfo.value = {
              projectName: project.name,
              code: project.code,
              status: project.status === "1" ? "已完成" : "未完成",
              company: ((_a = project.ownerDept) == null ? void 0 : _a.deptName) || "",
              progress: project.number || "0/0",
              year: project.year,
              timeRange: `${project.startDate || ""} - ${project.endDate || ""}`,
              detectionUnit: ((_b = project.dept) == null ? void 0 : _b.deptName) || "",
              inspector: ((_c = project.inspectors) == null ? void 0 : _c.map((i2) => i2.userName).join(" / ")) || ""
            };
          }
          const bridgeData = await getTask(3, 1);
          90;
          formatAppLog("log", "at pages/List/List.vue:108", "获取到的桥梁数据:", bridgeData);
          if (bridgeData && bridgeData.data && bridgeData.data.tasks) {
            bridges.value = bridgeData.data.tasks.map((task) => {
              var _a2, _b2, _c2, _d, _e2, _f, _g;
              return {
                id: task.id,
                code: ((_a2 = task.building) == null ? void 0 : _a2.buildingCode) || "",
                name: ((_b2 = task.building) == null ? void 0 : _b2.name) || "",
                location: `${((_c2 = task.building) == null ? void 0 : _c2.routeCode) || ""} / ${((_d = task.building) == null ? void 0 : _d.routeName) || ""} / ${((_e2 = task.building) == null ? void 0 : _e2.bridgePileNumber) || ""}`,
                type: "small",
                // 默认类型
                length: ((_f = task.building) == null ? void 0 : _f.bridgeLength) || "",
                class: ((_g = task.building) == null ? void 0 : _g.rootPropertyId) || ""
              };
            });
            formatAppLog("log", "at pages/List/List.vue:120", "处理后的桥梁列表:", bridges.value);
          } else {
            bridges.value = [];
            formatAppLog("error", "at pages/List/List.vue:123", "桥梁数据格式不正确");
            uni.showToast({
              title: "桥梁数据格式不正确",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/List/List.vue:130", "获取数据失败:", error);
          uni.showToast({
            title: "获取数据失败",
            icon: "none"
          });
        }
      };
      vue.onMounted(() => {
        getProjectData();
      });
      const getBridgeIcon = (type) => {
        const icons = {
          "small": "/static/image/bridge-small.png",
          "cross": "/static/image/bridge-cross.png",
          "arch": "/static/image/bridge-arch.png",
          "suspension": "/static/images/bridge-suspension.png",
          "main": "/static/image/bridge-arch.png",
          // 暂时使用拱桥图标代替主线桥图标
          "ramp": "/static/image/bridge-cross.png"
          // 暂时使用立交桥图标代替匝道桥图标
        };
        return icons[type] || icons["small"];
      };
      const goToDetail = (bridge) => {
        uni.navigateTo({
          url: `/pages/bridge-disease/bridge-disease`
        });
      };
      const filteredBridges = vue.computed(() => {
        if (!searchText.value) {
          return bridges.value;
        }
        const searchLower = searchText.value.toLowerCase();
        return bridges.value.filter((bridge) => {
          return bridge.name.toLowerCase().includes(searchLower) || bridge.code.toLowerCase().includes(searchLower) || bridge.location.toLowerCase().includes(searchLower);
        });
      });
      const handleSearch = () => {
        formatAppLog("log", "at pages/List/List.vue:178", "搜索关键词:", searchText.value);
      };
      const __returned__ = { back, projectInfo, searchText, bridges, getProjectData, getBridgeIcon, goToDetail, filteredBridges, handleSearch, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed, get getProject() {
        return getProject;
      }, get getTask() {
        return getTask;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 顶部信息卡片 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("view", { class: "content-box" }, [
          vue.createElementVNode(
            "view",
            { class: "title" },
            vue.toDisplayString($setup.projectInfo.projectName || "项目名称"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "项目编号: " + vue.toDisplayString($setup.projectInfo.code),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "检测状态: " + vue.toDisplayString($setup.projectInfo.status),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "项目单位: " + vue.toDisplayString($setup.projectInfo.company),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "检测数量: " + vue.toDisplayString($setup.projectInfo.progress),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "检测年度: " + vue.toDisplayString($setup.projectInfo.year),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "起止时间: " + vue.toDisplayString($setup.projectInfo.timeRange),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "检测单位: " + vue.toDisplayString($setup.projectInfo.detectionUnit),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "检测人员: " + vue.toDisplayString($setup.projectInfo.inspector),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 搜索框 "),
      vue.createElementVNode("view", { class: "search-box" }, [
        vue.createElementVNode("text", { class: "search-icon" }, ""),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            type: "text",
            placeholder: "搜索桥梁名称/编号/位置",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchText = $event),
            onInput: $setup.handleSearch
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vue.vModelText, $setup.searchText]
        ])
      ]),
      vue.createCommentVNode(" 桥梁列表 "),
      vue.createElementVNode("view", { class: "bridge-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.filteredBridges, (bridge) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "bridge-item",
              key: bridge.id,
              onClick: ($event) => $setup.goToDetail(bridge)
            }, [
              vue.createElementVNode("view", { class: "bridge-icon" }, [
                vue.createElementVNode("image", {
                  src: $setup.getBridgeIcon(bridge.type),
                  mode: "aspectFit"
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode("view", { class: "bridge-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "bridge-code" },
                  vue.toDisplayString(bridge.code),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "bridge-name" },
                  vue.toDisplayString(bridge.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "bridge-location" },
                  vue.toDisplayString(bridge.location),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "bridge-meta" }, [
                vue.createElementVNode("view", { class: "text-group" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "bridge-length" },
                    vue.toDisplayString(bridge.length),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "bridge-class" },
                    vue.toDisplayString(bridge.class) + "类",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("image", { src: _imports_0$4 })
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createCommentVNode(" 无搜索结果提示 "),
        $setup.filteredBridges.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "no-result"
        }, [
          vue.createElementVNode("text", null, "未找到匹配的桥梁")
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesListList = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/List/List.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$t = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code2 = this.icons.find((v2) => v2.font_class === this.type);
        if (code2) {
          return code2.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const en$2 = {
    "uni-search-bar.cancel": "cancel",
    "uni-search-bar.placeholder": "Search enter content"
  };
  const zhHans$1 = {
    "uni-search-bar.cancel": "取消",
    "uni-search-bar.placeholder": "请输入搜索内容"
  };
  const zhHant$1 = {
    "uni-search-bar.cancel": "取消",
    "uni-search-bar.placeholder": "請輸入搜索內容"
  };
  const messages$1 = {
    en: en$2,
    "zh-Hans": zhHans$1,
    "zh-Hant": zhHant$1
  };
  const {
    t: t$2
  } = initVueI18n(messages$1);
  const _sfc_main$s = {
    name: "UniSearchBar",
    emits: ["input", "update:modelValue", "clear", "cancel", "confirm", "blur", "focus"],
    props: {
      placeholder: {
        type: String,
        default: ""
      },
      radius: {
        type: [Number, String],
        default: 5
      },
      clearButton: {
        type: String,
        default: "auto"
      },
      cancelButton: {
        type: String,
        default: "auto"
      },
      cancelText: {
        type: String,
        default: ""
      },
      bgColor: {
        type: String,
        default: "#F8F8F8"
      },
      textColor: {
        type: String,
        default: "#000000"
      },
      maxlength: {
        type: [Number, String],
        default: 100
      },
      value: {
        type: [Number, String],
        default: ""
      },
      modelValue: {
        type: [Number, String],
        default: ""
      },
      focus: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: false,
        showSync: false,
        searchVal: ""
      };
    },
    computed: {
      cancelTextI18n() {
        return this.cancelText || t$2("uni-search-bar.cancel");
      },
      placeholderText() {
        return this.placeholder || t$2("uni-search-bar.placeholder");
      }
    },
    watch: {
      modelValue: {
        immediate: true,
        handler(newVal) {
          this.searchVal = newVal;
          if (newVal) {
            this.show = true;
          }
        }
      },
      focus: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            if (this.readonly)
              return;
            this.show = true;
            this.$nextTick(() => {
              this.showSync = true;
            });
          }
        }
      },
      searchVal(newVal, oldVal) {
        this.$emit("input", newVal);
        this.$emit("update:modelValue", newVal);
      }
    },
    methods: {
      searchClick() {
        if (this.readonly)
          return;
        if (this.show) {
          return;
        }
        this.show = true;
        this.$nextTick(() => {
          this.showSync = true;
        });
      },
      clear() {
        this.searchVal = "";
        this.$nextTick(() => {
          this.$emit("clear", { value: "" });
        });
      },
      cancel() {
        if (this.readonly)
          return;
        this.$emit("cancel", {
          value: this.searchVal
        });
        this.searchVal = "";
        this.show = false;
        this.showSync = false;
        plus.key.hideSoftKeybord();
      },
      confirm() {
        plus.key.hideSoftKeybord();
        this.$emit("confirm", {
          value: this.searchVal
        });
      },
      blur() {
        plus.key.hideSoftKeybord();
        this.$emit("blur", {
          value: this.searchVal
        });
      },
      emitFocus(e2) {
        this.$emit("focus", e2.detail);
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-searchbar" }, [
      vue.createElementVNode(
        "view",
        {
          style: vue.normalizeStyle({ borderRadius: $props.radius + "px", backgroundColor: $props.bgColor }),
          class: "uni-searchbar__box",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.searchClick && $options.searchClick(...args))
        },
        [
          vue.createElementVNode("view", { class: "uni-searchbar__box-icon-search" }, [
            vue.renderSlot(_ctx.$slots, "searchIcon", {}, () => [
              vue.createVNode(_component_uni_icons, {
                color: "#c0c4cc",
                size: "18",
                type: "search"
              })
            ], true)
          ]),
          $data.show || $data.searchVal ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 0,
            focus: $data.showSync,
            disabled: $props.readonly,
            placeholder: $options.placeholderText,
            maxlength: $props.maxlength,
            class: "uni-searchbar__box-search-input",
            "confirm-type": "search",
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.searchVal = $event),
            style: vue.normalizeStyle({ color: $props.textColor }),
            onConfirm: _cache[1] || (_cache[1] = (...args) => $options.confirm && $options.confirm(...args)),
            onBlur: _cache[2] || (_cache[2] = (...args) => $options.blur && $options.blur(...args)),
            onFocus: _cache[3] || (_cache[3] = (...args) => $options.emitFocus && $options.emitFocus(...args))
          }, null, 44, ["focus", "disabled", "placeholder", "maxlength"])), [
            [vue.vModelText, $data.searchVal]
          ]) : (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 1,
              class: "uni-searchbar__text-placeholder"
            },
            vue.toDisplayString($props.placeholder),
            1
            /* TEXT */
          )),
          $data.show && ($props.clearButton === "always" || $props.clearButton === "auto" && $data.searchVal !== "") && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "uni-searchbar__box-icon-clear",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.clear && $options.clear(...args))
          }, [
            vue.renderSlot(_ctx.$slots, "clearIcon", {}, () => [
              vue.createVNode(_component_uni_icons, {
                color: "#c0c4cc",
                size: "20",
                type: "clear"
              })
            ], true)
          ])) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      ),
      $props.cancelButton === "always" || $data.show && $props.cancelButton === "auto" ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          onClick: _cache[6] || (_cache[6] = (...args) => $options.cancel && $options.cancel(...args)),
          class: "uni-searchbar__cancel"
        },
        vue.toDisplayString($options.cancelTextI18n),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-a149a6be"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue"]]);
  let mpMixins = {};
  mpMixins = {
    data() {
      return {
        is_show: "none"
      };
    },
    watch: {
      show(newVal) {
        this.is_show = this.show;
      }
    },
    created() {
      this.swipeaction = this.getSwipeAction();
      if (this.swipeaction && Array.isArray(this.swipeaction.children)) {
        this.swipeaction.children.push(this);
      }
    },
    mounted() {
      this.is_show = this.show;
    },
    methods: {
      // wxs 中调用
      closeSwipe(e2) {
        if (this.autoClose && this.swipeaction) {
          this.swipeaction.closeOther(this);
        }
      },
      change(e2) {
        this.$emit("change", e2.open);
        if (this.is_show !== e2.open) {
          this.is_show = e2.open;
        }
      },
      appTouchStart(e2) {
        const {
          clientX
        } = e2.changedTouches[0];
        this.clientX = clientX;
        this.timestamp = (/* @__PURE__ */ new Date()).getTime();
      },
      appTouchEnd(e2, index, item, position) {
        const {
          clientX
        } = e2.changedTouches[0];
        let diff = Math.abs(this.clientX - clientX);
        let time = (/* @__PURE__ */ new Date()).getTime() - this.timestamp;
        if (diff < 40 && time < 300) {
          this.$emit("click", {
            content: item,
            index,
            position
          });
        }
      },
      onClickForPC(index, item, position) {
        return;
      }
    }
  };
  const mpwxs = mpMixins;
  let bindIngXMixins = {};
  let otherMixins = {};
  const block0 = (Comp) => {
    (Comp.$wxs || (Comp.$wxs = [])).push("wxsswipe");
    (Comp.$wxsModules || (Comp.$wxsModules = {}))["wxsswipe"] = "1f58cc29";
  };
  const block1 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("renderswipe");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["renderswipe"] = "74bb5072";
  };
  const _sfc_main$r = {
    mixins: [mpwxs, bindIngXMixins, otherMixins],
    emits: ["click", "change"],
    props: {
      // 控制开关
      show: {
        type: String,
        default: "none"
      },
      // 禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否自动关闭
      autoClose: {
        type: Boolean,
        default: true
      },
      // 滑动缺省距离
      threshold: {
        type: Number,
        default: 20
      },
      // 左侧按钮内容
      leftOptions: {
        type: Array,
        default() {
          return [];
        }
      },
      // 右侧按钮内容
      rightOptions: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    // TODO vue3
    unmounted() {
      this.__isUnmounted = true;
      this.uninstall();
    },
    methods: {
      uninstall() {
        if (this.swipeaction) {
          this.swipeaction.children.forEach((item, index) => {
            if (item === this) {
              this.swipeaction.children.splice(index, 1);
            }
          });
        }
      },
      /**
       * 获取父元素实例
       */
      getSwipeAction(name = "uniSwipeAction") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 在微信小程序 app vue端 h5 使用wxs 实现"),
        vue.createElementVNode("view", { class: "uni-swipe" }, [
          vue.createElementVNode("view", {
            class: "uni-swipe_box",
            "change:prop": _ctx.wxsswipe.showWatch,
            prop: vue.wp(_ctx.is_show),
            "data-threshold": $props.threshold,
            "data-disabled": $props.disabled,
            onTouchstart: _cache[2] || (_cache[2] = (...args) => _ctx.wxsswipe.touchstart && _ctx.wxsswipe.touchstart(...args)),
            onTouchmove: _cache[3] || (_cache[3] = (...args) => _ctx.wxsswipe.touchmove && _ctx.wxsswipe.touchmove(...args)),
            onTouchend: _cache[4] || (_cache[4] = (...args) => _ctx.wxsswipe.touchend && _ctx.wxsswipe.touchend(...args))
          }, [
            vue.createCommentVNode(" 在微信小程序 app vue端 h5 使用wxs 实现"),
            vue.createElementVNode("view", { class: "uni-swipe_button-group button-group--left" }, [
              vue.renderSlot(_ctx.$slots, "left", {}, () => [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($props.leftOptions, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      style: vue.normalizeStyle({
                        backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : "#C7C6CD"
                      }),
                      class: "uni-swipe_button button-hock",
                      onTouchstart: _cache[0] || (_cache[0] = vue.withModifiers((...args) => _ctx.appTouchStart && _ctx.appTouchStart(...args), ["stop"])),
                      onTouchend: vue.withModifiers(($event) => _ctx.appTouchEnd($event, index, item, "left"), ["stop"]),
                      onClick: vue.withModifiers(($event) => _ctx.onClickForPC(index, item, "left"), ["stop"])
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "uni-swipe_button-text",
                          style: vue.normalizeStyle({ color: item.style && item.style.color ? item.style.color : "#FFFFFF", fontSize: item.style && item.style.fontSize ? item.style.fontSize : "16px" })
                        },
                        vue.toDisplayString(item.text),
                        5
                        /* TEXT, STYLE */
                      )
                    ], 44, ["onTouchend", "onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], true)
            ]),
            vue.createElementVNode("view", { class: "uni-swipe_text--center" }, [
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ]),
            vue.createElementVNode("view", { class: "uni-swipe_button-group button-group--right" }, [
              vue.renderSlot(_ctx.$slots, "right", {}, () => [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($props.rightOptions, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      style: vue.normalizeStyle({
                        backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : "#C7C6CD"
                      }),
                      class: "uni-swipe_button button-hock",
                      onTouchstart: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.appTouchStart && _ctx.appTouchStart(...args), ["stop"])),
                      onTouchend: vue.withModifiers(($event) => _ctx.appTouchEnd($event, index, item, "right"), ["stop"]),
                      onClick: vue.withModifiers(($event) => _ctx.onClickForPC(index, item, "right"), ["stop"])
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "uni-swipe_button-text",
                          style: vue.normalizeStyle({ color: item.style && item.style.color ? item.style.color : "#FFFFFF", fontSize: item.style && item.style.fontSize ? item.style.fontSize : "16px" })
                        },
                        vue.toDisplayString(item.text),
                        5
                        /* TEXT, STYLE */
                      )
                    ], 44, ["onTouchend", "onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], true)
            ])
          ], 40, ["change:prop", "prop", "data-threshold", "data-disabled"])
        ]),
        vue.createCommentVNode(" app nvue端 使用 bindingx "),
        vue.createCommentVNode(" 其他平台使用 js ，长列表性能可能会有影响")
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  if (typeof block0 === "function")
    block0(_sfc_main$r);
  if (typeof block1 === "function")
    block1(_sfc_main$r);
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-82a5303b"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item.vue"]]);
  const _sfc_main$q = {
    name: "uniSwipeAction",
    data() {
      return {};
    },
    created() {
      this.children = [];
    },
    methods: {
      // 公开给用户使用，重制组件样式
      resize() {
      },
      // 公开给用户使用，关闭全部 已经打开的组件
      closeAll() {
        this.children.forEach((vm) => {
          vm.is_show = "none";
        });
      },
      closeOther(vm) {
        if (this.openItem && this.openItem !== vm) {
          this.openItem.is_show = "none";
        }
        this.openItem = vm;
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.renderSlot(_ctx.$slots, "default")
    ]);
  }
  const __easycom_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action.vue"]]);
  const _imports_0$3 = "/static/image/disease.png";
  const _sfc_main$p = {
    __name: "disease-item",
    props: {
      item: {
        type: Object,
        default: () => ({
          "createBy": "crh@znjc",
          "createTime": "2023-05-02 16:52:18",
          "updateTime": "2023-05-02 16:52:17",
          "id": 54,
          "diseaseType": {
            "id": 17,
            "code": "5.2.1-3",
            "name": "焊缝开裂",
            "maxScale": 5,
            "minScale": 1,
            "status": "0"
          },
          "diseaseTypeId": 17,
          "description": "焊缝部位涂层有大量裂纹，受拉翼缘边焊缝存在裂缝，其他部位焊缝无裂缝，主梁、纵横梁受拉翼缘边焊缝开裂长度≤5mm",
          "trend": "稳定",
          "level": 2,
          "quantity": 1,
          "type": "焊缝开裂",
          "participateAssess": "0",
          "deductPoints": 35,
          "biObjectId": 709,
          "projectId": 2,
          "component": {
            "createBy": "admin",
            "createTime": "2025-04-21 16:53:39",
            "updateTime": "2025-04-21 16:53:38",
            "id": 244,
            "code": "R-1-1#上部承重构件（主梁、挂梁）",
            "name": "上部承重构件（主梁、挂梁）1",
            "biObjectId": 709,
            "status": "0",
            "delFlag": "0",
            "biObject": {
              "id": 709,
              "name": "上部承重构件（主梁、挂梁）",
              "count": 0
            },
            "parentObjectName": "上部结构"
          },
          "componentId": 244,
          "buildingId": 37
        })
      },
      selectMode: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    emits: ["delete", "select", "swipe-opened"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const isSelected = vue.ref(false);
      const swipeAction = vue.ref(null);
      const swipeOptions = [
        {
          text: "取消",
          style: {
            backgroundColor: "#909399"
          }
        },
        {
          text: "编辑",
          style: {
            backgroundColor: "#409EFF"
          }
        },
        {
          text: "删除",
          style: {
            backgroundColor: "#F56C6C"
          }
        }
      ];
      vue.watch(() => props.selected, (val) => {
        isSelected.value = val;
      });
      vue.onMounted(() => {
        isSelected.value = props.selected;
      });
      const handleSwipeClick = (e2) => {
        if (e2.index === 0) {
          closeSwipe();
        }
        if (e2.index === 1) {
          const itemData = encodeURIComponent(JSON.stringify(props.item));
          uni.navigateTo({
            url: `/pages/add-disease/add-disease?mode=edit&id=${props.item.id}&data=${itemData}`
          });
        }
        if (e2.index === 2) {
          uni.showModal({
            title: "确认删除",
            content: "确定要删除这条病害记录吗？",
            success: (res) => {
              if (res.confirm) {
                const deleteData = {
                  id: props.item.id,
                  isDelete: true
                };
                formatAppLog("log", "at components/disease-item/disease-item.vue:170", "准备发送deleteDisease事件，ID:", props.item.id);
                uni.$emit("deleteDisease", deleteData);
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            }
          });
          closeSwipe();
        }
      };
      const handleItemClick = () => {
        if (props.selectMode) {
          isSelected.value = !isSelected.value;
          emit("select", {
            item: props.item,
            selected: isSelected.value
          });
        }
      };
      const closeSwipe = () => {
        if (swipeAction.value) {
          swipeAction.value.closeAll();
        }
      };
      const swipeChange = (e2) => {
        if (e2.open) {
          emit("swipe-opened", props.item.id);
        }
      };
      const __returned__ = { props, emit, isSelected, swipeAction, swipeOptions, handleSwipeClick, handleItemClick, closeSwipe, swipeChange, ref: vue.ref, watch: vue.watch, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_swipe_action_item = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action-item"), __easycom_0$3);
    const _component_uni_swipe_action = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action"), __easycom_1$3);
    return vue.openBlock(), vue.createBlock(
      _component_uni_swipe_action,
      {
        ref: (el) => $setup.swipeAction = el
      },
      {
        default: vue.withCtx(() => [
          vue.createVNode(_component_uni_swipe_action_item, {
            "right-options": $setup.swipeOptions,
            onClick: $setup.handleSwipeClick,
            onChange: $setup.swipeChange
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("view", {
                class: "disease-item",
                onClick: $setup.handleItemClick
              }, [
                vue.createCommentVNode(" 选择框区域 "),
                $props.selectMode ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "select-area"
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["select-circle", $setup.isSelected ? "selected" : ""])
                    },
                    [
                      $setup.isSelected ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "select-inner"
                      })) : vue.createCommentVNode("v-if", true)
                    ],
                    2
                    /* CLASS */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["disease-content", $props.selectMode ? "with-select" : ""])
                  },
                  [
                    vue.createElementVNode("view", { class: "item-header" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "title" },
                        vue.toDisplayString($props.item.component.biObject.name) + "/" + vue.toDisplayString($props.item.component.name) + "/" + vue.toDisplayString($props.item.type),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "content-container" }, [
                      vue.createElementVNode("view", { class: "left-column" }, [
                        vue.createElementVNode("view", { class: "info-row" }, [
                          vue.createElementVNode("text", { class: "label" }, "病害描述："),
                          vue.createElementVNode(
                            "text",
                            { class: "description-text" },
                            vue.toDisplayString($props.item.description),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "info-row" }, [
                          vue.createElementVNode("text", { class: "label" }, "采集时间："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($props.item.createTime),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "right-column" }, [
                        vue.createElementVNode("view", { class: "info-row" }, [
                          vue.createElementVNode("text", { class: "label" }, "缺损数量："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($props.item.quantity),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "info-row" }, [
                          vue.createElementVNode("text", { class: "label" }, "评定标度/参考评定："),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString($props.item.level) + "/" + vue.toDisplayString($props.item.participateAssess === "1" ? "是" : "否"),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ]),
                    vue.createElementVNode("image", {
                      class: "image-icon",
                      src: _imports_0$3,
                      mode: "aspectFit"
                    })
                  ],
                  2
                  /* CLASS */
                )
              ])
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      },
      512
      /* NEED_PATCH */
    );
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-e8b45b33"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/disease-item/disease-item.vue"]]);
  const _sfc_main$o = {
    __name: "current-disease",
    setup(__props, { expose: __expose }) {
      __expose();
      const tabItems = vue.ref(["上部结构", "下部结构", "桥面系", "附属设施"]);
      const activeTab = vue.ref(0);
      const searchText = vue.ref("");
      const showAddPopup = vue.ref(false);
      const diseaseList = vue.ref([]);
      const loadCurrentYearDiseaseData = async () => {
        try {
          const userId2 = "3";
          const buildingId2 = "39";
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const yearData = await getDisease(userId2, buildingId2, currentYear);
          formatAppLog("log", "at components/current-disease.vue:67", `获取到${currentYear}年病害数据:`, yearData);
          if (yearData && yearData.diseases && yearData.diseases.length > 0) {
            diseaseList.value = yearData.diseases;
          } else {
            diseaseList.value = [];
          }
          formatAppLog("log", "at components/current-disease.vue:76", "病害数据加载完成:", diseaseList.value);
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:78", "读取病害数据失败:", error);
          uni.showToast({
            title: "读取数据失败",
            icon: "none"
          });
        }
      };
      const addNewDiseaseData = async (newDisease) => {
        try {
          formatAppLog("log", "at components/current-disease.vue:89", "接收到新增病害数据:", newDisease);
          diseaseList.value.push(newDisease);
          const userId2 = "3";
          const buildingId2 = "39";
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const saveData2 = {
            year: parseInt(currentYear),
            buildingId: parseInt(buildingId2),
            diseases: diseaseList.value
          };
          formatAppLog("log", "at components/current-disease.vue:105", "准备保存的数据:", saveData2);
          await setDisease(userId2, buildingId2, currentYear, saveData2);
          formatAppLog("log", "at components/current-disease.vue:110", "新增病害数据保存成功");
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:116", "保存新增病害数据失败:", error);
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
        }
      };
      const handleDeleteDisease = async (deleteData) => {
        try {
          formatAppLog("log", "at components/current-disease.vue:127", "接收到删除病害事件:", deleteData);
          if (!deleteData || !deleteData.id) {
            formatAppLog("error", "at components/current-disease.vue:130", "删除数据无效");
            return;
          }
          const index = diseaseList.value.findIndex((item) => item.id == deleteData.id);
          if (index === -1) {
            formatAppLog("error", "at components/current-disease.vue:137", "未找到要删除的病害数据:", deleteData.id);
            return;
          }
          diseaseList.value[index].isDelete = true;
          formatAppLog("log", "at components/current-disease.vue:143", `病害ID:${deleteData.id}已标记为删除`);
          const userId2 = "3";
          const buildingId2 = "39";
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const saveData2 = {
            year: parseInt(currentYear),
            buildingId: parseInt(buildingId2),
            diseases: diseaseList.value
          };
          formatAppLog("log", "at components/current-disease.vue:157", "准备保存删除后的数据:", saveData2);
          await setDisease(userId2, buildingId2, currentYear, saveData2);
          formatAppLog("log", "at components/current-disease.vue:162", "删除标记保存成功");
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:164", "保存删除标记失败:", error);
          uni.showToast({
            title: "删除失败",
            icon: "none"
          });
        }
      };
      const handleUpdateDisease = async (updatedDisease) => {
        try {
          formatAppLog("log", "at components/current-disease.vue:175", "接收到更新病害事件:", updatedDisease);
          if (!updatedDisease || !updatedDisease.id) {
            formatAppLog("error", "at components/current-disease.vue:178", "更新数据无效");
            return;
          }
          const index = diseaseList.value.findIndex((item) => item.id == updatedDisease.id);
          if (index === -1) {
            formatAppLog("error", "at components/current-disease.vue:185", "未找到要更新的病害数据:", updatedDisease.id);
            return;
          }
          diseaseList.value[index] = updatedDisease;
          formatAppLog("log", "at components/current-disease.vue:191", `病害ID:${updatedDisease.id}已更新`);
          const userId2 = "3";
          const buildingId2 = "39";
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const saveData2 = {
            year: parseInt(currentYear),
            buildingId: parseInt(buildingId2),
            diseases: diseaseList.value
          };
          formatAppLog("log", "at components/current-disease.vue:205", "准备保存更新后的数据:", saveData2);
          await setDisease(userId2, buildingId2, currentYear, saveData2);
          formatAppLog("log", "at components/current-disease.vue:210", "更新数据保存成功");
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:212", "保存更新数据失败:", error);
          uni.showToast({
            title: "更新失败",
            icon: "none"
          });
        }
      };
      const filteredDiseases = vue.computed(() => {
        const selectedType = tabItems.value[activeTab.value];
        return diseaseList.value.filter((item) => {
          var _a, _b, _c;
          if (item.isDelete === true) {
            return false;
          }
          if (((_a = item.component) == null ? void 0 : _a.parentObjectName) !== selectedType) {
            return false;
          }
          if (searchText.value) {
            return ((_b = item.description) == null ? void 0 : _b.includes(searchText.value)) || ((_c = item.type) == null ? void 0 : _c.includes(searchText.value));
          }
          return true;
        });
      });
      const search = (e2) => {
        searchText.value = e2.value;
        formatAppLog("log", "at components/current-disease.vue:250", "搜索内容:", e2);
      };
      const changeTab = (index) => {
        activeTab.value = index;
      };
      const getTpyeItemCount = (type) => {
        return diseaseList.value.filter(
          (item) => {
            var _a;
            return ((_a = item.component) == null ? void 0 : _a.parentObjectName) === type && item.isDelete !== true;
          }
        ).length;
      };
      const addNewDisease = () => {
        uni.navigateTo({
          url: `/pages/add-disease/add-disease`
        });
      };
      const deleteDisease = (itemId) => {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条病害记录吗？",
          success: (res) => {
            if (res.confirm) {
              const index = diseaseList.value.findIndex((item) => item.id === itemId);
              if (index !== -1) {
                diseaseList.value[index].isDelete = true;
                const userId2 = "3";
                const buildingId2 = "39";
                const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
                const saveData2 = {
                  year: parseInt(currentYear),
                  buildingId: parseInt(buildingId2),
                  diseases: diseaseList.value
                };
                setDisease(userId2, buildingId2, currentYear, saveData2).then(() => {
                  uni.showToast({
                    title: "删除成功",
                    icon: "success"
                  });
                }).catch((error) => {
                  formatAppLog("error", "at components/current-disease.vue:307", "保存删除标记失败:", error);
                  uni.showToast({
                    title: "删除失败",
                    icon: "none"
                  });
                });
              }
            }
          }
        });
      };
      vue.onMounted(() => {
        formatAppLog("log", "at components/current-disease.vue:321", "current-disease组件挂载，准备加载数据");
        loadCurrentYearDiseaseData();
        uni.$on("addNewDisease", addNewDiseaseData);
        uni.$on("deleteDisease", handleDeleteDisease);
        uni.$on("updateDisease", handleUpdateDisease);
      });
      vue.onUnmounted(() => {
        uni.$off("addNewDisease");
        uni.$off("deleteDisease");
        uni.$off("updateDisease");
      });
      const __returned__ = { tabItems, activeTab, searchText, showAddPopup, diseaseList, loadCurrentYearDiseaseData, addNewDiseaseData, handleDeleteDisease, handleUpdateDisease, filteredDiseases, search, changeTab, getTpyeItemCount, addNewDisease, deleteDisease, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, watch: vue.watch, onUnmounted: vue.onUnmounted, get getDisease() {
        return getDisease;
      }, get setDisease() {
        return setDisease;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_search_bar = resolveEasycom(vue.resolveDynamicComponent("uni-search-bar"), __easycom_0$4);
    const _component_disease_item = resolveEasycom(vue.resolveDynamicComponent("disease-item"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "disease-container" }, [
      vue.createElementVNode("view", { class: "search-add-container" }, [
        vue.createElementVNode("view", { class: "view-search-bar" }, [
          vue.createVNode(_component_uni_search_bar, {
            class: "search-bar",
            placeholder: "搜索词",
            clearButton: "none",
            cancelButton: "none",
            onConfirm: $setup.search
          })
        ]),
        vue.createElementVNode("button", {
          class: "add-button",
          onClick: $setup.addNewDisease
        }, "新增病害")
      ]),
      vue.createElementVNode("view", { class: "content-layout" }, [
        vue.createCommentVNode(" 左侧边栏 "),
        vue.createElementVNode("view", { class: "sidebar" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.tabItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["sidebar-item", $setup.activeTab === index ? "active" : ""]),
                onClick: ($event) => $setup.changeTab(index)
              }, [
                vue.createElementVNode("view", { class: "sidebar-item-content" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "sidebar-item-text" },
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "sidebar-item-count" },
                    "(" + vue.toDisplayString($setup.getTpyeItemCount(item)) + ")",
                    1
                    /* TEXT */
                  )
                ])
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 右侧内容区 "),
        vue.createElementVNode("view", { class: "content" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.filteredDiseases, (item, index) => {
              return vue.openBlock(), vue.createBlock(_component_disease_item, {
                key: index,
                item,
                onDelete: $setup.deleteDisease
              }, null, 8, ["item"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $setup.filteredDiseases.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "placeholder"
          }, " 暂无数据 ")) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const currentDisease = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-0ae3eae8"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/current-disease.vue"]]);
  const _sfc_main$n = /* @__PURE__ */ Object.assign({
    name: "history-disease"
  }, {
    __name: "history-disease",
    setup(__props, { expose: __expose }) {
      __expose();
      const tabItems = vue.ref(["2024", "2023", "2022"]);
      const activeTab = vue.ref(0);
      const searchText = vue.ref("");
      const isSelectMode = vue.ref(false);
      const showCopyButton = vue.ref(false);
      const selectedItems = vue.ref([]);
      const currentOpenSwipe = vue.ref(null);
      const diseaseItems = vue.ref(null);
      const diseaseList = vue.ref([]);
      const loadDiseaseData = async () => {
        try {
          const userId2 = "3";
          const buildingId2 = "39";
          const years = ["2024", "2023", "2022"];
          diseaseList.value = [];
          for (const year of years) {
            try {
              const yearData = await getDisease(userId2, buildingId2, year);
              formatAppLog("log", "at components/history-disease.vue:103", `获取到${year}年病害数据:`, yearData);
              if (yearData && yearData.diseases && yearData.diseases.length > 0) {
                diseaseList.value = [...diseaseList.value, ...yearData.diseases];
              }
            } catch (yearError) {
              formatAppLog("warn", "at components/history-disease.vue:110", `获取${year}年数据失败:`, yearError);
            }
          }
          formatAppLog("log", "at components/history-disease.vue:114", "所有年份病害数据加载完成:", diseaseList.value);
        } catch (error) {
          formatAppLog("error", "at components/history-disease.vue:116", "读取病害数据失败:", error);
          uni.showToast({
            title: "读取数据失败",
            icon: "none"
          });
        }
      };
      const expandedTypes = vue.reactive({
        "上部结构": true,
        "下部结构": true,
        "桥面系": true,
        "附属设施": true
      });
      const filteredDiseases = vue.computed(() => {
        const selectedYear = tabItems.value[activeTab.value];
        return diseaseList.value.filter((item) => {
          var _a, _b, _c, _d;
          const itemYear = item.createTime.substring(0, 4);
          if (itemYear !== selectedYear) {
            return false;
          }
          if (searchText.value) {
            return ((_a = item.description) == null ? void 0 : _a.includes(searchText.value)) || ((_b = item.type) == null ? void 0 : _b.includes(searchText.value)) || ((_d = (_c = item.component) == null ? void 0 : _c.parentObjectName) == null ? void 0 : _d.includes(searchText.value));
          }
          return true;
        });
      });
      const deleteDisease = (itemId) => {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条病害记录吗？",
          success: (res) => {
            if (res.confirm) {
              const index = diseaseList.value.findIndex((item) => item.id === itemId);
              if (index !== -1) {
                diseaseList.value.splice(index, 1);
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            }
          }
        });
      };
      const toggleSelectMode = () => {
        isSelectMode.value = !isSelectMode.value;
        showCopyButton.value = isSelectMode.value;
        if (!isSelectMode.value) {
          selectedItems.value = [];
        }
      };
      const handleItemSelect = (event) => {
        const { item, selected } = event;
        if (selected) {
          if (!selectedItems.value.includes(item.id)) {
            selectedItems.value.push(item.id);
          }
        } else {
          const index = selectedItems.value.indexOf(item.id);
          if (index !== -1) {
            selectedItems.value.splice(index, 1);
          }
        }
        formatAppLog("log", "at components/history-disease.vue:207", "当前选中项:", selectedItems.value);
      };
      const copyDisease = () => {
        if (selectedItems.value.length === 0) {
          uni.showToast({
            title: "请先选择要复制的病害",
            icon: "none"
          });
          return;
        }
        const selectedDiseases = diseaseList.value.filter((item) => selectedItems.value.includes(item.id));
        if (selectedDiseases.length === 0) {
          uni.showToast({
            title: "获取选中病害数据失败",
            icon: "none"
          });
          return;
        }
        const currentTime = /* @__PURE__ */ new Date();
        currentTime.getFullYear().toString();
        const copiedDiseases = selectedDiseases.map((disease) => {
          const newDisease = JSON.parse(JSON.stringify(disease));
          newDisease.id = (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3);
          const formattedTime = formatDateTime(currentTime);
          newDisease.createTime = formattedTime;
          newDisease.updateTime = formattedTime;
          delete newDisease.isDelete;
          return newDisease;
        });
        Promise.all(copiedDiseases.map((disease) => {
          return new Promise((resolve) => {
            formatAppLog("log", "at components/history-disease.vue:257", "发送添加新病害事件给current-disease组件:", disease);
            uni.$emit("addNewDisease", disease);
            resolve();
          });
        })).then(() => {
          uni.showToast({
            title: `成功复制${copiedDiseases.length}条病害到当前病害`,
            icon: "success"
          });
          toggleSelectMode();
        }).catch((error) => {
          formatAppLog("error", "at components/history-disease.vue:273", "复制病害失败:", error);
          uni.showToast({
            title: "复制失败，请重试",
            icon: "none"
          });
        });
      };
      const formatDateTime = (date = /* @__PURE__ */ new Date()) => {
        const y2 = date.getFullYear();
        const m2 = String(date.getMonth() + 1).padStart(2, "0");
        const d2 = String(date.getDate()).padStart(2, "0");
        const h2 = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        const s2 = String(date.getSeconds()).padStart(2, "0");
        return `${y2}-${m2}-${d2} ${h2}:${mm}:${s2}`;
      };
      const search = (e2) => {
        searchText.value = e2.value;
        formatAppLog("log", "at components/history-disease.vue:296", "搜索内容:", e2);
        closeAllSwipeActions();
        expandAllTypes();
      };
      const changeTab = (index) => {
        activeTab.value = index;
        closeAllSwipeActions();
        expandAllTypes();
      };
      const getYearItemCount = (year) => {
        return diseaseList.value.filter((item) => item.createTime.substring(0, 4) === year).length;
      };
      const getFilteredDiseasesByType = (type) => {
        const selectedYear = tabItems.value[activeTab.value];
        return diseaseList.value.filter((item) => {
          var _a, _b, _c;
          const itemYear = item.createTime.substring(0, 4);
          const parentObjectName = (_a = item.component) == null ? void 0 : _a.parentObjectName;
          if (itemYear !== selectedYear || parentObjectName !== type) {
            return false;
          }
          if (searchText.value) {
            return ((_b = item.description) == null ? void 0 : _b.includes(searchText.value)) || ((_c = item.type) == null ? void 0 : _c.includes(searchText.value));
          }
          return true;
        });
      };
      const handleSwipeOpened = (itemId) => {
        closeSwipeExcept(itemId);
        currentOpenSwipe.value = itemId;
      };
      const closeAllSwipeActions = () => {
        var _a;
        (_a = diseaseItems.value) == null ? void 0 : _a.forEach((item) => {
          item.closeSwipe && item.closeSwipe();
        });
        currentOpenSwipe.value = null;
      };
      const closeSwipeExcept = (itemId) => {
        var _a;
        (_a = diseaseItems.value) == null ? void 0 : _a.forEach((item) => {
          if (item.item.id !== itemId && item.closeSwipe) {
            item.closeSwipe();
          }
        });
      };
      const toggleTypeExpand = (type) => {
        expandedTypes[type] = !expandedTypes[type];
        closeAllSwipeActions();
      };
      const expandAllTypes = () => {
        ["上部结构", "下部结构", "桥面系", "附属设施"].forEach((type) => {
          expandedTypes[type] = true;
        });
      };
      vue.onMounted(() => {
        formatAppLog("log", "at components/history-disease.vue:376", "history-disease组件挂载，准备加载数据");
        loadDiseaseData();
        expandAllTypes();
      });
      const __returned__ = { tabItems, activeTab, searchText, isSelectMode, showCopyButton, selectedItems, currentOpenSwipe, diseaseItems, diseaseList, loadDiseaseData, expandedTypes, filteredDiseases, deleteDisease, toggleSelectMode, handleItemSelect, copyDisease, formatDateTime, search, changeTab, getYearItemCount, getFilteredDiseasesByType, handleSwipeOpened, closeAllSwipeActions, closeSwipeExcept, toggleTypeExpand, expandAllTypes, ref: vue.ref, reactive: vue.reactive, computed: vue.computed, nextTick: vue.nextTick, watch: vue.watch, onMounted: vue.onMounted, get getDisease() {
        return getDisease;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_search_bar = resolveEasycom(vue.resolveDynamicComponent("uni-search-bar"), __easycom_0$4);
    const _component_disease_item = resolveEasycom(vue.resolveDynamicComponent("disease-item"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "disease-container" }, [
      vue.createElementVNode("view", { class: "search-add-container" }, [
        vue.createElementVNode("view", { class: "view-search-bar" }, [
          vue.createVNode(_component_uni_search_bar, {
            class: "search-bar",
            placeholder: "搜索词",
            clearButton: "none",
            cancelButton: "none",
            onConfirm: $setup.search
          })
        ]),
        vue.createElementVNode("view", { class: "button-group" }, [
          $setup.showCopyButton ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            class: "copy-button",
            onClick: $setup.copyDisease
          }, "复制为新病害")) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "button",
            {
              class: "select-button",
              onClick: $setup.toggleSelectMode
            },
            vue.toDisplayString($setup.isSelectMode ? "取消" : "选择"),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 侧边栏布局 "),
      vue.createElementVNode("view", { class: "content-layout" }, [
        vue.createCommentVNode("左侧边栏"),
        vue.createElementVNode("view", { class: "sidebar" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.tabItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["sidebar-item", $setup.activeTab === index ? "active" : ""]),
                onClick: ($event) => $setup.changeTab(index)
              }, [
                vue.createElementVNode("view", { class: "sidebar-item-content" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "sidebar-item-text" },
                    vue.toDisplayString(item) + "年度",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "sidebar-item-count" },
                    "(" + vue.toDisplayString($setup.getYearItemCount(item)) + ")",
                    1
                    /* TEXT */
                  )
                ])
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 右侧内容区 "),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createCommentVNode(" 按结构类型分组显示 "),
          (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(["上部结构", "下部结构", "桥面系", "附属设施"], (type) => {
              return vue.createElementVNode("view", {
                key: type,
                class: "type-group"
              }, [
                vue.createCommentVNode(" 只有该类型有数据时才显示分组 "),
                $setup.getFilteredDiseasesByType(type).length > 0 ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 0 },
                  [
                    vue.createElementVNode("view", {
                      class: "type-header",
                      onClick: ($event) => $setup.toggleTypeExpand(type)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(type),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "expand-icon" },
                        vue.toDisplayString($setup.expandedTypes[type] ? "▼" : "▶"),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"]),
                    vue.withDirectives(vue.createElementVNode(
                      "view",
                      null,
                      [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($setup.getFilteredDiseasesByType(type), (item, itemIndex) => {
                            return vue.openBlock(), vue.createBlock(_component_disease_item, {
                              key: itemIndex,
                              item,
                              selectMode: $setup.isSelectMode,
                              selected: $setup.selectedItems.includes(item.id),
                              onSelect: $setup.handleItemSelect,
                              onDelete: $setup.deleteDisease,
                              onSwipeOpened: $setup.handleSwipeOpened,
                              ref_for: true,
                              ref: "diseaseItems"
                            }, null, 8, ["item", "selectMode", "selected"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ],
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vShow, $setup.expandedTypes[type]]
                    ])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : vue.createCommentVNode("v-if", true)
              ]);
            }),
            64
            /* STABLE_FRAGMENT */
          )),
          $setup.filteredDiseases.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "placeholder"
          }, " 暂无数据 ")) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const historyDisease = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-5a6538ca"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/history-disease.vue"]]);
  const _sfc_main$m = {
    __name: "administrative-identification-data",
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const __returned__ = { props, ref: vue.ref, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.data, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "line",
            key: item.id
          }, [
            vue.createElementVNode(
              "view",
              { class: "line-title" },
              vue.toDisplayString(item.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "line-content" },
              vue.toDisplayString(item.value || "/"),
              1
              /* TEXT */
            )
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-33f748f2"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/administrative-identification-data/administrative-identification-data.vue"]]);
  const _sfc_main$l = {
    __name: "bridge-tech",
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const __returned__ = { props, ref: vue.ref, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.data, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "line",
            key: item.id
          }, [
            vue.createElementVNode(
              "view",
              { class: "line-title" },
              vue.toDisplayString(item.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "line-content" }, [
              item.children && item.children.length ? (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                { key: 0 },
                vue.renderList(item.children, (child, childIndex) => {
                  return vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    {
                      key: child.id
                    },
                    [
                      vue.createTextVNode(
                        vue.toDisplayString(child.name) + ": " + vue.toDisplayString(child.value || "/") + " ",
                        1
                        /* TEXT */
                      ),
                      childIndex < item.children.length - 1 ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "line-content-middle"
                      })) : vue.createCommentVNode("v-if", true)
                    ],
                    64
                    /* STABLE_FRAGMENT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              )) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createTextVNode(
                    vue.toDisplayString(item.value || "/"),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              ))
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-43eb6c80"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/bridge-tech/bridge-tech.vue"]]);
  const _sfc_main$k = {
    __name: "bridge-structure",
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const structureData = vue.computed(() => {
        return props.data || [];
      });
      const getBridgeSpanData = () => {
        return structureData.value.find((item) => item.name === "桥梁分孔(m)") || {};
      };
      const getStructuralSystemData = () => {
        return structureData.value.find((item) => item.name === "结构体系") || {};
      };
      const getStructureTypes = () => {
        const excludeNames = ["桥梁分孔(m)", "结构体系"];
        return structureData.value.filter((item) => !excludeNames.includes(item.name));
      };
      const expandedTypes = vue.reactive({});
      const initExpandedTypes = () => {
        const types = getStructureTypes();
        types.forEach((type) => {
          expandedTypes[type.name] = true;
        });
      };
      if (structureData.value.length > 0) {
        initExpandedTypes();
      }
      const toggleTypeExpand = (type) => {
        expandedTypes[type] = !expandedTypes[type];
      };
      const __returned__ = { props, structureData, getBridgeSpanData, getStructuralSystemData, getStructureTypes, expandedTypes, initExpandedTypes, toggleTypeExpand, reactive: vue.reactive, ref: vue.ref, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 保持桥梁分孔和结构体系单独显示 "),
      $setup.structureData && $setup.structureData.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "part-area"
      }, [
        vue.createElementVNode("view", { class: "part-area-title" }, "桥梁分孔（m）"),
        vue.createElementVNode(
          "view",
          { class: "part-area-content" },
          vue.toDisplayString($setup.getBridgeSpanData().value || "/"),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      $setup.structureData && $setup.structureData.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "part-area"
      }, [
        vue.createElementVNode("view", { class: "part-area-title" }, "结构体系"),
        vue.createElementVNode("view", { class: "part-area-content" }, [
          $setup.getStructuralSystemData().children && $setup.getStructuralSystemData().children.length ? (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            { key: 0 },
            vue.renderList($setup.getStructuralSystemData().children, (child, childIndex) => {
              return vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                {
                  key: child.id
                },
                [
                  vue.createTextVNode(
                    vue.toDisplayString(child.name) + ": " + vue.toDisplayString(child.value || "/") + " ",
                    1
                    /* TEXT */
                  ),
                  childIndex < $setup.getStructuralSystemData().children.length - 1 ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "line-content-middle"
                  })) : vue.createCommentVNode("v-if", true)
                ],
                64
                /* STABLE_FRAGMENT */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createTextVNode(
                vue.toDisplayString($setup.getStructuralSystemData().value || "/"),
                1
                /* TEXT */
              )
            ],
            64
            /* STABLE_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 动态渲染其他结构部分 "),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.getStructureTypes(), (type) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: type.id,
            class: "type-group"
          }, [
            vue.createElementVNode("view", {
              class: "type-header",
              onClick: ($event) => $setup.toggleTypeExpand(type.name)
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString(type.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "expand-icon" },
                vue.toDisplayString($setup.expandedTypes[type.name] ? "▼" : "▶"),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]),
            vue.withDirectives(vue.createElementVNode(
              "view",
              null,
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(type.children, (item) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: item.id,
                      class: "expand-area"
                    }, [
                      vue.createElementVNode(
                        "view",
                        { class: "expand-area-title" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "expand-area-content" }, [
                        item.children && item.children.length ? (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          { key: 0 },
                          vue.renderList(item.children, (child, childIndex) => {
                            return vue.openBlock(), vue.createElementBlock(
                              vue.Fragment,
                              {
                                key: child.id
                              },
                              [
                                vue.createTextVNode(
                                  vue.toDisplayString(child.name) + ": " + vue.toDisplayString(child.value || "/") + " ",
                                  1
                                  /* TEXT */
                                ),
                                childIndex < item.children.length - 1 ? (vue.openBlock(), vue.createElementBlock("text", {
                                  key: 0,
                                  class: "line-content-middle"
                                })) : vue.createCommentVNode("v-if", true)
                              ],
                              64
                              /* STABLE_FRAGMENT */
                            );
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        )) : (vue.openBlock(), vue.createElementBlock(
                          vue.Fragment,
                          { key: 1 },
                          [
                            vue.createTextVNode(
                              vue.toDisplayString(item.value || "/"),
                              1
                              /* TEXT */
                            )
                          ],
                          64
                          /* STABLE_FRAGMENT */
                        ))
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              512
              /* NEED_PATCH */
            ), [
              [vue.vShow, $setup.expandedTypes[type.name]]
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-7725a9a4"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/bridge-structure/bridge-structure.vue"]]);
  const _sfc_main$j = {
    __name: "bridge-files",
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const __returned__ = { props, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.data, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "line",
            key: item.id
          }, [
            vue.createElementVNode(
              "view",
              { class: "line-title" },
              vue.toDisplayString(item.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "line-content" },
              vue.toDisplayString(item.value || "/"),
              1
              /* TEXT */
            )
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-a88cecdd"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/bridge-files/bridge-files.vue"]]);
  const _sfc_main$i = {
    __name: "bridge-inspection-history",
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const expandedTypes = vue.reactive({});
      vue.onMounted(() => {
        initExpandState();
      });
      const initExpandState = () => {
        props.data.forEach((item) => {
          expandedTypes[item.name] = true;
        });
      };
      const toggleTypeExpand = (type) => {
        expandedTypes[type] = !expandedTypes[type];
      };
      const __returned__ = { props, expandedTypes, initExpandState, toggleTypeExpand, reactive: vue.reactive, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.data, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: item.id,
            class: "type-group"
          }, [
            vue.createElementVNode("view", {
              class: "type-header",
              onClick: ($event) => $setup.toggleTypeExpand(item.name)
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "expand-icon" },
                vue.toDisplayString($setup.expandedTypes[item.name] ? "▼" : "▶"),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]),
            $setup.expandedTypes[item.name] && item.children ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(item.children, (child, childIndex) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "line",
                    key: child.id
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "line-title" },
                      vue.toDisplayString(child.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "line-content" },
                      vue.toDisplayString(child.value || "/"),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true)
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-23cde231"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/bridge-inspection-history/bridge-inspection-history.vue"]]);
  const _sfc_main$h = {
    __name: "maintenance-records",
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const expandedTypes = vue.reactive({});
      vue.onMounted(() => {
        initExpandState();
      });
      const initExpandState = () => {
        if (props.data && props.data) {
          props.data.forEach((item) => {
            expandedTypes[item.id] = true;
          });
        }
      };
      const toggleTypeExpand = (id) => {
        expandedTypes[id] = !expandedTypes[id];
      };
      const __returned__ = { props, expandedTypes, initExpandState, toggleTypeExpand, reactive: vue.reactive, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.data, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: item.id,
            class: "type-group"
          }, [
            vue.createElementVNode("view", {
              class: "type-header",
              onClick: ($event) => $setup.toggleTypeExpand(item.id)
            }, [
              vue.createElementVNode(
                "text",
                null,
                "时间（段）：" + vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "expand-icon" },
                vue.toDisplayString($setup.expandedTypes[item.id] ? "▼" : "▶"),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]),
            $setup.expandedTypes[item.id] && item.children ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList(item.children, (child, childIndex) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "line",
                    key: child.id
                  }, [
                    vue.createElementVNode(
                      "view",
                      { class: "line-title" },
                      vue.toDisplayString(child.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "line-content" },
                      vue.toDisplayString(child.value || "/"),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true)
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-277d9f90"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/maintenance-records/maintenance-records.vue"]]);
  const _sfc_main$g = {
    __name: "notes",
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const __returned__ = { props, reactive: vue.reactive, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "part-area" }, [
        vue.createElementVNode("view", { class: "part-area-title" }, "需要说明的事项(含桥梁管养单位的变更情况)"),
        vue.createElementVNode(
          "view",
          { class: "part-area-content" },
          vue.toDisplayString($props.data.value || "/"),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-429be1cf"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/notes/notes.vue"]]);
  const _sfc_main$f = {
    __name: "other-info",
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const dataArray = vue.computed(() => {
        if (Array.isArray(props.data)) {
          return props.data;
        }
        if (props.data && props.data.children && Array.isArray(props.data.children)) {
          return props.data.children;
        }
        return [];
      });
      const imageItems = vue.computed(() => {
        return dataArray.value.filter(
          (item) => item.name.includes("照片") || item.name.includes("照")
        );
      });
      const textItems = vue.computed(() => {
        return dataArray.value.filter(
          (item) => !item.name.includes("照片") && !item.name.includes("照")
        );
      });
      const getImageUrl = (value) => {
        if (!value || value === "/") {
          return "/static/image/zjl.png";
        }
        return value;
      };
      const clickImg = (item) => {
        const url = getImageUrl(item.value);
        uni.previewImage({
          urls: [url],
          current: 0
        });
      };
      const __returned__ = { props, dataArray, imageItems, textItems, getImageUrl, clickImg, ref: vue.ref, computed: vue.computed };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 照片区域，每行两张照片 "),
      vue.createElementVNode("view", { class: "image-container" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.imageItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: "image-item"
            }, [
              vue.createElementVNode(
                "view",
                { class: "image-title" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "image-wrapper" }, [
                vue.createElementVNode("image", {
                  src: $setup.getImageUrl(item.value),
                  mode: "aspectFill",
                  class: "image",
                  onClick: ($event) => $setup.clickImg(item)
                }, null, 8, ["src", "onClick"])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 文本信息区域 "),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.textItems, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "line",
            key: item.id
          }, [
            vue.createElementVNode(
              "view",
              { class: "line-title" },
              vue.toDisplayString(item.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "line-content" },
              vue.toDisplayString(item.value || "/"),
              1
              /* TEXT */
            )
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-2aa7c852"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/other-info/other-info.vue"]]);
  const _sfc_main$e = {
    __name: "bridge-archive",
    setup(__props, { expose: __expose }) {
      __expose();
      const bridgeArchive2 = vue.ref({
        children: [{}, {}, {}, {}, {}, {}, {}, {}]
        // 初始化8个空对象，对应8个标签页
      });
      const tabItems = vue.ref(["行政识别数据", "桥梁技术指标", "桥梁结构信息", "桥梁档案资料", "桥梁检测评定历史", "养护处置记录", "需要说明的事项", "其他"]);
      const activeTab = vue.ref(0);
      const changeTab = (index) => {
        activeTab.value = index;
      };
      vue.onMounted(async () => {
        try {
          const data2 = await getProperty("3", "39");
          formatAppLog("log", "at components/bridge-archive.vue:67", "获取到桥梁档案数据:", data2);
          if (data2 && Object.keys(data2).length > 0) {
            bridgeArchive2.value = data2;
          }
        } catch (error) {
          formatAppLog("error", "at components/bridge-archive.vue:74", "获取桥梁档案数据失败:", error);
          uni.showToast({
            title: "获取数据失败",
            icon: "none"
          });
        }
      });
      const __returned__ = { bridgeArchive: bridgeArchive2, tabItems, activeTab, changeTab, ref: vue.ref, watch: vue.watch, onMounted: vue.onMounted, get getProperty() {
        return getProperty;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_administrative_identification_data = resolveEasycom(vue.resolveDynamicComponent("administrative-identification-data"), __easycom_0$2);
    const _component_bridge_tech = resolveEasycom(vue.resolveDynamicComponent("bridge-tech"), __easycom_1$1);
    const _component_bridge_structure = resolveEasycom(vue.resolveDynamicComponent("bridge-structure"), __easycom_2);
    const _component_bridge_files = resolveEasycom(vue.resolveDynamicComponent("bridge-files"), __easycom_3$1);
    const _component_bridge_inspection_history = resolveEasycom(vue.resolveDynamicComponent("bridge-inspection-history"), __easycom_4);
    const _component_maintenance_records = resolveEasycom(vue.resolveDynamicComponent("maintenance-records"), __easycom_5);
    const _component_notes = resolveEasycom(vue.resolveDynamicComponent("notes"), __easycom_6);
    const _component_other_info = resolveEasycom(vue.resolveDynamicComponent("other-info"), __easycom_7);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "content-layout" }, [
        vue.createCommentVNode("左侧边栏"),
        vue.createElementVNode("view", { class: "sidebar" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.tabItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["sidebar-item", $setup.activeTab === index ? "active" : ""]),
                onClick: ($event) => $setup.changeTab(index)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "sidebar-item-content" },
                  vue.toDisplayString(item),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 右侧内容区 "),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createCommentVNode("使用条件渲染显示不同组件 "),
          vue.createCommentVNode("行政识别数据 "),
          $setup.activeTab === 0 ? (vue.openBlock(), vue.createBlock(_component_administrative_identification_data, {
            key: 0,
            data: $setup.bridgeArchive.children[0].children
          }, null, 8, ["data"])) : $setup.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode("桥梁技术指标"),
              vue.createVNode(_component_bridge_tech, {
                data: $setup.bridgeArchive.children[1].children
              }, null, 8, ["data"])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : $setup.activeTab === 2 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 2 },
            [
              vue.createCommentVNode("桥梁结构信息"),
              vue.createVNode(_component_bridge_structure, {
                data: $setup.bridgeArchive.children[2].children
              }, null, 8, ["data"])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : $setup.activeTab === 3 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 3 },
            [
              vue.createCommentVNode("桥梁档案资料"),
              vue.createVNode(_component_bridge_files, {
                data: $setup.bridgeArchive.children[3].children
              }, null, 8, ["data"])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : $setup.activeTab === 4 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 4 },
            [
              vue.createCommentVNode("桥梁检测评定历史"),
              vue.createVNode(_component_bridge_inspection_history, {
                data: $setup.bridgeArchive.children[4].children
              }, null, 8, ["data"])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : $setup.activeTab === 5 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 5 },
            [
              vue.createCommentVNode("养护处置记录"),
              vue.createVNode(_component_maintenance_records, {
                data: $setup.bridgeArchive.children[5].children
              }, null, 8, ["data"])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : $setup.activeTab === 6 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 6 },
            [
              vue.createCommentVNode("需要说明的事项"),
              vue.createVNode(_component_notes, {
                data: $setup.bridgeArchive.children[6]
              }, null, 8, ["data"])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : $setup.activeTab === 7 ? (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 7 },
            [
              vue.createCommentVNode("其他"),
              vue.createVNode(_component_other_info, {
                data: $setup.bridgeArchive.children[7]
              }, null, 8, ["data"])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const bridgeArchive = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-8bcf311a"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/bridge-archive.vue"]]);
  const msg = "ObjectTree success";
  const code = 0;
  const data = {
    orderNum: 0,
    delFlag: "0",
    children: [
      {
        orderNum: 1,
        delFlag: "0",
        children: [
          {
            orderNum: 1,
            delFlag: "0",
            id: 709,
            ancestors: "0,704,705,706",
            templateObjectId: 2011,
            comments: [
              {
                code: "R-1-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:38",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）1",
                id: 244,
                status: "0"
              },
              {
                code: "R-1-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:38",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）2",
                id: 245,
                status: "0"
              },
              {
                code: "R-2-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:38",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）3",
                id: 246,
                status: "0"
              },
              {
                code: "R-2-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）4",
                id: 247,
                status: "0"
              },
              {
                code: "R-3-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）5",
                id: 248,
                status: "0"
              },
              {
                code: "R-3-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）6",
                id: 249,
                status: "0"
              },
              {
                code: "R-4-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）7",
                id: 250,
                status: "0"
              },
              {
                code: "R-4-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）8",
                id: 251,
                status: "0"
              },
              {
                code: "R-5-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）9",
                id: 252,
                status: "0"
              },
              {
                code: "R-5-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）10",
                id: 253,
                status: "0"
              },
              {
                code: "R-6-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）11",
                id: 254,
                status: "0"
              },
              {
                code: "R-6-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:39",
                name: "上部承重构件（主梁、挂梁）12",
                id: 255,
                status: "0"
              },
              {
                code: "R-7-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）13",
                id: 256,
                status: "0"
              },
              {
                code: "R-7-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）14",
                id: 257,
                status: "0"
              },
              {
                code: "R-8-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）15",
                id: 258,
                status: "0"
              },
              {
                code: "R-8-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）16",
                id: 259,
                status: "0"
              },
              {
                code: "R-9-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）17",
                id: 260,
                status: "0"
              },
              {
                code: "R-9-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）18",
                id: 261,
                status: "0"
              },
              {
                code: "R-10-1#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:39",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）19",
                id: 262,
                status: "0"
              },
              {
                code: "R-10-2#上部承重构件（主梁、挂梁）",
                updateTime: "2025-04-21 16:53:40",
                delFlag: "0",
                biObjectId: 709,
                createBy: "admin",
                createTime: "2025-04-21 16:53:40",
                name: "上部承重构件（主梁、挂梁）20",
                id: 263,
                status: "0"
              }
            ],
            count: 20,
            weight: 0.7,
            updateTime: "2025-04-21 16:50:36",
            parentId: 706,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "上部承重构件（主梁、挂梁）",
            diseaseTypes: [
              {
                createBy: "admin",
                code: "5.2.1-1",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "涂层劣化",
                updateTime: "2025-04-14 17:14:06",
                id: 15,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-2",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "锈蚀",
                updateTime: "2025-04-14 17:14:06",
                id: 16,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-3",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "焊缝开裂",
                updateTime: "2025-04-14 17:14:06",
                id: 17,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-4",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "铆钉（螺栓）损失",
                updateTime: "2025-04-14 17:14:06",
                id: 18,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-5",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "构件裂缝",
                updateTime: "2025-04-14 17:14:06",
                id: 19,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-6",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "跨中挠度",
                updateTime: "2025-04-14 17:14:06",
                id: 20,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-7",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "构件变形",
                updateTime: "2025-04-14 17:14:06",
                id: 21,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-8",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "结构变位",
                updateTime: "2025-04-14 17:14:06",
                id: 22,
                minScale: 1,
                status: "0"
              }
            ],
            status: "0"
          },
          {
            orderNum: 2,
            delFlag: "0",
            id: 710,
            ancestors: "0,704,705,706",
            templateObjectId: 2012,
            count: 0,
            weight: 0.18,
            updateTime: "2025-04-21 16:50:36",
            parentId: 706,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "上部一般构件（湿接缝、横隔板等）",
            diseaseTypes: [
              {
                createBy: "admin",
                code: "5.2.1-1",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "涂层劣化",
                updateTime: "2025-04-14 17:14:06",
                id: 15,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-2",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "锈蚀",
                updateTime: "2025-04-14 17:14:06",
                id: 16,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-3",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "焊缝开裂",
                updateTime: "2025-04-14 17:14:06",
                id: 17,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-4",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "铆钉（螺栓）损失",
                updateTime: "2025-04-14 17:14:06",
                id: 18,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-5",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "构件裂缝",
                updateTime: "2025-04-14 17:14:06",
                id: 19,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-6",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "跨中挠度",
                updateTime: "2025-04-14 17:14:06",
                id: 20,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-7",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "构件变形",
                updateTime: "2025-04-14 17:14:06",
                id: 21,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.2.1-8",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "结构变位",
                updateTime: "2025-04-14 17:14:06",
                id: 22,
                minScale: 1,
                status: "0"
              }
            ],
            status: "0"
          },
          {
            orderNum: 3,
            delFlag: "0",
            id: 711,
            ancestors: "0,704,705,706",
            templateObjectId: 2013,
            comments: [
              {
                code: "R-1#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:19",
                name: "支座1",
                id: 264,
                status: "0"
              },
              {
                code: "R-2#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座2",
                id: 265,
                status: "0"
              },
              {
                code: "R-3#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座3",
                id: 266,
                status: "0"
              },
              {
                code: "R-4#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座4",
                id: 267,
                status: "0"
              },
              {
                code: "R-5#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座5",
                id: 268,
                status: "0"
              },
              {
                code: "R-6#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座6",
                id: 269,
                status: "0"
              },
              {
                code: "R-7#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座7",
                id: 270,
                status: "0"
              },
              {
                code: "R-8#支座",
                updateTime: "2025-04-21 16:57:19",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座8",
                id: 271,
                status: "0"
              },
              {
                code: "R-9#支座",
                updateTime: "2025-04-21 16:57:20",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座9",
                id: 272,
                status: "0"
              },
              {
                code: "R-10#支座",
                updateTime: "2025-04-21 16:57:20",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座10",
                id: 273,
                status: "0"
              },
              {
                code: "R-11#支座",
                updateTime: "2025-04-21 16:57:20",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座11",
                id: 274,
                status: "0"
              },
              {
                code: "R-12#支座",
                updateTime: "2025-04-21 16:57:20",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座12",
                id: 275,
                status: "0"
              },
              {
                code: "R-13#支座",
                updateTime: "2025-04-21 16:57:20",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座13",
                id: 276,
                status: "0"
              },
              {
                code: "R-14#支座",
                updateTime: "2025-04-21 16:57:20",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座14",
                id: 277,
                status: "0"
              },
              {
                code: "R-15#支座",
                updateTime: "2025-04-21 16:57:20",
                delFlag: "0",
                biObjectId: 711,
                createBy: "admin",
                createTime: "2025-04-21 16:57:20",
                name: "支座15",
                id: 278,
                status: "0"
              }
            ],
            count: 15,
            weight: 0.12,
            updateTime: "2025-04-21 16:50:36",
            parentId: 706,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "支座",
            diseaseTypes: [
              {
                createBy: "admin",
                code: "5.3.1-1",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "橡胶支座老化变质、开裂",
                updateTime: "2025-04-14 17:14:06",
                id: 23,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.1-2",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "板式支座缺陷",
                updateTime: "2025-04-14 17:14:06",
                id: 24,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.1-3",
                maxScale: 5,
                createTime: "2025-04-14 17:14:06",
                name: "板式支座位置串动、脱空或剪切超限",
                updateTime: "2025-04-14 17:14:06",
                id: 25,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.1-4",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "盆式支座组件损坏",
                updateTime: "2025-04-14 17:14:06",
                id: 26,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.1-5",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "聚四氟乙烯滑板磨损",
                updateTime: "2025-04-14 17:14:06",
                id: 27,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.1-6",
                maxScale: 3,
                createTime: "2025-04-14 17:14:06",
                name: "盆式支座位移、转角超限",
                updateTime: "2025-04-14 17:14:06",
                id: 28,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.2-1",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "钢支座组件或功能缺陷",
                updateTime: "2025-04-14 17:14:06",
                id: 29,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.2-2",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "钢支座位移、转角超限",
                updateTime: "2025-04-14 17:14:06",
                id: 30,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.2-3",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "钢支座部件磨损、裂缝",
                updateTime: "2025-04-14 17:14:06",
                id: 31,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.3-1",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "混凝土缺损",
                updateTime: "2025-04-14 17:14:06",
                id: 32,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.3-2",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "活动支座滑动面不平整、生锈咬死",
                updateTime: "2025-04-14 17:14:06",
                id: 33,
                minScale: 1,
                status: "0"
              },
              {
                createBy: "admin",
                code: "5.3.3-3",
                maxScale: 4,
                createTime: "2025-04-14 17:14:06",
                name: "承有裂纹、切口或偏移",
                updateTime: "2025-04-14 17:14:06",
                id: 34,
                minScale: 1,
                status: "0"
              }
            ],
            status: "0"
          }
        ],
        id: 706,
        ancestors: "0,704,705",
        templateObjectId: 201,
        count: 0,
        weight: 0.4,
        updateTime: "2025-04-21 16:50:36",
        parentId: 705,
        createBy: "admin",
        createTime: "2025-04-21 16:50:36",
        name: "上部结构",
        status: "0"
      },
      {
        orderNum: 2,
        delFlag: "0",
        children: [
          {
            orderNum: 1,
            delFlag: "0",
            id: 712,
            ancestors: "0,704,705,707",
            templateObjectId: 2021,
            count: 0,
            weight: 0.02,
            updateTime: "2025-04-21 16:50:37",
            parentId: 707,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "翼墙、耳墙",
            status: "0"
          },
          {
            orderNum: 2,
            delFlag: "0",
            id: 713,
            ancestors: "0,704,705,707",
            templateObjectId: 2022,
            count: 0,
            weight: 0.01,
            updateTime: "2025-04-21 16:50:37",
            parentId: 707,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "锥坡、护坡",
            status: "0"
          },
          {
            orderNum: 3,
            delFlag: "0",
            id: 714,
            ancestors: "0,704,705,707",
            templateObjectId: 2023,
            count: 0,
            weight: 0.3,
            updateTime: "2025-04-21 16:50:37",
            parentId: 707,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "桥墩",
            status: "0"
          },
          {
            orderNum: 4,
            delFlag: "0",
            id: 715,
            ancestors: "0,704,705,707",
            templateObjectId: 2024,
            count: 0,
            weight: 0.3,
            updateTime: "2025-04-21 16:50:37",
            parentId: 707,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "桥台",
            status: "0"
          },
          {
            orderNum: 5,
            delFlag: "0",
            id: 716,
            ancestors: "0,704,705,707",
            templateObjectId: 2025,
            count: 0,
            weight: 0.28,
            updateTime: "2025-04-21 16:50:37",
            parentId: 707,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "墩台基础",
            status: "0"
          },
          {
            orderNum: 6,
            delFlag: "0",
            id: 717,
            ancestors: "0,704,705,707",
            templateObjectId: 2026,
            count: 0,
            weight: 0.07,
            updateTime: "2025-04-21 16:50:37",
            parentId: 707,
            createBy: "admin",
            createTime: "2025-04-21 16:50:37",
            name: "河床",
            status: "0"
          },
          {
            orderNum: 7,
            delFlag: "0",
            id: 718,
            ancestors: "0,704,705,707",
            templateObjectId: 2027,
            count: 0,
            weight: 0.02,
            updateTime: "2025-04-21 16:50:37",
            parentId: 707,
            createBy: "admin",
            createTime: "2025-04-21 16:50:38",
            name: "调治构造物",
            status: "0"
          }
        ],
        id: 707,
        ancestors: "0,704,705",
        templateObjectId: 202,
        count: 0,
        weight: 0.4,
        updateTime: "2025-04-21 16:50:36",
        parentId: 705,
        createBy: "admin",
        createTime: "2025-04-21 16:50:37",
        name: "下部结构",
        status: "0"
      },
      {
        orderNum: 3,
        delFlag: "0",
        children: [
          {
            orderNum: 1,
            delFlag: "0",
            id: 719,
            ancestors: "0,704,705,708",
            templateObjectId: 2031,
            count: 0,
            weight: 0.4,
            updateTime: "2025-04-21 16:50:37",
            parentId: 708,
            createBy: "admin",
            createTime: "2025-04-21 16:50:38",
            name: "桥面铺装",
            status: "0"
          },
          {
            orderNum: 2,
            delFlag: "0",
            id: 720,
            ancestors: "0,704,705,708",
            templateObjectId: 2032,
            count: 0,
            weight: 0.25,
            updateTime: "2025-04-21 16:50:37",
            parentId: 708,
            createBy: "admin",
            createTime: "2025-04-21 16:50:38",
            name: "伸缩缝装置",
            status: "0"
          },
          {
            orderNum: 3,
            delFlag: "0",
            id: 721,
            ancestors: "0,704,705,708",
            templateObjectId: 2033,
            count: 0,
            weight: 0.1,
            updateTime: "2025-04-21 16:50:37",
            parentId: 708,
            createBy: "admin",
            createTime: "2025-04-21 16:50:38",
            name: "人行道",
            status: "0"
          },
          {
            orderNum: 4,
            delFlag: "0",
            id: 722,
            ancestors: "0,704,705,708",
            templateObjectId: 2034,
            count: 0,
            weight: 0.1,
            updateTime: "2025-04-21 16:50:37",
            parentId: 708,
            createBy: "admin",
            createTime: "2025-04-21 16:50:38",
            name: "栏杆、护栏",
            status: "0"
          },
          {
            orderNum: 5,
            delFlag: "0",
            id: 723,
            ancestors: "0,704,705,708",
            templateObjectId: 2035,
            count: 0,
            weight: 0.1,
            updateTime: "2025-04-21 16:50:38",
            parentId: 708,
            createBy: "admin",
            createTime: "2025-04-21 16:50:38",
            name: "排水系统",
            status: "0"
          },
          {
            orderNum: 6,
            delFlag: "0",
            id: 724,
            ancestors: "0,704,705,708",
            templateObjectId: 2036,
            count: 0,
            weight: 0.05,
            updateTime: "2025-04-21 16:50:38",
            parentId: 708,
            createBy: "admin",
            createTime: "2025-04-21 16:50:38",
            name: "照明、标志",
            status: "0"
          }
        ],
        id: 708,
        ancestors: "0,704,705",
        templateObjectId: 203,
        count: 0,
        weight: 0.2,
        updateTime: "2025-04-21 16:50:36",
        parentId: 705,
        createBy: "admin",
        createTime: "2025-04-21 16:50:37",
        name: "桥面系",
        status: "0"
      }
    ],
    id: 705,
    ancestors: "0,704",
    templateObjectId: 2,
    count: 0,
    updateTime: "2025-04-21 16:50:36",
    parentId: 704,
    createBy: "admin",
    parentName: "K38+837白洋互通主线桥",
    createTime: "2025-04-21 16:50:36",
    name: "K38+837白洋互通主线桥(K1474+780)-右线(钢梁桥)",
    status: "0"
  };
  const structureJSON = {
    msg,
    code,
    data
  };
  const _sfc_main$d = {
    __name: "structure-info",
    setup(__props, { expose: __expose }) {
      __expose();
      const tabItems = vue.ref([]);
      const structures = vue.ref([]);
      const selectedIndex = vue.ref(0);
      const confirmed = vue.ref(false);
      const activeTab = vue.ref(0);
      const popupContent = vue.ref("");
      const currentStructure = vue.ref();
      const currentEdit = vue.ref();
      const editSuffix = vue.ref("");
      const editNumber = vue.ref("");
      const selectedStructure = vue.ref(null);
      const popup2 = vue.ref(null);
      const confirmPopup = vue.ref(null);
      const confirmStructure = () => {
        confirmPopup.value.open();
      };
      const confirmConfirm = () => {
        confirmed.value = true;
        confirmPopup.value.close();
      };
      const closeConfirmPopup = () => {
        confirmPopup.value.close();
      };
      const changeTab = (index) => {
        selectedIndex.value = index;
      };
      const suffix = vue.ref("");
      const segments = vue.ref([{
        id: generateId(),
        typeIndex: 0,
        value: "",
        start: "",
        end: ""
      }]);
      function generateId() {
        return "id_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
      }
      const isAllSelected = vue.computed(() => currentStructure.value.comments.every((item) => item.selected));
      const hasSelection = vue.computed(() => currentStructure.value.comments.some((item) => item.selected));
      const showPopup = (item) => {
        currentStructure.value = item;
        if (!item.comments) {
          popupContent.value = "create";
          suffix.value = "#" + currentStructure.value.name;
        } else {
          popupContent.value = "read";
          item.comments.forEach((item2) => {
            item2.selected = false;
          });
        }
        popup2.value.open();
      };
      const changeStructureState = (structure) => {
        formatAppLog("log", "at components/structure-info.vue:247", structure);
        structure.status = structure.status === "0" ? "1" : "0";
      };
      const toggleSelectAll = () => {
        const all = isAllSelected.value;
        currentStructure.value.comments.forEach((item) => item.selected = !all);
      };
      const selectItem = (index) => {
        currentStructure.value.comments[index].selected = !currentStructure.value.comments[index].selected;
      };
      const singleDelete = (comment) => {
        if (!comment)
          return;
        currentStructure.value.comments = currentStructure.value.comments.filter((item) => item !== comment);
        uni.showToast({
          title: "删除成功",
          icon: "none"
        });
      };
      const batchDelete = () => {
        if (!hasSelection.value)
          return;
        currentStructure.value.comments = currentStructure.value.comments.filter((item) => !item.selected);
        uni.showToast({
          title: "批量删除成功",
          icon: "none"
        });
      };
      const edit = (structure) => {
        currentEdit.value = structure;
        editSuffix.value = "#" + structure.code.split("#")[1];
        editNumber.value = structure.code.split("#")[0];
        popupContent.value = "edit";
      };
      const addSegment = () => {
        segments.value.push({
          id: generateId(),
          typeIndex: 0,
          value: "",
          start: "",
          end: ""
        });
      };
      const typeChange = (e2) => {
        const id = e2.id;
        const newValue = e2.event.detail.value;
        const index = segments.value.findIndex((segment) => segment.id === id);
        if (index !== -1) {
          segments.value[index].typeIndex = newValue;
        }
      };
      const removeSegment = (index) => {
        segments.value.splice(index, 1);
      };
      function getCurrentFormattedTime() {
        const now = /* @__PURE__ */ new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      const generateCombinations = (segs, index = 0, path = [], result = []) => {
        if (index === segs.length) {
          const combined = path.join("-");
          result.push({
            // name: `${combined}${suffix.value}`,
            // number: combined,
            // suffix: suffix.value
            biObjectId: currentStructure.value.id,
            code: `${combined}${suffix.value}`,
            createBy: "user",
            createTime: getCurrentFormattedTime(),
            delFlag: "0",
            // 未知属性
            // id: ,//不知道id是啥
            name: `${suffix.value.split("#")[1] + (result.length + 1)}`,
            status: "0",
            updateTime: getCurrentFormattedTime()
          });
          return;
        }
        const seg = segs[index];
        if (seg.typeIndex === 0) {
          generateCombinations(segs, index + 1, [...path, seg.value], result);
        } else if (seg.typeIndex === 1) {
          const start = Number(seg.start);
          const end = Number(seg.end);
          for (let i2 = start; i2 <= end; i2++) {
            generateCombinations(segs, index + 1, [...path, i2], result);
          }
        }
        return result;
      };
      const generateNameObjects = () => {
        return generateCombinations(segments.value);
      };
      const cancel = () => {
        popup2.value.close();
      };
      const confirm = () => {
        currentStructure.value.comments = generateNameObjects();
        currentStructure.value.count = currentStructure.value.comments.length;
        popup2.value.close();
      };
      const editCancel = () => {
        popupContent.value = "read";
      };
      const editConfirm = () => {
        const match = currentEdit.value.name.match(/\d+$/);
        const number = match ? match[0] : "";
        currentEdit.value.name = editSuffix.value.split("#")[1] + number;
        currentEdit.value.code = `${editNumber.value + editSuffix.value}`;
        popupContent.value = "read";
      };
      const selectStructure = (item, index) => {
        selectedStructure.value = item;
      };
      vue.onMounted(() => {
        structures.value = JSON.parse(JSON.stringify(structureJSON.data));
        tabItems.value = structures.value.children.map((item) => item.name);
        formatAppLog("log", "at components/structure-info.vue:406", structures.value);
      });
      const __returned__ = { tabItems, structures, selectedIndex, confirmed, activeTab, popupContent, currentStructure, currentEdit, editSuffix, editNumber, selectedStructure, popup: popup2, confirmPopup, confirmStructure, confirmConfirm, closeConfirmPopup, changeTab, suffix, segments, generateId, isAllSelected, hasSelection, showPopup, changeStructureState, toggleSelectAll, selectItem, singleDelete, batchDelete, edit, addSegment, typeChange, removeSegment, getCurrentFormattedTime, generateCombinations, generateNameObjects, cancel, confirm, editCancel, editConfirm, selectStructure, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, get structureJSON() {
        return structureJSON;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_2$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "confirm-row" }, [
        vue.createElementVNode("span", { class: "confirm-text" }, "结构信息状态："),
        vue.createElementVNode(
          "span",
          {
            class: "confirm-status",
            style: vue.normalizeStyle({ color: $setup.confirmed ? "#00dd00" : "#f56c6c" })
          },
          vue.toDisplayString($setup.confirmed ? "已确认" : "未确认"),
          5
          /* TEXT, STYLE */
        ),
        vue.createElementVNode("view", { class: "confirm-button-container" }, [
          vue.createElementVNode("button", {
            onClick: $setup.confirmStructure,
            class: "confirm-button"
          }, "确定构件信息")
        ])
      ]),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "confirmPopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "confirmPopup-content" }, [
              vue.createElementVNode("text", { class: "confirmPopup-text" }, "确定当前结构信息状态吗？"),
              vue.createElementVNode("view", { class: "confirmPopup-buttons" }, [
                vue.createElementVNode("button", {
                  class: "confirmPopup-buttons-cancel",
                  onClick: $setup.closeConfirmPopup
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "confirmPopup-buttons-confirm",
                  onClick: $setup.confirmConfirm
                }, "确定")
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createElementVNode("view", { class: "content-layout" }, [
        vue.createCommentVNode("左侧边栏"),
        vue.createElementVNode("view", { class: "sidebar" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.tabItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["sidebar-item", $setup.selectedIndex === index ? "active" : ""]),
                onClick: ($event) => $setup.changeTab(index)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "sidebar-item-content" },
                  vue.toDisplayString(item),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 右侧内容区 "),
        vue.createElementVNode("view", { class: "content" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.structures.children[$setup.selectedIndex].children, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["structure-item", { "selected": $setup.selectedStructure === item }]),
                onClick: ($event) => $setup.selectStructure(item, index)
              }, [
                (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: index,
                    class: "structure-name"
                  },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                )),
                vue.createElementVNode("view", {
                  class: vue.normalizeClass(["structure-state-button", item.status === "0" ? "button-on" : "button-off", $setup.confirmed ? "disabled" : ""]),
                  onClick: vue.withModifiers(($event) => $setup.selectedStructure === item && !$setup.confirmed && $setup.changeStructureState(item), ["stop"])
                }, vue.toDisplayString(item.status === "0" ? "启用部件" : "停用部件"), 11, ["onClick"]),
                vue.createElementVNode("view", {
                  class: vue.normalizeClass(["structure-number-button", $setup.confirmed ? "disabled" : ""]),
                  onClick: vue.withModifiers(($event) => $setup.selectedStructure === item && !$setup.confirmed && $setup.showPopup(item), ["stop"])
                }, vue.toDisplayString(item.comments ? "查看编号" : "创建编号"), 11, ["onClick"])
              ], 10, ["onClick"]);
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 底部弹出层 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "popup",
          type: "bottom"
        },
        {
          default: vue.withCtx(() => [
            vue.createCommentVNode(" read 模式 "),
            $setup.popupContent === "read" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "popup-content"
            }, [
              vue.createElementVNode(
                "view",
                { class: "popup-header" },
                " 构建编号 - " + vue.toDisplayString($setup.currentStructure.name),
                1
                /* TEXT */
              ),
              vue.createCommentVNode(" 表头 "),
              vue.createElementVNode("view", { class: "read-table-header" }, [
                vue.createElementVNode("view", { class: "read-cell name" }, [
                  vue.createElementVNode("checkbox", {
                    checked: $setup.isAllSelected,
                    onClick: $setup.toggleSelectAll,
                    shape: "circle"
                  }, null, 8, ["checked"]),
                  vue.createElementVNode("text", null, "名称")
                ]),
                vue.createElementVNode("text", { class: "read-cell code" }, "编号"),
                vue.createElementVNode("view", { class: "read-batchDelete" }, [
                  vue.createElementVNode("button", {
                    class: vue.normalizeClass(["btn delete", { "disabled-btn": !$setup.hasSelection }]),
                    disabled: !$setup.hasSelection,
                    onClick: $setup.batchDelete
                  }, "批量删除", 10, ["disabled"])
                ])
              ]),
              vue.createCommentVNode(" 列表 "),
              vue.createElementVNode("scroll-view", {
                "scroll-y": "",
                class: "read-table-body"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.currentStructure.comments, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: item.id,
                      class: "read-table-row"
                    }, [
                      vue.createElementVNode("view", { class: "read-cell name" }, [
                        vue.createElementVNode("checkbox", {
                          checked: item.selected,
                          onClick: ($event) => $setup.selectItem(index),
                          shape: "circle"
                        }, null, 8, ["checked", "onClick"]),
                        vue.createElementVNode(
                          "text",
                          { class: "text-hide" },
                          vue.toDisplayString(item.code),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "read-cell code text-hide" },
                        vue.toDisplayString(item.code.split("#")[0]),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "read-cell actions" }, [
                        vue.createElementVNode("button", {
                          class: "btn delete",
                          onClick: ($event) => $setup.singleDelete(item)
                        }, "删除", 8, ["onClick"]),
                        vue.createElementVNode("button", {
                          class: "btn edit",
                          onClick: ($event) => $setup.edit(item)
                        }, "编辑", 8, ["onClick"])
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])) : $setup.popupContent === "create" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              [
                vue.createCommentVNode(" create 模式 "),
                vue.createElementVNode("view", { class: "popup-box" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "popup-header" },
                    " 创建编号 - " + vue.toDisplayString($setup.currentStructure.name),
                    1
                    /* TEXT */
                  ),
                  vue.createCommentVNode(" 名称后缀 "),
                  vue.createElementVNode("view", { class: "create-suffix" }, [
                    vue.createElementVNode("text", { class: "create-suffix-text" }, "名称后缀"),
                    vue.withDirectives(vue.createElementVNode(
                      "input",
                      {
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.suffix = $event),
                        class: "create-suffix-input",
                        placeholder: "如 #锚具"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vModelText, $setup.suffix]
                    ])
                  ]),
                  vue.createCommentVNode(" 编号片段表格 "),
                  vue.createElementVNode("view", { class: "create-table-header" }, [
                    vue.createElementVNode("text", { class: "numberFragment" }, "编号片段"),
                    vue.createElementVNode("template", { class: "create-table-cols" }, [
                      vue.createElementVNode("text", { class: "col" }, "序号"),
                      vue.createElementVNode("text", { class: "col" }, "类型"),
                      vue.createElementVNode("text", { class: "col" }, "值"),
                      vue.createElementVNode("text", { class: "col" }, "操作")
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "create-table-body" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.segments, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: "create-row",
                          key: index
                        }, [
                          vue.createElementVNode("view", { class: "create-placeholder" }),
                          vue.createElementVNode("template", { class: "create-row-right" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "create-number" },
                              vue.toDisplayString(index + 1),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode("picker", {
                              mode: "selector",
                              range: ["固定值", "序号"],
                              value: item.typeIndex,
                              onChange: (e2) => $setup.typeChange({ id: item.id, event: e2 }),
                              class: "create-class"
                            }, [
                              vue.createElementVNode("view", { class: "create-class-value" }, [
                                vue.createTextVNode(
                                  vue.toDisplayString(["固定值", "序号"][item.typeIndex]) + " ",
                                  1
                                  /* TEXT */
                                ),
                                vue.createElementVNode("text", { class: "arrow-down" }, "▼")
                              ])
                            ], 40, ["value", "onChange"]),
                            vue.createElementVNode("view", { class: "create-value" }, [
                              item.typeIndex === 0 ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                                key: 0,
                                "onUpdate:modelValue": ($event) => item.value = $event,
                                class: "create-value-input"
                              }, null, 8, ["onUpdate:modelValue"])), [
                                [vue.vModelText, item.value]
                              ]) : (vue.openBlock(), vue.createElementBlock("view", {
                                key: 1,
                                class: "range-input"
                              }, [
                                vue.withDirectives(vue.createElementVNode("input", {
                                  "onUpdate:modelValue": ($event) => item.start = $event,
                                  class: "create-value-input"
                                }, null, 8, ["onUpdate:modelValue"]), [
                                  [vue.vModelText, item.start]
                                ]),
                                vue.createTextVNode(),
                                vue.createElementVNode("text", { class: "create-value-text" }, "至"),
                                vue.createTextVNode(),
                                vue.withDirectives(vue.createElementVNode("input", {
                                  "onUpdate:modelValue": ($event) => item.end = $event,
                                  class: "create-value-input"
                                }, null, 8, ["onUpdate:modelValue"]), [
                                  [vue.vModelText, item.end]
                                ])
                              ]))
                            ]),
                            vue.createElementVNode("view", { class: "create-delete" }, [
                              vue.createElementVNode("button", {
                                class: "btn-delete",
                                onClick: ($event) => $setup.removeSegment(index)
                              }, "删除", 8, ["onClick"])
                            ])
                          ])
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    vue.createCommentVNode(" 操作按钮 "),
                    vue.createElementVNode("view", { class: "btn-row" }, [
                      vue.createElementVNode("button", {
                        onClick: $setup.addSegment,
                        class: "btn-add"
                      }, "添加片段"),
                      vue.createElementVNode("view", { class: "right-btns" }, [
                        vue.createElementVNode("button", {
                          onClick: $setup.cancel,
                          class: "btn-cancel"
                        }, "取消"),
                        vue.createElementVNode("button", {
                          onClick: $setup.confirm,
                          class: "btn-confirm"
                        }, "确定")
                      ])
                    ])
                  ])
                ])
              ],
              2112
              /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
            )) : $setup.popupContent === "edit" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 2 },
              [
                vue.createCommentVNode(" edit 模式 "),
                vue.createElementVNode("view", { class: "popup-content" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "popup-header" },
                    " 编辑编号 - " + vue.toDisplayString($setup.currentStructure.name),
                    1
                    /* TEXT */
                  ),
                  vue.createCommentVNode(" 名称后缀 "),
                  vue.createElementVNode("view", { class: "create-suffix bottomBorder" }, [
                    vue.createElementVNode("text", { class: "create-suffix-text" }, "名称后缀"),
                    vue.withDirectives(vue.createElementVNode(
                      "input",
                      {
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.editSuffix = $event),
                        class: "create-suffix-input",
                        placeholder: "如 #锚具"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vModelText, $setup.editSuffix]
                    ])
                  ]),
                  vue.createCommentVNode(" 编号 "),
                  vue.createElementVNode("view", { class: "create-suffix" }, [
                    vue.createElementVNode("text", { class: "create-suffix-text" }, "编号"),
                    vue.withDirectives(vue.createElementVNode(
                      "input",
                      {
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.editNumber = $event),
                        class: "create-suffix-input",
                        placeholder: "如 1-01-1"
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vModelText, $setup.editNumber]
                    ])
                  ]),
                  vue.createCommentVNode(" 操作按钮 "),
                  vue.createElementVNode("view", { class: "edit-btn-row" }, [
                    vue.createElementVNode("button", {
                      onClick: $setup.editCancel,
                      class: "btn-cancel"
                    }, "取消"),
                    vue.createElementVNode("button", {
                      onClick: $setup.editConfirm,
                      class: "btn-confirm"
                    }, "确定")
                  ])
                ])
              ],
              2112
              /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const structureInfo = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-8f2488a5"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/structure-info.vue"]]);
  const _sfc_main$c = {
    __name: "front-photo",
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const photoList = vue.ref([]);
      vue.watch(() => props.data, (newData) => {
        if (newData && newData.length > 0) {
          formatAppLog("log", "at components/front-photo.vue:34", "接收到桥梁正面立照数据:", newData);
          photoList.value = newData;
        }
      }, { immediate: true, deep: true });
      const previewImage = (url, index) => {
        const urls = props.data.map((item) => item.imageUrl);
        uni.previewImage({
          current: index,
          urls,
          indicator: "number",
          loop: true
        });
      };
      vue.onMounted(() => {
        formatAppLog("log", "at components/front-photo.vue:52", "front-photo组件挂载，接收到的数据:", props.data);
      });
      const __returned__ = { props, photoList, previewImage, ref: vue.ref, onMounted: vue.onMounted, watch: vue.watch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "photo-container" }, [
      vue.createElementVNode("view", { class: "title" }, "桥梁正面立照"),
      vue.createElementVNode("view", { class: "photos-list" }, [
        $props.data && $props.data.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "photo-grid"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($props.data, (photo, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "photo-item"
              }, [
                vue.createElementVNode("image", {
                  src: photo.imageUrl,
                  mode: "aspectFill",
                  onClick: ($event) => $setup.previewImage(photo.imageUrl, index)
                }, null, 8, ["src", "onClick"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "empty-data"
        }, " 暂无桥梁正面立照数据 "))
      ])
    ]);
  }
  const frontPhoto = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-95007593"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/front-photo.vue"]]);
  const DOC_BASE_PATH = plus.io.convertLocalFileSystemURL("_doc/");
  const FILE_NAMING = {
    taskList: (userId2) => `${userId2}/taskList.json`,
    bridgeList: (userId2, bridgeListId) => `${userId2}/${bridgeListId}/bridgeList.json`,
    bridge: (userId2, bridgeListId, bridgeId) => `${userId2}/${bridgeListId}/${bridgeId}/bridge.json`
  };
  function getFullPath(fileName) {
    return `${DOC_BASE_PATH}${fileName}`;
  }
  async function getJsonData(fullPath) {
    try {
      formatAppLog("log", "at utils/readJson.js:20", "文件访问路径:", fullPath);
      const fileSystem = await new Promise((resolve, reject) => {
        plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, resolve, reject);
      });
      const fileEntry = await new Promise((resolve, reject) => {
        fileSystem.root.getFile(fullPath, { create: false }, resolve, reject);
      });
      const file = await new Promise((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });
      const jsonString = await new Promise((resolve, reject) => {
        const reader = new plus.io.FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      try {
        return JSON.parse(jsonString);
      } catch (parseError) {
        formatAppLog("error", "at utils/readJson.js:49", `JSON解析失败: ${fullPath}`, parseError);
        throw new Error("文件内容格式不正确");
      }
    } catch (error) {
      formatAppLog("error", "at utils/readJson.js:54", `文件操作失败: ${fullPath}`, error);
      throw error;
    }
  }
  function getBridge(userId2, bridgeListId, bridgeId) {
    const fileName = FILE_NAMING.bridge(userId2, bridgeListId, bridgeId);
    const fullPath = getFullPath(fileName);
    trackPath$1(fullPath);
    return getJsonData(fullPath);
  }
  const _sfc_main$b = {
    __name: "bridge-disease",
    setup(__props, { expose: __expose }) {
      __expose();
      const tabs = vue.ref([
        {
          name: "当前病害"
        },
        {
          name: "历史病害"
        },
        {
          name: "正面立照"
        },
        {
          name: "桥梁卡片"
        },
        {
          name: "结构信息"
        }
      ]);
      const activeTab = vue.ref(0);
      const switchTab = (index) => {
        activeTab.value = index;
      };
      const indicatorStyle = vue.computed(() => {
        const width = 100 / tabs.value.length;
        return {
          width: "50rpx",
          // 固定指示器宽度
          left: `calc(${width * activeTab.value}% + ${width / 2}% - 25px)`,
          // 将指示器居中
          transform: "none"
          // 移除transform
        };
      });
      const __returned__ = { tabs, activeTab, switchTab, indicatorStyle, currentDisease, historyDisease, bridgeArchive, structureInfo, frontPhoto, get getBridge() {
        return getBridge;
      }, get saveData() {
        return saveData$1;
      }, get trackPath() {
        return trackPath$1;
      }, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 顶部导航栏 "),
      vue.createElementVNode("view", { class: "tabs" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.tabs, (tab, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["tab-item", $setup.activeTab === index ? "active" : ""]),
              onClick: ($event) => $setup.switchTab(index)
            }, [
              vue.createElementVNode(
                "view",
                { class: "tab-item-text" },
                vue.toDisplayString(tab.name),
                1
                /* TEXT */
              )
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createCommentVNode(" 滑动指示器 "),
        vue.createElementVNode(
          "view",
          {
            class: "tab-indicator",
            style: vue.normalizeStyle($setup.indicatorStyle)
          },
          null,
          4
          /* STYLE */
        )
      ]),
      vue.createCommentVNode(" 内容区域 "),
      vue.createElementVNode("view", { class: "content" }, [
        vue.withDirectives(vue.createElementVNode(
          "view",
          null,
          [
            vue.createCommentVNode(" 当前病害内容 "),
            vue.createVNode($setup["currentDisease"])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.activeTab === 0]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          null,
          [
            vue.createCommentVNode(" 历史病害内容 "),
            vue.createVNode($setup["historyDisease"])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.activeTab === 1]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          null,
          [
            vue.createCommentVNode(" 正面立照内容 "),
            vue.createVNode($setup["frontPhoto"])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.activeTab === 2]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          null,
          [
            vue.createCommentVNode(" 桥梁档案内容 "),
            vue.createVNode($setup["bridgeArchive"])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.activeTab === 3]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "view",
          null,
          [
            vue.createCommentVNode(" 结构信息内容 "),
            vue.createVNode($setup["structureInfo"])
          ],
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.activeTab === 4]
        ])
      ])
    ]);
  }
  const PagesBridgeDiseaseBridgeDisease = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/bridge-disease/bridge-disease.vue"]]);
  const easycom = {
    autoscan: true,
    custom: {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
    }
  };
  const pages = [
    {
      path: "pages/LoginPage/LoginPage",
      style: {
        navigationBarTitleText: "湖北交投桥梁定检现场检测",
        navigationBarBackgroundColor: "#0F4687",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/login/login",
      style: {
        navigationBarTitleText: "",
        navigationStyle: "custom",
        "app-plus": {
          titleNView: {
            autoBackButton: false
          }
        }
      }
    },
    {
      path: "pages/home/home",
      style: {
        navigationBarTitleText: "湖北交投桥梁定检现场检测",
        navigationBarBackgroundColor: "#0F4687",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/message/message",
      style: {
        navigationBarTitleText: "消息管理",
        navigationBarBackgroundColor: "#3d655f",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/userinfo/userinfo",
      style: {
        navigationBarTitleText: "个人信息",
        navigationBarBackgroundColor: "#3d655f",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/setting/setting",
      style: {
        navigationBarTitleText: "设置",
        navigationBarBackgroundColor: "#3d655f",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/versionInfo/versionInfo",
      style: {
        navigationBarTitleText: "陕西交控定期检查",
        navigationBarBackgroundColor: "#3d655f",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/testWrite/testWrite",
      style: {
        navigationBarTitleText: ""
      }
    },
    {
      path: "pages/bridge/bridge",
      style: {
        navigationBarTitleText: "湖北交投桥梁定检现场检测",
        navigationBarBackgroundColor: "#0F4687",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/List/List",
      style: {
        navigationBarTitleText: "桥梁定期检查项目列表",
        navigationBarBackgroundColor: "#0F4687"
      }
    },
    {
      path: "pages/bridge-disease/bridge-disease",
      style: {
        navigationBarTitleText: "桥梁与病害信息",
        navigationBarBackgroundColor: "#0F4687",
        "app-plus": {
          titleNView: {}
        }
      }
    },
    {
      path: "pages/add-disease/add-disease",
      style: {
        navigationBarTitleText: "新增病害",
        navigationBarBackgroundColor: "#0F4687"
      }
    },
    {
      path: "pages/canvas/canvas",
      style: {
        navigationBarTitleText: ""
      }
    },
    {
      path: "pages/init_data_test/init_data_test",
      style: {
        navigationBarTitleText: ""
      }
    },
    {
      path: "pages/SystemSetting/SystemSetting",
      style: {
        navigationBarTitleText: "系统设置",
        navigationBarBackgroundColor: "#0F4687",
        "app-plus": {
          titleNView: {}
        }
      }
    }
  ];
  const globalStyle = {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "uni-app",
    navigationBarBackgroundColor: "#F8F8F8",
    backgroundColor: "#F8F8F8",
    "app-plus": {
      titleNView: {
        titleColor: "#ffffff"
      }
    }
  };
  const uniIdRouter = {};
  const e = {
    easycom,
    pages,
    globalStyle,
    uniIdRouter
  };
  var define_process_env_UNI_SECURE_NETWORK_CONFIG_default = [];
  function t$1(e2) {
    return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
  }
  function n(e2, t2, n2) {
    return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(null == t3 && n2.path);
    } }, n2.exports), n2.exports;
  }
  var s = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = n2 || function(e3, t3) {
      var n3 = Object.create || /* @__PURE__ */ function() {
        function e4() {
        }
        return function(t4) {
          var n4;
          return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
        };
      }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e4) {
        var t4 = n3(this);
        return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e4 = this.extend();
        return e4.init.apply(e4, arguments), e4;
      }, init: function() {
      }, mixIn: function(e4) {
        for (var t4 in e4)
          e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
        e4.hasOwnProperty("toString") && (this.toString = e4.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, o2 = r2.WordArray = i2.extend({ init: function(e4, n4) {
        e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
      }, toString: function(e4) {
        return (e4 || c2).stringify(this);
      }, concat: function(e4) {
        var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, r3 = e4.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var i3 = 0; i3 < r3; i3++) {
            var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
            t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
          }
        else
          for (i3 = 0; i3 < r3; i3 += 4)
            t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
        return this.sigBytes += r3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4.words = this.words.slice(0), e4;
      }, random: function(t4) {
        for (var n4, s3 = [], r3 = function(t5) {
          t5 = t5;
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return r4 /= 4294967296, (r4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
          };
        }, i3 = 0; i3 < t4; i3 += 4) {
          var a3 = r3(4294967296 * (n4 || e3.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new o2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new o2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(i3));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new o2.init(n4, t4);
      } }, h2 = a2.Utf8 = { stringify: function(e4) {
        try {
          return decodeURIComponent(escape(u2.stringify(e4)));
        } catch (e5) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e4) {
        return u2.parse(unescape(encodeURIComponent(e4)));
      } }, l2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
        this._data = new o2.init(), this._nDataBytes = 0;
      }, _append: function(e4) {
        "string" == typeof e4 && (e4 = h2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e3.min(4 * c3, r3);
        if (c3) {
          for (var h3 = 0; h3 < c3; h3 += i3)
            this._doProcessBlock(s3, h3);
          var l3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new o2.init(l3, u3);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._data = this._data.clone(), e4;
      }, _minBufferSize: 0 });
      r2.Hasher = l2.extend({ cfg: i2.extend(), init: function(e4) {
        this.cfg = this.cfg.extend(e4), this.reset();
      }, reset: function() {
        l2.reset.call(this), this._doReset();
      }, update: function(e4) {
        return this._append(e4), this._process(), this;
      }, finalize: function(e4) {
        return e4 && this._append(e4), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e4) {
        return function(t4, n4) {
          return new e4.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e4) {
        return function(t4, n4) {
          return new d2.HMAC.init(e4, n4).finalize(t4);
        };
      } });
      var d2 = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = s, i = (n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
      }();
      var c2 = o2.MD5 = i2.extend({ _doReset: function() {
        this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, r3 = e4[s3];
          e4[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
        }
        var i3 = this._hash.words, o3 = e4[t4 + 0], c3 = e4[t4 + 1], p2 = e4[t4 + 2], f2 = e4[t4 + 3], g2 = e4[t4 + 4], m2 = e4[t4 + 5], y2 = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], v2 = e4[t4 + 9], I2 = e4[t4 + 10], S2 = e4[t4 + 11], b2 = e4[t4 + 12], k2 = e4[t4 + 13], T2 = e4[t4 + 14], A2 = e4[t4 + 15], P2 = i3[0], C2 = i3[1], x2 = i3[2], O2 = i3[3];
        P2 = u2(P2, C2, x2, O2, o3, 7, a2[0]), O2 = u2(O2, P2, C2, x2, c3, 12, a2[1]), x2 = u2(x2, O2, P2, C2, p2, 17, a2[2]), C2 = u2(C2, x2, O2, P2, f2, 22, a2[3]), P2 = u2(P2, C2, x2, O2, g2, 7, a2[4]), O2 = u2(O2, P2, C2, x2, m2, 12, a2[5]), x2 = u2(x2, O2, P2, C2, y2, 17, a2[6]), C2 = u2(C2, x2, O2, P2, _2, 22, a2[7]), P2 = u2(P2, C2, x2, O2, w2, 7, a2[8]), O2 = u2(O2, P2, C2, x2, v2, 12, a2[9]), x2 = u2(x2, O2, P2, C2, I2, 17, a2[10]), C2 = u2(C2, x2, O2, P2, S2, 22, a2[11]), P2 = u2(P2, C2, x2, O2, b2, 7, a2[12]), O2 = u2(O2, P2, C2, x2, k2, 12, a2[13]), x2 = u2(x2, O2, P2, C2, T2, 17, a2[14]), P2 = h2(P2, C2 = u2(C2, x2, O2, P2, A2, 22, a2[15]), x2, O2, c3, 5, a2[16]), O2 = h2(O2, P2, C2, x2, y2, 9, a2[17]), x2 = h2(x2, O2, P2, C2, S2, 14, a2[18]), C2 = h2(C2, x2, O2, P2, o3, 20, a2[19]), P2 = h2(P2, C2, x2, O2, m2, 5, a2[20]), O2 = h2(O2, P2, C2, x2, I2, 9, a2[21]), x2 = h2(x2, O2, P2, C2, A2, 14, a2[22]), C2 = h2(C2, x2, O2, P2, g2, 20, a2[23]), P2 = h2(P2, C2, x2, O2, v2, 5, a2[24]), O2 = h2(O2, P2, C2, x2, T2, 9, a2[25]), x2 = h2(x2, O2, P2, C2, f2, 14, a2[26]), C2 = h2(C2, x2, O2, P2, w2, 20, a2[27]), P2 = h2(P2, C2, x2, O2, k2, 5, a2[28]), O2 = h2(O2, P2, C2, x2, p2, 9, a2[29]), x2 = h2(x2, O2, P2, C2, _2, 14, a2[30]), P2 = l2(P2, C2 = h2(C2, x2, O2, P2, b2, 20, a2[31]), x2, O2, m2, 4, a2[32]), O2 = l2(O2, P2, C2, x2, w2, 11, a2[33]), x2 = l2(x2, O2, P2, C2, S2, 16, a2[34]), C2 = l2(C2, x2, O2, P2, T2, 23, a2[35]), P2 = l2(P2, C2, x2, O2, c3, 4, a2[36]), O2 = l2(O2, P2, C2, x2, g2, 11, a2[37]), x2 = l2(x2, O2, P2, C2, _2, 16, a2[38]), C2 = l2(C2, x2, O2, P2, I2, 23, a2[39]), P2 = l2(P2, C2, x2, O2, k2, 4, a2[40]), O2 = l2(O2, P2, C2, x2, o3, 11, a2[41]), x2 = l2(x2, O2, P2, C2, f2, 16, a2[42]), C2 = l2(C2, x2, O2, P2, y2, 23, a2[43]), P2 = l2(P2, C2, x2, O2, v2, 4, a2[44]), O2 = l2(O2, P2, C2, x2, b2, 11, a2[45]), x2 = l2(x2, O2, P2, C2, A2, 16, a2[46]), P2 = d2(P2, C2 = l2(C2, x2, O2, P2, p2, 23, a2[47]), x2, O2, o3, 6, a2[48]), O2 = d2(O2, P2, C2, x2, _2, 10, a2[49]), x2 = d2(x2, O2, P2, C2, T2, 15, a2[50]), C2 = d2(C2, x2, O2, P2, m2, 21, a2[51]), P2 = d2(P2, C2, x2, O2, b2, 6, a2[52]), O2 = d2(O2, P2, C2, x2, f2, 10, a2[53]), x2 = d2(x2, O2, P2, C2, I2, 15, a2[54]), C2 = d2(C2, x2, O2, P2, c3, 21, a2[55]), P2 = d2(P2, C2, x2, O2, w2, 6, a2[56]), O2 = d2(O2, P2, C2, x2, A2, 10, a2[57]), x2 = d2(x2, O2, P2, C2, y2, 15, a2[58]), C2 = d2(C2, x2, O2, P2, k2, 21, a2[59]), P2 = d2(P2, C2, x2, O2, g2, 6, a2[60]), O2 = d2(O2, P2, C2, x2, S2, 10, a2[61]), x2 = d2(x2, O2, P2, C2, p2, 15, a2[62]), C2 = d2(C2, x2, O2, P2, v2, 21, a2[63]), i3[0] = i3[0] + P2 | 0, i3[1] = i3[1] + C2 | 0, i3[2] = i3[2] + x2 | 0, i3[3] = i3[3] + O2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
        var i3 = e3.floor(s3 / 4294967296), o3 = s3;
        n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var h3 = c3[u3];
          c3[u3] = 16711935 & (h3 << 8 | h3 >>> 24) | 4278255360 & (h3 << 24 | h3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      function u2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & n3 | ~t4 & s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function h2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & s3 | n3 & ~s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function l2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 ^ n3 ^ s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function d2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (n3 ^ (t4 | ~s3)) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, void function() {
      var e3 = n2, t3 = e3.lib.Base, s2 = e3.enc.Utf8;
      e3.algo.HMAC = t3.extend({ init: function(e4, t4) {
        e4 = this._hasher = new e4.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
        var n3 = e4.blockSize, r2 = 4 * n3;
        t4.sigBytes > r2 && (t4 = e4.finalize(t4)), t4.clamp();
        for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
          a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
        i2.sigBytes = o2.sigBytes = r2, this.reset();
      }, reset: function() {
        var e4 = this._hasher;
        e4.reset(), e4.update(this._iKey);
      }, update: function(e4) {
        return this._hasher.update(e4), this;
      }, finalize: function(e4) {
        var t4 = this._hasher, n3 = t4.finalize(e4);
        return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
      } });
    }());
  }), n(function(e2, t2) {
    e2.exports = r.HmacMD5;
  })), o = n(function(e2, t2) {
    e2.exports = r.enc.Utf8;
  }), a = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function() {
      var e3 = n2, t3 = e3.lib.WordArray;
      function s2(e4, n3, s3) {
        for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
          if (o2 % 4) {
            var a2 = s3[e4.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e4.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
            r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
          }
        return t3.create(r2, i2);
      }
      e3.enc.Base64 = { stringify: function(e4) {
        var t4 = e4.words, n3 = e4.sigBytes, s3 = this._map;
        e4.clamp();
        for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
          for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
            r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; r2.length % 4; )
            r2.push(c2);
        return r2.join("");
      }, parse: function(e4) {
        var t4 = e4.length, n3 = this._map, r2 = this._reverseMap;
        if (!r2) {
          r2 = this._reverseMap = [];
          for (var i2 = 0; i2 < n3.length; i2++)
            r2[n3.charCodeAt(i2)] = i2;
        }
        var o2 = n3.charAt(64);
        if (o2) {
          var a2 = e4.indexOf(o2);
          -1 !== a2 && (t4 = a2);
        }
        return s2(e4, t4, r2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const c = "FUNCTION", u = "OBJECT", h = "CLIENT_DB", l = "pending", d = "fulfilled", p = "rejected";
  function f(e2) {
    return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
  }
  function g(e2) {
    return "object" === f(e2);
  }
  function m(e2) {
    return "function" == typeof e2;
  }
  function y(e2) {
    return function() {
      try {
        return e2.apply(e2, arguments);
      } catch (e3) {
        console.error(e3);
      }
    };
  }
  const _ = "REJECTED", w = "NOT_PENDING";
  class v {
    constructor({ createPromise: e2, retryRule: t2 = _ } = {}) {
      this.createPromise = e2, this.status = null, this.promise = null, this.retryRule = t2;
    }
    get needRetry() {
      if (!this.status)
        return true;
      switch (this.retryRule) {
        case _:
          return this.status === p;
        case w:
          return this.status !== l;
      }
    }
    exec() {
      return this.needRetry ? (this.status = l, this.promise = this.createPromise().then((e2) => (this.status = d, Promise.resolve(e2)), (e2) => (this.status = p, Promise.reject(e2))), this.promise) : this.promise;
    }
  }
  function I(e2) {
    return e2 && "string" == typeof e2 ? JSON.parse(e2) : e2;
  }
  const S = true, b = "app", T = I(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), A = b, P = I(""), C = I("[]") || [];
  let O = "";
  try {
    O = "__UNI__B200628";
  } catch (e2) {
  }
  let E, L = {};
  function R(e2, t2 = {}) {
    var n2, s2;
    return n2 = L, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (L[e2] = t2), L[e2];
  }
  function U() {
    return E || (E = function() {
      if ("undefined" != typeof globalThis)
        return globalThis;
      if ("undefined" != typeof self)
        return self;
      if ("undefined" != typeof window)
        return window;
      function e2() {
        return this;
      }
      return void 0 !== e2() ? e2() : new Function("return this")();
    }(), E);
  }
  L = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {};
  const N = ["invoke", "success", "fail", "complete"], D = R("_globalUniCloudInterceptor");
  function M(e2, t2) {
    D[e2] || (D[e2] = {}), g(t2) && Object.keys(t2).forEach((n2) => {
      N.indexOf(n2) > -1 && function(e3, t3, n3) {
        let s2 = D[e3][t3];
        s2 || (s2 = D[e3][t3] = []), -1 === s2.indexOf(n3) && m(n3) && s2.push(n3);
      }(e2, n2, t2[n2]);
    });
  }
  function q(e2, t2) {
    D[e2] || (D[e2] = {}), g(t2) ? Object.keys(t2).forEach((n2) => {
      N.indexOf(n2) > -1 && function(e3, t3, n3) {
        const s2 = D[e3][t3];
        if (!s2)
          return;
        const r2 = s2.indexOf(n3);
        r2 > -1 && s2.splice(r2, 1);
      }(e2, n2, t2[n2]);
    }) : delete D[e2];
  }
  function K(e2, t2) {
    return e2 && 0 !== e2.length ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function F(e2, t2) {
    return D[e2] && D[e2][t2] || [];
  }
  function j(e2) {
    M("callObject", e2);
  }
  const $ = R("_globalUniCloudListener"), B = "response", W = "needLogin", H = "refreshToken", J = "clientdb", z = "cloudfunction", V = "cloudobject";
  function G(e2) {
    return $[e2] || ($[e2] = []), $[e2];
  }
  function Y(e2, t2) {
    const n2 = G(e2);
    n2.includes(t2) || n2.push(t2);
  }
  function Q(e2, t2) {
    const n2 = G(e2), s2 = n2.indexOf(t2);
    -1 !== s2 && n2.splice(s2, 1);
  }
  function X(e2, t2) {
    const n2 = G(e2);
    for (let e3 = 0; e3 < n2.length; e3++) {
      (0, n2[e3])(t2);
    }
  }
  let Z, ee = false;
  function te() {
    return Z || (Z = new Promise((e2) => {
      ee && e2(), function t2() {
        if ("function" == typeof getCurrentPages) {
          const t3 = getCurrentPages();
          t3 && t3[0] && (ee = true, e2());
        }
        ee || setTimeout(() => {
          t2();
        }, 30);
      }();
    }), Z);
  }
  function ne(e2) {
    const t2 = {};
    for (const n2 in e2) {
      const s2 = e2[n2];
      m(s2) && (t2[n2] = y(s2));
    }
    return t2;
  }
  class se extends Error {
    constructor(e2) {
      super(e2.message), this.errMsg = e2.message || e2.errMsg || "unknown system error", this.code = this.errCode = e2.code || e2.errCode || "SYSTEM_ERROR", this.errSubject = this.subject = e2.subject || e2.errSubject, this.cause = e2.cause, this.requestId = e2.requestId;
    }
    toJson(e2 = 0) {
      if (!(e2 >= 10))
        return e2++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e2) : this.cause };
    }
  }
  var re = { request: (e2) => uni.request(e2), uploadFile: (e2) => uni.uploadFile(e2), setStorageSync: (e2, t2) => uni.setStorageSync(e2, t2), getStorageSync: (e2) => uni.getStorageSync(e2), removeStorageSync: (e2) => uni.removeStorageSync(e2), clearStorageSync: () => uni.clearStorageSync(), connectSocket: (e2) => uni.connectSocket(e2) };
  function ie(e2) {
    return e2 && ie(e2.__v_raw) || e2;
  }
  function oe() {
    return { token: re.getStorageSync("uni_id_token") || re.getStorageSync("uniIdToken"), tokenExpired: re.getStorageSync("uni_id_token_expired") };
  }
  function ae({ token: e2, tokenExpired: t2 } = {}) {
    e2 && re.setStorageSync("uni_id_token", e2), t2 && re.setStorageSync("uni_id_token_expired", t2);
  }
  let ce, ue;
  function he() {
    return ce || (ce = uni.getSystemInfoSync()), ce;
  }
  function le() {
    let e2, t2;
    try {
      if (uni.getLaunchOptionsSync) {
        if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
          return;
        const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
        e2 = s2, t2 = n2;
      }
    } catch (e3) {
    }
    return { channel: e2, scene: t2 };
  }
  let de = {};
  function pe() {
    const e2 = uni.getLocale && uni.getLocale() || "en";
    if (ue)
      return { ...de, ...ue, locale: e2, LOCALE: e2 };
    const t2 = he(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["appId", "appLanguage", "appName", "appVersion", "appVersionCode", "appWgtVersion", "browserName", "browserVersion", "deviceBrand", "deviceId", "deviceModel", "deviceType", "osName", "osVersion", "romName", "romVersion", "ua", "hostName", "hostVersion", "uniPlatform", "uniRuntimeVersion", "uniRuntimeVersionCode", "uniCompilerVersion", "uniCompilerVersionCode"];
    for (const e3 in t2)
      Object.hasOwnProperty.call(t2, e3) && -1 === o2.indexOf(e3) && delete t2[e3];
    return ue = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...le(), ...t2 }, { ...de, ...ue, locale: e2, LOCALE: e2 };
  }
  var fe = { sign: function(e2, t2) {
    let n2 = "";
    return Object.keys(e2).sort().forEach(function(t3) {
      e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
    }), n2 = n2.slice(1), i(n2, t2).toString();
  }, wrappedRequest: function(e2, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e2, { complete(e3) {
        e3 || (e3 = {});
        const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
        if (!e3.statusCode || e3.statusCode >= 400) {
          const n3 = e3.data && e3.data.error && e3.data.error.code || "SYS_ERR", r3 = e3.data && e3.data.error && e3.data.error.message || e3.errMsg || "request:fail";
          return s2(new se({ code: n3, message: r3, requestId: t3 }));
        }
        const r2 = e3.data;
        if (r2.error)
          return s2(new se({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
        r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
      } }));
    });
  }, toBase64: function(e2) {
    return a.stringify(o.parse(e2));
  } };
  var ge = class {
    constructor(e2) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), this.config = Object.assign({}, { endpoint: 0 === e2.spaceId.indexOf("mp-") ? "https://api.next.bspapp.com" : "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = re, this._getAccessTokenPromiseHub = new v({ createPromise: () => this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e3) => {
        if (!e3.result || !e3.result.accessToken)
          throw new se({ code: "AUTH_FAILED", message: "获取accessToken失败" });
        this.setAccessToken(e3.result.accessToken);
      }), retryRule: w });
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e2) {
      this.accessToken = e2;
    }
    requestWrapped(e2) {
      return fe.wrappedRequest(e2, this.adapter.request);
    }
    requestAuth(e2) {
      return this.requestWrapped(e2);
    }
    request(e2, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
        !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e3();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e2);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e2);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e2) {
      const t2 = Object.assign({}, e2);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = fe.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e2, t2) {
      const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = fe.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      return this._getAccessTokenPromiseHub.exec();
    }
    async authorize() {
      await this.getAccessToken();
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request({ ...this.setupRequest(t2), timeout: e2.timeout });
    }
    getOSSUploadOptionsFromPath(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
      return new Promise((o2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
          e3 && e3.statusCode < 400 ? o2(e3) : a2(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          a2(new se({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
          i2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", cloudPathAsRealPath: s2 = false, onUploadProgress: r2, config: i2 }) {
      if ("string" !== f(t2))
        throw new se({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new se({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new se({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const o2 = i2 && i2.envType || this.config.envType;
      if (s2 && ("/" !== t2[0] && (t2 = "/" + t2), t2.indexOf("\\") > -1))
        throw new se({ code: "INVALID_PARAM", message: "使用cloudPath作为路径时，cloudPath不可包含“\\”" });
      const a2 = (await this.getOSSUploadOptionsFromPath({ env: o2, filename: s2 ? t2.split("/").pop() : t2, fileId: s2 ? t2 : void 0 })).result, c2 = "https://" + a2.cdnDomain + "/" + a2.ossPath, { securityToken: u2, accessKeyId: h2, signature: l2, host: d2, ossPath: p2, id: g2, policy: m2, ossCallbackUrl: y2 } = a2, _2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: h2, Signature: l2, host: d2, id: g2, key: p2, policy: m2, success_action_status: 200 };
      if (u2 && (_2["x-oss-security-token"] = u2), y2) {
        const e3 = JSON.stringify({ callbackUrl: y2, callbackBody: JSON.stringify({ fileId: g2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        _2.callback = fe.toBase64(e3);
      }
      const w2 = { url: "https://" + a2.host, formData: _2, fileName: "file", name: "file", filePath: e2, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, w2, { onUploadProgress: r2 })), y2)
        return { success: true, filePath: e2, fileID: c2 };
      if ((await this.reportOSSUpload({ id: g2 })).success)
        return { success: true, filePath: e2, fileID: c2 };
      throw new se({ code: "UPLOAD_FAILED", message: "文件上传失败" });
    }
    getTempFileURL({ fileList: e2 } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e2) && 0 !== e2.length || n2(new se({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" })), t2({ fileList: e2.map((e3) => ({ fileID: e3, tempFileURL: e3 })) });
      });
    }
    async getFileInfo({ fileList: e2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new se({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e2.map((e3) => e3.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var me = { init(e2) {
    const t2 = new ge(e2), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const ye = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
  var _e;
  !function(e2) {
    e2.local = "local", e2.none = "none", e2.session = "session";
  }(_e || (_e = {}));
  var we = function() {
  }, ve = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [], c2 = [];
      !function() {
        function t4(t5) {
          for (var n4 = e3.sqrt(t5), s4 = 2; s4 <= n4; s4++)
            if (!(t5 % s4))
              return false;
          return true;
        }
        function n3(e4) {
          return 4294967296 * (e4 - (0 | e4)) | 0;
        }
        for (var s3 = 2, r3 = 0; r3 < 64; )
          t4(s3) && (r3 < 8 && (a2[r3] = n3(e3.pow(s3, 0.5))), c2[r3] = n3(e3.pow(s3, 1 / 3)), r3++), s3++;
      }();
      var u2 = [], h2 = o2.SHA256 = i2.extend({ _doReset: function() {
        this._hash = new r2.init(a2.slice(0));
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = this._hash.words, s3 = n3[0], r3 = n3[1], i3 = n3[2], o3 = n3[3], a3 = n3[4], h3 = n3[5], l2 = n3[6], d2 = n3[7], p2 = 0; p2 < 64; p2++) {
          if (p2 < 16)
            u2[p2] = 0 | e4[t4 + p2];
          else {
            var f2 = u2[p2 - 15], g2 = (f2 << 25 | f2 >>> 7) ^ (f2 << 14 | f2 >>> 18) ^ f2 >>> 3, m2 = u2[p2 - 2], y2 = (m2 << 15 | m2 >>> 17) ^ (m2 << 13 | m2 >>> 19) ^ m2 >>> 10;
            u2[p2] = g2 + u2[p2 - 7] + y2 + u2[p2 - 16];
          }
          var _2 = s3 & r3 ^ s3 & i3 ^ r3 & i3, w2 = (s3 << 30 | s3 >>> 2) ^ (s3 << 19 | s3 >>> 13) ^ (s3 << 10 | s3 >>> 22), v2 = d2 + ((a3 << 26 | a3 >>> 6) ^ (a3 << 21 | a3 >>> 11) ^ (a3 << 7 | a3 >>> 25)) + (a3 & h3 ^ ~a3 & l2) + c2[p2] + u2[p2];
          d2 = l2, l2 = h3, h3 = a3, a3 = o3 + v2 | 0, o3 = i3, i3 = r3, r3 = s3, s3 = v2 + (w2 + _2) | 0;
        }
        n3[0] = n3[0] + s3 | 0, n3[1] = n3[1] + r3 | 0, n3[2] = n3[2] + i3 | 0, n3[3] = n3[3] + o3 | 0, n3[4] = n3[4] + a3 | 0, n3[5] = n3[5] + h3 | 0, n3[6] = n3[6] + l2 | 0, n3[7] = n3[7] + d2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        return n3[r3 >>> 5] |= 128 << 24 - r3 % 32, n3[14 + (r3 + 64 >>> 9 << 4)] = e3.floor(s3 / 4294967296), n3[15 + (r3 + 64 >>> 9 << 4)] = s3, t4.sigBytes = 4 * n3.length, this._process(), this._hash;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      t3.SHA256 = i2._createHelper(h2), t3.HmacSHA256 = i2._createHmacHelper(h2);
    }(Math), n2.SHA256);
  }), Ie = ve, Se = n(function(e2, t2) {
    e2.exports = r.HmacSHA256;
  });
  const be = () => {
    let e2;
    if (!Promise) {
      e2 = () => {
      }, e2.promise = {};
      const t3 = () => {
        throw new se({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
    }
    const t2 = new Promise((t3, n2) => {
      e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
    });
    return e2.promise = t2, e2;
  };
  function ke(e2) {
    return void 0 === e2;
  }
  function Te(e2) {
    return "[object Null]" === Object.prototype.toString.call(e2);
  }
  function Ae(e2 = "") {
    return e2.replace(/([\s\S]+)\s+(请前往云开发AI小助手查看问题：.*)/, "$1");
  }
  function Pe(e2 = 32) {
    const t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n2 = t2.length;
    let s2 = "";
    for (let r2 = 0; r2 < e2; r2++)
      s2 += t2.charAt(Math.floor(Math.random() * n2));
    return s2;
  }
  var Ce;
  function xe(e2) {
    const t2 = (n2 = e2, "[object Array]" === Object.prototype.toString.call(n2) ? e2 : [e2]);
    var n2;
    for (const e3 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e2) {
    e2.WEB = "web", e2.WX_MP = "wx_mp";
  }(Ce || (Ce = {}));
  const Oe = { adapter: null, runtime: void 0 }, Ee = ["anonymousUuidKey"];
  class Le extends we {
    constructor() {
      super(), Oe.adapter.root.tcbObject || (Oe.adapter.root.tcbObject = {});
    }
    setItem(e2, t2) {
      Oe.adapter.root.tcbObject[e2] = t2;
    }
    getItem(e2) {
      return Oe.adapter.root.tcbObject[e2];
    }
    removeItem(e2) {
      delete Oe.adapter.root.tcbObject[e2];
    }
    clear() {
      delete Oe.adapter.root.tcbObject;
    }
  }
  function Re(e2, t2) {
    switch (e2) {
      case "local":
        return t2.localStorage || new Le();
      case "none":
        return new Le();
      default:
        return t2.sessionStorage || new Le();
    }
  }
  class Ue {
    constructor(e2) {
      if (!this._storage) {
        this._persistence = Oe.adapter.primaryStorage || e2.persistence, this._storage = Re(this._persistence, Oe.adapter);
        const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, r2 = `anonymous_uuid_${e2.env}`, i2 = `login_type_${e2.env}`, o2 = "device_id", a2 = `token_type_${e2.env}`, c2 = `user_info_${e2.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: c2, deviceIdKey: o2, tokenTypeKey: a2 };
      }
    }
    updatePersistence(e2) {
      if (e2 === this._persistence)
        return;
      const t2 = "local" === this._persistence;
      this._persistence = e2;
      const n2 = Re(e2, Oe.adapter);
      for (const e3 in this.keys) {
        const s2 = this.keys[e3];
        if (t2 && Ee.includes(e3))
          continue;
        const r2 = this._storage.getItem(s2);
        ke(r2) || Te(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e2, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e2, r2);
      } catch (e3) {
        throw e3;
      }
    }
    getStore(e2, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e3) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e2);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e2) {
      this._storage.removeItem(e2);
    }
  }
  const Ne = {}, De = {};
  function Me(e2) {
    return Ne[e2];
  }
  class qe {
    constructor(e2, t2) {
      this.data = t2 || null, this.name = e2;
    }
  }
  class Ke extends qe {
    constructor(e2, t2) {
      super("error", { error: e2, data: t2 }), this.error = e2;
    }
  }
  const Fe = new class {
    constructor() {
      this._listeners = {};
    }
    on(e2, t2) {
      return function(e3, t3, n2) {
        n2[e3] = n2[e3] || [], n2[e3].push(t3);
      }(e2, t2, this._listeners), this;
    }
    off(e2, t2) {
      return function(e3, t3, n2) {
        if (n2 && n2[e3]) {
          const s2 = n2[e3].indexOf(t3);
          -1 !== s2 && n2[e3].splice(s2, 1);
        }
      }(e2, t2, this._listeners), this;
    }
    fire(e2, t2) {
      if (e2 instanceof Ke)
        return console.error(e2.error), this;
      const n2 = "string" == typeof e2 ? new qe(e2, t2 || {}) : e2;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e3)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e2) {
      return this._listeners[e2] && this._listeners[e2].length > 0;
    }
  }();
  function je(e2, t2) {
    Fe.on(e2, t2);
  }
  function $e(e2, t2 = {}) {
    Fe.fire(e2, t2);
  }
  function Be(e2, t2) {
    Fe.off(e2, t2);
  }
  const We = "loginStateChanged", He = "loginStateExpire", Je = "loginTypeChanged", ze = "anonymousConverted", Ve = "refreshAccessToken";
  var Ge;
  !function(e2) {
    e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
  }(Ge || (Ge = {}));
  class Ye {
    constructor() {
      this._fnPromiseMap = /* @__PURE__ */ new Map();
    }
    async run(e2, t2) {
      let n2 = this._fnPromiseMap.get(e2);
      return n2 || (n2 = new Promise(async (n3, s2) => {
        try {
          await this._runIdlePromise();
          const s3 = t2();
          n3(await s3);
        } catch (e3) {
          s2(e3);
        } finally {
          this._fnPromiseMap.delete(e2);
        }
      }), this._fnPromiseMap.set(e2, n2)), n2;
    }
    _runIdlePromise() {
      return Promise.resolve();
    }
  }
  class Qe {
    constructor(e2) {
      this._singlePromise = new Ye(), this._cache = Me(e2.env), this._baseURL = `https://${e2.env}.ap-shanghai.tcb-api.tencentcloudapi.com`, this._reqClass = new Oe.adapter.reqClass({ timeout: e2.timeout, timeoutMsg: `请求在${e2.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] });
    }
    _getDeviceId() {
      if (this._deviceID)
        return this._deviceID;
      const { deviceIdKey: e2 } = this._cache.keys;
      let t2 = this._cache.getStore(e2);
      return "string" == typeof t2 && t2.length >= 16 && t2.length <= 48 || (t2 = Pe(), this._cache.setStore(e2, t2)), this._deviceID = t2, t2;
    }
    async _request(e2, t2, n2 = {}) {
      const s2 = { "x-request-id": Pe(), "x-device-id": this._getDeviceId() };
      if (n2.withAccessToken) {
        const { tokenTypeKey: e3 } = this._cache.keys, t3 = await this.getAccessToken(), n3 = this._cache.getStore(e3);
        s2.authorization = `${n3} ${t3}`;
      }
      return this._reqClass["get" === n2.method ? "get" : "post"]({ url: `${this._baseURL}${e2}`, data: t2, headers: s2 });
    }
    async _fetchAccessToken() {
      const { loginTypeKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2, tokenTypeKey: s2 } = this._cache.keys, r2 = this._cache.getStore(e2);
      if (r2 && r2 !== Ge.ANONYMOUS)
        throw new se({ code: "INVALID_OPERATION", message: "非匿名登录不支持刷新 access token" });
      const i2 = await this._singlePromise.run("fetchAccessToken", async () => (await this._request("/auth/v1/signin/anonymously", {}, { method: "post" })).data), { access_token: o2, expires_in: a2, token_type: c2 } = i2;
      return this._cache.setStore(s2, c2), this._cache.setStore(t2, o2), this._cache.setStore(n2, Date.now() + 1e3 * a2), o2;
    }
    isAccessTokenExpired(e2, t2) {
      let n2 = true;
      return e2 && t2 && (n2 = t2 < Date.now()), n2;
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this.isAccessTokenExpired(n2, s2) ? this._fetchAccessToken() : n2;
    }
    async refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, loginTypeKey: n2 } = this._cache.keys;
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.setStore(n2, Ge.ANONYMOUS), this.getAccessToken();
    }
    async getUserInfo() {
      return this._singlePromise.run("getUserInfo", async () => (await this._request("/auth/v1/user/me", {}, { withAccessToken: true, method: "get" })).data);
    }
  }
  const Xe = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Ze = { "X-SDK-Version": "1.3.5" };
  function et(e2, t2, n2) {
    const s2 = e2[t2];
    e2[t2] = function(t3) {
      const r2 = {}, i2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: o3 } = n3.call(e2, t3);
        Object.assign(r2, s3), Object.assign(i2, o3);
      });
      const o2 = t3.data;
      return o2 && (() => {
        var e3;
        if (e3 = o2, "[object FormData]" !== Object.prototype.toString.call(e3))
          t3.data = { ...o2, ...r2 };
        else
          for (const e4 in r2)
            o2.append(e4, r2[e4]);
      })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e2, t3);
    };
  }
  function tt() {
    const e2 = Math.random().toString(16).slice(2);
    return { data: { seqId: e2 }, headers: { ...Ze, "x-seqid": e2 } };
  }
  class nt {
    constructor(e2 = {}) {
      var t2;
      this.config = e2, this._reqClass = new Oe.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `请求在${this.config.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] }), this._cache = Me(this.config.env), this._localCache = (t2 = this.config.env, De[t2]), this.oauth = new Qe(this.config), et(this._reqClass, "post", [tt]), et(this._reqClass, "upload", [tt]), et(this._reqClass, "download", [tt]);
    }
    async post(e2) {
      return await this._reqClass.post(e2);
    }
    async upload(e2) {
      return await this._reqClass.upload(e2);
    }
    async download(e2) {
      return await this._reqClass.download(e2);
    }
    async refreshAccessToken() {
      let e2, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e2 = await this._refreshAccessTokenPromise;
      } catch (e3) {
        t2 = e3;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e2;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
      this._cache.removeStore(e2), this._cache.removeStore(t2);
      let i2 = this._cache.getStore(n2);
      if (!i2)
        throw new se({ message: "未登录CloudBase" });
      const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
      if (a2.data.code) {
        const { code: e3 } = a2.data;
        if ("SIGN_PARAM_INVALID" === e3 || "REFRESH_TOKEN_EXPIRED" === e3 || "INVALID_REFRESH_TOKEN" === e3) {
          if (this._cache.getStore(s2) === Ge.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e3) {
            const e4 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          $e(He), this._cache.removeStore(n2);
        }
        throw new se({ code: a2.data.code, message: `刷新access token失败：${a2.data.code}` });
      }
      if (a2.data.access_token)
        return $e(Ve), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new se({ message: "refresh token不存在，登录状态异常" });
      let s2 = this._cache.getStore(e2), r2 = this._cache.getStore(t2), i2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
    }
    async request(e2, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let r2 = "application/x-www-form-urlencoded";
      const i2 = { action: e2, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
      let o2;
      if (-1 === Xe.indexOf(e2) && (this._cache.keys, i2.access_token = await this.oauth.getAccessToken()), "storage.uploadFile" === e2) {
        o2 = new FormData();
        for (let e3 in o2)
          o2.hasOwnProperty(e3) && void 0 !== o2[e3] && o2.append(e3, i2[e3]);
        r2 = "multipart/form-data";
      } else {
        r2 = "application/json", o2 = {};
        for (let e3 in i2)
          void 0 !== i2[e3] && (o2[e3] = i2[e3]);
      }
      let a2 = { headers: { "content-type": r2 } };
      n2 && n2.timeout && (a2.timeout = n2.timeout), n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: h2, search: l2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), h2 && (d2 = { ...h2, ...d2 });
      let p2 = function(e3, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let r3 = "";
        for (let e4 in n3)
          "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e4}=${encodeURIComponent(n3[e4])}`;
        return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e3}${t3}`;
      }(ye, "//tcb-api.tencentcloudapi.com/web", d2);
      l2 && (p2 += l2);
      const f2 = await this.post({ url: p2, data: o2, ...a2 }), g2 = f2.header && f2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(f2.status) && 200 !== Number(f2.statusCode) || !f2.data)
        throw new se({ code: "NETWORK_ERROR", message: "network request error" });
      return f2;
    }
    async send(e2, t2 = {}, n2 = {}) {
      const s2 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
      if (("ACCESS_TOKEN_DISABLED" === s2.data.code || "ACCESS_TOKEN_EXPIRED" === s2.data.code) && -1 === Xe.indexOf(e2)) {
        await this.oauth.refreshAccessToken();
        const s3 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
        if (s3.data.code)
          throw new se({ code: s3.data.code, message: Ae(s3.data.message) });
        return s3.data;
      }
      if (s2.data.code)
        throw new se({ code: s2.data.code, message: Ae(s2.data.message) });
      return s2.data;
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
  }
  const st = {};
  function rt(e2) {
    return st[e2];
  }
  class it {
    constructor(e2) {
      this.config = e2, this._cache = Me(e2.env), this._request = rt(e2.env);
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
    setAccessToken(e2, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e2 } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e2), e2;
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2);
    }
  }
  class ot {
    constructor(e2) {
      if (!e2)
        throw new se({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e2, this._cache = Me(this._envId), this._request = rt(this._envId), this.setUserInfo();
    }
    linkWithTicket(e2) {
      if ("string" != typeof e2)
        throw new se({ code: "PARAM_ERROR", message: "ticket must be string" });
      return this._request.send("auth.linkWithTicket", { ticket: e2 });
    }
    linkWithRedirect(e2) {
      e2.signInWithRedirect();
    }
    updatePassword(e2, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
    }
    updateEmail(e2) {
      return this._request.send("auth.updateEmail", { newEmail: e2 });
    }
    updateUsername(e2) {
      if ("string" != typeof e2)
        throw new se({ code: "PARAM_ERROR", message: "username must be a string" });
      return this._request.send("auth.updateUsername", { username: e2 });
    }
    async getLinkedUidList() {
      const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e2;
      return n2.forEach((e3) => {
        e3.wxOpenId && e3.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e2) {
      return this._request.send("auth.setPrimaryUid", { uid: e2 });
    }
    unlink(e2) {
      return this._request.send("auth.unlink", { platform: e2 });
    }
    async update(e2) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const e2 = await this._request.oauth.getUserInfo();
      return this.setLocalUserInfo(e2), e2;
    }
    setUserInfo() {
      const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
        this[e3] = t2[e3];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2), this.setUserInfo();
    }
  }
  class at {
    constructor(e2) {
      if (!e2)
        throw new se({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = Me(e2);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
      this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new ot(e2);
    }
    get isAnonymousAuth() {
      return this.loginType === Ge.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === Ge.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === Ge.WECHAT || this.loginType === Ge.WECHAT_OPEN || this.loginType === Ge.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class ct extends it {
    async signIn() {
      this._cache.updatePersistence("local"), await this._request.oauth.getAccessToken(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.ANONYMOUS, persistence: "local" });
      const e2 = new at(this.config.env);
      return await e2.user.refresh(), e2;
    }
    async linkAndRetrieveDataWithTicket(e2) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e2 });
      if (i2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), $e(ze, { env: this.config.env }), $e(Je, { loginType: Ge.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
      throw new se({ message: "匿名转化失败" });
    }
    _setAnonymousUUID(e2) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, Ge.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class ut extends it {
    async signIn(e2) {
      if ("string" != typeof e2)
        throw new se({ code: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new at(this.config.env);
      throw new se({ message: "自定义登录失败" });
    }
  }
  class ht extends it {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new se({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.EMAIL, persistence: this.config.persistence }), new at(this.config.env);
      throw s2.code ? new se({ code: s2.code, message: `邮箱登录失败: ${s2.message}` }) : new se({ message: "邮箱登录失败" });
    }
    async activate(e2) {
      return this._request.send("auth.activateEndUserMail", { token: e2 });
    }
    async resetPasswordWithToken(e2, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
    }
  }
  class lt extends it {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new se({ code: "PARAM_ERROR", message: "username must be a string" });
      "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Ge.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), $e(We), $e(Je, { env: this.config.env, loginType: Ge.USERNAME, persistence: this.config.persistence }), new at(this.config.env);
      throw s2.code ? new se({ code: s2.code, message: `用户名密码登录失败: ${s2.message}` }) : new se({ message: "用户名密码登录失败" });
    }
  }
  class dt {
    constructor(e2) {
      this.config = e2, this._cache = Me(e2.env), this._request = rt(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), je(Je, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e2 = this.hasLoginState();
      return e2 && e2.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new ct(this.config);
    }
    customAuthProvider() {
      return new ut(this.config);
    }
    emailAuthProvider() {
      return new ht(this.config);
    }
    usernameAuthProvider() {
      return new lt(this.config);
    }
    async signInAnonymously() {
      return new ct(this.config).signIn();
    }
    async signInWithEmailAndPassword(e2, t2) {
      return new ht(this.config).signIn(e2, t2);
    }
    signInWithUsernameAndPassword(e2, t2) {
      return new lt(this.config).signIn(e2, t2);
    }
    async linkAndRetrieveDataWithTicket(e2) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new ct(this.config)), je(ze, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
    }
    async signOut() {
      if (this.loginType === Ge.ANONYMOUS)
        throw new se({ message: "匿名用户不支持登出操作" });
      const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
      if (!s2)
        return;
      const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), $e(We), $e(Je, { env: this.config.env, loginType: Ge.NULL, persistence: this.config.persistence }), r2;
    }
    async signUpWithEmailAndPassword(e2, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
    }
    async sendPasswordResetEmail(e2) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
    }
    onLoginStateChanged(e2) {
      je(We, () => {
        const t3 = this.hasLoginState();
        e2.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    }
    onLoginStateExpired(e2) {
      je(He, e2.bind(this));
    }
    onAccessTokenRefreshed(e2) {
      je(Ve, e2.bind(this));
    }
    onAnonymousConverted(e2) {
      je(ze, e2.bind(this));
    }
    onLoginTypeChanged(e2) {
      je(Je, () => {
        const t2 = this.hasLoginState();
        e2.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this._request.oauth.isAccessTokenExpired(n2, s2) ? null : new at(this.config.env);
    }
    async isUsernameRegistered(e2) {
      if ("string" != typeof e2)
        throw new se({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e2) {
      return new ut(this.config).signIn(e2);
    }
    shouldRefreshAccessToken(e2) {
      this._request._shouldRefreshAccessTokenHook = e2.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : { ...e2.data, requestId: e2.seqId });
    }
    getAuthHeader() {
      const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e2) {
      const { env: t2 } = e2.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e2) {
      const { loginType: t2, persistence: n2, env: s2 } = e2.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const pt = function(e2, t2) {
    t2 = t2 || be();
    const n2 = rt(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: h2, cosFileId: l2 }, requestId: d2 } = e3, p2 = { key: s2, signature: c2, "x-cos-meta-fileid": l2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: p2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e4) => {
        201 === e4.statusCode ? t2(null, { fileID: h2, requestId: d2 }) : t2(new se({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
      }).catch((e4) => {
        t2(e4);
      });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, ft = function(e2, t2) {
    t2 = t2 || be();
    const n2 = rt(this.config.env), { cloudPath: s2 } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      t2(null, e3);
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, gt = function({ fileList: e2 }, t2) {
    if (t2 = t2 || be(), !e2 || !Array.isArray(e2))
      return { code: "INVALID_PARAM", message: "fileList必须是非空的数组" };
    for (let t3 of e2)
      if (!t3 || "string" != typeof t3)
        return { code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" };
    const n2 = { fileid_list: e2 };
    return rt(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, mt = function({ fileList: e2 }, t2) {
    t2 = t2 || be(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList必须是非空的数组" });
    let n2 = [];
    for (let s3 of e2)
      "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是包含fileID和maxAge的对象" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是字符串" });
    const s2 = { file_list: n2 };
    return rt(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, yt = async function({ fileID: e2 }, t2) {
    const n2 = (await mt.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
    if ("SUCCESS" !== n2.code)
      return t2 ? t2(n2) : new Promise((e3) => {
        e3(n2);
      });
    const s2 = rt(this.config.env);
    let r2 = n2.download_url;
    if (r2 = encodeURI(r2), !t2)
      return s2.download({ url: r2 });
    t2(await s2.download({ url: r2 }));
  }, _t = function({ name: e2, data: t2, query: n2, parse: s2, search: r2, timeout: i2 }, o2) {
    const a2 = o2 || be();
    let c2;
    try {
      c2 = t2 ? JSON.stringify(t2) : "";
    } catch (e3) {
      return Promise.reject(e3);
    }
    if (!e2)
      return Promise.reject(new se({ code: "PARAM_ERROR", message: "函数名不能为空" }));
    const u2 = { inQuery: n2, parse: s2, search: r2, function_name: e2, request_data: c2 };
    return rt(this.config.env).send("functions.invokeFunction", u2, { timeout: i2 }).then((e3) => {
      if (e3.code)
        a2(null, e3);
      else {
        let t3 = e3.data.response_data;
        if (s2)
          a2(null, { result: t3, requestId: e3.requestId });
        else
          try {
            t3 = JSON.parse(e3.data.response_data), a2(null, { result: t3, requestId: e3.requestId });
          } catch (e4) {
            a2(new se({ message: "response data must be json" }));
          }
      }
      return a2.promise;
    }).catch((e3) => {
      a2(e3);
    }), a2.promise;
  }, wt = { timeout: 15e3, persistence: "session" }, vt = {};
  class It {
    constructor(e2) {
      this.config = e2 || this.config, this.authObj = void 0;
    }
    init(e2) {
      switch (Oe.adapter || (this.requestClient = new Oe.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `请求在${(e2.timeout || 5e3) / 1e3}s内未完成，已中断` })), this.config = { ...wt, ...e2 }, true) {
        case this.config.timeout > 6e5:
          console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = 6e5;
          break;
        case this.config.timeout < 100:
          console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100;
      }
      return new It(this.config);
    }
    auth({ persistence: e2 } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e2 || Oe.adapter.primaryStorage || wt.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
        const { env: t3 } = e3;
        Ne[t3] = new Ue(e3), De[t3] = new Ue({ ...e3, persistence: "local" });
      }(this.config), n2 = this.config, st[n2.env] = new nt(n2), this.authObj = new dt(this.config), this.authObj;
    }
    on(e2, t2) {
      return je.apply(this, [e2, t2]);
    }
    off(e2, t2) {
      return Be.apply(this, [e2, t2]);
    }
    callFunction(e2, t2) {
      return _t.apply(this, [e2, t2]);
    }
    deleteFile(e2, t2) {
      return gt.apply(this, [e2, t2]);
    }
    getTempFileURL(e2, t2) {
      return mt.apply(this, [e2, t2]);
    }
    downloadFile(e2, t2) {
      return yt.apply(this, [e2, t2]);
    }
    uploadFile(e2, t2) {
      return pt.apply(this, [e2, t2]);
    }
    getUploadMetadata(e2, t2) {
      return ft.apply(this, [e2, t2]);
    }
    registerExtension(e2) {
      vt[e2.name] = e2;
    }
    async invokeExtension(e2, t2) {
      const n2 = vt[e2];
      if (!n2)
        throw new se({ message: `扩展${e2} 必须先注册` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e2) {
      const { adapter: t2, runtime: n2 } = xe(e2) || {};
      t2 && (Oe.adapter = t2), n2 && (Oe.runtime = n2);
    }
  }
  var St = new It();
  function bt(e2, t2, n2) {
    void 0 === n2 && (n2 = {});
    var s2 = /\?/.test(t2), r2 = "";
    for (var i2 in n2)
      "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
    return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e2 + t2;
  }
  class kt {
    get(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        re.request({ url: bt("https:", t2), data: n2, method: "GET", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    post(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        re.request({ url: bt("https:", t2), data: n2, method: "POST", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    upload(e2) {
      return new Promise((t2, n2) => {
        const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e2, c2 = re.uploadFile({ url: bt("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e3) {
          const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
          200 === e3.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
        }, fail(e3) {
          n2(new Error(e3.errMsg || "uploadFile:fail"));
        } });
        "function" == typeof e2.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
          e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const Tt = { setItem(e2, t2) {
    re.setStorageSync(e2, t2);
  }, getItem: (e2) => re.getStorageSync(e2), removeItem(e2) {
    re.removeStorageSync(e2);
  }, clear() {
    re.clearStorageSync();
  } };
  var At = { genAdapter: function() {
    return { root: {}, reqClass: kt, localStorage: Tt, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  St.useAdapters(At);
  const Pt = St, Ct = Pt.init;
  Pt.init = function(e2) {
    e2.env = e2.spaceId;
    const t2 = Ct.call(this, e2);
    t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e3) {
      const t3 = n2.call(this, e3);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
        var n3;
        t3[e4] = (n3 = t3[e4], function(e5) {
          e5 = e5 || {};
          const { success: t4, fail: s2, complete: r2 } = ne(e5);
          if (!(t4 || s2 || r2))
            return n3.call(this, e5);
          n3.call(this, e5).then((e6) => {
            t4 && t4(e6), r2 && r2(e6);
          }, (e6) => {
            s2 && s2(e6), r2 && r2(e6);
          });
        }).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var xt = Pt;
  async function Ot(e2, t2) {
    const n2 = `http://${e2}:${t2}/system/ping`;
    try {
      const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
        re.request({ ...s2, success(t4) {
          e4(t4);
        }, fail(e5) {
          t3(e5);
        } });
      }));
      return !(!e3.data || 0 !== e3.data.code);
    } catch (e3) {
      return false;
    }
    var s2;
  }
  async function Et(e2, t2) {
    let n2;
    for (let s2 = 0; s2 < e2.length; s2++) {
      const r2 = e2[s2];
      if (await Ot(r2, t2)) {
        n2 = r2;
        break;
      }
    }
    return { address: n2, port: t2 };
  }
  const Lt = { "serverless.file.resource.generateProximalSign": "storage/generate-proximal-sign", "serverless.file.resource.report": "storage/report", "serverless.file.resource.delete": "storage/delete", "serverless.file.resource.getTempFileURL": "storage/get-temp-file-url" };
  var Rt = class {
    constructor(e2) {
      if (["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), !e2.endpoint)
        throw new Error("集群空间未配置ApiEndpoint，配置后需要重新关联服务空间后生效");
      this.config = Object.assign({}, e2), this.config.provider = "dcloud", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.adapter = re;
    }
    async request(e2, t2 = true) {
      const n2 = t2;
      return e2 = n2 ? await this.setupLocalRequest(e2) : this.setupRequest(e2), Promise.resolve().then(() => n2 ? this.requestLocal(e2) : fe.wrappedRequest(e2, this.adapter.request));
    }
    requestLocal(e2) {
      return new Promise((t2, n2) => {
        this.adapter.request(Object.assign(e2, { complete(e3) {
          if (e3 || (e3 = {}), !e3.statusCode || e3.statusCode >= 400) {
            const t3 = e3.data && e3.data.code || "SYS_ERR", s2 = e3.data && e3.data.message || "request:fail";
            return n2(new se({ code: t3, message: s2 }));
          }
          t2({ success: true, result: e3.data });
        } }));
      });
    }
    setupRequest(e2) {
      const t2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), n2 = { "Content-Type": "application/json" };
      n2["x-serverless-sign"] = fe.sign(t2, this.config.clientSecret);
      const s2 = pe();
      n2["x-client-info"] = encodeURIComponent(JSON.stringify(s2));
      const { token: r2 } = oe();
      return n2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: t2, dataType: "json", header: JSON.parse(JSON.stringify(n2)) };
    }
    async setupLocalRequest(e2) {
      const t2 = pe(), { token: n2 } = oe(), s2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now(), clientInfo: t2, token: n2 }), { address: r2, servePort: i2 } = this.__dev__ && this.__dev__.debugInfo || {}, { address: o2 } = await Et(r2, i2);
      return { url: `http://${o2}:${i2}/${Lt[e2.method]}`, method: "POST", data: s2, dataType: "json", header: JSON.parse(JSON.stringify({ "Content-Type": "application/json" })) };
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request(t2, false);
    }
    getUploadFileOptions(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    reportUploadFile(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new se({ code: "CLOUDPATH_REQUIRED", message: "cloudPath不可为空" });
      let r2;
      return this.getUploadFileOptions({ cloudPath: t2 }).then((t3) => {
        const { url: i2, formData: o2, name: a2 } = t3.result;
        return r2 = t3.result.fileUrl, new Promise((t4, r3) => {
          const c2 = this.adapter.uploadFile({ url: i2, formData: o2, name: a2, filePath: e2, fileType: n2, success(e3) {
            e3 && e3.statusCode < 400 ? t4(e3) : r3(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
          }, fail(e3) {
            r3(new se({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
          } });
          "function" == typeof s2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
            s2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
          });
        });
      }).then(() => this.reportUploadFile({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e2, fileID: r2 }) : s3(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }));
    }
    deleteFile({ fileList: e2 }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
      return this.request(t2).then((e3) => {
        if (e3.success)
          return e3.result;
        throw new se({ code: "DELETE_FILE_FAILED", message: "删除文件失败" });
      });
    }
    getTempFileURL({ fileList: e2, maxAge: t2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new se({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const n2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2, maxAge: t2 }) };
      return this.request(n2).then((e3) => {
        if (e3.success)
          return { fileList: e3.result.fileList.map((e4) => ({ fileID: e4.fileID, tempFileURL: e4.tempFileURL })) };
        throw new se({ code: "GET_TEMP_FILE_URL_FAILED", message: "获取临时文件链接失败" });
      });
    }
  };
  var Ut = { init(e2) {
    const t2 = new Rt(e2), n2 = { signInAnonymously: function() {
      return Promise.resolve();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } }, Nt = n(function(e2, t2) {
    e2.exports = r.enc.Hex;
  });
  function Dt() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e2) {
      var t2 = 16 * Math.random() | 0;
      return ("x" === e2 ? t2 : 3 & t2 | 8).toString(16);
    });
  }
  function Mt(e2 = "", t2 = {}) {
    const { data: n2, functionName: s2, method: r2, headers: i2, signHeaderKeys: o2 = [], config: a2 } = t2, c2 = String(Date.now()), u2 = Dt(), h2 = Object.assign({}, i2, { "x-from-app-id": a2.spaceAppId, "x-from-env-id": a2.spaceId, "x-to-env-id": a2.spaceId, "x-from-instance-id": c2, "x-from-function-name": s2, "x-client-timestamp": c2, "x-alipay-source": "client", "x-request-id": u2, "x-alipay-callid": u2, "x-trace-id": u2 }), l2 = ["x-from-app-id", "x-from-env-id", "x-to-env-id", "x-from-instance-id", "x-from-function-name", "x-client-timestamp"].concat(o2), [d2 = "", p2 = ""] = e2.split("?") || [], f2 = function(e3) {
      const t3 = e3.signedHeaders.join(";"), n3 = e3.signedHeaders.map((t4) => `${t4.toLowerCase()}:${e3.headers[t4]}
`).join(""), s3 = Ie(e3.body).toString(Nt), r3 = `${e3.method.toUpperCase()}
${e3.path}
${e3.query}
${n3}
${t3}
${s3}
`, i3 = Ie(r3).toString(Nt), o3 = `HMAC-SHA256
${e3.timestamp}
${i3}
`, a3 = Se(o3, e3.secretKey).toString(Nt);
      return `HMAC-SHA256 Credential=${e3.secretId}, SignedHeaders=${t3}, Signature=${a3}`;
    }({ path: d2, query: p2, method: r2, headers: h2, timestamp: c2, body: JSON.stringify(n2), secretId: a2.accessKey, secretKey: a2.secretKey, signedHeaders: l2.sort() });
    return { url: `${a2.endpoint}${e2}`, headers: Object.assign({}, h2, { Authorization: f2 }) };
  }
  function qt({ url: e2, data: t2, method: n2 = "POST", headers: s2 = {}, timeout: r2 }) {
    return new Promise((i2, o2) => {
      re.request({ url: e2, method: n2, data: "object" == typeof t2 ? JSON.stringify(t2) : t2, header: s2, dataType: "json", timeout: r2, complete: (e3 = {}) => {
        const t3 = s2["x-trace-id"] || "";
        if (!e3.statusCode || e3.statusCode >= 400) {
          const { message: n3, errMsg: s3, trace_id: r3 } = e3.data || {};
          return o2(new se({ code: "SYS_ERR", message: n3 || s3 || "request:fail", requestId: r3 || t3 }));
        }
        i2({ status: e3.statusCode, data: e3.data, headers: e3.header, requestId: t3 });
      } });
    });
  }
  function Kt(e2, t2) {
    const { path: n2, data: s2, method: r2 = "GET" } = e2, { url: i2, headers: o2 } = Mt(n2, { functionName: "", data: s2, method: r2, headers: { "x-alipay-cloud-mode": "oss", "x-data-api-type": "oss", "x-expire-timestamp": Date.now() + 6e4 }, signHeaderKeys: ["x-data-api-type", "x-expire-timestamp"], config: t2 });
    return qt({ url: i2, data: s2, method: r2, headers: o2 }).then((e3) => {
      const t3 = e3.data || {};
      if (!t3.success)
        throw new se({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
      return t3.data || {};
    }).catch((e3) => {
      throw new se({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
    });
  }
  function Ft(e2 = "") {
    const t2 = e2.trim().replace(/^cloud:\/\//, ""), n2 = t2.indexOf("/");
    if (n2 <= 0)
      throw new se({ code: "INVALID_PARAM", message: "fileID不合法" });
    const s2 = t2.substring(0, n2), r2 = t2.substring(n2 + 1);
    return s2 !== this.config.spaceId && console.warn("file ".concat(e2, " does not belong to env ").concat(this.config.spaceId)), r2;
  }
  function jt(e2 = "") {
    return "cloud://".concat(this.config.spaceId, "/").concat(e2.replace(/^\/+/, ""));
  }
  class $t {
    constructor(e2) {
      this.config = e2;
    }
    signedURL(e2, t2 = {}) {
      const n2 = `/ws/function/${e2}`, s2 = this.config.wsEndpoint.replace(/^ws(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Dt(), timestamp: "" + Date.now() }), i2 = [n2, ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
        return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
      }).filter(Boolean).join("&"), `host:${s2}`].join("\n"), o2 = ["HMAC-SHA256", Ie(i2).toString(Nt)].join("\n"), a2 = Se(o2, this.config.secretKey).toString(Nt), c2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
      return `${this.config.wsEndpoint}${n2}?${c2}&signature=${a2}`;
    }
  }
  var Bt = class {
    constructor(e2) {
      if (["spaceId", "spaceAppId", "accessKey", "secretKey"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), e2.endpoint) {
        if ("string" != typeof e2.endpoint)
          throw new Error("endpoint must be string");
        if (!/^https:\/\//.test(e2.endpoint))
          throw new Error("endpoint must start with https://");
        e2.endpoint = e2.endpoint.replace(/\/$/, "");
      }
      this.config = Object.assign({}, e2, { endpoint: e2.endpoint || `https://${e2.spaceId}.api-hz.cloudbasefunction.cn`, wsEndpoint: e2.wsEndpoint || `wss://${e2.spaceId}.api-hz.cloudbasefunction.cn` }), this._websocket = new $t(this.config);
    }
    callFunction(e2) {
      return function(e3, t2) {
        const { name: n2, data: s2, async: r2 = false, timeout: i2 } = e3, o2 = "POST", a2 = { "x-to-function-name": n2 };
        r2 && (a2["x-function-invoke-type"] = "async");
        const { url: c2, headers: u2 } = Mt("/functions/invokeFunction", { functionName: n2, data: s2, method: o2, headers: a2, signHeaderKeys: ["x-to-function-name"], config: t2 });
        return qt({ url: c2, data: s2, method: o2, headers: u2, timeout: i2 }).then((e4) => {
          let t3 = 0;
          if (r2) {
            const n3 = e4.data || {};
            t3 = "200" === n3.errCode ? 0 : n3.errCode, e4.data = n3.data || {}, e4.errMsg = n3.errMsg;
          }
          if (0 !== t3)
            throw new se({ code: t3, message: e4.errMsg, requestId: e4.requestId });
          return { errCode: t3, success: 0 === t3, requestId: e4.requestId, result: e4.data };
        }).catch((e4) => {
          throw new se({ code: e4.errCode, message: e4.errMsg, requestId: e4.requestId });
        });
      }(e2, this.config);
    }
    uploadFileToOSS({ url: e2, filePath: t2, fileType: n2, formData: s2, onUploadProgress: r2 }) {
      return new Promise((i2, o2) => {
        const a2 = re.uploadFile({ url: e2, filePath: t2, fileType: n2, formData: s2, name: "file", success(e3) {
          e3 && e3.statusCode < 400 ? i2(e3) : o2(new se({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          o2(new se({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof r2 && a2 && "function" == typeof a2.onProgressUpdate && a2.onProgressUpdate((e3) => {
          r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    async uploadFile({ filePath: e2, cloudPath: t2 = "", fileType: n2 = "image", onUploadProgress: s2 }) {
      if ("string" !== f(t2))
        throw new se({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new se({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new se({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const r2 = await Kt({ path: "/".concat(t2.replace(/^\//, ""), "?post_url") }, this.config), { file_id: i2, upload_url: o2, form_data: a2 } = r2, c2 = a2 && a2.reduce((e3, t3) => (e3[t3.key] = t3.value, e3), {});
      return this.uploadFileToOSS({ url: o2, filePath: e2, fileType: n2, formData: c2, onUploadProgress: s2 }).then(() => ({ fileID: i2 }));
    }
    async getTempFileURL({ fileList: e2 }) {
      return new Promise((t2, n2) => {
        (!e2 || e2.length < 0) && t2({ code: "INVALID_PARAM", message: "fileList不能为空数组" }), e2.length > 50 && t2({ code: "INVALID_PARAM", message: "fileList数组长度不能超过50" });
        const s2 = [];
        for (const n3 of e2) {
          let e3;
          "string" !== f(n3) && t2({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
          try {
            e3 = Ft.call(this, n3);
          } catch (t3) {
            console.warn(t3.errCode, t3.errMsg), e3 = n3;
          }
          s2.push({ file_id: e3, expire: 600 });
        }
        Kt({ path: "/?download_url", data: { file_list: s2 }, method: "POST" }, this.config).then((e3) => {
          const { file_list: n3 = [] } = e3;
          t2({ fileList: n3.map((e4) => ({ fileID: jt.call(this, e4.file_id), tempFileURL: e4.download_url })) });
        }).catch((e3) => n2(e3));
      });
    }
    async connectWebSocket(e2) {
      const { name: t2, query: n2 } = e2;
      return re.connectSocket({ url: this._websocket.signedURL(t2, n2), complete: () => {
      } });
    }
  };
  var Wt = { init: (e2) => {
    e2.provider = "alipay";
    const t2 = new Bt(e2);
    return t2.auth = function() {
      return { signInAnonymously: function() {
        return Promise.resolve();
      }, getLoginState: function() {
        return Promise.resolve(true);
      } };
    }, t2;
  } };
  function Ht({ data: e2 }) {
    let t2;
    t2 = pe();
    const n2 = JSON.parse(JSON.stringify(e2 || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e3 } = oe();
      e3 && (n2.uniIdToken = e3);
    }
    return n2;
  }
  async function Jt(e2 = {}) {
    await this.__dev__.initLocalNetwork();
    const { localAddress: t2, localPort: n2 } = this.__dev__, s2 = { aliyun: "aliyun", tencent: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${t2}:${n2}/system/check-function`, o2 = `http://${t2}:${n2}/cloudfunctions/${e2.name}`;
    return new Promise((t3, n3) => {
      re.request({ method: "POST", url: i2, data: { name: e2.name, platform: A, provider: s2, spaceId: r2 }, timeout: 3e3, success(e3) {
        t3(e3);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。" } });
      } });
    }).then(({ data: e3 } = {}) => {
      const { code: t3, message: n3 } = e3 || {};
      return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: t3, message: n3 }) => {
      if (0 !== t3) {
        switch (t3) {
          case "MODULE_ENCRYPTED":
            console.error(`此云函数（${e2.name}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`此云函数（${e2.name}）已加密不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(n3 || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
            break;
          case "NETWORK_ERROR":
            console.error(n3 || "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下");
            break;
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e3 = `检测本地调试服务出现错误：${n3}，请检查网络环境或重启客户端再试`;
            throw console.error(e3), new Error(e3);
          }
        }
        return this._callCloudFunction(e2);
      }
      return new Promise((t4, n4) => {
        const r3 = Ht.call(this, { data: e2.data });
        re.request({ method: "POST", url: o2, data: { provider: s2, platform: A, param: r3 }, timeout: e2.timeout, success: ({ statusCode: e3, data: s3 } = {}) => !e3 || e3 >= 400 ? n4(new se({ code: s3.code || "SYS_ERR", message: s3.message || "request:fail" })) : t4({ result: s3 }), fail(e3) {
          n4(new se({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const zt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间", mode: "append" }];
  var Vt = /[\\^$.*+?()[\]{}|]/g, Gt = RegExp(Vt.source);
  function Yt(e2, t2, n2) {
    return e2.replace(new RegExp((s2 = t2) && Gt.test(s2) ? s2.replace(Vt, "\\$&") : s2, "g"), n2);
    var s2;
  }
  const Xt = "request", Zt = "response", en$1 = "both";
  const Mn = { code: 2e4, message: "System error" }, qn = { code: 20101, message: "Invalid client" };
  function jn(e2) {
    const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e2 || {};
    return new se({ subject: t2 || n2 || "uni-secure-network", code: s2 || i2 || Mn.code, message: r2 || o2, cause: a2 });
  }
  let Bn;
  function Vn({ secretType: e2 } = {}) {
    return e2 === Xt || e2 === Zt || e2 === en$1;
  }
  function Gn({ name: e2, data: t2 = {} } = {}) {
    return "DCloud-clientDB" === e2 && "encryption" === t2.redirectTo && "getAppClientKey" === t2.action;
  }
  function Yn({ provider: e2, spaceId: t2, functionName: n2 } = {}) {
    const { appId: s2, uniPlatform: r2, osName: i2 } = he();
    let o2 = r2;
    "app" === r2 && (o2 = i2);
    const a2 = function({ provider: e3, spaceId: t3 } = {}) {
      const n3 = T;
      if (!n3)
        return {};
      e3 = /* @__PURE__ */ function(e4) {
        return "tencent" === e4 ? "tcb" : e4;
      }(e3);
      const s3 = n3.find((n4) => n4.provider === e3 && n4.spaceId === t3);
      return s3 && s3.config;
    }({ provider: e2, spaceId: t2 });
    if (!a2 || !a2.accessControl || !a2.accessControl.enable)
      return false;
    const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
    if (0 === u2.length)
      return true;
    const h2 = function(e3, t3) {
      let n3, s3, r3;
      for (let i3 = 0; i3 < e3.length; i3++) {
        const o3 = e3[i3];
        o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e4) => e4.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
      }
      return n3 || s3 || r3;
    }(u2, n2);
    if (!h2)
      return false;
    if ((c2[h2] || []).find((e3 = {}) => e3.appId === s2 && (e3.platform || "").toLowerCase() === o2.toLowerCase()))
      return true;
    throw console.error(`此应用[appId: ${s2}, platform: ${o2}]不在云端配置的允许访问的应用列表内，参考：https://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), jn(qn);
  }
  function Qn({ functionName: e2, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function Xn(e2) {
    const t2 = e2.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = Ht.call(e2, { data: n3.data });
      const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], i2 = Vn(n3), o2 = Gn(n3), a2 = i2 || o2;
      return t2.call(this, n3).then((e3) => (e3.errCode = 0, !a2 && Qn.call(this, { functionName: s2, result: e3, logPvd: r2 }), Promise.resolve(e3)), (e3) => (!a2 && Qn.call(this, { functionName: s2, result: e3, logPvd: r2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e4.match(r3);
          if (!a3)
            continue;
          let c2 = i3;
          for (let e5 = 1; e5 < a3.length; e5++)
            c2 = Yt(c2, `{$${e5}}`, a3[e5]);
          for (const e5 in t3)
            c2 = Yt(c2, `{${e5}}`, t3[e5]);
          return "replace" === o3 ? c2 : e4 + c2;
        }
        return e4;
      }({ message: `[${n3.name}]: ${e3.message}`, formatter: zt, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
    };
    e2.callFunction = function(t3) {
      const { provider: s2, spaceId: r2 } = e2.config, i2 = t3.name;
      let o2, a2;
      if (t3.data = t3.data || {}, e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && C ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = Jt), o2 = Jt) : o2 = n2, o2 = o2.bind(e2), Gn(t3))
        a2 = n2.call(e2, t3);
      else if (Vn(t3)) {
        a2 = new Bn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapEncryptDataCallFunction(n2.bind(e2))(t3);
      } else if (Yn({ provider: s2, spaceId: r2, functionName: i2 })) {
        a2 = new Bn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapVerifyClientCallFunction(n2.bind(e2))(t3);
      } else
        a2 = o2(t3);
      return Object.defineProperty(a2, "result", { get: () => (console.warn("当前返回结果为Promise类型，不可直接访问其result属性，详情请参考：https://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2.then((e3) => ("undefined" != typeof UTSJSONObject && "undefined" != typeof UTS && (e3.result = UTS.JSON.parse(JSON.stringify(e3.result))), e3));
    };
  }
  Bn = class {
    constructor() {
      throw jn({ message: `Platform ${A} is not enabled, please check whether secure network module is enabled in your manifest.json` });
    }
  };
  const Zn = Symbol("CLIENT_DB_INTERNAL");
  function es(e2, t2) {
    return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = Zn, e2.inspect = null, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
      if ("_uniClient" === n2)
        return null;
      if ("symbol" == typeof n2)
        return e3[n2];
      if (n2 in e3 || "string" != typeof n2) {
        const t3 = e3[n2];
        return "function" == typeof t3 ? t3.bind(e3) : t3;
      }
      return t2.get(e3, n2, s2);
    } });
  }
  function ts(e2) {
    return { on: (t2, n2) => {
      e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
    }, off: (t2, n2) => {
      e2[t2] = e2[t2] || [];
      const s2 = e2[t2].indexOf(n2);
      -1 !== s2 && e2[t2].splice(s2, 1);
    } };
  }
  const ns = ["db.Geo", "db.command", "command.aggregate"];
  function ss(e2, t2) {
    return ns.indexOf(`${e2}.${t2}`) > -1;
  }
  function rs(e2) {
    switch (f(e2 = ie(e2))) {
      case "array":
        return e2.map((e3) => rs(e3));
      case "object":
        return e2._internalType === Zn || Object.keys(e2).forEach((t2) => {
          e2[t2] = rs(e2[t2]);
        }), e2;
      case "regexp":
        return { $regexp: { source: e2.source, flags: e2.flags } };
      case "date":
        return { $date: e2.toISOString() };
      default:
        return e2;
    }
  }
  function is(e2) {
    return e2 && e2.content && e2.content.$method;
  }
  class os {
    constructor(e2, t2, n2) {
      this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e2 = this;
      const t2 = [e2.content];
      for (; e2.prevStage; )
        e2 = e2.prevStage, t2.push(e2.content);
      return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: rs(e3.$param) })) };
    }
    toString() {
      return JSON.stringify(this.toJSON());
    }
    getAction() {
      const e2 = this.toJSON().$db.find((e3) => "action" === e3.$method);
      return e2 && e2.$param && e2.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e2) => "action" !== e2.$method) };
    }
    get isAggregate() {
      let e2 = this;
      for (; e2; ) {
        const t2 = is(e2), n2 = is(e2.prevStage);
        if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e2 = this;
      for (; e2; ) {
        if ("command" === is(e2))
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e2 = this;
      for (; e2; ) {
        const t2 = is(e2), n2 = is(e2.prevStage);
        if ("aggregate" === t2 && "command" === n2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    getNextStageFn(e2) {
      const t2 = this;
      return function() {
        return as({ $method: e2, $param: rs(Array.from(arguments)) }, t2, t2._database);
      };
    }
    get count() {
      return this.isAggregate ? this.getNextStageFn("count") : function() {
        return this._send("count", Array.from(arguments));
      };
    }
    get remove() {
      return this.isCommand ? this.getNextStageFn("remove") : function() {
        return this._send("remove", Array.from(arguments));
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    get add() {
      return this.isCommand ? this.getNextStageFn("add") : function() {
        return this._send("add", Array.from(arguments));
      };
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      return this.isCommand ? this.getNextStageFn("set") : function() {
        throw new Error("JQL禁止使用set方法");
      };
    }
    _send(e2, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e2, $param: rs(t2) }), S) {
        const e3 = s2.$db.find((e4) => "collection" === e4.$method), t3 = e3 && e3.$param;
        t3 && 1 === t3.length && "string" == typeof e3.$param[0] && e3.$param[0].indexOf(",") > -1 && console.warn("检测到使用JQL语法联表查询时，未使用getTemp先过滤主表数据，在主表数据量大的情况下可能会查询缓慢。\n- 如何优化请参考此文档：https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- 如果主表数据量很小请忽略此信息，项目发行时不会出现此提示。");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function as(e2, t2, n2) {
    return es(new os(e2, t2, n2), { get(e3, t3) {
      let s2 = "db";
      return e3 && e3.content && (s2 = e3.content.$method), ss(s2, t3) ? as({ $method: t3 }, e3, n2) : function() {
        return as({ $method: t3, $param: rs(Array.from(arguments)) }, e3, n2);
      };
    } });
  }
  function cs({ path: e2, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
      }
      toString() {
        return JSON.stringify(this.toJSON());
      }
    };
  }
  function us(e2, t2 = {}) {
    return es(new e2(t2), { get: (e3, t3) => ss("db", t3) ? as({ $method: t3 }, null, e3) : function() {
      return as({ $method: t3, $param: rs(Array.from(arguments)) }, null, e3);
    } });
  }
  class hs extends class {
    constructor({ uniClient: e2 = {}, isJQL: t2 = false } = {}) {
      this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2._isDefault && (this._dbCallBacks = R("_globalUniCloudDatabaseCallback")), t2 || (this.auth = ts(this._authCallBacks)), this._isJQL = t2, Object.assign(this, ts(this._dbCallBacks)), this.env = es({}, { get: (e3, t3) => ({ $env: t3 }) }), this.Geo = es({}, { get: (e3, t3) => cs({ path: ["Geo"], method: t3 }) }), this.serverDate = cs({ path: [], method: "serverDate" }), this.RegExp = cs({ path: [], method: "RegExp" });
    }
    getCloudEnv(e2) {
      if ("string" != typeof e2 || !e2.trim())
        throw new Error("getCloudEnv参数错误");
      return { $env: e2.replace("$cloudEnv_", "") };
    }
    _callback(e2, t2) {
      const n2 = this._dbCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    _callbackAuth(e2, t2) {
      const n2 = this._authCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    multiSend() {
      const e2 = Array.from(arguments), t2 = e2.map((e3) => {
        const t3 = e3.getAction(), n2 = e3.getCommand();
        if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
          throw new Error("multiSend只支持子命令内使用getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
    }
  } {
    _parseResult(e2) {
      return this._isJQL ? e2.result : e2;
    }
    _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
      function r2(e3, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const r3 = s2[n3];
            r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e3.result.dataList[n3]));
          }
      }
      const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
      function a2(e3) {
        return i2._callback("error", [e3]), K(F(o2, "fail"), e3).then(() => K(F(o2, "complete"), e3)).then(() => (r2(null, e3), X(B, { type: J, content: e3 }), Promise.reject(e3)));
      }
      const c2 = K(F(o2, "invoke")), u2 = this._uniClient;
      return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: h, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
        const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e3.result;
        if (u3)
          for (let e4 = 0; e4 < u3.length; e4++) {
            const { level: t4, message: n4, detail: s4 } = u3[e4], r3 = console["warn" === t4 ? "error" : t4] || console.log;
            let i3 = "[System Info]" + n4;
            s4 && (i3 = `${i3}
详细信息：${s4}`), r3(i3);
          }
        if (t3) {
          return a2(new se({ code: t3, message: n3, requestId: e3.requestId }));
        }
        e3.result.errCode = e3.result.errCode || e3.result.code, e3.result.errMsg = e3.result.errMsg || e3.result.message, s3 && c3 && (ae({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), X(H, { token: s3, tokenExpired: c3 }));
        const h2 = [{ prop: "affectedDocs", tips: "affectedDocs不再推荐使用，请使用inserted/deleted/updated/data.length替代" }, { prop: "code", tips: "code不再推荐使用，请使用errCode替代" }, { prop: "message", tips: "message不再推荐使用，请使用errMsg替代" }];
        for (let t4 = 0; t4 < h2.length; t4++) {
          const { prop: n4, tips: s4 } = h2[t4];
          if (n4 in e3.result) {
            const t5 = e3.result[n4];
            Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e4) {
          return K(F(o2, "success"), e4).then(() => K(F(o2, "complete"), e4)).then(() => {
            r2(e4, null);
            const t4 = i2._parseResult(e4);
            return X(B, { type: J, content: t4 }), Promise.resolve(t4);
          });
        }(e3);
      }, (e3) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB未初始化，请在web控制台保存一次schema以开启clientDB");
        return a2(new se({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
      });
    }
  }
  const ls = "token无效，跳转登录页面", ds = "token过期，跳转登录页面", ps = { TOKEN_INVALID_TOKEN_EXPIRED: ds, TOKEN_INVALID_INVALID_CLIENTID: ls, TOKEN_INVALID: ls, TOKEN_INVALID_WRONG_TOKEN: ls, TOKEN_INVALID_ANONYMOUS_USER: ls }, fs = { "uni-id-token-expired": ds, "uni-id-check-token-failed": ls, "uni-id-token-not-exist": ls, "uni-id-check-device-feature-failed": ls };
  function gs(e2, t2) {
    let n2 = "";
    return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function ms(e2 = [], t2 = "") {
    const n2 = [], s2 = [];
    return e2.forEach((e3) => {
      true === e3.needLogin ? n2.push(gs(t2, e3.path)) : false === e3.needLogin && s2.push(gs(t2, e3.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function ys(e2) {
    return e2.split("?")[0].replace(/^\//, "");
  }
  function _s() {
    return function(e2) {
      let t2 = e2 && e2.$page && e2.$page.fullPath || "";
      return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : t2;
    }(function() {
      const e2 = getCurrentPages();
      return e2[e2.length - 1];
    }());
  }
  function ws() {
    return ys(_s());
  }
  function vs(e2 = "", t2 = {}) {
    if (!e2)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = ys(e2);
    return n2.some((e3) => e3.pagePath === s2);
  }
  const Is = !!e.uniIdRouter;
  const { loginPage: Ss, routerNeedLogin: bs, resToLogin: ks, needLoginPage: Ts, notNeedLoginPage: As, loginPageInTabBar: Ps } = function({ pages: t2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = e) {
    const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = ms(t2), { needLoginPage: h2, notNeedLoginPage: l2 } = function(e2 = []) {
      const t3 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = ms(r3, s3);
        t3.push(...i3), n3.push(...o3);
      }), { needLoginPage: t3, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...h2], notNeedLoginPage: [...u2, ...l2], loginPageInTabBar: vs(i2, r2) };
  }();
  if (Ts.indexOf(Ss) > -1)
    throw new Error(`Login page [${Ss}] should not be "needLogin", please check your pages.json`);
  function Cs(e2) {
    const t2 = ws();
    if ("/" === e2.charAt(0))
      return e2;
    const [n2, s2] = e2.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
    i2.pop();
    for (let e3 = 0; e3 < r2.length; e3++) {
      const t3 = r2[e3];
      ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
    }
    return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
  }
  function xs(e2) {
    const t2 = ys(Cs(e2));
    return !(As.indexOf(t2) > -1) && (Ts.indexOf(t2) > -1 || bs.some((t3) => function(e3, t4) {
      return new RegExp(t4).test(e3);
    }(e2, t3)));
  }
  function Os({ redirect: e2 }) {
    const t2 = ys(e2), n2 = ys(Ss);
    return ws() !== n2 && t2 !== n2;
  }
  function Es({ api: e2, redirect: t2 } = {}) {
    if (!t2 || !Os({ redirect: t2 }))
      return;
    const n2 = function(e3, t3) {
      return "/" !== e3.charAt(0) && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
    }(Ss, t2);
    Ps ? "navigateTo" !== e2 && "redirectTo" !== e2 || (e2 = "switchTab") : "switchTab" === e2 && (e2 = "navigateTo");
    const s2 = { navigateTo: uni.navigateTo, redirectTo: uni.redirectTo, switchTab: uni.switchTab, reLaunch: uni.reLaunch };
    setTimeout(() => {
      s2[e2]({ url: n2 });
    }, 0);
  }
  function Ls({ url: e2 } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e3, tokenExpired: t3 } = oe();
      let n3;
      if (e3) {
        if (t3 < Date.now()) {
          const e4 = "uni-id-token-expired";
          n3 = { errCode: e4, errMsg: fs[e4] };
        }
      } else {
        const e4 = "uni-id-check-token-failed";
        n3 = { errCode: e4, errMsg: fs[e4] };
      }
      return n3;
    }();
    if (xs(e2) && n2) {
      n2.uniIdRedirectUrl = e2;
      if (G(W).length > 0)
        return setTimeout(() => {
          X(W, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function Rs() {
    !function() {
      const e3 = _s(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Ls({ url: e3 });
      t2 || n2 && Es({ api: "redirectTo", redirect: e3 });
    }();
    const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e2.length; t2++) {
      const n2 = e2[t2];
      uni.addInterceptor(n2, { invoke(e3) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Ls({ url: e3.url });
        return t3 ? e3 : s2 ? (Es({ api: n2, redirect: Cs(e3.url) }), false) : e3;
      } });
    }
  }
  function Us() {
    this.onResponse((e2) => {
      const { type: t2, content: n2 } = e2;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in fs;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in ps;
          }(n2);
      }
      s2 && function(e3 = {}) {
        const t3 = G(W);
        te().then(() => {
          const n3 = _s();
          if (n3 && Os({ redirect: n3 }))
            return t3.length > 0 ? X(W, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (Ss && Es({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function Ns(e2) {
    !function(e3) {
      e3.onResponse = function(e4) {
        Y(B, e4);
      }, e3.offResponse = function(e4) {
        Q(B, e4);
      };
    }(e2), function(e3) {
      e3.onNeedLogin = function(e4) {
        Y(W, e4);
      }, e3.offNeedLogin = function(e4) {
        Q(W, e4);
      }, Is && (R("_globalUniCloudStatus").needLoginInit || (R("_globalUniCloudStatus").needLoginInit = true, te().then(() => {
        Rs.call(e3);
      }), ks && Us.call(e3)));
    }(e2), function(e3) {
      e3.onRefreshToken = function(e4) {
        Y(H, e4);
      }, e3.offRefreshToken = function(e4) {
        Q(H, e4);
      };
    }(e2);
  }
  let Ds;
  const Ms = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", qs = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function Ks() {
    const e2 = oe().token || "", t2 = e2.split(".");
    if (!e2 || 3 !== t2.length)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(Ds(s2).split("").map(function(e3) {
        return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e3) {
      throw new Error("获取当前用户信息出错，详细错误信息为：" + e3.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  Ds = "function" != typeof atob ? function(e2) {
    if (e2 = String(e2).replace(/[\t\n\f\r ]+/g, ""), !qs.test(e2))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e2 += "==".slice(2 - (3 & e2.length));
    for (var n2, s2, r2 = "", i2 = 0; i2 < e2.length; )
      t2 = Ms.indexOf(e2.charAt(i2++)) << 18 | Ms.indexOf(e2.charAt(i2++)) << 12 | (n2 = Ms.indexOf(e2.charAt(i2++))) << 6 | (s2 = Ms.indexOf(e2.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  } : atob;
  var Fs = n(function(e2, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function r2(e3, t3) {
      return e3.tempFiles.forEach((e4, n3) => {
        e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
      }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
    }
    function i2(e3, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
      return t3.then((e4) => {
        if (s3) {
          const t4 = s3(e4);
          if (void 0 !== t4)
            return Promise.resolve(t4).then((t5) => void 0 === t5 ? e4 : t5);
        }
        return e4;
      }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, r4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const i3 = t5.tempFiles, o2 = i3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= o2)
              return void (!i3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
            const u2 = i3[s5];
            e4.uploadFile({ provider: u2.provider, filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, cloudPathAsRealPath: u2.cloudPathAsRealPath, onUploadProgress(e5) {
              e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, r4 && r4(e5);
            } }).then((e5) => {
              u2.url = e5.fileID, s5 < o2 && c2();
            }).catch((e5) => {
              u2.errMsg = e5.errMsg || e5.message, s5 < o2 && c2();
            });
          }
        });
      }(e3, t4, 5, r3));
    }
    t2.initChooseAndUploadFile = function(e3) {
      return function(t3 = { type: "all" }) {
        return "image" === t3.type ? i2(e3, function(e4) {
          const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e4;
          return new Promise((e5, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
              e5(r2(t5, "image"));
            }, fail(e6) {
              a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : "video" === t3.type ? i2(e3, function(e4) {
          const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e4;
          return new Promise((e5, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
              e5(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e6) {
              c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : i2(e3, function(e4) {
          const { count: t4, extension: n3 } = e4;
          return new Promise((e5, i3) => {
            let o2 = uni.chooseFile;
            if ("undefined" != typeof wx && "function" == typeof wx.chooseMessageFile && (o2 = wx.chooseMessageFile), "function" != typeof o2)
              return i3({ errMsg: s2 + " 请指定 type 类型，该平台仅支持选择 image 或 video。" });
            o2({ type: "all", count: t4, extension: n3, success(t5) {
              e5(r2(t5));
            }, fail(e6) {
              i3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), js = t$1(Fs);
  const $s = "manual";
  function Bs(e2) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {}, mixinDatacomError: null }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e3 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e3.push(this[t2]);
        }), e3;
      }, (e3, t2) => {
        if (this.loadtime === $s)
          return;
        let n2 = false;
        const s2 = [];
        for (let r2 = 2; r2 < e3.length; r2++)
          e3[r2] !== t2[r2] && (s2.push(e3[r2]), n2 = true);
        e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e3, t2) {
    }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomError = null, this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: r2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const i2 = e3 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = i2, t2 && t2(i2);
      }).catch((e4) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, this.mixinDatacomError = e4, n2 && n2(e4);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2;
      t2 = t2 || {}, n2 = "undefined" != typeof __uniX && __uniX ? e2.databaseForJQL(this.spaceInfo) : e2.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const r2 = t2.collection || this.collection;
      n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
      const i2 = t2.where || this.where;
      i2 && Object.keys(i2).length && (n2 = n2.where(i2));
      const o2 = t2.field || this.field;
      o2 && (n2 = n2.field(o2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
      const h2 = t2.orderby || this.orderby;
      h2 && (n2 = n2.orderBy(h2));
      const l2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, p2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, f2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: p2 }, y2 = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
      return f2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (l2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function Ws(e2) {
    return function(t2, n2 = {}) {
      n2 = function(e3, t3 = {}) {
        return e3.customUI = t3.customUI || e3.customUI, e3.parseSystemError = t3.parseSystemError || e3.parseSystemError, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e3.secretMethods = t3.secretMethods), e3;
      }({ customUI: false, loadingOptions: { title: "加载中...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
      return new Proxy({}, { get(s3, c2) {
        switch (c2) {
          case "toString":
            return "[object UniCloudObject]";
          case "toJSON":
            return {};
        }
        return function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
          return async function(...s4) {
            const r3 = n3 ? n3({ params: s4 }) : {};
            let i3, o3;
            try {
              return await K(F(t3, "invoke"), { ...r3 }), i3 = await e3(...s4), await K(F(t3, "success"), { ...r3, result: i3 }), i3;
            } catch (e4) {
              throw o3 = e4, await K(F(t3, "fail"), { ...r3, error: o3 }), o3;
            } finally {
              await K(F(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
            }
          };
        }({ fn: async function s4(...h2) {
          let l2;
          a2 && uni.showLoading({ title: r2.title, mask: r2.mask });
          const d2 = { name: t2, type: u, data: { method: c2, params: h2 } };
          "object" == typeof n2.secretMethods && function(e3, t3) {
            const n3 = t3.data.method, s5 = e3.secretMethods || {}, r3 = s5[n3] || s5["*"];
            r3 && (t3.secretType = r3);
          }(n2, d2);
          let p2 = false;
          try {
            l2 = await e2.callFunction(d2);
          } catch (e3) {
            p2 = true, l2 = { result: new se(e3) };
          }
          const { errSubject: f2, errCode: g2, errMsg: m2, newToken: y2 } = l2.result || {};
          if (a2 && uni.hideLoading(), y2 && y2.token && y2.tokenExpired && (ae(y2), X(H, { ...y2 })), g2) {
            let e3 = m2;
            if (p2 && o2) {
              e3 = (await o2({ objectName: t2, methodName: c2, params: h2, errSubject: f2, errCode: g2, errMsg: m2 })).errMsg || m2;
            }
            if (a2)
              if ("toast" === i2.type)
                uni.showToast({ title: e3, icon: "none" });
              else {
                if ("modal" !== i2.type)
                  throw new Error(`Invalid errorOptions.type: ${i2.type}`);
                {
                  const { confirm: t3 } = await async function({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                    return new Promise((i3, o3) => {
                      uni.showModal({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e5) {
                        i3(e5);
                      }, fail() {
                        i3({ confirm: false, cancel: true });
                      } });
                    });
                  }({ title: "提示", content: e3, showCancel: i2.retry, cancelText: "取消", confirmText: i2.retry ? "重试" : "确定" });
                  if (i2.retry && t3)
                    return s4(...h2);
                }
              }
            const n3 = new se({ subject: f2, code: g2, message: m2, requestId: l2.requestId });
            throw n3.detail = l2.result, X(B, { type: V, content: n3 }), n3;
          }
          return X(B, { type: V, content: l2.result }), l2.result;
        }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
          return { objectName: t2, methodName: c2, params: e3 };
        } });
      } });
    };
  }
  function Hs(e2) {
    return R("_globalUniCloudSecureNetworkCache__{spaceId}".replace("{spaceId}", e2.config.spaceId));
  }
  async function Js({ openid: e2, callLoginByWeixin: t2 = false } = {}) {
    Hs(this);
    throw new Error(`[SecureNetwork] API \`initSecureNetworkByWeixin\` is not supported on platform \`${A}\``);
  }
  async function zs(e2) {
    const t2 = Hs(this);
    return t2.initPromise || (t2.initPromise = Js.call(this, e2).then((e3) => e3).catch((e3) => {
      throw delete t2.initPromise, e3;
    })), t2.initPromise;
  }
  function Vs(e2) {
    return function({ openid: t2, callLoginByWeixin: n2 = false } = {}) {
      return zs.call(e2, { openid: t2, callLoginByWeixin: n2 });
    };
  }
  function Gs(e2) {
    !function(e3) {
      de = e3;
    }(e2);
  }
  function Ys(e2) {
    const t2 = { getSystemInfo: uni.getSystemInfo, getPushClientId: uni.getPushClientId };
    return function(n2) {
      return new Promise((s2, r2) => {
        t2[e2]({ ...n2, success(e3) {
          s2(e3);
        }, fail(e3) {
          r2(e3);
        } });
      });
    };
  }
  class Qs extends class {
    constructor() {
      this._callback = {};
    }
    addListener(e2, t2) {
      this._callback[e2] || (this._callback[e2] = []), this._callback[e2].push(t2);
    }
    on(e2, t2) {
      return this.addListener(e2, t2);
    }
    removeListener(e2, t2) {
      if (!t2)
        throw new Error('The "listener" argument must be of type function. Received undefined');
      const n2 = this._callback[e2];
      if (!n2)
        return;
      const s2 = function(e3, t3) {
        for (let n3 = e3.length - 1; n3 >= 0; n3--)
          if (e3[n3] === t3)
            return n3;
        return -1;
      }(n2, t2);
      n2.splice(s2, 1);
    }
    off(e2, t2) {
      return this.removeListener(e2, t2);
    }
    removeAllListener(e2) {
      delete this._callback[e2];
    }
    emit(e2, ...t2) {
      const n2 = this._callback[e2];
      if (n2)
        for (let e3 = 0; e3 < n2.length; e3++)
          n2[e3](...t2);
    }
  } {
    constructor() {
      super(), this._uniPushMessageCallback = this._receivePushMessage.bind(this), this._currentMessageId = -1, this._payloadQueue = [];
    }
    init() {
      return Promise.all([Ys("getSystemInfo")(), Ys("getPushClientId")()]).then(([{ appId: e2 } = {}, { cid: t2 } = {}] = []) => {
        if (!e2)
          throw new Error("Invalid appId, please check the manifest.json file");
        if (!t2)
          throw new Error("Invalid push client id");
        this._appId = e2, this._pushClientId = t2, this._seqId = Date.now() + "-" + Math.floor(9e5 * Math.random() + 1e5), this.emit("open"), this._initMessageListener();
      }, (e2) => {
        throw this.emit("error", e2), this.close(), e2;
      });
    }
    async open() {
      return this.init();
    }
    _isUniCloudSSE(e2) {
      if ("receive" !== e2.type)
        return false;
      const t2 = e2 && e2.data && e2.data.payload;
      return !(!t2 || "UNI_CLOUD_SSE" !== t2.channel || t2.seqId !== this._seqId);
    }
    _receivePushMessage(e2) {
      if (!this._isUniCloudSSE(e2))
        return;
      const t2 = e2 && e2.data && e2.data.payload, { action: n2, messageId: s2, message: r2 } = t2;
      this._payloadQueue.push({ action: n2, messageId: s2, message: r2 }), this._consumMessage();
    }
    _consumMessage() {
      for (; ; ) {
        const e2 = this._payloadQueue.find((e3) => e3.messageId === this._currentMessageId + 1);
        if (!e2)
          break;
        this._currentMessageId++, this._parseMessagePayload(e2);
      }
    }
    _parseMessagePayload(e2) {
      const { action: t2, messageId: n2, message: s2 } = e2;
      "end" === t2 ? this._end({ messageId: n2, message: s2 }) : "message" === t2 && this._appendMessage({ messageId: n2, message: s2 });
    }
    _appendMessage({ messageId: e2, message: t2 } = {}) {
      this.emit("message", t2);
    }
    _end({ messageId: e2, message: t2 } = {}) {
      this.emit("end", t2), this.close();
    }
    _initMessageListener() {
      uni.onPushMessage(this._uniPushMessageCallback);
    }
    _destroy() {
      uni.offPushMessage(this._uniPushMessageCallback);
    }
    toJSON() {
      return { appId: this._appId, pushClientId: this._pushClientId, seqId: this._seqId };
    }
    close() {
      this._destroy(), this.emit("close");
    }
  }
  async function Xs(e2) {
    {
      const { osName: e3, osVersion: t3 } = he();
      "ios" === e3 && function(e4) {
        if (!e4 || "string" != typeof e4)
          return 0;
        const t4 = e4.match(/^(\d+)./);
        return t4 && t4[1] ? parseInt(t4[1]) : 0;
      }(t3) >= 14 && console.warn("iOS 14及以上版本连接uniCloud本地调试服务需要允许客户端查找并连接到本地网络上的设备（仅开发期间需要，发行后不需要）");
    }
    const t2 = e2.__dev__;
    if (!t2.debugInfo)
      return;
    const { address: n2, servePort: s2 } = t2.debugInfo, { address: r2 } = await Et(n2, s2);
    if (r2)
      return t2.localAddress = r2, void (t2.localPort = s2);
    const i2 = console["error"];
    let o2 = "";
    if ("remote" === t2.debugInfo.initialLaunchType ? (t2.debugInfo.forceRemote = true, o2 = "当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。") : o2 = "无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。", o2 += "\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试\n- 检查系统防火墙是否拦截了HBuilderX自带的nodejs\n- 检查是否错误的使用拦截器修改uni.request方法的参数", 0 === A.indexOf("mp-") && (o2 += "\n- 小程序中如何使用uniCloud，请参考：https://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), !t2.debugInfo.forceRemote)
      throw new Error(o2);
    i2(o2);
  }
  function Zs(e2) {
    e2._initPromiseHub || (e2._initPromiseHub = new v({ createPromise: function() {
      let t2 = Promise.resolve();
      var n2;
      n2 = 1, t2 = new Promise((e3) => {
        setTimeout(() => {
          e3();
        }, n2);
      });
      const s2 = e2.auth();
      return t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously());
    } }));
  }
  const er = { tcb: xt, tencent: xt, aliyun: me, private: Ut, dcloud: Ut, alipay: Wt };
  let tr = new class {
    init(e2) {
      let t2 = {};
      const n2 = er[e2.provider];
      if (!n2)
        throw new Error("未提供正确的provider参数");
      t2 = n2.init(e2), function(e3) {
        const t3 = {};
        e3.__dev__ = t3, t3.debugLog = "app" === A;
        const n3 = P;
        n3 && !n3.code && (t3.debugInfo = n3);
        const s2 = new v({ createPromise: function() {
          return Xs(e3);
        } });
        t3.initLocalNetwork = function() {
          return s2.exec();
        };
      }(t2), Zs(t2), Xn(t2), function(e3) {
        const t3 = e3.uploadFile;
        e3.uploadFile = function(e4) {
          return t3.call(this, e4);
        };
      }(t2), function(e3) {
        e3.database = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).database();
          if (this._database)
            return this._database;
          const n3 = us(hs, { uniClient: e3 });
          return this._database = n3, n3;
        }, e3.databaseForJQL = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).databaseForJQL();
          if (this._databaseForJQL)
            return this._databaseForJQL;
          const n3 = us(hs, { uniClient: e3, isJQL: true });
          return this._databaseForJQL = n3, n3;
        };
      }(t2), function(e3) {
        e3.getCurrentUserInfo = Ks, e3.chooseAndUploadFile = js.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
          return Bs(e3);
        } }), e3.SSEChannel = Qs, e3.initSecureNetworkByWeixin = Vs(e3), e3.setCustomClientInfo = Gs, e3.importObject = Ws(e3);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
        if (!t2[e3])
          return;
        const n3 = t2[e3];
        t2[e3] = function() {
          return n3.apply(t2, Array.from(arguments));
        }, t2[e3] = (/* @__PURE__ */ function(e4, t3) {
          return function(n4) {
            let s2 = false;
            if ("callFunction" === t3) {
              const e5 = n4 && n4.type || c;
              s2 = e5 !== c;
            }
            const r2 = "callFunction" === t3 && !s2, i2 = this._initPromiseHub.exec();
            n4 = n4 || {};
            const { success: o2, fail: a2, complete: u2 } = ne(n4), h2 = i2.then(() => s2 ? Promise.resolve() : K(F(t3, "invoke"), n4)).then(() => e4.call(this, n4)).then((e5) => s2 ? Promise.resolve(e5) : K(F(t3, "success"), e5).then(() => K(F(t3, "complete"), e5)).then(() => (r2 && X(B, { type: z, content: e5 }), Promise.resolve(e5))), (e5) => s2 ? Promise.reject(e5) : K(F(t3, "fail"), e5).then(() => K(F(t3, "complete"), e5)).then(() => (X(B, { type: z, content: e5 }), Promise.reject(e5))));
            if (!(o2 || a2 || u2))
              return h2;
            h2.then((e5) => {
              o2 && o2(e5), u2 && u2(e5), r2 && X(B, { type: z, content: e5 });
            }, (e5) => {
              a2 && a2(e5), u2 && u2(e5), r2 && X(B, { type: z, content: e5 });
            });
          };
        }(t2[e3], e3)).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e2 = C;
    let t2 = {};
    if (e2 && 1 === e2.length)
      t2 = e2[0], tr = tr.init(t2), tr._isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
      let n2;
      n2 = e2 && e2.length > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" : "应用未关联服务空间，请在uniCloud目录右键关联服务空间", t3.forEach((e3) => {
        tr[e3] = function() {
          return console.error(n2), Promise.reject(new se({ code: "SYS_ERR", message: n2 }));
        };
      });
    }
    if (Object.assign(tr, { get mixinDatacom() {
      return Bs(tr);
    } }), Ns(tr), tr.addInterceptor = M, tr.removeInterceptor = q, tr.interceptObject = j, uni.__uniCloud = tr, "app" === A) {
      const e3 = U();
      e3.uniCloud = tr, e3.UniCloudError = se;
    }
  })();
  var nr = tr;
  const en = {
    "uni-load-more.contentdown": "Pull up to show more",
    "uni-load-more.contentrefresh": "loading...",
    "uni-load-more.contentnomore": "No more data"
  };
  const zhHans = {
    "uni-load-more.contentdown": "上拉显示更多",
    "uni-load-more.contentrefresh": "正在加载...",
    "uni-load-more.contentnomore": "没有更多数据了"
  };
  const zhHant = {
    "uni-load-more.contentdown": "上拉顯示更多",
    "uni-load-more.contentrefresh": "正在加載...",
    "uni-load-more.contentnomore": "沒有更多數據了"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  let platform;
  setTimeout(() => {
    platform = uni.getSystemInfoSync().platform;
  }, 16);
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$a = {
    name: "UniLoadMore",
    emits: ["clickLoadMore"],
    props: {
      status: {
        // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
        type: String,
        default: "more"
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      iconType: {
        type: String,
        default: "auto"
      },
      iconSize: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: "#777777"
      },
      contentText: {
        type: Object,
        default() {
          return {
            contentdown: "",
            contentrefresh: "",
            contentnomore: ""
          };
        }
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        webviewHide: false,
        platform,
        imgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZVHb98LM+F5bHL8khA1iSeiyQBCRM+YGqKUnnJTDLGI0BGZlKDIU2MMglUiDApEZvSsZnQtBRJtKwQNKQMFYeRDR10WOLd8ljYXdh+v8v5fR3Od+797t1dnOnO/Ofce77z+J//+b/P+ZqtXbs2sJ9MJhNUV1cHJ06cCJo3bx7EPc2aNcvpy7pWrVoF+/fvDyoqKoI2bdoE9fX1F7TjN8a+EXBn/fkfvw942Tf+wYMHg9mzZwfjxo0LDhw4EPa1x2MbFw/fOGfPng1qa2tzcCkILsLDydq2bRsunpOTMM7TD/W/tZDZhPdeKD+yGxHhdu3aBV27dg3OnDlzMVANMheLAO3btw8KCwuDmpoaX5OxbgUIMEq7K8IcPnw4KCsrC/r37x8cP378/4cAXAB3vqSkJMuiDhTkw+XcuXNhOWbMmKBly5YhUT8xArhyFvP0BfwRsAuwxJZJsm/nzp2DTp06he/OU+cZ64K6o0ePBkOHDg2GDx8e6gEbJ5Q/NHNuAJQ1hgBeHUDlR7nVTkY8rQAvAi4z34vR/mPs1FoRsaCgIJThI0eOBC1atEiFGGV+5MiRoS45efJkqFjJFXV1dQuA012m2WcwTw98fy6CqBdsaiIO4CScrGPHjvk4odhavPquRtFWXEC25VgkREKOCh/qDSq+vn37htzD/mZTOmOc5U7zKzBPEedygWshcDyWvs30igAbU+6oyMgJBCFhwQE0fccxN60Ay9iebbjoDh06hMowjQxT4fXq1SskArmHZpkArvixp/kWzHdMeArExSJEaiXIjjRjRJ4DaAGWpibLzXN3Fm1vA5teBgh3j1Rv3bp1YgKwPdmf2p9zcyNYYgPKMfY0T5f5nNYdw158nJ8QawW4CLKwiOBSEgO/hok2eBydR+3dYH+PLxA5J8Vv0KBBwenTp0P2JWAx6+yFEBfs8lMY+y0SWMBNI9E4ThKi58VKTg3FQZS1RQF1cz27eC0QHMu+3E0SkUowjhVt5VdaWhp07949ZHv2Qd1EjDXM2cla1M0nl3GxAs3J9yREzyTdFVKVFOaE9qRA8GM0WebRuo9JGZKA7Mv2SeS/Z8+eoQ9BArMfFrLGo6jvxbhHbJZnKX2Rzz1O7QhJJ9Cs2ZMaWIyq/zhdeqPNfIoHd58clIQD+JSXl4dKlyIAuBdVXZwFVWKspSSoxE++h8x4k3uCnEhE4I5KwRiFWGOU0QWKiCYLbdoRMRKAu2kQ9vkfLU6dOhX06NEjlH+yMRZSinnuyWnYosVcji8CEA/6Cg2JF+IIUBqnGKUTCNwtwBN4f89RiK1R96DEgO2o0NDmtEdvVFdVVYV+P3UAPUEs6GFwV3PHmXkD4vh74iDFJysVI/MlaQhwKeBNTLYX5VuA8T4/gZxA4MRGFxDB6R7OmYPfyykGRJbyie+XnGYnQIC/coH9+vULiYrxrkL9ZA9+0ykaHIfEpM7ge8TiJ2CsHYwyMfafAF1yCGBHYIbCVDjDjKt7BeB51D+LgQa6OkG7IDYEEtvQ7lnXLKLtLdLuJBpE4gPUXcW2+PkZwOex+4cGDhwYDBkyRL7/HFcEwUGPo/8uWRUpYnfxGHco8HkewLHLyYmAawAPuIFZxhOpDfJQ8gbUv41yORAptMWBNr6oqMhWird5+u+iHmBb2nhjDV7HWBNQTgK8y11l5NetWzc5ULscAtSj7nbNI0skhWeUZCc0W4nyH/jO4Vz0u1IeYhbk4AiwM6tjxIWByHsoZ9qcIBPJd/y+DwPfBESOmCa/QF3WiZHucLlEDpNxcNhmheEOPgdQNx6/VZFQzFZ5TN08AHXQt2Ii3EdyFuUsPtTcGPhW5iMiCNELvz+Gdn9huG4HUJaW/w3g0wxV0XaG7arG2WeKiUWYM4Y7GO5ezshTARbbWGw/DvXkpp/ivVvE0JVoMxN4rpGzJMhE5Pl+xlATsDIqikP9F9D2z3h9nOksEUFhK+qO4rcPkoalMQ/HqJLIyb3F3JdjrCcw1yZ8joyJLR5gCo54etlag7qIoeNh1N1BRYj3DTFJ0elotxPlVzkGuYAmL0VSJVGAJA41c4Z6A3BzTLfn0HYwYKEI6CUAMzZEWvLsIcQOo1AmmyyM72nHJCfYsogflGV6jEk9vyQZXSuq6w4c16NsGcGZbwOPr+H1RkOk2LEzjNepxQkihHSCQ4ynAYNRx2zMKV92CQMWqj8J0BRE8EShxRFN6YrfCRhC0x3r/Zm4IbQCcmJoV0kMamllccR6FjHqUC5F2R/wS2dcymOlfAKOS4KmzQb5cpNC2MC7JhVn5wjXoJ44rYhLh8n0eXOCorJxa7POjbSlCGVczr34/RsAmrcvo9s+wGp3tzVhntxiXiJ4nvEYb4FJkf0O8HocAePmLvCxnL0AORraVekJk6TYjDabRVXfRE2lCN1h6ZQRN1+InUbsCpKwoBZHh0dODN9JBCUffItXxEavTQkUtnfTVAplCWL3JISz29h4NjotnuSsQKJCk8dF+kJR6RARjrqFVmfPnj3ZbK8cIJ0msd6jgHPGtfVTQ8VLmlvh4mct9sobRmPic0DyDQQnx/NlfYUgyz59+oScsH379pAwXABD32nTpoUHIToESeI5mnbE/UqDdyLcafEBf2MCqgC7NwxIbMREJQ0g4D4sfJwnD+AmRrII05cfMWJE+L1169bQr+fip06dGp4oJ83lmYd5wj/EmMa4TaHivo4EeCguYZBnkB5g2aWA69OIEnUHOaGysjIYMGBAMGnSpODYsWPZwCpFmm4lNq+4gSLQA7jcX8DwtjEyRC8wjabnXEx9kfWnTJkSJkAo90xpJVV+FmcVNeYAF5zWngS4C4O91MBxmAv8blLEpbjI5sz9MTdAhcgkCT1RO8mZkAjfiYpTEvStAS53Uw1vAiUGgZ3GpuQEYvoiBqlIan7kSDHnTwJQFNiPu0+5VxCVYhcZIjNrdXUDdp+Eq5AZ3Gkg8QAyVZRZIk4Tl4QAbF9cXJxNYZMAtAokgs4BrNxEpCtteXg7DDTMDKYNSuQdKsnJBek7HxewvxaosWxLYXtw+cJp18217wql4aKCfBNoEu0O5VU+PhctJ0YeXD4C6JQpyrlpSLTojpGGGN5YwNziChdIZLk4lvLcFJ9jMX3QdiImY9bmGQU+TRUL5CHITTRlgF8D9ouD1MfmLoEPl5xokIumZ2cfgMpHt47IW9N64Hsh7wQYYjyIugWuF5fCqYncXRd5vPMWyizzvhi/32+nvG0dZc9vR6fZOu0md5e+uC408FvKSIOZwXlGvxPv95izA2Vtvg1xKFWARI+vMX66HUhpQQb643uW1bSjuTWyw2SBvDrBvjFic1eGGlz5esq3ko9uSIlBRqPuFcCv8F4WIcN12nVaBd0SaYwI6PDDImR11JkqgHcPmQssjxIn6bUshygDFJUTxPMpHk+jfjPgupgdnYV2R/g7xSjtpah8RJBewhwf0gGK6XI92u4wXFEU40afJ4DN4h5LcAd+40HI3JgJecuT0c062W0i2hQJUTcxan3/CMW1PF2K6bbA+Daz4xRs1D3Br1Cm0OihKCqizW78/nXAF/G5TXrEcVzaNMH6CyMswqsAHqDyDLEyou8lwOXnKF8DjI6KjV3KzMBiXkDH8ij/H214J5A596ekrZ3F0zXlWeL7+P5eUrNo3/QwC15uxthuzidy7DzKRwEDaAViiDgKbTbz7CJnzo0bN7pIfIiid8SuPwn25o3QCmpnyjlZkyxPP8EomCJzrGb7GJMx7tNsq4MT2xMUYaiErZOluTzKsnz3gwCeCZyVRZJfYplNEokEjwrPtxlxjeYAk+F1F74VAzPxQRNYYdtpOUvWs8J1sGhBJMNsb7igN8plJs1eSmLIhLKE4rvaCX27gOhLpLOsIzJ7qn/i+wZzcvSOZ23/du8TZjwV8zHIXoP4R3ifBxiFz1dcVpa3aPntPE+c6TmIWE9EtcMmAcPdWAhYhAXxcLOQi9L1WhD1Sc8p1d2oL7XGiRKp8F4A2i8K/nfI+y/gsTDJ/YC/8+AD5Uh04KHiGl+cIFPnBDDrPMjwRGkLXyxO4VGbfQWnDH2v0bVWE3C9QOXlepbgjEfIJQI6XDG3z5ahD9cw2pS78ipB85wyScNTvsVzlzzhL8/jRrnmVjfFJK/m3m4nj9vbgQTguT8XZTjsm672R5uJKEaQmBI/c58gyus8ZDagLpEVSJBIyHp4jn++xqPV71OgQgJYEWOtZ/haxRtKmWOBu8xdBLftWltsY84zE6WIEy/eIOWL+BaayMx+KHtL7EAkqdNDLiEXmEMUHniedtJqg9HmZtfvt26vNi0BdG3Ft3g8ZOf7PAu59TxtzivLNIekyi+wD1i8CuUiD9FXAa8C+/xS3JPmZnomyc7H+fb4/Se0bk41Fel621r4cgVxbq91V4jVqwB7HTe2M7jgB+QWHavZkDRPmZcASoZEmBx6i75bGjPcMdL4/VKGFAGWZkGzPG0XAbdL9A81G5LOmUnC9hHKJeO7dcUMjblSl12867ElFTtaGl20xvvLGPdVz/8TVuU7y0x1PG7vtNg24oz9Uo/Z412++VFWI7Fcog9tu9Lm6gvRmIPv9x1xmQAu6RDkXtbOtlGEmpgD5Nvnyc0dcv0EE6cfdi1HmhMf9wDF3k3gtRvEedhxjpgfqPb9PU9iEJHnyOUA7bQUXh6kq/D7l2iTjWv7XOD530BDr8jIrus+srXjt4MzumJMHuTsBa63YKE1+RR5lBjEikCCnWKWiHdzOgKO+nRIBAF88za/IFmJ3eMZov4CYxGBabcpGL8EYx+SeMXJeRwHNsV/h+vdxeuhEpN3ZyNY78Gm2fknJxVGhyjixPiQvVkNzT1elD9Py/aTAL64Hb9vcYmC9zfdXdT/C1LeGbg4rnBaAihDFJH12W5ulfNCNe/xTsP3bp8ikzJs5BF+5PNfAQYAPaseTdsEcaYAAAAASUVORK5CYII="
      };
    },
    computed: {
      iconSnowWidth() {
        return (Math.floor(this.iconSize / 24) || 1) * 2;
      },
      contentdownText() {
        return this.contentText.contentdown || t("uni-load-more.contentdown");
      },
      contentrefreshText() {
        return this.contentText.contentrefresh || t("uni-load-more.contentrefresh");
      },
      contentnomoreText() {
        return this.contentText.contentnomore || t("uni-load-more.contentnomore");
      }
    },
    mounted() {
      var pages2 = getCurrentPages();
      var page = pages2[pages2.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    },
    methods: {
      onClick() {
        this.$emit("clickLoadMore", {
          detail: {
            status: this.status
          }
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.webviewHide && ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--android-MP"
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : !$data.webviewHide && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--ios-H5"
        },
        [
          vue.createElementVNode("image", {
            src: $data.imgBase64,
            mode: "widthFix"
          }, null, 8, ["src"])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      $props.showText ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 2,
          class: "uni-load-more__text",
          style: vue.normalizeStyle({ color: $props.color })
        },
        vue.toDisplayString($props.status === "more" ? $options.contentdownText : $props.status === "loading" ? $options.contentrefreshText : $options.contentnomoreText),
        5
        /* TEXT, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-9245e42c"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  const _sfc_main$9 = {
    name: "uniDataChecklist",
    mixins: [nr.mixinDatacom || {}],
    emits: ["input", "update:modelValue", "change"],
    props: {
      mode: {
        type: String,
        default: "default"
      },
      multiple: {
        type: Boolean,
        default: false
      },
      value: {
        type: [Array, String, Number],
        default() {
          return "";
        }
      },
      // TODO vue3
      modelValue: {
        type: [Array, String, Number],
        default() {
          return "";
        }
      },
      localdata: {
        type: Array,
        default() {
          return [];
        }
      },
      min: {
        type: [Number, String],
        default: ""
      },
      max: {
        type: [Number, String],
        default: ""
      },
      wrap: {
        type: Boolean,
        default: false
      },
      icon: {
        type: String,
        default: "left"
      },
      selectedColor: {
        type: String,
        default: ""
      },
      selectedTextColor: {
        type: String,
        default: ""
      },
      emptyText: {
        type: String,
        default: "暂无数据"
      },
      disabled: {
        type: Boolean,
        default: false
      },
      map: {
        type: Object,
        default() {
          return {
            text: "text",
            value: "value"
          };
        }
      }
    },
    watch: {
      localdata: {
        handler(newVal) {
          this.range = newVal;
          this.dataList = this.getDataList(this.getSelectedValue(newVal));
        },
        deep: true
      },
      mixinDatacomResData(newVal) {
        this.range = newVal;
        this.dataList = this.getDataList(this.getSelectedValue(newVal));
      },
      value(newVal) {
        this.dataList = this.getDataList(newVal);
      },
      modelValue(newVal) {
        this.dataList = this.getDataList(newVal);
      }
    },
    data() {
      return {
        dataList: [],
        range: [],
        contentText: {
          contentdown: "查看更多",
          contentrefresh: "加载中",
          contentnomore: "没有更多"
        },
        isLocal: true,
        styles: {
          selectedColor: "#2979ff",
          selectedTextColor: "#666"
        },
        isTop: 0
      };
    },
    computed: {
      dataValue() {
        if (this.value === "")
          return this.modelValue;
        if (this.modelValue === "")
          return this.value;
        return this.value;
      }
    },
    created() {
      if (this.localdata && this.localdata.length !== 0) {
        this.isLocal = true;
        this.range = this.localdata;
        this.dataList = this.getDataList(this.getSelectedValue(this.range));
      } else {
        if (this.collection) {
          this.isLocal = false;
          this.loadData();
        }
      }
    },
    methods: {
      loadData() {
        this.mixinDatacomGet().then((res) => {
          this.mixinDatacomResData = res.result.data;
          if (this.mixinDatacomResData.length === 0) {
            this.isLocal = false;
            this.mixinDatacomErrorMessage = this.emptyText;
          } else {
            this.isLocal = true;
          }
        }).catch((err) => {
          this.mixinDatacomErrorMessage = err.message;
        });
      },
      /**
       * 获取父元素实例
       */
      getForm(name = "uniForms") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      },
      change(e2) {
        const values = e2.detail.value;
        let detail = {
          value: [],
          data: []
        };
        if (this.multiple) {
          this.range.forEach((item) => {
            if (values.includes(item[this.map.value] + "")) {
              detail.value.push(item[this.map.value]);
              detail.data.push(item);
            }
          });
        } else {
          const range = this.range.find((item) => item[this.map.value] + "" === values);
          if (range) {
            detail = {
              value: range[this.map.value],
              data: range
            };
          }
        }
        this.$emit("input", detail.value);
        this.$emit("update:modelValue", detail.value);
        this.$emit("change", {
          detail
        });
        if (this.multiple) {
          this.dataList = this.getDataList(detail.value, true);
        } else {
          this.dataList = this.getDataList(detail.value);
        }
      },
      /**
       * 获取渲染的新数组
       * @param {Object} value 选中内容
       */
      getDataList(value) {
        let dataList = JSON.parse(JSON.stringify(this.range));
        let list = [];
        if (this.multiple) {
          if (!Array.isArray(value)) {
            value = [];
          }
        }
        dataList.forEach((item, index) => {
          item.disabled = item.disable || item.disabled || false;
          if (this.multiple) {
            if (value.length > 0) {
              let have = value.find((val) => val === item[this.map.value]);
              item.selected = have !== void 0;
            } else {
              item.selected = false;
            }
          } else {
            item.selected = value === item[this.map.value];
          }
          list.push(item);
        });
        return this.setRange(list);
      },
      /**
       * 处理最大最小值
       * @param {Object} list
       */
      setRange(list) {
        let selectList = list.filter((item) => item.selected);
        let min = Number(this.min) || 0;
        let max = Number(this.max) || "";
        list.forEach((item, index) => {
          if (this.multiple) {
            if (selectList.length <= min) {
              let have = selectList.find((val) => val[this.map.value] === item[this.map.value]);
              if (have !== void 0) {
                item.disabled = true;
              }
            }
            if (selectList.length >= max && max !== "") {
              let have = selectList.find((val) => val[this.map.value] === item[this.map.value]);
              if (have === void 0) {
                item.disabled = true;
              }
            }
          }
          this.setStyles(item, index);
          list[index] = item;
        });
        return list;
      },
      /**
       * 设置 class
       * @param {Object} item
       * @param {Object} index
       */
      setStyles(item, index) {
        item.styleBackgroud = this.setStyleBackgroud(item);
        item.styleIcon = this.setStyleIcon(item);
        item.styleIconText = this.setStyleIconText(item);
        item.styleRightIcon = this.setStyleRightIcon(item);
      },
      /**
       * 获取选中值
       * @param {Object} range
       */
      getSelectedValue(range) {
        if (!this.multiple)
          return this.dataValue;
        let selectedArr = [];
        range.forEach((item) => {
          if (item.selected) {
            selectedArr.push(item[this.map.value]);
          }
        });
        return this.dataValue.length > 0 ? this.dataValue : selectedArr;
      },
      /**
       * 设置背景样式
       */
      setStyleBackgroud(item) {
        let styles = {};
        let selectedColor = this.selectedColor ? this.selectedColor : "#2979ff";
        if (this.selectedColor) {
          if (this.mode !== "list") {
            styles["border-color"] = item.selected ? selectedColor : "#DCDFE6";
          }
          if (this.mode === "tag") {
            styles["background-color"] = item.selected ? selectedColor : "#f5f5f5";
          }
        }
        let classles = "";
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      },
      setStyleIcon(item) {
        let styles = {};
        let classles = "";
        if (this.selectedColor) {
          let selectedColor = this.selectedColor ? this.selectedColor : "#2979ff";
          styles["background-color"] = item.selected ? selectedColor : "#fff";
          styles["border-color"] = item.selected ? selectedColor : "#DCDFE6";
          if (!item.selected && item.disabled) {
            styles["background-color"] = "#F2F6FC";
            styles["border-color"] = item.selected ? selectedColor : "#DCDFE6";
          }
        }
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      },
      setStyleIconText(item) {
        let styles = {};
        let classles = "";
        if (this.selectedColor) {
          let selectedColor = this.selectedColor ? this.selectedColor : "#2979ff";
          if (this.mode === "tag") {
            styles.color = item.selected ? this.selectedTextColor ? this.selectedTextColor : "#fff" : "#666";
          } else {
            styles.color = item.selected ? this.selectedTextColor ? this.selectedTextColor : selectedColor : "#666";
          }
          if (!item.selected && item.disabled) {
            styles.color = "#999";
          }
        }
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      },
      setStyleRightIcon(item) {
        let styles = {};
        let classles = "";
        if (this.mode === "list") {
          styles["border-color"] = item.selected ? this.styles.selectedColor : "#DCDFE6";
        }
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "uni-data-checklist",
        style: vue.normalizeStyle({ "margin-top": $data.isTop + "px" })
      },
      [
        !$data.isLocal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-data-loading"
        }, [
          !_ctx.mixinDatacomErrorMessage ? (vue.openBlock(), vue.createBlock(_component_uni_load_more, {
            key: 0,
            status: "loading",
            iconType: "snow",
            iconSize: 18,
            "content-text": $data.contentText
          }, null, 8, ["content-text"])) : (vue.openBlock(), vue.createElementBlock(
            "text",
            { key: 1 },
            vue.toDisplayString(_ctx.mixinDatacomErrorMessage),
            1
            /* TEXT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            $props.multiple ? (vue.openBlock(), vue.createElementBlock(
              "checkbox-group",
              {
                key: 0,
                class: vue.normalizeClass(["checklist-group", { "is-list": $props.mode === "list" || $props.wrap }]),
                onChange: _cache[0] || (_cache[0] = (...args) => $options.change && $options.change(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.dataList, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "label",
                      {
                        class: vue.normalizeClass(["checklist-box", ["is--" + $props.mode, item.selected ? "is-checked" : "", $props.disabled || !!item.disabled ? "is-disable" : "", index !== 0 && $props.mode === "list" ? "is-list-border" : ""]]),
                        style: vue.normalizeStyle(item.styleBackgroud),
                        key: index
                      },
                      [
                        vue.createElementVNode("checkbox", {
                          class: "hidden",
                          hidden: "",
                          disabled: $props.disabled || !!item.disabled,
                          value: item[$props.map.value] + "",
                          checked: item.selected
                        }, null, 8, ["disabled", "value", "checked"]),
                        $props.mode !== "tag" && $props.mode !== "list" || $props.mode === "list" && $props.icon === "left" ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 0,
                            class: "checkbox__inner",
                            style: vue.normalizeStyle(item.styleIcon)
                          },
                          [
                            vue.createElementVNode("view", { class: "checkbox__inner-icon" })
                          ],
                          4
                          /* STYLE */
                        )) : vue.createCommentVNode("v-if", true),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["checklist-content", { "list-content": $props.mode === "list" && $props.icon === "left" }])
                          },
                          [
                            vue.createElementVNode(
                              "text",
                              {
                                class: "checklist-text",
                                style: vue.normalizeStyle(item.styleIconText)
                              },
                              vue.toDisplayString(item[$props.map.text]),
                              5
                              /* TEXT, STYLE */
                            ),
                            $props.mode === "list" && $props.icon === "right" ? (vue.openBlock(), vue.createElementBlock(
                              "view",
                              {
                                key: 0,
                                class: "checkobx__list",
                                style: vue.normalizeStyle(item.styleBackgroud)
                              },
                              null,
                              4
                              /* STYLE */
                            )) : vue.createCommentVNode("v-if", true)
                          ],
                          2
                          /* CLASS */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              34
              /* CLASS, NEED_HYDRATION */
            )) : (vue.openBlock(), vue.createElementBlock(
              "radio-group",
              {
                key: 1,
                class: vue.normalizeClass(["checklist-group", { "is-list": $props.mode === "list", "is-wrap": $props.wrap }]),
                onChange: _cache[1] || (_cache[1] = (...args) => $options.change && $options.change(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.dataList, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "label",
                      {
                        class: vue.normalizeClass(["checklist-box", ["is--" + $props.mode, item.selected ? "is-checked" : "", $props.disabled || !!item.disabled ? "is-disable" : "", index !== 0 && $props.mode === "list" ? "is-list-border" : ""]]),
                        style: vue.normalizeStyle(item.styleBackgroud),
                        key: index
                      },
                      [
                        vue.createElementVNode("radio", {
                          class: "hidden",
                          hidden: "",
                          disabled: $props.disabled || item.disabled,
                          value: item[$props.map.value] + "",
                          checked: item.selected
                        }, null, 8, ["disabled", "value", "checked"]),
                        $props.mode !== "tag" && $props.mode !== "list" || $props.mode === "list" && $props.icon === "left" ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 0,
                            class: "radio__inner",
                            style: vue.normalizeStyle(item.styleBackgroud)
                          },
                          [
                            vue.createElementVNode(
                              "view",
                              {
                                class: "radio__inner-icon",
                                style: vue.normalizeStyle(item.styleIcon)
                              },
                              null,
                              4
                              /* STYLE */
                            )
                          ],
                          4
                          /* STYLE */
                        )) : vue.createCommentVNode("v-if", true),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["checklist-content", { "list-content": $props.mode === "list" && $props.icon === "left" }])
                          },
                          [
                            vue.createElementVNode(
                              "text",
                              {
                                class: "checklist-text",
                                style: vue.normalizeStyle(item.styleIconText)
                              },
                              vue.toDisplayString(item[$props.map.text]),
                              5
                              /* TEXT, STYLE */
                            ),
                            $props.mode === "list" && $props.icon === "right" ? (vue.openBlock(), vue.createElementBlock(
                              "view",
                              {
                                key: 0,
                                style: vue.normalizeStyle(item.styleRightIcon),
                                class: "checkobx__list"
                              },
                              null,
                              4
                              /* STYLE */
                            )) : vue.createCommentVNode("v-if", true)
                          ],
                          2
                          /* CLASS */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              34
              /* CLASS, NEED_HYDRATION */
            ))
          ],
          64
          /* STABLE_FRAGMENT */
        ))
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-149d584b"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.vue"]]);
  const ERR_MSG_OK = "chooseAndUploadFile:ok";
  const ERR_MSG_FAIL = "chooseAndUploadFile:fail";
  function chooseImage(opts) {
    const {
      count,
      sizeType = ["original", "compressed"],
      sourceType,
      extension
    } = opts;
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count,
        sizeType,
        sourceType,
        extension,
        success(res) {
          resolve(normalizeChooseAndUploadFileRes(res, "image"));
        },
        fail(res) {
          reject({
            errMsg: res.errMsg.replace("chooseImage:fail", ERR_MSG_FAIL)
          });
        }
      });
    });
  }
  function chooseVideo(opts) {
    const {
      count,
      camera,
      compressed,
      maxDuration,
      sourceType,
      extension
    } = opts;
    return new Promise((resolve, reject) => {
      uni.chooseVideo({
        camera,
        compressed,
        maxDuration,
        sourceType,
        extension,
        success(res) {
          const {
            tempFilePath,
            duration,
            size,
            height,
            width
          } = res;
          resolve(normalizeChooseAndUploadFileRes({
            errMsg: "chooseVideo:ok",
            tempFilePaths: [tempFilePath],
            tempFiles: [{
              name: res.tempFile && res.tempFile.name || "",
              path: tempFilePath,
              size,
              type: res.tempFile && res.tempFile.type || "",
              width,
              height,
              duration,
              fileType: "video",
              cloudPath: ""
            }]
          }, "video"));
        },
        fail(res) {
          reject({
            errMsg: res.errMsg.replace("chooseVideo:fail", ERR_MSG_FAIL)
          });
        }
      });
    });
  }
  function chooseAll(opts) {
    const {
      count,
      extension
    } = opts;
    return new Promise((resolve, reject) => {
      let chooseFile = uni.chooseFile;
      if (typeof wx !== "undefined" && typeof wx.chooseMessageFile === "function") {
        chooseFile = wx.chooseMessageFile;
      }
      if (typeof chooseFile !== "function") {
        return reject({
          errMsg: ERR_MSG_FAIL + " 请指定 type 类型，该平台仅支持选择 image 或 video。"
        });
      }
      chooseFile({
        type: "all",
        count,
        extension,
        success(res) {
          resolve(normalizeChooseAndUploadFileRes(res));
        },
        fail(res) {
          reject({
            errMsg: res.errMsg.replace("chooseFile:fail", ERR_MSG_FAIL)
          });
        }
      });
    });
  }
  function normalizeChooseAndUploadFileRes(res, fileType) {
    res.tempFiles.forEach((item, index) => {
      if (!item.name) {
        item.name = item.path.substring(item.path.lastIndexOf("/") + 1);
      }
      if (fileType) {
        item.fileType = fileType;
      }
      item.cloudPath = Date.now() + "_" + index + item.name.substring(item.name.lastIndexOf("."));
    });
    if (!res.tempFilePaths) {
      res.tempFilePaths = res.tempFiles.map((file) => file.path);
    }
    return res;
  }
  function uploadCloudFiles(files, max = 5, onUploadProgress) {
    files = JSON.parse(JSON.stringify(files));
    const len = files.length;
    let count = 0;
    let self2 = this;
    return new Promise((resolve) => {
      while (count < max) {
        next();
      }
      function next() {
        let cur = count++;
        if (cur >= len) {
          !files.find((item) => !item.url && !item.errMsg) && resolve(files);
          return;
        }
        const fileItem = files[cur];
        const index = self2.files.findIndex((v2) => v2.uuid === fileItem.uuid);
        fileItem.url = "";
        delete fileItem.errMsg;
        nr.uploadFile({
          filePath: fileItem.path,
          cloudPath: fileItem.cloudPath,
          fileType: fileItem.fileType,
          onUploadProgress: (res) => {
            res.index = index;
            onUploadProgress && onUploadProgress(res);
          }
        }).then((res) => {
          fileItem.url = res.fileID;
          fileItem.index = index;
          if (cur < len) {
            next();
          }
        }).catch((res) => {
          fileItem.errMsg = res.errMsg || res.message;
          fileItem.index = index;
          if (cur < len) {
            next();
          }
        });
      }
    });
  }
  function uploadFiles(choosePromise, {
    onChooseFile,
    onUploadProgress
  }) {
    return choosePromise.then((res) => {
      if (onChooseFile) {
        const customChooseRes = onChooseFile(res);
        if (typeof customChooseRes !== "undefined") {
          return Promise.resolve(customChooseRes).then((chooseRes) => typeof chooseRes === "undefined" ? res : chooseRes);
        }
      }
      return res;
    }).then((res) => {
      if (res === false) {
        return {
          errMsg: ERR_MSG_OK,
          tempFilePaths: [],
          tempFiles: []
        };
      }
      return res;
    });
  }
  function chooseAndUploadFile(opts = {
    type: "all"
  }) {
    if (opts.type === "image") {
      return uploadFiles(chooseImage(opts), opts);
    } else if (opts.type === "video") {
      return uploadFiles(chooseVideo(opts), opts);
    }
    return uploadFiles(chooseAll(opts), opts);
  }
  const get_file_ext = (name) => {
    const last_len = name.lastIndexOf(".");
    const len = name.length;
    return {
      name: name.substring(0, last_len),
      ext: name.substring(last_len + 1, len)
    };
  };
  const get_extname = (fileExtname) => {
    if (!Array.isArray(fileExtname)) {
      let extname = fileExtname.replace(/(\[|\])/g, "");
      return extname.split(",");
    } else {
      return fileExtname;
    }
  };
  const get_files_and_is_max = (res, _extname) => {
    let filePaths = [];
    let files = [];
    if (!_extname || _extname.length === 0) {
      return {
        filePaths,
        files
      };
    }
    res.tempFiles.forEach((v2) => {
      let fileFullName = get_file_ext(v2.name);
      const extname = fileFullName.ext.toLowerCase();
      if (_extname.indexOf(extname) !== -1) {
        files.push(v2);
        filePaths.push(v2.path);
      }
    });
    if (files.length !== res.tempFiles.length) {
      uni.showToast({
        title: `当前选择了${res.tempFiles.length}个文件 ，${res.tempFiles.length - files.length} 个文件格式不正确`,
        icon: "none",
        duration: 5e3
      });
    }
    return {
      filePaths,
      files
    };
  };
  const get_file_info = (filepath) => {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src: filepath,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        }
      });
    });
  };
  const get_file_data = async (files, type = "image") => {
    let fileFullName = get_file_ext(files.name);
    const extname = fileFullName.ext.toLowerCase();
    let filedata = {
      name: files.name,
      uuid: files.uuid,
      extname: extname || "",
      cloudPath: files.cloudPath,
      fileType: files.fileType,
      thumbTempFilePath: files.thumbTempFilePath,
      url: files.path || files.path,
      size: files.size,
      //单位是字节
      image: {},
      path: files.path,
      video: {}
    };
    if (type === "image") {
      const imageinfo = await get_file_info(files.path);
      delete filedata.video;
      filedata.image.width = imageinfo.width;
      filedata.image.height = imageinfo.height;
      filedata.image.location = imageinfo.path;
    } else {
      delete filedata.image;
    }
    return filedata;
  };
  const _sfc_main$8 = {
    name: "uploadImage",
    emits: ["uploadFiles", "choose", "delFile"],
    props: {
      filesList: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      disablePreview: {
        type: Boolean,
        default: false
      },
      limit: {
        type: [Number, String],
        default: 9
      },
      imageStyles: {
        type: Object,
        default() {
          return {
            width: "auto",
            height: "auto",
            border: {}
          };
        }
      },
      delIcon: {
        type: Boolean,
        default: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      styles() {
        let styles = {
          width: "auto",
          height: "auto",
          border: {}
        };
        return Object.assign(styles, this.imageStyles);
      },
      boxStyle() {
        const {
          width = "auto",
          height = "auto"
        } = this.styles;
        let obj = {};
        if (height === "auto") {
          if (width !== "auto") {
            obj.height = this.value2px(width);
            obj["padding-top"] = 0;
          } else {
            obj.height = 0;
          }
        } else {
          obj.height = this.value2px(height);
          obj["padding-top"] = 0;
        }
        if (width === "auto") {
          if (height !== "auto") {
            obj.width = this.value2px(height);
          } else {
            obj.width = "33.3%";
          }
        } else {
          obj.width = this.value2px(width);
        }
        let classles = "";
        for (let i2 in obj) {
          classles += `${i2}:${obj[i2]};`;
        }
        return classles;
      },
      borderStyle() {
        let {
          border
        } = this.styles;
        let obj = {};
        const widthDefaultValue = 1;
        const radiusDefaultValue = 3;
        if (typeof border === "boolean") {
          obj.border = border ? "1px #eee solid" : "none";
        } else {
          let width = border && border.width || widthDefaultValue;
          width = this.value2px(width);
          let radius = border && border.radius || radiusDefaultValue;
          radius = this.value2px(radius);
          obj = {
            "border-width": width,
            "border-style": border && border.style || "solid",
            "border-color": border && border.color || "#eee",
            "border-radius": radius
          };
        }
        let classles = "";
        for (let i2 in obj) {
          classles += `${i2}:${obj[i2]};`;
        }
        return classles;
      }
    },
    methods: {
      uploadFiles(item, index) {
        this.$emit("uploadFiles", item);
      },
      choose() {
        this.$emit("choose");
      },
      delFile(index) {
        this.$emit("delFile", index);
      },
      prviewImage(img, index) {
        let urls = [];
        if (Number(this.limit) === 1 && this.disablePreview && !this.disabled) {
          this.$emit("choose");
        }
        if (this.disablePreview)
          return;
        this.filesList.forEach((i2) => {
          urls.push(i2.url);
        });
        uni.previewImage({
          urls,
          current: index
        });
      },
      value2px(value) {
        if (typeof value === "number") {
          value += "px";
        } else {
          if (value.indexOf("%") === -1) {
            value = value.indexOf("px") !== -1 ? value : value + "px";
          }
        }
        return value;
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-file-picker__container" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.filesList, (item, index) => {
          return vue.openBlock(), vue.createElementBlock(
            "view",
            {
              class: "file-picker__box",
              key: index,
              style: vue.normalizeStyle($options.boxStyle)
            },
            [
              vue.createElementVNode(
                "view",
                {
                  class: "file-picker__box-content",
                  style: vue.normalizeStyle($options.borderStyle)
                },
                [
                  vue.createElementVNode("image", {
                    class: "file-image",
                    src: item.url,
                    mode: "aspectFill",
                    onClick: vue.withModifiers(($event) => $options.prviewImage(item, index), ["stop"])
                  }, null, 8, ["src", "onClick"]),
                  $props.delIcon && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "icon-del-box",
                    onClick: vue.withModifiers(($event) => $options.delFile(index), ["stop"])
                  }, [
                    vue.createElementVNode("view", { class: "icon-del" }),
                    vue.createElementVNode("view", { class: "icon-del rotate" })
                  ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                  item.progress && item.progress !== 100 || item.progress === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "file-picker__progress"
                  }, [
                    vue.createElementVNode("progress", {
                      class: "file-picker__progress-item",
                      percent: item.progress === -1 ? 0 : item.progress,
                      "stroke-width": "4",
                      backgroundColor: item.errMsg ? "#ff5a5f" : "#EBEBEB"
                    }, null, 8, ["percent", "backgroundColor"])
                  ])) : vue.createCommentVNode("v-if", true),
                  item.errMsg ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 2,
                    class: "file-picker__mask",
                    onClick: vue.withModifiers(($event) => $options.uploadFiles(item, index), ["stop"])
                  }, " 点击重试 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ],
                4
                /* STYLE */
              )
            ],
            4
            /* STYLE */
          );
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      $props.filesList.length < $props.limit && !$props.readonly ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: "file-picker__box",
          style: vue.normalizeStyle($options.boxStyle)
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "file-picker__box-content is-add",
              style: vue.normalizeStyle($options.borderStyle),
              onClick: _cache[0] || (_cache[0] = (...args) => $options.choose && $options.choose(...args))
            },
            [
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                vue.createElementVNode("view", { class: "icon-add" }),
                vue.createElementVNode("view", { class: "icon-add rotate" })
              ], true)
            ],
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const uploadImage = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-6f3c6077"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-file-picker/upload-image.vue"]]);
  const _sfc_main$7 = {
    name: "uploadFile",
    emits: ["uploadFiles", "choose", "delFile"],
    props: {
      filesList: {
        type: Array,
        default() {
          return [];
        }
      },
      delIcon: {
        type: Boolean,
        default: true
      },
      limit: {
        type: [Number, String],
        default: 9
      },
      showType: {
        type: String,
        default: ""
      },
      listStyles: {
        type: Object,
        default() {
          return {
            // 是否显示边框
            border: true,
            // 是否显示分隔线
            dividline: true,
            // 线条样式
            borderStyle: {}
          };
        }
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      list() {
        let files = [];
        this.filesList.forEach((v2) => {
          files.push(v2);
        });
        return files;
      },
      styles() {
        let styles = {
          border: true,
          dividline: true,
          "border-style": {}
        };
        return Object.assign(styles, this.listStyles);
      },
      borderStyle() {
        let {
          borderStyle,
          border
        } = this.styles;
        let obj = {};
        if (!border) {
          obj.border = "none";
        } else {
          let width = borderStyle && borderStyle.width || 1;
          width = this.value2px(width);
          let radius = borderStyle && borderStyle.radius || 5;
          radius = this.value2px(radius);
          obj = {
            "border-width": width,
            "border-style": borderStyle && borderStyle.style || "solid",
            "border-color": borderStyle && borderStyle.color || "#eee",
            "border-radius": radius
          };
        }
        let classles = "";
        for (let i2 in obj) {
          classles += `${i2}:${obj[i2]};`;
        }
        return classles;
      },
      borderLineStyle() {
        let obj = {};
        let {
          borderStyle
        } = this.styles;
        if (borderStyle && borderStyle.color) {
          obj["border-color"] = borderStyle.color;
        }
        if (borderStyle && borderStyle.width) {
          let width = borderStyle && borderStyle.width || 1;
          let style = borderStyle && borderStyle.style || 0;
          if (typeof width === "number") {
            width += "px";
          } else {
            width = width.indexOf("px") ? width : width + "px";
          }
          obj["border-width"] = width;
          if (typeof style === "number") {
            style += "px";
          } else {
            style = style.indexOf("px") ? style : style + "px";
          }
          obj["border-top-style"] = style;
        }
        let classles = "";
        for (let i2 in obj) {
          classles += `${i2}:${obj[i2]};`;
        }
        return classles;
      }
    },
    methods: {
      uploadFiles(item, index) {
        this.$emit("uploadFiles", {
          item,
          index
        });
      },
      choose() {
        this.$emit("choose");
      },
      delFile(index) {
        this.$emit("delFile", index);
      },
      value2px(value) {
        if (typeof value === "number") {
          value += "px";
        } else {
          value = value.indexOf("px") !== -1 ? value : value + "px";
        }
        return value;
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-file-picker__files" }, [
      !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "files-button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.choose && $options.choose(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(` :class="{'is-text-box':showType === 'list'}" `),
      $options.list.length > 0 ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          class: "uni-file-picker__lists is-text-box",
          style: vue.normalizeStyle($options.borderStyle)
        },
        [
          vue.createCommentVNode(" ,'is-list-card':showType === 'list-card' "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.list, (item, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  class: vue.normalizeClass(["uni-file-picker__lists-box", {
                    "files-border": index !== 0 && $options.styles.dividline
                  }]),
                  key: index,
                  style: vue.normalizeStyle(index !== 0 && $options.styles.dividline && $options.borderLineStyle)
                },
                [
                  vue.createElementVNode("view", { class: "uni-file-picker__item" }, [
                    vue.createCommentVNode(` :class="{'is-text-image':showType === 'list'}" `),
                    vue.createCommentVNode(' 	<view class="files__image is-text-image">\r\n						<image class="header-image" :src="item.logo" mode="aspectFit"></image>\r\n					</view> '),
                    vue.createElementVNode(
                      "view",
                      { class: "files__name" },
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    $props.delIcon && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "icon-del-box icon-files",
                      onClick: ($event) => $options.delFile(index)
                    }, [
                      vue.createElementVNode("view", { class: "icon-del icon-files" }),
                      vue.createElementVNode("view", { class: "icon-del rotate" })
                    ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ]),
                  item.progress && item.progress !== 100 || item.progress === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "file-picker__progress"
                  }, [
                    vue.createElementVNode("progress", {
                      class: "file-picker__progress-item",
                      percent: item.progress === -1 ? 0 : item.progress,
                      "stroke-width": "4",
                      backgroundColor: item.errMsg ? "#ff5a5f" : "#EBEBEB"
                    }, null, 8, ["percent", "backgroundColor"])
                  ])) : vue.createCommentVNode("v-if", true),
                  item.status === "error" ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "file-picker__mask",
                    onClick: vue.withModifiers(($event) => $options.uploadFiles(item, index), ["stop"])
                  }, " 点击重试 ", 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                ],
                6
                /* CLASS, STYLE */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const uploadFile = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-86fc2bba"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-file-picker/upload-file.vue"]]);
  const _sfc_main$6 = {
    name: "uniFilePicker",
    components: {
      uploadImage,
      uploadFile
    },
    options: {
      virtualHost: true
    },
    emits: ["select", "success", "fail", "progress", "delete", "update:modelValue", "input"],
    props: {
      modelValue: {
        type: [Array, Object],
        default() {
          return [];
        }
      },
      value: {
        type: [Array, Object],
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      disablePreview: {
        type: Boolean,
        default: false
      },
      delIcon: {
        type: Boolean,
        default: true
      },
      // 自动上传
      autoUpload: {
        type: Boolean,
        default: true
      },
      // 最大选择个数 ，h5只能限制单选或是多选
      limit: {
        type: [Number, String],
        default: 9
      },
      // 列表样式 grid | list | list-card
      mode: {
        type: String,
        default: "grid"
      },
      // 选择文件类型  image/video/all
      fileMediatype: {
        type: String,
        default: "image"
      },
      // 文件类型筛选
      fileExtname: {
        type: [Array, String],
        default() {
          return [];
        }
      },
      title: {
        type: String,
        default: ""
      },
      listStyles: {
        type: Object,
        default() {
          return {
            // 是否显示边框
            border: true,
            // 是否显示分隔线
            dividline: true,
            // 线条样式
            borderStyle: {}
          };
        }
      },
      imageStyles: {
        type: Object,
        default() {
          return {
            width: "auto",
            height: "auto"
          };
        }
      },
      readonly: {
        type: Boolean,
        default: false
      },
      returnType: {
        type: String,
        default: "array"
      },
      sizeType: {
        type: Array,
        default() {
          return ["original", "compressed"];
        }
      },
      sourceType: {
        type: Array,
        default() {
          return ["album", "camera"];
        }
      },
      provider: {
        type: String,
        default: ""
        // 默认上传到 unicloud 内置存储 extStorage 扩展存储
      }
    },
    data() {
      return {
        files: [],
        localValue: []
      };
    },
    watch: {
      value: {
        handler(newVal, oldVal) {
          this.setValue(newVal, oldVal);
        },
        immediate: true
      },
      modelValue: {
        handler(newVal, oldVal) {
          this.setValue(newVal, oldVal);
        },
        immediate: true
      }
    },
    computed: {
      filesList() {
        let files = [];
        this.files.forEach((v2) => {
          files.push(v2);
        });
        return files;
      },
      showType() {
        if (this.fileMediatype === "image") {
          return this.mode;
        }
        return "list";
      },
      limitLength() {
        if (this.returnType === "object") {
          return 1;
        }
        if (!this.limit) {
          return 1;
        }
        if (this.limit >= 9) {
          return 9;
        }
        return this.limit;
      }
    },
    created() {
      if (!(nr.config && nr.config.provider)) {
        this.noSpace = true;
        nr.chooseAndUploadFile = chooseAndUploadFile;
      }
      this.form = this.getForm("uniForms");
      this.formItem = this.getForm("uniFormsItem");
      if (this.form && this.formItem) {
        if (this.formItem.name) {
          this.rename = this.formItem.name;
          this.form.inputChildrens.push(this);
        }
      }
    },
    methods: {
      /**
       * 公开用户使用，清空文件
       * @param {Object} index
       */
      clearFiles(index) {
        if (index !== 0 && !index) {
          this.files = [];
          this.$nextTick(() => {
            this.setEmit();
          });
        } else {
          this.files.splice(index, 1);
        }
        this.$nextTick(() => {
          this.setEmit();
        });
      },
      /**
       * 公开用户使用，继续上传
       */
      upload() {
        let files = [];
        this.files.forEach((v2, index) => {
          if (v2.status === "ready" || v2.status === "error") {
            files.push(Object.assign({}, v2));
          }
        });
        return this.uploadFiles(files);
      },
      async setValue(newVal, oldVal) {
        const newData = async (v2) => {
          const reg = /cloud:\/\/([\w.]+\/?)\S*/;
          let url = "";
          if (v2.fileID) {
            url = v2.fileID;
          } else {
            url = v2.url;
          }
          if (reg.test(url)) {
            v2.fileID = url;
            v2.url = await this.getTempFileURL(url);
          }
          if (v2.url)
            v2.path = v2.url;
          return v2;
        };
        if (this.returnType === "object") {
          if (newVal) {
            await newData(newVal);
          } else {
            newVal = {};
          }
        } else {
          if (!newVal)
            newVal = [];
          for (let i2 = 0; i2 < newVal.length; i2++) {
            let v2 = newVal[i2];
            await newData(v2);
          }
        }
        this.localValue = newVal;
        if (this.form && this.formItem && !this.is_reset) {
          this.is_reset = false;
          this.formItem.setValue(this.localValue);
        }
        let filesData = Object.keys(newVal).length > 0 ? newVal : [];
        this.files = [].concat(filesData);
      },
      /**
       * 选择文件
       */
      choose() {
        if (this.disabled)
          return;
        if (this.files.length >= Number(this.limitLength) && this.showType !== "grid" && this.returnType === "array") {
          uni.showToast({
            title: `您最多选择 ${this.limitLength} 个文件`,
            icon: "none"
          });
          return;
        }
        this.chooseFiles();
      },
      /**
       * 选择文件并上传
       */
      chooseFiles() {
        const _extname = get_extname(this.fileExtname);
        nr.chooseAndUploadFile({
          type: this.fileMediatype,
          compressed: false,
          sizeType: this.sizeType,
          sourceType: this.sourceType,
          // TODO 如果为空，video 有问题
          extension: _extname.length > 0 ? _extname : void 0,
          count: this.limitLength - this.files.length,
          //默认9
          onChooseFile: this.chooseFileCallback,
          onUploadProgress: (progressEvent) => {
            this.setProgress(progressEvent, progressEvent.index);
          }
        }).then((result) => {
          this.setSuccessAndError(result.tempFiles);
        }).catch((err) => {
          formatAppLog("log", "at node_modules/@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue:364", "选择失败", err);
        });
      },
      /**
       * 选择文件回调
       * @param {Object} res
       */
      async chooseFileCallback(res) {
        const _extname = get_extname(this.fileExtname);
        const is_one = Number(this.limitLength) === 1 && this.disablePreview && !this.disabled || this.returnType === "object";
        if (is_one) {
          this.files = [];
        }
        let {
          filePaths,
          files
        } = get_files_and_is_max(res, _extname);
        if (!(_extname && _extname.length > 0)) {
          filePaths = res.tempFilePaths;
          files = res.tempFiles;
        }
        let currentData = [];
        for (let i2 = 0; i2 < files.length; i2++) {
          if (this.limitLength - this.files.length <= 0)
            break;
          files[i2].uuid = Date.now();
          let filedata = await get_file_data(files[i2], this.fileMediatype);
          filedata.progress = 0;
          filedata.status = "ready";
          this.files.push(filedata);
          currentData.push({
            ...filedata,
            file: files[i2]
          });
        }
        this.$emit("select", {
          tempFiles: currentData,
          tempFilePaths: filePaths
        });
        res.tempFiles = files;
        if (!this.autoUpload || this.noSpace) {
          res.tempFiles = [];
        }
        res.tempFiles.forEach((fileItem, index) => {
          this.provider && (fileItem.provider = this.provider);
          const fileNameSplit = fileItem.name.split(".");
          const ext = fileNameSplit.pop();
          const fileName = fileNameSplit.join(".").replace(/[\s\/\?<>\\:\*\|":]/g, "_");
          fileItem.cloudPath = fileName + "_" + Date.now() + "_" + index + "." + ext;
        });
      },
      /**
       * 批传
       * @param {Object} e
       */
      uploadFiles(files) {
        files = [].concat(files);
        return uploadCloudFiles.call(this, files, 5, (res) => {
          this.setProgress(res, res.index, true);
        }).then((result) => {
          this.setSuccessAndError(result);
          return result;
        }).catch((err) => {
          formatAppLog("log", "at node_modules/@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue:437", err);
        });
      },
      /**
       * 成功或失败
       */
      async setSuccessAndError(res, fn) {
        let successData = [];
        let errorData = [];
        let tempFilePath = [];
        let errorTempFilePath = [];
        for (let i2 = 0; i2 < res.length; i2++) {
          const item = res[i2];
          const index = item.uuid ? this.files.findIndex((p2) => p2.uuid === item.uuid) : item.index;
          if (index === -1 || !this.files)
            break;
          if (item.errMsg === "request:fail") {
            this.files[index].url = item.path;
            this.files[index].status = "error";
            this.files[index].errMsg = item.errMsg;
            errorData.push(this.files[index]);
            errorTempFilePath.push(this.files[index].url);
          } else {
            this.files[index].errMsg = "";
            this.files[index].fileID = item.url;
            const reg = /cloud:\/\/([\w.]+\/?)\S*/;
            if (reg.test(item.url)) {
              this.files[index].url = await this.getTempFileURL(item.url);
            } else {
              this.files[index].url = item.url;
            }
            this.files[index].status = "success";
            this.files[index].progress += 1;
            successData.push(this.files[index]);
            tempFilePath.push(this.files[index].fileID);
          }
        }
        if (successData.length > 0) {
          this.setEmit();
          this.$emit("success", {
            tempFiles: this.backObject(successData),
            tempFilePaths: tempFilePath
          });
        }
        if (errorData.length > 0) {
          this.$emit("fail", {
            tempFiles: this.backObject(errorData),
            tempFilePaths: errorTempFilePath
          });
        }
      },
      /**
       * 获取进度
       * @param {Object} progressEvent
       * @param {Object} index
       * @param {Object} type
       */
      setProgress(progressEvent, index, type) {
        this.files.length;
        const percentCompleted = Math.round(progressEvent.loaded * 100 / progressEvent.total);
        let idx = index;
        if (!type) {
          idx = this.files.findIndex((p2) => p2.uuid === progressEvent.tempFile.uuid);
        }
        if (idx === -1 || !this.files[idx])
          return;
        this.files[idx].progress = percentCompleted - 1;
        this.$emit("progress", {
          index: idx,
          progress: parseInt(percentCompleted),
          tempFile: this.files[idx]
        });
      },
      /**
       * 删除文件
       * @param {Object} index
       */
      delFile(index) {
        this.$emit("delete", {
          index,
          tempFile: this.files[index],
          tempFilePath: this.files[index].url
        });
        this.files.splice(index, 1);
        this.$nextTick(() => {
          this.setEmit();
        });
      },
      /**
       * 获取文件名和后缀
       * @param {Object} name
       */
      getFileExt(name) {
        const last_len = name.lastIndexOf(".");
        const len = name.length;
        return {
          name: name.substring(0, last_len),
          ext: name.substring(last_len + 1, len)
        };
      },
      /**
       * 处理返回事件
       */
      setEmit() {
        let data2 = [];
        if (this.returnType === "object") {
          data2 = this.backObject(this.files)[0];
          this.localValue = data2 ? data2 : null;
        } else {
          data2 = this.backObject(this.files);
          if (!this.localValue) {
            this.localValue = [];
          }
          this.localValue = [...data2];
        }
        this.$emit("update:modelValue", this.localValue);
      },
      /**
       * 处理返回参数
       * @param {Object} files
       */
      backObject(files) {
        let newFilesData = [];
        files.forEach((v2) => {
          newFilesData.push({
            extname: v2.extname,
            fileType: v2.fileType,
            image: v2.image,
            name: v2.name,
            path: v2.path,
            size: v2.size,
            fileID: v2.fileID,
            url: v2.url,
            // 修改删除一个文件后不能再上传的bug, #694
            uuid: v2.uuid,
            status: v2.status,
            cloudPath: v2.cloudPath
          });
        });
        return newFilesData;
      },
      async getTempFileURL(fileList) {
        fileList = {
          fileList: [].concat(fileList)
        };
        const urls = await nr.getTempFileURL(fileList);
        return urls.fileList[0].tempFileURL || "";
      },
      /**
       * 获取父元素实例
       */
      getForm(name = "uniForms") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_upload_image = vue.resolveComponent("upload-image");
    const _component_upload_file = vue.resolveComponent("upload-file");
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-file-picker" }, [
      $props.title ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "uni-file-picker__header"
      }, [
        vue.createElementVNode(
          "text",
          { class: "file-title" },
          vue.toDisplayString($props.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          { class: "file-count" },
          vue.toDisplayString($options.filesList.length) + "/" + vue.toDisplayString($options.limitLength),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      $props.fileMediatype === "image" && $options.showType === "grid" ? (vue.openBlock(), vue.createBlock(_component_upload_image, {
        key: 1,
        readonly: $props.readonly,
        "image-styles": $props.imageStyles,
        "files-list": $options.filesList,
        limit: $options.limitLength,
        disablePreview: $props.disablePreview,
        delIcon: $props.delIcon,
        onUploadFiles: $options.uploadFiles,
        onChoose: $options.choose,
        onDelFile: $options.delFile
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode("view", { class: "is-add" }, [
              vue.createElementVNode("view", { class: "icon-add" }),
              vue.createElementVNode("view", { class: "icon-add rotate" })
            ])
          ], true)
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["readonly", "image-styles", "files-list", "limit", "disablePreview", "delIcon", "onUploadFiles", "onChoose", "onDelFile"])) : vue.createCommentVNode("v-if", true),
      $props.fileMediatype !== "image" || $options.showType !== "grid" ? (vue.openBlock(), vue.createBlock(_component_upload_file, {
        key: 2,
        readonly: $props.readonly,
        "list-styles": $props.listStyles,
        "files-list": $options.filesList,
        showType: $options.showType,
        delIcon: $props.delIcon,
        onUploadFiles: $options.uploadFiles,
        onChoose: $options.choose,
        onDelFile: $options.delFile
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default", {}, () => [
            vue.createElementVNode("button", {
              type: "primary",
              size: "mini"
            }, "选择文件")
          ], true)
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["readonly", "list-styles", "files-list", "showType", "delIcon", "onUploadFiles", "onChoose", "onDelFile"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-418f48eb"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue"]]);
  const _sfc_main$5 = {
    name: "uniCombox",
    emits: ["input", "update:modelValue"],
    props: {
      clearAble: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: true
      },
      label: {
        type: String,
        default: ""
      },
      labelWidth: {
        type: String,
        default: "auto"
      },
      placeholder: {
        type: String,
        default: ""
      },
      candidates: {
        type: Array,
        default() {
          return [];
        }
      },
      emptyTips: {
        type: String,
        default: "无匹配项"
      },
      modelValue: {
        type: [String, Number],
        default: ""
      }
    },
    data() {
      return {
        showSelector: false,
        inputVal: ""
      };
    },
    computed: {
      labelStyle() {
        if (this.labelWidth === "auto") {
          return "";
        }
        return `width: ${this.labelWidth}`;
      },
      filterCandidates() {
        return this.candidates.filter((item) => {
          return item.toString().indexOf(this.inputVal) > -1;
        });
      },
      filterCandidatesLength() {
        return this.filterCandidates.length;
      }
    },
    watch: {
      modelValue: {
        handler(newVal) {
          this.inputVal = newVal;
        },
        immediate: true
      }
    },
    methods: {
      toggleSelector() {
        this.showSelector = !this.showSelector;
      },
      onFocus() {
        this.showSelector = true;
      },
      onBlur() {
        setTimeout(() => {
          this.showSelector = false;
        }, 153);
      },
      onSelectorClick(index) {
        this.inputVal = this.filterCandidates[index];
        this.showSelector = false;
        this.$emit("input", this.inputVal);
        this.$emit("update:modelValue", this.inputVal);
      },
      onInput() {
        setTimeout(() => {
          this.$emit("input", this.inputVal);
          this.$emit("update:modelValue", this.inputVal);
        });
      },
      clean() {
        this.inputVal = "";
        this.onInput();
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$5);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-combox", $props.border ? "" : "uni-combox__no-border"])
      },
      [
        $props.label ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "uni-combox__label",
            style: vue.normalizeStyle($options.labelStyle)
          },
          [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($props.label),
              1
              /* TEXT */
            )
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "uni-combox__input-box" }, [
          vue.withDirectives(vue.createElementVNode("input", {
            class: "uni-combox__input",
            type: "text",
            placeholder: $props.placeholder,
            "placeholder-class": "uni-combox__input-plac",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.inputVal = $event),
            onInput: _cache[1] || (_cache[1] = (...args) => $options.onInput && $options.onInput(...args)),
            onFocus: _cache[2] || (_cache[2] = (...args) => $options.onFocus && $options.onFocus(...args)),
            onBlur: _cache[3] || (_cache[3] = (...args) => $options.onBlur && $options.onBlur(...args))
          }, null, 40, ["placeholder"]), [
            [vue.vModelText, $data.inputVal]
          ]),
          !$data.inputVal || !$props.clearAble ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
            key: 0,
            type: $data.showSelector ? "top" : "bottom",
            size: "14",
            color: "#999",
            onClick: $options.toggleSelector
          }, null, 8, ["type", "onClick"])) : vue.createCommentVNode("v-if", true),
          $data.inputVal && $props.clearAble ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
            key: 1,
            type: "clear",
            size: "24",
            color: "#999",
            onClick: $options.clean
          }, null, 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
        ]),
        $data.showSelector ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "uni-combox__selector"
        }, [
          vue.createElementVNode("view", { class: "uni-popper__arrow" }),
          vue.createElementVNode("scroll-view", {
            "scroll-y": "true",
            class: "uni-combox__selector-scroll"
          }, [
            $options.filterCandidatesLength === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "uni-combox__selector-empty"
            }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($props.emptyTips),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.filterCandidates, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "uni-combox__selector-item",
                  key: index,
                  onClick: ($event) => $options.onSelectorClick(index)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-a8e6b638"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-combox/uni-combox.vue"]]);
  const _imports_0$2 = "/static/image/AD.svg";
  const _imports_1$1 = "/static/image/template1.png";
  const _imports_2$1 = "/static/image/template2.png";
  const _imports_3$1 = "/static/image/template3.png";
  const userId = "3";
  const buildingId = "39";
  const _sfc_main$4 = {
    __name: "add-disease",
    setup(__props, { expose: __expose }) {
      __expose();
      const popup2 = vue.ref(null);
      const ADImgs = vue.ref([]);
      const isEdit = vue.ref(false);
      const structureData = vue.ref(null);
      const parentObjectName = vue.ref("上部结构");
      const biObjectNameOptions = vue.ref([]);
      const diseaseTypeOptions = vue.ref([]);
      const biObjectName = vue.ref([]);
      const biObjectindex = vue.ref(-1);
      const componentCode = vue.ref(["1", "2", "3"]);
      const componentCodeindex = vue.ref(-1);
      const componentCodePopup = vue.ref(null);
      const filteredComponentCodes = vue.ref([]);
      const componentCodeFilter = vue.ref("");
      const type = vue.ref([]);
      const typeindex = vue.ref(-1);
      const position = vue.ref("");
      const quantity = vue.ref(1);
      const WayofDefect = vue.ref(["数值", "记载方式2", "记载方式3"]);
      const WayofDefectindex = vue.ref(0);
      const length = vue.ref("");
      const width = vue.ref("");
      const slitWidth = vue.ref("");
      const heightOrDepth = vue.ref("");
      const area = vue.ref("");
      const description = vue.ref("");
      const fileList = vue.ref([]);
      const scalesItems = vue.reactive([{
        name: "1级",
        value: "1"
      }, {
        name: "2级",
        value: "2"
      }, {
        name: "3级",
        value: "3"
      }, {
        name: "4级",
        value: "4"
      }]);
      const scalesCurrent = vue.ref(0);
      const ratingItems = vue.reactive([{
        name: "否",
        value: "0"
      }, {
        name: "是",
        value: "1"
      }]);
      const ratingCurrent = vue.ref(0);
      const diseasePosition = vue.ref(["底板", "左翼板", "右翼板", "顶板", "左腹板", "右腹板"]);
      const diseasePositionPopup = vue.ref(null);
      const selectedPosition = vue.ref("");
      const structureTypes = vue.ref(["上部结构", "下部结构", "桥面系", "附属设施"]);
      const typeMultiArray = vue.ref([
        structureTypes.value,
        []
      ]);
      const typeMultiIndex = vue.ref([0, 0]);
      const quantityUnitData = vue.ref([
        {
          text: "个",
          value: 0
        },
        {
          text: "条",
          value: 1
        },
        {
          text: "台",
          value: 2
        },
        {
          text: "次",
          value: 3
        },
        {
          text: "月",
          value: 4
        },
        {
          text: "处",
          value: 5
        }
      ]);
      const quantityUnitOptions = vue.ref(quantityUnitData.value.map((item) => item.text));
      const quantityUnitIndex = vue.ref(0);
      const quantityUnitChange = (e2) => {
        quantityUnitIndex.value = e2.detail.value;
      };
      const natureindex = vue.ref(0);
      const nature = vue.ref([{
        text: "新病害",
        value: 0
      }, {
        text: "旧病害",
        value: 1
      }]);
      const participateAssess = vue.ref([{
        text: "是",
        value: 1
      }, {
        text: "否",
        value: 0
      }]);
      const participateAssessindex = vue.ref(0);
      const level = vue.ref([{
        text: "1",
        value: 1
      }, {
        text: "2",
        value: 2
      }, {
        text: "3",
        value: 3
      }, {
        text: "4",
        value: 4
      }]);
      const levelindex = vue.ref(1);
      const maintenanceStatus = vue.ref([
        {
          text: "待修复",
          value: 0
        },
        {
          text: "修复中",
          value: 1
        },
        {
          text: "已修复",
          value: 2
        },
        {
          text: "修补不良",
          value: 3
        }
      ]);
      const maintenanceStatusindex = vue.ref(0);
      const initMultiPickerColumn2 = () => {
        const structureType = structureTypes.value[typeMultiIndex.value[0]];
        parentObjectName.value = structureType;
        updateBiObjectOptions();
        setTimeout(() => {
          typeMultiArray.value = [
            structureTypes.value,
            biObjectName.value
          ];
          if (typeMultiIndex.value[1] >= biObjectName.value.length) {
            typeMultiIndex.value[1] = 0;
          }
        }, 100);
      };
      const typeColumnChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:979", "typeColumnChange:", e2);
        const column = e2.detail.column;
        const value = e2.detail.value;
        typeMultiIndex.value[column] = value;
        if (column === 0) {
          parentObjectName.value = structureTypes.value[value];
          updateBiObjectOptions();
          typeMultiIndex.value[1] = 0;
          setTimeout(() => {
            typeMultiArray.value = [
              structureTypes.value,
              biObjectName.value
            ];
          }, 100);
        }
      };
      const typeMultiPickerChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1009", "typeMultiPickerChange:", e2);
        typeMultiIndex.value = e2.detail.value;
        parentObjectName.value = structureTypes.value[typeMultiIndex.value[0]];
        biObjectindex.value = typeMultiIndex.value[1];
        updateDiseaseTypeOptions();
        updateComponentNumbers();
      };
      vue.watch(parentObjectName, (newVal) => {
        const index = structureTypes.value.findIndex((item) => item === newVal);
        if (index !== -1 && index !== typeMultiIndex.value[0]) {
          typeMultiIndex.value[0] = index;
          initMultiPickerColumn2();
        }
      });
      vue.onMounted(() => {
        var _a;
        fetchStructureData();
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
        if (options && options.mode === "edit") {
          isEdit.value = true;
          if (options.data) {
            try {
              const diseaseData = JSON.parse(decodeURIComponent(options.data));
              formatAppLog("log", "at pages/add-disease/add-disease.vue:1047", "接收到的编辑数据:", diseaseData);
              fillFormWithData(diseaseData);
            } catch (error) {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:1052", "解析编辑数据失败:", error);
              uni.showToast({
                title: "加载编辑数据失败",
                icon: "none"
              });
            }
          }
        } else {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1062", "新增模式");
          if (options && options.type) {
            try {
              const typeVal = decodeURIComponent(options.type);
              formatAppLog("log", "at pages/add-disease/add-disease.vue:1067", "接收到的病害类型位置:", typeVal);
              parentObjectName.value = typeVal;
            } catch (error) {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:1070", "解析type参数失败:", error);
              parentObjectName.value = "上部结构";
            }
          } else {
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1075", "未接收到type参数，使用默认值: 上部结构");
            parentObjectName.value = "上部结构";
          }
        }
        setTimeout(() => {
          initMultiPickerColumn2();
        }, 200);
        filteredComponentCodes.value = [...componentCode.value];
      });
      const fillFormWithData = (data2) => {
        var _a;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1091", "开始填充表单数据:", data2);
        if ((_a = data2.component) == null ? void 0 : _a.parentObjectName) {
          parentObjectName.value = data2.component.parentObjectName;
          const index = structureTypes.value.findIndex((item) => item === parentObjectName.value);
          if (index !== -1) {
            typeMultiIndex.value[0] = index;
            initMultiPickerColumn2();
          }
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1103", "设置病害类型:", parentObjectName.value);
        }
        setTimeout(() => {
          var _a2, _b;
          if ((_b = (_a2 = data2.component) == null ? void 0 : _a2.biObject) == null ? void 0 : _b.name) {
            const index = biObjectName.value.findIndex((item) => item === data2.component.biObject.name);
            if (index !== -1) {
              biObjectindex.value = index;
              formatAppLog("log", "at pages/add-disease/add-disease.vue:1113", "设置部件类型:", data2.component.biObject.name);
              setTimeout(() => {
                var _a3;
                if ((_a3 = data2.component) == null ? void 0 : _a3.code) {
                  const codeIndex = componentCode.value.findIndex((item) => item === data2.component.code);
                  if (codeIndex !== -1) {
                    componentCodeindex.value = codeIndex;
                    formatAppLog("log", "at pages/add-disease/add-disease.vue:1123", "设置构件编号:", data2.component.code);
                  }
                }
              }, 50);
            }
          }
          setTimeout(() => {
            if (data2.type) {
              const index = type.value.findIndex((item) => item === data2.type);
              if (index !== -1) {
                typeindex.value = index;
                formatAppLog("log", "at pages/add-disease/add-disease.vue:1137", "设置缺损类型:", data2.type);
              }
            }
          }, 50);
        }, 100);
        if (data2.position) {
          position.value = data2.position;
        }
        if (data2.quantity) {
          quantity.value = parseInt(data2.quantity) || 1;
        }
        if (data2.level) {
          const index = scalesItems.findIndex((item) => item.value === data2.level.toString());
          if (index !== -1) {
            scalesCurrent.value = index;
          }
        }
        if (data2.participateAssess !== void 0) {
          const index = ratingItems.findIndex((item) => item.value === data2.participateAssess);
          if (index !== -1) {
            ratingCurrent.value = index;
          }
        }
        if (data2.length) {
          length.value = data2.length;
        }
        if (data2.width) {
          width.value = data2.width;
        }
        if (data2.slitWidth) {
          slitWidth.value = data2.slitWidth;
        }
        if (data2.heightOrDepth) {
          heightOrDepth.value = data2.heightOrDepth;
        }
        if (data2.area) {
          area.value = data2.area;
        }
        if (data2.description) {
          description.value = data2.description;
        }
        if (data2.images && Array.isArray(data2.images)) {
          fileList.value = data2.images.map((url, index) => ({
            name: `图片${index + 1}`,
            url,
            extname: "jpg",
            size: 0
          }));
        }
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1209", "表单数据填充完成");
      };
      const imageStyles = vue.reactive({
        width: "150rpx",
        height: "150rpx"
      });
      const beforedisease = () => {
        var _a;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1219", "上一条");
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
        const currentId = options == null ? void 0 : options.id;
        if (!currentId || !parentObjectName.value) {
          uni.showToast({
            title: "无法获取当前病害信息",
            icon: "none"
          });
          return;
        }
        uni.$emit("getDiseasesOfType", {
          type: parentObjectName.value,
          currentId,
          callback: (diseaseList) => {
            if (!diseaseList || diseaseList.length === 0) {
              uni.showToast({
                title: "没有可用的病害记录",
                icon: "none"
              });
              return;
            }
            const validDiseases = diseaseList.filter((item) => !item.isDelete);
            const currentIndex = validDiseases.findIndex((item) => item.id === currentId);
            if (currentIndex === -1) {
              uni.showToast({
                title: "无法找到当前病害",
                icon: "none"
              });
              return;
            }
            const prevIndex = currentIndex === 0 ? validDiseases.length - 1 : currentIndex - 1;
            const prevDisease = validDiseases[prevIndex];
            navigateToEditDisease(prevDisease);
          }
        });
      };
      const nextdisease = () => {
        var _a;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1271", "下一条");
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
        const currentId = options == null ? void 0 : options.id;
        if (!currentId || !parentObjectName.value) {
          uni.showToast({
            title: "无法获取当前病害信息",
            icon: "none"
          });
          return;
        }
        uni.$emit("getDiseasesOfType", {
          type: parentObjectName.value,
          currentId,
          callback: (diseaseList) => {
            if (!diseaseList || diseaseList.length === 0) {
              uni.showToast({
                title: "没有可用的病害记录",
                icon: "none"
              });
              return;
            }
            const validDiseases = diseaseList.filter((item) => !item.isDelete);
            const currentIndex = validDiseases.findIndex((item) => item.id === currentId);
            if (currentIndex === -1) {
              uni.showToast({
                title: "无法找到当前病害",
                icon: "none"
              });
              return;
            }
            const nextIndex = currentIndex === validDiseases.length - 1 ? 0 : currentIndex + 1;
            const nextDisease = validDiseases[nextIndex];
            navigateToEditDisease(nextDisease);
          }
        });
      };
      const navigateToEditDisease = (disease) => {
        if (!disease || !disease.id) {
          uni.showToast({
            title: "无效的病害数据",
            icon: "none"
          });
          return;
        }
        const diseaseData = encodeURIComponent(JSON.stringify(disease));
        uni.redirectTo({
          url: `/pages/add-disease/add-disease?mode=edit&id=${disease.id}&data=${diseaseData}`,
          success: () => {
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1339", "成功导航到病害:", disease.id);
          },
          fail: (error) => {
            formatAppLog("error", "at pages/add-disease/add-disease.vue:1342", "导航失败:", error);
            uni.showToast({
              title: "切换失败，请重试",
              icon: "none"
            });
          }
        });
      };
      const savetonextdisease = () => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1352", "保存并复制到下一条");
        const diseaseData = createDiseaseData();
        if (diseaseData) {
          saveWithoutNavigateBack(diseaseData);
        }
      };
      const createDiseaseData = () => {
        var _a, _b;
        let diseaseTypeObj = null;
        if (typeindex.value !== -1 && diseaseTypeOptions.value && diseaseTypeOptions.value[typeindex.value]) {
          diseaseTypeObj = diseaseTypeOptions.value[typeindex.value];
        }
        let biObjectObj = null;
        if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex.value]) {
          biObjectObj = biObjectNameOptions.value[biObjectindex.value];
        }
        let componentObj = null;
        if (componentCodeindex.value !== -1 && biObjectObj && biObjectObj.comments) {
          componentObj = biObjectObj.comments[componentCodeindex.value];
        }
        const diseaseData = {
          createBy: "crh@znjc",
          createTime: formatDateTime(),
          updateTime: formatDateTime(),
          id: ((_b = (_a = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _a.options) == null ? void 0 : _b.id) || (/* @__PURE__ */ new Date()).getTime(),
          diseaseType: diseaseTypeObj ? {
            id: diseaseTypeObj.id,
            code: diseaseTypeObj.code || "",
            name: diseaseTypeObj.name,
            maxScale: diseaseTypeObj.maxScale || 5,
            minScale: diseaseTypeObj.minScale || 1,
            status: "0"
          } : null,
          diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
          description: description.value,
          position: position.value,
          trend: "稳定",
          level: parseInt(scalesItems[scalesCurrent.value].value),
          quantity: parseInt(quantity.value),
          length: length.value,
          width: width.value,
          slitWidth: slitWidth.value,
          heightOrDepth: heightOrDepth.value,
          area: area.value,
          type: type.value[typeindex.value],
          participateAssess: ratingItems[ratingCurrent.value].value,
          deductPoints: 35,
          biObjectId: biObjectObj ? biObjectObj.id : null,
          projectId: 2,
          component: componentObj ? {
            createBy: "admin",
            createTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            updateTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            id: componentObj.id,
            code: componentObj.code,
            name: componentObj.name || `${biObjectObj.name}${componentCodeindex.value + 1}`,
            biObjectId: biObjectObj ? biObjectObj.id : null,
            status: "0",
            delFlag: "0",
            biObject: {
              id: biObjectObj ? biObjectObj.id : null,
              name: biObjectObj ? biObjectObj.name : "",
              count: 0
            },
            parentObjectName: parentObjectName.value
          } : null,
          componentId: componentObj ? componentObj.id : null,
          buildingId: 37,
          images: []
          // 初始化为空数组，等待图片保存后更新
        };
        if (!diseaseData.type || !diseaseData.component || !diseaseData.diseaseType) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1435", "数据不完整，请确保选择了部件类型、构件编号和缺损类型");
          uni.hideLoading();
          uni.showToast({
            title: "请填写必填项",
            icon: "none"
          });
          return null;
        }
        return diseaseData;
      };
      const saveWithoutNavigateBack = (diseaseData) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1449", "保存但不返回");
        uni.showLoading({
          title: "保存中..."
        });
        saveImagesAndUpdateDisease(diseaseData, false).then(() => {
          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            fileList.value = [];
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1469", "已清空图片列表，保留其他表单数据");
            uni.showToast({
              title: "已保存，可继续添加下一条",
              icon: "none",
              duration: 1500
            });
          }, 500);
        }).catch((error) => {
          formatAppLog("error", "at pages/add-disease/add-disease.vue:1480", "保存失败:", error);
          uni.hideLoading();
          uni.showToast({
            title: "保存失败，请重试",
            icon: "none"
          });
        });
      };
      const saveImagesAndUpdateDisease = (diseaseData, isEditMode) => {
        return new Promise((resolve, reject) => {
          var _a;
          const pages2 = getCurrentPages();
          const currentPage = pages2[pages2.length - 1];
          const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
          let originalImages = [];
          if (isEditMode && options && options.data) {
            try {
              const originalData = JSON.parse(decodeURIComponent(options.data));
              originalImages = originalData.images || [];
            } catch (error) {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:1504", "解析原始数据失败:", error);
            }
          }
          const currentImageUrls = fileList.value.map((img) => img.url);
          const imagesToKeep = originalImages.filter(
            (img) => currentImageUrls.includes(img)
          );
          const imagesToDelete = originalImages.filter(
            (img) => !currentImageUrls.includes(img)
          );
          const newImages = currentImageUrls.filter(
            (url) => !originalImages.includes(url)
          );
          if (imagesToDelete.length > 0) {
            imagesToDelete.forEach((imgPath) => {
              plus.io.resolveLocalFileSystemURL(imgPath, (fileEntry) => {
                fileEntry.remove(() => {
                  formatAppLog("log", "at pages/add-disease/add-disease.vue:1531", "删除原有图片成功:", imgPath);
                }, (error) => {
                  formatAppLog("error", "at pages/add-disease/add-disease.vue:1533", "删除原有图片失败:", error);
                });
              }, (error) => {
                formatAppLog("error", "at pages/add-disease/add-disease.vue:1536", "无法访问原有图片:", error);
              });
            });
          }
          if (newImages.length > 0) {
            saveDiseaseImages(userId, buildingId, newImages).then((savedPaths) => {
              diseaseData.images = [...imagesToKeep, ...savedPaths];
              if (isEditMode) {
                uni.$emit("updateDisease", diseaseData);
              } else {
                uni.$emit("addNewDisease", diseaseData);
              }
              resolve();
            }).catch((error) => {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:1558", "保存新图片失败:", error);
              reject(error);
            });
          } else {
            diseaseData.images = imagesToKeep;
            if (isEditMode) {
              uni.$emit("updateDisease", diseaseData);
            } else {
              uni.$emit("addNewDisease", diseaseData);
            }
            resolve();
          }
        });
      };
      const savedisease = () => {
        var _a, _b;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1578", "保存按钮点击");
        let diseaseTypeObj = null;
        if (typeindex.value !== -1 && diseaseTypeOptions.value && diseaseTypeOptions.value[typeindex.value]) {
          diseaseTypeObj = diseaseTypeOptions.value[typeindex.value];
        }
        let biObjectObj = null;
        if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex.value]) {
          biObjectObj = biObjectNameOptions.value[biObjectindex.value];
        }
        let componentObj = null;
        if (componentCodeindex.value !== -1 && biObjectObj && biObjectObj.comments) {
          componentObj = biObjectObj.comments[componentCodeindex.value];
        }
        const diseaseData = {
          createBy: "crh@znjc",
          createTime: formatDateTime(),
          updateTime: formatDateTime(),
          id: ((_b = (_a = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _a.options) == null ? void 0 : _b.id) || (/* @__PURE__ */ new Date()).getTime(),
          diseaseType: diseaseTypeObj ? {
            id: diseaseTypeObj.id,
            code: diseaseTypeObj.code || "",
            name: diseaseTypeObj.name,
            maxScale: diseaseTypeObj.maxScale || 5,
            minScale: diseaseTypeObj.minScale || 1,
            status: "0"
          } : null,
          diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
          description: description.value,
          position: position.value,
          trend: "稳定",
          level: parseInt(scalesItems[scalesCurrent.value].value),
          quantity: parseInt(quantity.value),
          length: length.value,
          width: width.value,
          slitWidth: slitWidth.value,
          heightOrDepth: heightOrDepth.value,
          area: area.value,
          type: type.value[typeindex.value],
          participateAssess: ratingItems[ratingCurrent.value].value,
          deductPoints: 35,
          biObjectId: biObjectObj ? biObjectObj.id : null,
          projectId: 2,
          component: componentObj ? {
            createBy: "admin",
            createTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            updateTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            id: componentObj.id,
            code: componentObj.code,
            name: componentObj.name || `${biObjectObj.name}${componentCodeindex.value + 1}`,
            biObjectId: biObjectObj ? biObjectObj.id : null,
            status: "0",
            delFlag: "0",
            biObject: {
              id: biObjectObj ? biObjectObj.id : null,
              name: biObjectObj ? biObjectObj.name : "",
              count: 0
            },
            parentObjectName: parentObjectName.value
          } : null,
          componentId: componentObj ? componentObj.id : null,
          buildingId: 37,
          images: []
          // 初始化为空数组，等待图片保存后更新
        };
        if (!diseaseData.type || !diseaseData.component || !diseaseData.diseaseType) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1653", "数据不完整，请确保选择了部件类型、构件编号和缺损类型");
          uni.hideLoading();
          uni.showToast({
            title: "请填写必填项",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "保存中..."
        });
        saveImagesAndUpdateDisease(diseaseData, isEdit.value).then(() => {
          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 500);
        }).catch((error) => {
          uni.hideLoading();
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
        });
      };
      const canceldisease = () => {
        uni.navigateBack({
          delta: 1
          // 返回上一页
        });
      };
      const typePickerChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1698", "picker发送选择改变，携带值为", e2.detail.value);
        const index = parseInt(e2.detail.value);
        biObjectindex.value = index;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1701", "biObjectindex设置为:", index, "对应的值为:", biObjectName.value[index]);
        updateDiseaseTypeOptions();
        updateComponentNumbers();
      };
      const numberPickerChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1710", "picker发送选择改变，携带值为", e2.detail.value);
        const index = parseInt(e2.detail.value);
        componentCodeindex.value = index;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1713", "componentCodeindex设置为:", index, "对应的值为:", componentCode.value[index]);
      };
      const TypeofdefectPickerChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1717", "picker发送选择改变，携带值为", e2.detail.value);
        const index = parseInt(e2.detail.value);
        typeindex.value = index;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1720", "typeindex设置为:", index, "对应的值为:", type.value[index]);
      };
      const WayofDefectPickerChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1724", "picker发送选择改变，携带值为", e2.detail.value);
        const index = parseInt(e2.detail.value);
        WayofDefectindex.value = index;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1727", "WayofDefectindex设置为:", index, "对应的值为:", WayofDefect.value[index]);
      };
      const ScalesRadioChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1732", "radio发送选择改变，携带值为", e2.detail.value);
        const index = scalesItems.findIndex((item) => item.value === e2.detail.value);
        if (index !== -1) {
          scalesCurrent.value = index;
        }
      };
      const RatingsRadioChange = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1742", "radio发送选择改变，携带值为", e2.detail.value);
        const index = ratingItems.findIndex((item) => item.value === e2.detail.value);
        if (index !== -1) {
          ratingCurrent.value = index;
        }
      };
      const formatDateTime = (date = /* @__PURE__ */ new Date()) => {
        const y2 = date.getFullYear();
        const m2 = String(date.getMonth() + 1).padStart(2, "0");
        const d2 = String(date.getDate()).padStart(2, "0");
        const h2 = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        const s2 = String(date.getSeconds()).padStart(2, "0");
        return `${y2}-${m2}-${d2} ${h2}:${mm}:${s2}`;
      };
      const deleteDisease = () => {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条病害记录吗？",
          success: (res) => {
            var _a, _b;
            if (res.confirm) {
              const currentId = (_b = (_a = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _a.options) == null ? void 0 : _b.id;
              if (currentId) {
                const deleteData = {
                  id: currentId,
                  isDelete: true
                };
                formatAppLog("log", "at pages/add-disease/add-disease.vue:1780", "准备发送deleteDisease事件，标记删除ID:", currentId);
                uni.$emit("deleteDisease", deleteData);
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              } else {
                uni.showToast({
                  title: "无法获取病害ID",
                  icon: "none"
                });
              }
            }
          }
        });
      };
      const copyAndAddDisease = () => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1805", "复制并新增");
        ({
          partType: biObjectName.value[biObjectindex.value],
          partNumber: componentCode.value[componentCodeindex.value],
          disease: type.value[typeindex.value],
          position: position.value,
          quantity: quantity.value.toString(),
          length: length.value,
          width: width.value,
          slitWidth: slitWidth.value,
          heightOrDepth: heightOrDepth.value,
          area: area.value,
          description: description.value,
          level: scalesItems[scalesCurrent.value].value,
          participateAssess: ratingItems[ratingCurrent.value].value,
          parentObjectName: parentObjectName.value
        });
        fileList.value = [];
        isEdit.value = false;
        uni.showToast({
          title: "已切换到新增模式",
          icon: "none",
          duration: 500
        });
      };
      const editDisease = () => {
        var _a, _b;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1840", "编辑");
        let diseaseTypeObj = null;
        if (typeindex.value !== -1 && diseaseTypeOptions.value && diseaseTypeOptions.value[typeindex.value]) {
          diseaseTypeObj = diseaseTypeOptions.value[typeindex.value];
        }
        let biObjectObj = null;
        if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex.value]) {
          biObjectObj = biObjectNameOptions.value[biObjectindex.value];
        }
        let componentObj = null;
        if (componentCodeindex.value !== -1 && biObjectObj && biObjectObj.comments) {
          componentObj = biObjectObj.comments[componentCodeindex.value];
        }
        const diseaseData = {
          createBy: "crh@znjc",
          createTime: formatDateTime(),
          updateTime: formatDateTime(),
          id: ((_b = (_a = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _a.options) == null ? void 0 : _b.id) || (/* @__PURE__ */ new Date()).getTime(),
          diseaseType: diseaseTypeObj ? {
            id: diseaseTypeObj.id,
            code: diseaseTypeObj.code || "",
            name: diseaseTypeObj.name,
            maxScale: diseaseTypeObj.maxScale || 5,
            minScale: diseaseTypeObj.minScale || 1,
            status: "0"
          } : null,
          diseaseTypeId: diseaseTypeObj ? diseaseTypeObj.id : null,
          description: description.value,
          position: position.value,
          trend: "稳定",
          level: parseInt(scalesItems[scalesCurrent.value].value),
          quantity: parseInt(quantity.value),
          length: length.value,
          width: width.value,
          slitWidth: slitWidth.value,
          heightOrDepth: heightOrDepth.value,
          area: area.value,
          type: type.value[typeindex.value],
          participateAssess: ratingItems[ratingCurrent.value].value,
          deductPoints: 35,
          biObjectId: biObjectObj ? biObjectObj.id : null,
          projectId: 2,
          component: componentObj ? {
            createBy: "admin",
            createTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            updateTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            id: componentObj.id,
            code: componentObj.code,
            name: componentObj.name || `${biObjectObj.name}${componentCodeindex.value + 1}`,
            biObjectId: biObjectObj ? biObjectObj.id : null,
            status: "0",
            delFlag: "0",
            biObject: {
              id: biObjectObj ? biObjectObj.id : null,
              name: biObjectObj ? biObjectObj.name : "",
              count: 0
            },
            parentObjectName: parentObjectName.value
          } : null,
          componentId: componentObj ? componentObj.id : null,
          buildingId: 37,
          images: []
          // 初始化为空数组，等待图片保存后更新
        };
        if (!diseaseData.type || !diseaseData.component || !diseaseData.diseaseType) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1915", "数据不完整，请确保选择了部件类型、构件编号和缺损类型");
          uni.hideLoading();
          uni.showToast({
            title: "请填写必填项",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "保存中..."
        });
        saveImagesAndUpdateDisease(diseaseData, true).then(() => {
          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 500);
        }).catch((error) => {
          uni.hideLoading();
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
        });
      };
      const handleFileSelect = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1953", "文件选择事件", e2);
        if (e2 && e2.tempFiles && e2.tempFiles.length > 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1956", "选择的文件数量:", e2.tempFiles.length);
          const newFiles = e2.tempFiles.map((file) => {
            return {
              name: file.name,
              url: file.url || file.path || file.file && file.file.path || file.image && file.image.location || file.tempFilePath,
              extname: file.extname || "jpg",
              size: file.size || 0,
              // 保存原始文件信息，以备后用
              originalFile: file
            };
          });
          newFiles.forEach((file) => {
            const existingIndex = fileList.value.findIndex((f2) => f2.name === file.name || f2.url === file.url);
            if (existingIndex === -1) {
              fileList.value.push(file);
            } else {
              fileList.value[existingIndex] = file;
            }
          });
          fileList.value = [...fileList.value];
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1992", "更新后的fileList:", fileList.value);
          const paths = getImagePaths(fileList.value);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1996", "当前有效路径数:", paths.length);
        }
      };
      const handleFileDelete = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2001", "文件删除事件", e2);
        if (e2 && e2.tempFile && e2.tempFile.name) {
          const fileName = e2.tempFile.name;
          fileList.value = fileList.value.filter((file) => file.name !== fileName);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2010", "删除后的文件列表:", fileList.value);
        } else if (e2 && e2.index !== void 0 && e2.index >= 0) {
          fileList.value.splice(e2.index, 1);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2014", "删除后的文件列表:", fileList.value);
        }
      };
      const getImagePaths = (fileListData) => {
        const paths = [];
        if (!fileListData || !Array.isArray(fileListData) || fileListData.length === 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2023", "文件列表为空");
          return paths;
        }
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2027", "处理文件列表:", fileListData);
        fileListData.forEach((file, index) => {
          let path = "";
          if (file.url) {
            path = file.url;
          } else if (file.path) {
            path = file.path;
          } else if (file.tempFilePath) {
            path = file.tempFilePath;
          } else if (file.file && file.file.path) {
            path = file.file.path;
          } else if (file.image && file.image.location) {
            path = file.image.location;
          }
          if (path) {
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2047", `文件[${index}]有效路径:`, path);
            paths.push(path);
          } else {
            formatAppLog("warn", "at pages/add-disease/add-disease.vue:2050", `文件[${index}]没有有效路径:`, file);
          }
        });
        return paths;
      };
      const onClickTemplate = (templateIndex) => {
        uni.navigateTo({
          url: `/pages/canvas/canvas?template=${templateIndex}`,
          success: (res) => {
            res.eventChannel.once("returnData", (data2) => {
              ADImgs.value.push({
                src: data2.src
              });
            });
            popup2.value.close();
          }
        });
      };
      const selectCanvasTemplate = () => {
        popup2.value.open();
      };
      const removeImage = (index) => {
        ADImgs.value.splice(index, 1);
      };
      const openDiseasePositionPopup = () => {
        selectedPosition.value = position.value || "";
        diseasePositionPopup.value.open();
      };
      const closeDiseasePositionPopup = () => {
        diseasePositionPopup.value.close();
      };
      const confirmDiseasePosition = () => {
        position.value = selectedPosition.value;
        closeDiseasePositionPopup();
      };
      const fetchStructureData = async () => {
        try {
          const userId2 = "3";
          const buildingId2 = "39";
          const data2 = await getObject(userId2, buildingId2);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2106", "结构数据获取成功:", data2);
          structureData.value = data2;
          updateBiObjectOptions();
        } catch (error) {
          formatAppLog("error", "at pages/add-disease/add-disease.vue:2112", "获取结构数据失败:", error);
          uni.showToast({
            title: "获取结构数据失败",
            icon: "none"
          });
        }
      };
      const updateBiObjectOptions = () => {
        if (!structureData.value || !structureData.value.children) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2123", "结构数据不完整");
          return;
        }
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2127", "更新部件类型选项，当前选择:", parentObjectName.value);
        const structurePart = structureData.value.children.find(
          (item) => item.name === parentObjectName.value
        );
        if (!structurePart || !structurePart.children) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2135", "未找到对应的结构部分或其子项");
          biObjectName.value = [];
          return;
        }
        biObjectNameOptions.value = structurePart.children;
        biObjectName.value = structurePart.children.map((item) => item.name);
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2143", "部件类型选项更新为:", biObjectName.value);
        biObjectindex.value = -1;
        type.value = [];
        typeindex.value = -1;
        componentCode.value = [];
        componentCodeindex.value = -1;
        if (typeMultiArray.value) {
          typeMultiArray.value[1] = biObjectName.value;
        }
      };
      const updateComponentNumbers = () => {
        if (biObjectindex.value === -1 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2163", "无效的部件类型选择");
          componentCode.value = [];
          return;
        }
        const selectedBiObject = biObjectNameOptions.value[biObjectindex.value];
        if (!selectedBiObject) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2170", "选中的部件类型不存在");
          componentCode.value = [];
          return;
        }
        if (!selectedBiObject.comments || !Array.isArray(selectedBiObject.comments) || selectedBiObject.comments.length === 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2178", "当前部件类型没有构件编号信息");
          componentCode.value = ["1", "2", "3"];
          return;
        }
        componentCode.value = selectedBiObject.comments.map((item) => item.code);
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2185", "构件编号选项更新为:", componentCode.value);
        componentCodeindex.value = -1;
      };
      const updateDiseaseTypeOptions = () => {
        if (biObjectindex.value === -1 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2194", "无效的部件类型选择");
          type.value = [];
          return;
        }
        const selectedBiObject = biObjectNameOptions.value[biObjectindex.value];
        if (!selectedBiObject || !selectedBiObject.diseaseTypes) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2201", "选中的部件类型没有缺损类型定义");
          type.value = [];
          return;
        }
        diseaseTypeOptions.value = selectedBiObject.diseaseTypes;
        type.value = selectedBiObject.diseaseTypes.map((item) => item.name);
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2209", "缺损类型选项更新为:", type.value);
        typeindex.value = -1;
      };
      const openComponentCodePopup = () => {
        filteredComponentCodes.value = [...componentCode.value];
        componentCodePopup.value.open();
      };
      const closeComponentCodePopup = () => {
        componentCodePopup.value.close();
      };
      const confirmComponentCode = () => {
        if (componentCodeindex.value !== -1) {
          closeComponentCodePopup();
        } else {
          uni.showToast({
            title: "请选择构件编号",
            icon: "none"
          });
        }
      };
      const clearComponentSearch = () => {
        componentCodeFilter.value = "";
        filteredComponentCodes.value = [...componentCode.value];
      };
      const filterComponentCodes = () => {
        if (!componentCodeFilter.value) {
          filteredComponentCodes.value = [...componentCode.value];
          return;
        }
        filteredComponentCodes.value = componentCode.value.filter(
          (code2) => code2.toString().includes(componentCodeFilter.value)
        );
      };
      const selectComponentCode = (index) => {
        const selectedCode = filteredComponentCodes.value[index];
        const originalIndex = componentCode.value.findIndex((code2) => code2 === selectedCode);
        if (originalIndex !== -1) {
          componentCodeindex.value = originalIndex;
          closeComponentCodePopup();
        }
      };
      const longitudinalPosition = vue.ref("");
      const lateralPosition = vue.ref("");
      const verticalPosition = vue.ref("");
      const activePositionType = vue.ref("");
      const currentPositionTitle = vue.ref("位置");
      const longitudinalPositionOptions = vue.ref(["大桩号侧", "小桩号侧"]);
      const lateralPositionOptions = vue.ref(["左侧", "右侧"]);
      const verticalPositionOptions = vue.ref(["顶部", "底部"]);
      const currentPositionOptions = vue.ref([]);
      const positionInput1Value = vue.ref("");
      const positionInput2Value = vue.ref("");
      const LocationDescriptionPositionPopup = vue.ref(null);
      const openLocationPositionPopup = (type2) => {
        activePositionType.value = type2 || "longitudinal";
        if (activePositionType.value === "longitudinal") {
          currentPositionTitle.value = "纵向位置";
          currentPositionOptions.value = longitudinalPositionOptions.value;
        } else if (activePositionType.value === "lateral") {
          currentPositionTitle.value = "横向位置";
          currentPositionOptions.value = lateralPositionOptions.value;
        } else if (activePositionType.value === "vertical") {
          currentPositionTitle.value = "竖向位置";
          currentPositionOptions.value = verticalPositionOptions.value;
        }
        LocationDescriptionPositionPopup.value.open();
      };
      const confirmPositionInput1 = () => {
        const inputValue = positionInput1Value.value;
        if (!inputValue) {
          uni.showToast({
            title: "请输入内容",
            icon: "none"
          });
          return;
        }
        if (activePositionType.value === "longitudinal") {
          longitudinalPosition.value = inputValue;
        } else if (activePositionType.value === "lateral") {
          lateralPosition.value = inputValue;
        } else if (activePositionType.value === "vertical") {
          verticalPosition.value = inputValue;
        }
        LocationDescriptionPositionPopup.value.close();
        positionInput1Value.value = "";
      };
      const confirmPositionInput2 = () => {
        const inputValue = positionInput2Value.value;
        if (!inputValue) {
          uni.showToast({
            title: "请输入内容",
            icon: "none"
          });
          return;
        }
        const fullValue = inputValue + "#墩侧";
        if (activePositionType.value === "longitudinal") {
          longitudinalPosition.value = fullValue;
        } else if (activePositionType.value === "lateral") {
          lateralPosition.value = fullValue;
        } else if (activePositionType.value === "vertical") {
          verticalPosition.value = fullValue;
        }
        LocationDescriptionPositionPopup.value.close();
        positionInput2Value.value = "";
      };
      const selectPositionItem = (item) => {
        if (activePositionType.value === "longitudinal") {
          longitudinalPosition.value = item;
        } else if (activePositionType.value === "lateral") {
          lateralPosition.value = item;
        } else if (activePositionType.value === "vertical") {
          verticalPosition.value = item;
        }
        LocationDescriptionPositionPopup.value.close();
      };
      const LocationDescriptionDistancePopup = vue.ref(null);
      const openLocationDistancePopup = (type2) => {
        activeDistanceType.value = type2;
        LocationDescriptionDistancePopup.value.open();
      };
      const lengthUnitData = vue.ref([
        {
          text: "m",
          value: 0
        },
        {
          text: "cm",
          value: 1
        },
        {
          text: "mm",
          value: 2
        }
      ]);
      const lengthUnitOptions = vue.ref(lengthUnitData.value.map((item) => item.text));
      const lengthUnitIndex = vue.ref(0);
      const lengthUnitChange = (e2) => {
        lengthUnitIndex.value = e2.detail.value;
      };
      const widthUnitData = vue.ref([
        {
          text: "m",
          value: 0
        },
        {
          text: "cm",
          value: 1
        },
        {
          text: "mm",
          value: 2
        }
      ]);
      const widthUnitOptions = vue.ref(widthUnitData.value.map((item) => item.text));
      const widthUnitIndex = vue.ref(0);
      const widthUnitChange = (e2) => {
        widthUnitIndex.value = e2.detail.value;
      };
      const heightUnitData = vue.ref([
        {
          text: "m",
          value: 0
        },
        {
          text: "cm",
          value: 1
        },
        {
          text: "mm",
          value: 2
        }
      ]);
      const heightUnitOptions = vue.ref(heightUnitData.value.map((item) => item.text));
      const heightUnitIndex = vue.ref(0);
      const heightUnitChange = (e2) => {
        heightUnitIndex.value = e2.detail.value;
      };
      const seamsWidthUnitData = vue.ref([
        {
          text: "m",
          value: 0
        },
        {
          text: "cm",
          value: 1
        },
        {
          text: "mm",
          value: 2
        }
      ]);
      const seamsWidthUnitOptions = vue.ref(seamsWidthUnitData.value.map((item) => item.text));
      const seamsWidthUnitIndex = vue.ref(0);
      const seamsWidthUnitChange = (e2) => {
        seamsWidthUnitIndex.value = e2.detail.value;
      };
      const areaUnitData = vue.ref([
        {
          text: "m²",
          value: 0
        },
        {
          text: "cm²",
          value: 1
        },
        {
          text: "mm²",
          value: 2
        }
      ]);
      const areaUnitOptions = vue.ref(areaUnitData.value.map((item) => item.text));
      const areaUnitIndex = vue.ref(0);
      const areaUnitChange = (e2) => {
        areaUnitIndex.value = e2.detail.value;
      };
      const volumeUnitData = vue.ref([
        {
          text: "m³",
          value: 0
        },
        {
          text: "cm³",
          value: 1
        },
        {
          text: "mm³",
          value: 2
        }
      ]);
      const volumeUnitOptions = vue.ref(volumeUnitData.value.map((item) => item.text));
      const volumeUnitIndex = vue.ref(0);
      const volumeUnitChange = (e2) => {
        volumeUnitIndex.value = e2.detail.value;
      };
      const longitudinalDistance = vue.ref("");
      const lateralDistance = vue.ref("");
      const verticalDistance = vue.ref("");
      const activeDistanceType = vue.ref("");
      const confirmDistanceInput1 = () => {
        const inputValue = distanceInput1Value.value;
        if (!inputValue) {
          uni.showToast({
            title: "请输入数值",
            icon: "none"
          });
          return;
        }
        if (activeDistanceType.value === "longitudinal") {
          longitudinalDistance.value = inputValue + "米";
        } else if (activeDistanceType.value === "lateral") {
          lateralDistance.value = inputValue + "米";
        } else if (activeDistanceType.value === "vertical") {
          verticalDistance.value = inputValue + "米";
        }
        LocationDescriptionDistancePopup.value.close();
        distanceInput1Value.value = "";
      };
      const confirmDistanceInput2 = () => {
        const numerator = distanceInput2Numerator.value;
        const denominator = distanceInput2Denominator.value;
        if (!numerator || !denominator) {
          uni.showToast({
            title: "请完整输入分子和分母",
            icon: "none"
          });
          return;
        }
        const fractionValue = denominator + "/" + numerator;
        if (activeDistanceType.value === "longitudinal") {
          longitudinalDistance.value = fractionValue;
        } else if (activeDistanceType.value === "lateral") {
          lateralDistance.value = fractionValue;
        } else if (activeDistanceType.value === "vertical") {
          verticalDistance.value = fractionValue;
        }
        LocationDescriptionDistancePopup.value.close();
        distanceInput2Numerator.value = "";
        distanceInput2Denominator.value = "";
      };
      const selectDistanceItem = (item) => {
        if (activeDistanceType.value === "longitudinal") {
          longitudinalDistance.value = item;
        } else if (activeDistanceType.value === "lateral") {
          lateralDistance.value = item;
        } else if (activeDistanceType.value === "vertical") {
          verticalDistance.value = item;
        }
        LocationDescriptionDistancePopup.value.close();
      };
      const distanceInput1Value = vue.ref("");
      const distanceInput2Numerator = vue.ref("");
      const distanceInput2Denominator = vue.ref("");
      const __returned__ = { popup: popup2, ADImgs, userId, buildingId, isEdit, structureData, parentObjectName, biObjectNameOptions, diseaseTypeOptions, biObjectName, biObjectindex, componentCode, componentCodeindex, componentCodePopup, filteredComponentCodes, componentCodeFilter, type, typeindex, position, quantity, WayofDefect, WayofDefectindex, length, width, slitWidth, heightOrDepth, area, description, fileList, scalesItems, scalesCurrent, ratingItems, ratingCurrent, diseasePosition, diseasePositionPopup, selectedPosition, structureTypes, typeMultiArray, typeMultiIndex, quantityUnitData, quantityUnitOptions, quantityUnitIndex, quantityUnitChange, natureindex, nature, participateAssess, participateAssessindex, level, levelindex, maintenanceStatus, maintenanceStatusindex, initMultiPickerColumn2, typeColumnChange, typeMultiPickerChange, fillFormWithData, imageStyles, beforedisease, nextdisease, navigateToEditDisease, savetonextdisease, createDiseaseData, saveWithoutNavigateBack, saveImagesAndUpdateDisease, savedisease, canceldisease, typePickerChange, numberPickerChange, TypeofdefectPickerChange, WayofDefectPickerChange, ScalesRadioChange, RatingsRadioChange, formatDateTime, deleteDisease, copyAndAddDisease, editDisease, handleFileSelect, handleFileDelete, getImagePaths, onClickTemplate, selectCanvasTemplate, removeImage, openDiseasePositionPopup, closeDiseasePositionPopup, confirmDiseasePosition, fetchStructureData, updateBiObjectOptions, updateComponentNumbers, updateDiseaseTypeOptions, openComponentCodePopup, closeComponentCodePopup, confirmComponentCode, clearComponentSearch, filterComponentCodes, selectComponentCode, longitudinalPosition, lateralPosition, verticalPosition, activePositionType, currentPositionTitle, longitudinalPositionOptions, lateralPositionOptions, verticalPositionOptions, currentPositionOptions, positionInput1Value, positionInput2Value, LocationDescriptionPositionPopup, openLocationPositionPopup, confirmPositionInput1, confirmPositionInput2, selectPositionItem, LocationDescriptionDistancePopup, openLocationDistancePopup, lengthUnitData, lengthUnitOptions, lengthUnitIndex, lengthUnitChange, widthUnitData, widthUnitOptions, widthUnitIndex, widthUnitChange, heightUnitData, heightUnitOptions, heightUnitIndex, heightUnitChange, seamsWidthUnitData, seamsWidthUnitOptions, seamsWidthUnitIndex, seamsWidthUnitChange, areaUnitData, areaUnitOptions, areaUnitIndex, areaUnitChange, volumeUnitData, volumeUnitOptions, volumeUnitIndex, volumeUnitChange, longitudinalDistance, lateralDistance, verticalDistance, activeDistanceType, confirmDistanceInput1, confirmDistanceInput2, selectDistanceItem, distanceInput1Value, distanceInput2Numerator, distanceInput2Denominator, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted, watch: vue.watch, get getObject() {
        return getObject;
      }, get saveDiseaseImages() {
        return saveDiseaseImages;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_data_checkbox = resolveEasycom(vue.resolveDynamicComponent("uni-data-checkbox"), __easycom_0);
    const _component_uni_file_picker = resolveEasycom(vue.resolveDynamicComponent("uni-file-picker"), __easycom_1);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_2$1);
    const _component_uni_combox = resolveEasycom(vue.resolveDynamicComponent("uni-combox"), __easycom_3);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 新增病害时显示 "),
      !$setup.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "button-group-add"
      }, [
        vue.createElementVNode("button", {
          class: "button-savetonext",
          onClick: $setup.savetonextdisease
        }, "保存并复制到下一条"),
        vue.createElementVNode("button", {
          class: "button-save",
          onClick: $setup.savedisease
        }, "保存"),
        vue.createElementVNode("button", {
          class: "button-cancle",
          onClick: $setup.canceldisease
        }, "取消")
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 编辑病害时显示 "),
          vue.createElementVNode("view", { class: "button-group-edit" }, [
            vue.createElementVNode("button", {
              class: "button-before",
              onClick: $setup.beforedisease
            }, "上一条"),
            vue.createElementVNode("button", {
              class: "button-next",
              onClick: $setup.nextdisease
            }, "下一条"),
            vue.createElementVNode("button", {
              class: "button-delete",
              onClick: $setup.deleteDisease
            }, "删除"),
            vue.createElementVNode("button", {
              class: "button-save",
              onClick: $setup.copyAndAddDisease
            }, "复制并新增"),
            vue.createElementVNode("button", {
              class: "button-edit",
              onClick: $setup.editDisease
            }, "编辑")
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 表单内容容器 - 添加form-container类以便横屏时调整布局 "),
      vue.createElementVNode("view", { class: "form-container" }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { class: "head" }, [
            vue.createElementVNode("view", { class: "head-text" }, " 病害基础信息 ")
          ]),
          vue.createCommentVNode(" 将原来的部件类型picker改为multiSelector "),
          vue.createElementVNode("picker", {
            class: "picker",
            mode: "multiSelector",
            onChange: $setup.typeMultiPickerChange,
            onColumnchange: $setup.typeColumnChange,
            value: $setup.typeMultiIndex,
            range: $setup.typeMultiArray
          }, [
            vue.createElementVNode("view", { class: "picker-titleAndContent" }, [
              vue.createElementVNode("view", { class: "picker-left" }, [
                vue.createElementVNode("text", { class: "picker-must" }, "*"),
                vue.createElementVNode("view", { class: "picker-title" }, " 部件类型 ")
              ]),
              vue.createElementVNode("view", { class: "picker-right" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "picker-content",
                    style: vue.normalizeStyle($setup.biObjectindex === -1 ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.biObjectName[$setup.biObjectindex] || "请选择部件类型"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("text", { class: "picker-icon" }, ">")
              ])
            ])
          ], 40, ["value", "range"]),
          vue.createCommentVNode(" 替换原来的构件编号picker为view "),
          vue.createElementVNode("view", {
            class: "picker",
            onClick: $setup.openComponentCodePopup
          }, [
            vue.createElementVNode("view", { class: "picker-titleAndContent" }, [
              vue.createElementVNode("view", { class: "picker-left" }, [
                vue.createElementVNode("text", { class: "picker-must" }, "*"),
                vue.createElementVNode("view", { class: "picker-title" }, " 构件编号 ")
              ]),
              vue.createElementVNode("view", { class: "picker-right" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "picker-content",
                    style: vue.normalizeStyle($setup.componentCodeindex === -1 ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.componentCode[$setup.componentCodeindex] || "请选择构件编号"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("text", { class: "picker-icon" }, ">")
              ])
            ])
          ]),
          vue.createElementVNode("picker", {
            class: "picker",
            onChange: $setup.TypeofdefectPickerChange,
            value: $setup.typeindex,
            range: $setup.type
          }, [
            vue.createElementVNode("view", { class: "picker-titleAndContent" }, [
              vue.createElementVNode("view", { class: "picker-left" }, [
                vue.createElementVNode("text", { class: "picker-must" }, "*"),
                vue.createElementVNode("view", { class: "picker-title" }, " 病害类型 ")
              ]),
              vue.createElementVNode("view", { class: "picker-right" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "picker-content",
                    style: vue.normalizeStyle($setup.typeindex === -1 ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.type[$setup.typeindex] || "请选择缺损类型"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("text", { class: "picker-icon" }, ">")
              ])
            ])
          ], 40, ["value", "range"]),
          vue.createCommentVNode(" 修改病害位置区域 - 添加点击事件 "),
          vue.createElementVNode("view", {
            class: "picker",
            onClick: $setup.openDiseasePositionPopup
          }, [
            vue.createElementVNode("view", { class: "picker-titleAndContent" }, [
              vue.createElementVNode("view", { class: "picker-left" }, [
                vue.createElementVNode("text", { class: "picker-must" }, "*"),
                vue.createElementVNode("view", { class: "picker-title" }, " 病害位置 ")
              ]),
              vue.createElementVNode("view", { class: "picker-right" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "picker-content",
                    style: vue.normalizeStyle(!$setup.position ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.position || "请选择病害位置"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("text", { class: "picker-icon" }, ">")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "location-description" }, [
            vue.createElementVNode("view", { class: "location-description-left" }, " 纵向位置描述 "),
            vue.createElementVNode("view", { class: "location-description-right" }, [
              vue.createTextVNode(" 距 "),
              vue.createElementVNode("view", {
                class: "location-description-right-position",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.openLocationPositionPopup("longitudinal"))
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "location-description-right-position-input",
                    style: vue.normalizeStyle(!$setup.longitudinalPosition ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.longitudinalPosition || "请选择"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ]),
              vue.createElementVNode("view", {
                class: "location-description-right-distance",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.openLocationDistancePopup("longitudinal"))
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "location-description-right-distance-input",
                    style: vue.normalizeStyle(!$setup.longitudinalDistance ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.longitudinalDistance || "请选择"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ]),
              vue.createElementVNode("view", { class: "clear" }, " × ")
            ])
          ]),
          vue.createElementVNode("view", { class: "location-description" }, [
            vue.createElementVNode("view", { class: "location-description-left" }, " 横向位置描述 "),
            vue.createElementVNode("view", { class: "location-description-right" }, [
              vue.createTextVNode(" 距 "),
              vue.createElementVNode("view", {
                class: "location-description-right-position",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.openLocationPositionPopup("lateral"))
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "location-description-right-position-input",
                    style: vue.normalizeStyle(!$setup.lateralPosition ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.lateralPosition || "请选择"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ]),
              vue.createElementVNode("view", {
                class: "location-description-right-distance",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.openLocationDistancePopup("lateral"))
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "location-description-right-distance-input",
                    style: vue.normalizeStyle(!$setup.lateralDistance ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.lateralDistance || "请选择"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ]),
              vue.createElementVNode("view", { class: "clear" }, " × ")
            ])
          ]),
          vue.createElementVNode("view", { class: "location-description" }, [
            vue.createElementVNode("view", { class: "location-description-left" }, " 竖向位置描述 "),
            vue.createElementVNode("view", { class: "location-description-right" }, [
              vue.createTextVNode(" 距 "),
              vue.createElementVNode("view", {
                class: "location-description-right-position",
                onClick: _cache[4] || (_cache[4] = ($event) => $setup.openLocationPositionPopup("vertical"))
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "location-description-right-distance-input",
                    style: vue.normalizeStyle(!$setup.verticalPosition ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.verticalPosition || "请选择"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ]),
              vue.createElementVNode("view", {
                class: "location-description-right-distance",
                onClick: _cache[5] || (_cache[5] = ($event) => $setup.openLocationDistancePopup("vertical"))
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "location-description-right-distance-input",
                    style: vue.normalizeStyle(!$setup.verticalDistance ? "color: #CCCCCC;" : "")
                  },
                  vue.toDisplayString($setup.verticalDistance || "请选择"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ]),
              vue.createElementVNode("view", { class: "clear" }, " × ")
            ])
          ])
        ]),
        vue.createCommentVNode(`			<view class="part-typeandnumber">\r
\r
				<picker class="picker-type" @change="typePickerChange" :value="biObjectindex" :range="biObjectName">\r
					<view class="picker-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title" style="position: relative;">\r
								<text style="position: absolute; left: -10px; color: red;">*</text>部件类型\r
							</view>\r
							<view class="part-content" :style="biObjectindex === -1 ? 'color: #CCCCCC;' : ''">\r
								{{ biObjectName[biObjectindex] || '请选择部件类型'}}\r
							</view>\r
						</view>\r
						<view class="part-icon">&gt;</view>\r
					</view>\r
				</picker>\r
\r
\r
				<picker class="picker-number" @change="numberPickerChange" :value="componentCodeindex"\r
					:range="componentCode">\r
					<view class="picker-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title" style="position: relative;">\r
								<text style="position: absolute; left: -10px; color: red;">*</text>构件编号\r
							</view>\r
							<view class="part-content" :style="componentCodeindex === -1 ? 'color: #CCCCCC;' : ''">\r
								{{ componentCode[componentCodeindex] || '请选择构件编号'}}\r
							</view>\r
						</view>\r
						<view class="part-icon">&gt;</view>\r
					</view>\r
				</picker>\r
\r
			</view>\r
\r
			<view class="part-Typeofdefect">\r
				<picker class="picker-Typeofdefect" @change="TypeofdefectPickerChange" :value="typeindex" :range="type">\r
					<view class="picker-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title" style="position: relative;">\r
								<text style="position: absolute; left: -10px; color: red;">*</text>缺损类型\r
							</view>\r
							<view class="part-content" :style="typeindex === -1 ? 'color: #CCCCCC;' : ''">\r
								{{type[typeindex] || '请选择缺损类型'}}\r
							</view>\r
						</view>\r
\r
						<view class="part-icon">&gt;</view>\r
					</view>\r
				</picker>\r
			</view>\r
\r
			<view class="part-Positionofdefect">\r
				<view class="input-content">\r
					<view class="part-titleandcontent">\r
						<view class="part-title" style="position: relative;">\r
							<text style="position: absolute; left: -10px; color: red;">*</text>缺损位置\r
						</view>\r
						<input type="text" placeholder="请填写缺损位置信息" class="input-text"\r
							placeholder-class="input-text-placeholder" v-model="position">\r
					</view>\r
				</view>\r
			</view>`),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { class: "head" }, [
            vue.createElementVNode("view", { class: "head-text" }, " 病害定量数据 ")
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 缺损数量 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("picker", {
                class: "quantitative-data-right-unit",
                onChange: $setup.quantityUnitChange,
                value: $setup.quantityUnitIndex,
                range: $setup.quantityUnitOptions
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "quantitative-data-right-unit-input" },
                  vue.toDisplayString($setup.quantityUnitOptions[$setup.quantityUnitIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 长度 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("picker", {
                class: "quantitative-data-right-unit",
                onChange: $setup.lengthUnitChange,
                value: $setup.lengthUnitIndex,
                range: $setup.lengthUnitOptions
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "quantitative-data-right-unit-input" },
                  vue.toDisplayString($setup.lengthUnitOptions[$setup.lengthUnitIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 宽度 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("picker", {
                class: "quantitative-data-right-unit",
                onChange: $setup.widthUnitChange,
                value: $setup.widthUnitIndex,
                range: $setup.widthUnitOptions
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "quantitative-data-right-unit-input" },
                  vue.toDisplayString($setup.widthUnitOptions[$setup.widthUnitIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 高度/深度 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("picker", {
                class: "quantitative-data-right-unit",
                onChange: $setup.heightUnitChange,
                value: $setup.heightUnitIndex,
                range: $setup.heightUnitOptions
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "quantitative-data-right-unit-input" },
                  vue.toDisplayString($setup.heightUnitOptions[$setup.heightUnitIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 缝宽 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("picker", {
                class: "quantitative-data-right-unit",
                onChange: $setup.seamsWidthUnitChange,
                value: $setup.seamsWidthUnitIndex,
                range: $setup.seamsWidthUnitOptions
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "quantitative-data-right-unit-input" },
                  vue.toDisplayString($setup.seamsWidthUnitOptions[$setup.seamsWidthUnitIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 面积 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("picker", {
                class: "quantitative-data-right-unit",
                onChange: $setup.areaUnitChange,
                value: $setup.areaUnitIndex,
                range: $setup.areaUnitOptions
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "quantitative-data-right-unit-input" },
                  vue.toDisplayString($setup.areaUnitOptions[$setup.areaUnitIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 体积 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("picker", {
                class: "quantitative-data-right-unit",
                onChange: $setup.volumeUnitChange,
                value: $setup.volumeUnitIndex,
                range: $setup.volumeUnitOptions
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "quantitative-data-right-unit-input" },
                  vue.toDisplayString($setup.volumeUnitOptions[$setup.volumeUnitIndex]),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "right-icon" }, ">")
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 角度 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("view", { class: "quantitative-data-right-unit-fixed" }, [
                vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " 度 "),
                vue.createElementVNode("view", { class: "right-icon" }, " ")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, " 百分比 "),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.createElementVNode("input", {
                  class: "quantitative-data-right-value-input",
                  placeholder: "请填写"
                }),
                vue.createElementVNode("view", { class: "clear-input" }, "×")
              ]),
              vue.createElementVNode("view", { class: "quantitative-data-right-unit-fixed" }, [
                vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " % "),
                vue.createElementVNode("view", { class: "right-icon" }, " ")
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { class: "head" }, [
            vue.createElementVNode("view", { class: "head-text" }, " 病害定性数据 ")
          ]),
          vue.createElementVNode("view", { class: "input-area" }, [
            vue.createElementVNode("view", { class: "input-area-title" }, [
              vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
              vue.createTextVNode("病害描述 ")
            ]),
            vue.createElementVNode("textarea", {
              class: "input-area-content",
              placeholder: "请填写病害信息",
              "auto-height": ""
            })
          ]),
          vue.createElementVNode("view", { class: "line-select" }, [
            vue.createElementVNode("view", { class: "line-select-left" }, [
              vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
              vue.createTextVNode(" 病害性质 ")
            ]),
            vue.createElementVNode("view", { class: "line-select-right" }, [
              vue.createVNode(_component_uni_data_checkbox, {
                mode: "tag",
                modelValue: $setup.natureindex,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.natureindex = $event),
                localdata: $setup.nature
              }, null, 8, ["modelValue", "localdata"])
            ])
          ]),
          vue.createElementVNode("view", { class: "line-select" }, [
            vue.createElementVNode("view", { class: "line-select-left" }, [
              vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
              vue.createTextVNode(" 参与评定（构件扣分25） ")
            ]),
            vue.createElementVNode("view", { class: "line-select-right" }, [
              vue.createVNode(_component_uni_data_checkbox, {
                mode: "tag",
                modelValue: $setup.participateAssessindex,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.participateAssessindex = $event),
                localdata: $setup.participateAssess
              }, null, 8, ["modelValue", "localdata"])
            ])
          ]),
          vue.createElementVNode("view", { class: "line-select" }, [
            vue.createElementVNode("view", { class: "line-select-left" }, [
              vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
              vue.createTextVNode(" 评定标度 ")
            ]),
            vue.createElementVNode("view", { class: "line-select-right" }, [
              vue.createVNode(_component_uni_data_checkbox, {
                mode: "tag",
                modelValue: $setup.levelindex,
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.levelindex = $event),
                localdata: $setup.level
              }, null, 8, ["modelValue", "localdata"])
            ])
          ]),
          vue.createElementVNode("view", { class: "line-select" }, [
            vue.createElementVNode("view", { class: "line-select-left" }, [
              vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
              vue.createTextVNode(" 病害维护状态 ")
            ]),
            vue.createElementVNode("view", { class: "line-select-right" }, [
              vue.createVNode(_component_uni_data_checkbox, {
                mode: "tag",
                modelValue: $setup.maintenanceStatusindex,
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.maintenanceStatusindex = $event),
                localdata: $setup.maintenanceStatus
              }, null, 8, ["modelValue", "localdata"])
            ])
          ])
        ]),
        vue.createCommentVNode(`			<view class="part-NumAndWayofDefect">\r
\r
				<view class="part-NumofDefect">\r
					<view class="picker-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title" style="position: relative;">\r
								<text style="position: absolute; left: -10px; color: red;">*</text>缺损数量\r
							</view>\r
							<uni-number-box class="NumofDefect" v-model="quantity" />\r
						</view>\r
\r
					</view>\r
				</view>\r
\r
				<picker class="part-WayofDefect" @change="WayofDefectPickerChange" :value="WayofDefectindex"\r
					:range="WayofDefect">\r
					<view class="picker-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title">数据记载方式</view>\r
							<view class="part-content" :style="WayofDefectindex === -1 ? 'color: #CCCCCC;' : ''">\r
								{{WayofDefect[WayofDefectindex] || '请选择数据记载方式'}}\r
							</view>\r
						</view>\r
						<view class="part-icon">&gt;</view>\r
					</view>\r
				</picker>\r
\r
			</view>\r
\r
			<view class="part-LengthAndWidth">\r
				<view class="part-Length">\r
					<view class="input-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title">长度(m)</view>\r
							<input type="text" placeholder="长度数据" class="input-text"\r
								placeholder-class="input-text-placeholder" v-model="length">\r
						</view>\r
					</view>\r
				</view>\r
\r
				<view class="part-Width">\r
					<view class="input-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title">宽度(m)</view>\r
							<input type="text" placeholder="宽度数据" class="input-text"\r
								placeholder-class="input-text-placeholder" v-model="width">\r
						</view>\r
					</view>\r
				</view>\r
\r
			</view>\r
\r
			<view class="part-SeamWidth-height-area">\r
				<view class="part-SeamWidth">\r
					<view class="input-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title">缝宽(mm)</view>\r
							<input type="text" placeholder="缝宽数据" class="input-text"\r
								placeholder-class="input-text-placeholder" v-model="slitWidth">\r
						</view>\r
					</view>\r
				</view>\r
\r
				<view class="part-height">\r
					<view class="input-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title">高度/深度(m)</view>\r
							<input type="text" placeholder="高度/深度数据" class="input-text"\r
								placeholder-class="input-text-placeholder" v-model="heightOrDepth">\r
						</view>\r
					</view>\r
				</view>\r
\r
				<view class="part-area">\r
					<view class="input-content">\r
						<view class="part-titleandcontent">\r
							<view class="part-title">面积(m²)</view>\r
							<input type="text" placeholder="面积数据" class="input-text"\r
								placeholder-class="input-text-placeholder" v-model="area">\r
						</view>\r
					</view>\r
				</view>\r
			</view>`),
        vue.createCommentVNode('			<view class="part-descriptionofDefect">\r\n				<view class="input-content">\r\n					<view class="part-titleandcontent">\r\n						<view class="part-title" style="position: relative;">\r\n							<text style="position: absolute; left: -10px; color: red;">*</text>病害描述(性质、范围、程度等)\r\n						</view>\r\n						<input type="text" placeholder="请填写病害描述信息" class="input-text"\r\n							placeholder-class="input-text-placeholder" v-model="description">\r\n					</view>\r\n				</view>\r\n			</view>\r\n\r\n			<view class="part-ScalesandRatings">\r\n				<view class="part-Scales">\r\n					<view class="radio-title" style="position: relative;">\r\n						<text style="position: absolute; left: -10px; color: red;">*</text>评定标度\r\n					</view>\r\n					<radio-group @change="ScalesRadioChange" class="radio-group">\r\n						<label class="radio-group-label" v-for="(item, index) in scalesItems" :key="item.value">\r\n							<view class="radio-item">\r\n								<radio style="transform:scale(1.2)" :value="item.value"\r\n									:checked="index === scalesCurrent" />\r\n							</view>\r\n							<view class="radio-item-name">{{item.name}}</view>\r\n						</label>\r\n					</radio-group>\r\n					<view class="part-prompt">\r\n						最大标度：4\r\n					</view>\r\n\r\n				</view>\r\n\r\n				<view class="part-Ratings">\r\n					<view class="radio-title" style="position: relative;">\r\n						<text style="position: absolute; left: -10px; color: red;">*</text>参与评定\r\n					</view>\r\n					<radio-group @change="RatingsRadioChange" class="radio-group">\r\n						<label class="radio-group-label" v-for="(item, index) in ratingItems" :key="item.value">\r\n							<view class="radio-item">\r\n								<radio style="transform:scale(1.2)" :value="item.value"\r\n									:checked="index === ratingCurrent" />\r\n							</view>\r\n							<view class="radio-item-name">{{item.name}}</view>\r\n						</label>\r\n					</radio-group>\r\n					<view class="part-prompt">\r\n						构件扣分：25\r\n					</view>\r\n				</view>\r\n\r\n			</view>'),
        vue.createElementVNode("view", { class: "head" }, [
          vue.createElementVNode("view", { class: "head-text" }, " 病害附件信息 ")
        ]),
        vue.createElementVNode("view", { class: "part-UploadImage" }, [
          vue.createElementVNode("view", { class: "part-title" }, "上传图片或视频"),
          vue.createElementVNode("view", { class: "upload-view" }, [
            vue.createVNode(_component_uni_file_picker, {
              class: "file-picker",
              limit: "9",
              "image-styles": $setup.imageStyles,
              modelValue: $setup.fileList,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.fileList = $event),
              "file-mediatype": "image",
              mode: "grid",
              onSelect: $setup.handleFileSelect,
              onDelete: $setup.handleFileDelete,
              "auto-upload": false
            }, null, 8, ["image-styles", "modelValue"])
          ])
        ]),
        vue.createElementVNode("view", { class: "part-ADImages" }, [
          vue.createElementVNode("view", { class: "part-title" }, "上传简图"),
          vue.createElementVNode("view", { class: "ADImages" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.ADImgs, (img, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "img-wrapper",
                  key: img.src
                }, [
                  vue.createElementVNode("image", {
                    src: img.src,
                    class: "ADImage",
                    mode: "widthFix"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", {
                    class: "close-btn",
                    onClick: ($event) => $setup.removeImage(index)
                  }, "×", 8, ["onClick"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.createElementVNode("view", {
              class: "ADImage-container",
              onClick: _cache[11] || (_cache[11] = ($event) => $setup.selectCanvasTemplate())
            }, [
              vue.createElementVNode("image", {
                src: _imports_0$2,
                class: "ADImageButton"
              })
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 底部弹出层 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "popup",
          type: "bottom"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "popup-content" }, [
              vue.createElementVNode("view", { class: "template-row" }, [
                vue.createElementVNode("view", { class: "template-type" }, " 模板 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_1$1,
                    class: "template-image-card",
                    onClick: _cache[12] || (_cache[12] = ($event) => $setup.onClickTemplate(1))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_2$1,
                    class: "template-image-card",
                    onClick: _cache[13] || (_cache[13] = ($event) => $setup.onClickTemplate(2))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_3$1,
                    class: "template-image-card",
                    onClick: _cache[14] || (_cache[14] = ($event) => $setup.onClickTemplate(3))
                  })
                ])
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createCommentVNode(" 添加病害位置选择弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "diseasePositionPopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "position-popup-content" }, [
              vue.createElementVNode("view", { class: "position-popup-title" }, "选择病害位置"),
              vue.createVNode(_component_uni_combox, {
                class: "position-combox",
                candidates: $setup.diseasePosition,
                modelValue: $setup.selectedPosition,
                "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $setup.selectedPosition = $event),
                placeholder: "请选择病害位置"
              }, null, 8, ["candidates", "modelValue"]),
              vue.createElementVNode("view", { class: "position-popup-buttons" }, [
                vue.createElementVNode("button", {
                  class: "position-popup-button cancel",
                  onClick: $setup.closeDiseasePositionPopup
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "position-popup-button confirm",
                  onClick: $setup.confirmDiseasePosition
                }, "确认")
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createCommentVNode(" 添加构件编号选择弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "componentCodePopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "component-popup-content" }, [
              vue.createElementVNode("view", { class: "component-popup-title" }, "选择构件编号"),
              vue.createElementVNode("view", { class: "component-search-box" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "component-search-input",
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $setup.componentCodeFilter = $event),
                    placeholder: "输入关键字筛选",
                    onInput: $setup.filterComponentCodes
                  },
                  null,
                  544
                  /* NEED_HYDRATION, NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.componentCodeFilter]
                ]),
                $setup.componentCodeFilter ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "component-search-clear",
                  onClick: $setup.clearComponentSearch
                }, "×")) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("scroll-view", {
                class: "component-code-list",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.filteredComponentCodes, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: vue.normalizeClass(["component-code-item", { "component-code-item-active": $setup.componentCode[$setup.componentCodeindex] === item }]),
                      onClick: ($event) => $setup.selectComponentCode(index)
                    }, vue.toDisplayString(item), 11, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "component-popup-buttons" }, [
                vue.createElementVNode("button", {
                  class: "component-popup-button cancel",
                  onClick: $setup.closeComponentCodePopup
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "component-popup-button confirm",
                  onClick: $setup.confirmComponentCode
                }, "确认")
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "LocationDescriptionPositionPopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "location-description-position-popup-content" }, [
              vue.createElementVNode(
                "view",
                { class: "location-description-position-popup-title" },
                vue.toDisplayString($setup.currentPositionTitle),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "location-description-position-popup-input1" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请填写",
                    class: "location-description-popup-input",
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $setup.positionInput1Value = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.positionInput1Value]
                ]),
                vue.createElementVNode("button", {
                  class: "location-description-popup-button",
                  onClick: $setup.confirmPositionInput1
                }, "确定")
              ]),
              vue.createElementVNode("view", { class: "location-description-position-popup-input2" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请填写",
                    class: "location-description-popup-input",
                    "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $setup.positionInput2Value = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.positionInput2Value]
                ]),
                vue.createElementVNode("view", { class: "location-description-position-popup-input2-right" }, [
                  vue.createElementVNode("view", { class: "location-description-position-popup-input2-text" }, "#墩侧"),
                  vue.createElementVNode("button", {
                    class: "location-description-popup-button",
                    onClick: $setup.confirmPositionInput2
                  }, "确定")
                ])
              ]),
              vue.createElementVNode("view", { class: "location-description-position-popup-input3" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.currentPositionOptions, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "location-description-position-popup-input3-item",
                      onClick: ($event) => $setup.selectPositionItem(item)
                    }, vue.toDisplayString(item), 9, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "LocationDescriptionDistancePopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "location-description-distance-popup-content" }, [
              vue.createElementVNode("view", { class: "location-description-distance-popup-title" }, "位置"),
              vue.createElementVNode("view", { class: "location-description-distance-popup-input1" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $setup.distanceInput1Value = $event),
                    placeholder: "请填写",
                    class: "location-description-popup-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.distanceInput1Value]
                ]),
                vue.createElementVNode("view", { class: "location-description-distance-popup-input1-right" }, [
                  vue.createElementVNode("view", { class: "location-description-distance-popup-input1-text" }, "米"),
                  vue.createElementVNode("button", {
                    class: "location-description-popup-button",
                    onClick: $setup.confirmDistanceInput1
                  }, "确定")
                ])
              ]),
              vue.createElementVNode("view", { class: "location-description-distance-popup-input2" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => $setup.distanceInput2Numerator = $event),
                    placeholder: "请填写",
                    class: "location-description-popup-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.distanceInput2Numerator]
                ]),
                vue.createElementVNode("view", { class: "location-description-distance-popup-input2-mid" }, "分之"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $setup.distanceInput2Denominator = $event),
                    placeholder: "请填写",
                    class: "location-description-popup-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.distanceInput2Denominator]
                ]),
                vue.createElementVNode("button", {
                  class: "location-description-popup-button",
                  onClick: $setup.confirmDistanceInput2
                }, "确定")
              ]),
              vue.createElementVNode("view", { class: "location-description-distance-popup-input3" }, [
                (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(["1/2", "1/3", "1/4"], (item, index) => {
                    return vue.createElementVNode("view", {
                      key: index,
                      class: "location-description-distance-popup-input3-item",
                      onClick: ($event) => $setup.selectDistanceItem(item)
                    }, vue.toDisplayString(item), 9, ["onClick"]);
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesAddDiseaseAddDisease = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-79f8b97c"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/add-disease/add-disease.vue"]]);
  function drawRulerRectTemplate(ctx, {
    logicalWidth = 8,
    logicalHeight = 8,
    unit = "cm"
  }) {
    const MAX_DRAW_WIDTH = 800;
    const MAX_DRAW_HEIGHT = 400;
    let scale = MAX_DRAW_WIDTH / logicalWidth;
    let drawWidth = MAX_DRAW_WIDTH;
    let drawHeight = logicalHeight * scale;
    if (drawHeight > MAX_DRAW_HEIGHT) {
      scale = MAX_DRAW_HEIGHT / logicalHeight;
      drawHeight = MAX_DRAW_HEIGHT;
      drawWidth = logicalWidth * scale;
    }
    const centerX = 750 / 2;
    const centerY = 950 / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-centerY, -centerX);
    const x = (950 - drawWidth) / 2;
    const y2 = (750 - drawHeight) / 2;
    const rulerGap = 10;
    const minPixelPerUnit = 40;
    let unitStepX = 1;
    while (unitStepX * scale < minPixelPerUnit)
      unitStepX++;
    let unitStepY = 1;
    while (unitStepY * scale < minPixelPerUnit)
      unitStepY++;
    ctx.setLineWidth(1);
    ctx.setStrokeStyle("#333");
    ctx.setFontSize(12);
    ctx.strokeRect(x, y2, drawWidth, drawHeight);
    ctx.beginPath();
    ctx.moveTo(x, y2 - rulerGap);
    ctx.lineTo(x + drawWidth, y2 - rulerGap);
    ctx.stroke();
    for (let i2 = 0; i2 <= logicalWidth; i2 += unitStepX) {
      const px = x + i2 * scale;
      const py = y2 - rulerGap;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py - 8);
      ctx.stroke();
      ctx.fillText(`${i2}${unit}`, px - 10, py - 12);
    }
    if (logicalWidth % unitStepX !== 0) {
      const px = x + logicalWidth * scale;
      const py = y2 - rulerGap;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py - 8);
      ctx.stroke();
      ctx.fillText(`${logicalWidth}${unit}`, px - 10, py - 12);
    }
    ctx.beginPath();
    ctx.moveTo(x + drawWidth + rulerGap, y2);
    ctx.lineTo(x + drawWidth + rulerGap, y2 + drawHeight);
    ctx.stroke();
    for (let i2 = 0; i2 <= logicalHeight; i2 += unitStepY) {
      const py = y2 + i2 * scale;
      const px = x + drawWidth + rulerGap;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 8, py);
      ctx.stroke();
      ctx.fillText(`${i2}${unit}`, px + 10, py + 5);
    }
    if (logicalHeight % unitStepY !== 0) {
      const py = y2 + logicalHeight * scale;
      const px = x + drawWidth + rulerGap;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 8, py);
      ctx.stroke();
      ctx.fillText(`${logicalHeight}${unit}`, px + 10, py + 5);
    }
    {
      const arrowStartX = x + drawWidth / 3;
      const arrowY = y2 + drawHeight + 10;
      const arrowEndX = x + drawWidth / 3 * 2;
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - 10, arrowY - 5);
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - 10, arrowY + 5);
      ctx.stroke();
      ctx.fillText("桩号增大方向", x + drawWidth / 2 - 40, arrowY + 20);
    }
  }
  function drawArchBridgeTemplate(ctx, {
    logicalLength = 53,
    // 总逻辑长度（单位）
    beamCount = 3,
    // 梁数，最终桥墩数 = 2n + 1
    unit = "m",
    // 单位显示
    bigBeamNumber = 36,
    //大桩号墩
    smallBeamNumber = 35,
    //小桩号墩
    bridgeFu = "L"
    //桥幅
  }) {
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const drawWidth = 800 / (beamCount * 2 + 1) < 80 ? (beamCount * 2 + 1) * 80 : 800;
    const drawHeight = beamCount * 20 > 200 ? 200 : beamCount * 20;
    const screenWidth = 750;
    const screenHeight = 950;
    const x = (screenWidth - drawHeight) / 2;
    const y2 = (screenHeight - drawWidth) / 2;
    const unitLevel = 25;
    drawRuler(
      ctx,
      x + drawHeight + 10,
      y2,
      x + drawHeight + 10,
      y2 + drawWidth,
      "row",
      logicalLength,
      unitLevel,
      unit
    );
    const lineList = [];
    ctx.beginPath();
    ctx.moveTo(x + drawHeight, y2);
    ctx.lineTo(x + drawHeight, y2 + drawWidth);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + drawHeight, y2);
    ctx.lineTo(x, y2);
    ctx.stroke();
    lineList.push({
      x,
      y: y2
    });
    const exponent = 2;
    const xPoints = [lineList[0].x];
    for (let i2 = 1; i2 < beamCount; i2++) {
      const ratio = 1 - Math.pow(1 - i2 / (beamCount + 1), exponent);
      const xi = x + drawHeight / 3 * 2 * ratio;
      xPoints.push(xi);
    }
    for (let i2 = 0; i2 < beamCount; i2++) {
      const py = y2 + (i2 + 1) * drawWidth / (beamCount * 2 + 1);
      const px = xPoints[i2];
      ctx.beginPath();
      ctx.moveTo(px, py);
      lineList.push({
        x: px,
        y: py
      });
      ctx.lineTo(x + drawHeight, py);
      ctx.stroke();
    }
    for (let i2 = 0; i2 < beamCount; i2++) {
      const py = y2 + (i2 + 1 + beamCount) * drawWidth / (beamCount * 2 + 1);
      ctx.beginPath();
      ctx.moveTo(lineList[beamCount - i2].x, py);
      lineList.push({
        x: lineList[beamCount - i2].x,
        y: py
      });
      ctx.lineTo(x + drawHeight, py);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x + drawHeight, y2 + drawWidth);
    lineList.push({
      x,
      y: y2 + drawWidth
    });
    ctx.lineTo(x, y2 + drawWidth);
    ctx.stroke();
    drawConvexCurve(ctx, lineList, bigBeamNumber, smallBeamNumber, bridgeFu, beamCount);
  }
  function drawRuler(ctx, x, y2, endx, endy, direction, logicalLength, unitLevel, unit) {
    const intLogicalLength = Math.floor(logicalLength);
    const unitCount = logicalLength % unitLevel === 0 ? logicalLength / unitLevel : Math.floor(logicalLength / unitLevel) + 1;
    ctx.beginPath();
    ctx.moveTo(x, y2);
    ctx.lineTo(endx, endy);
    ctx.stroke();
    for (let i2 = 0; i2 <= intLogicalLength / unitCount - 1; i2++) {
      let text;
      let textX;
      let textY;
      if (direction === "colunm") {
        const longth = endx - x;
        const oversetY = (endy - y2) / (intLogicalLength / unitCount);
        const px = x + i2 * (longth / (intLogicalLength / unitCount));
        ctx.beginPath();
        ctx.moveTo(px, y2 + oversetY * i2);
        ctx.lineTo(px, y2 + 8 + oversetY * i2);
        ctx.stroke();
        text = `${i2 * unitCount}${unit}`;
        textX = px - 10;
        textY = y2 + 15 + oversetY * i2;
      } else {
        const longth = endy - y2;
        const oversetX = (endx - x) / (intLogicalLength / unitCount);
        const py = y2 + i2 * (longth / (intLogicalLength / unitCount));
        ctx.beginPath();
        ctx.moveTo(x + oversetX, py);
        ctx.lineTo(x + 8 + oversetX, py);
        ctx.stroke();
        text = `${i2 * unitCount}${unit}`;
        textX = x + 15 + oversetX;
        textY = py - 10;
      }
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(90 * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
    {
      let text;
      let textX;
      let textY;
      if (direction === "colunm") {
        ctx.beginPath();
        ctx.moveTo(endx, endy);
        ctx.lineTo(endx, endy + 8);
        ctx.stroke();
        text = `${logicalLength}${unit}`;
        textX = endx - 10;
        textY = endy + 15;
      } else {
        ctx.beginPath();
        ctx.moveTo(endx, endy);
        ctx.lineTo(endx + 8, endy);
        ctx.stroke();
        text = `${logicalLength}${unit}`;
        textX = endx + 15;
        textY = endy - 10;
      }
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(90 * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }
  function drawConvexCurve(ctx, points, bigBeamNumber, smallBeamNumber, bridgeFu, beamCount) {
    if (!points || points.length < 2)
      return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i2 = 1; i2 < points.length; i2++) {
      const text = `${bridgeFu}${bigBeamNumber}-${i2 > beamCount ? bigBeamNumber : smallBeamNumber}-${i2 - 1 > beamCount ? beamCount * 2 - i2 + 1 : i2 - 1}#`;
      const textX = points[i2 - 1].x - 20;
      const textY = points[i2 - 1].y - 20;
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(90 * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
    for (let i2 = 1; i2 < points.length; i2++) {
      const p0 = points[i2 - 1];
      const p1 = points[i2];
      const p2 = points[i2 + 1] || p1;
      const cp1x = p0.x + (p1.x - p0.x) / 4;
      const cp1y = p0.y + (p1.y - p0.y) / 4;
      const cp2x = p1.x - (p2.x - p1.x) / 4;
      const cp2y = p1.y - (p2.y - p1.y) / 4;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y);
    }
    ctx.stroke();
  }
  function drawRulerRectTemplate4(ctx, {
    logicalWidth = 12,
    bigBeamNumber = 1,
    beamCount = 8,
    bridgeFu = "L",
    unit = "m"
  }) {
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const miniRectHeight = 50;
    const drawWidth = 600;
    const drawHeight = miniRectHeight * beamCount;
    const overSetY = 50;
    const x = 100;
    const y2 = 950 - drawHeight > 0 ? (950 - drawHeight) / 2 : 50;
    ctx.beginPath();
    ctx.moveTo(x, y2);
    ctx.lineTo(x + drawWidth, y2 + overSetY);
    ctx.moveTo(x, y2);
    ctx.lineTo(x, y2 + drawHeight);
    ctx.moveTo(x, y2 + drawHeight);
    ctx.lineTo(x + drawWidth, y2 + drawHeight + overSetY);
    ctx.moveTo(x + drawWidth, y2 + overSetY);
    ctx.lineTo(x + drawWidth, y2 + drawHeight + overSetY);
    ctx.stroke();
    for (let i2 = 1; i2 <= beamCount; i2++) {
      const py = y2 + i2 * miniRectHeight;
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + drawWidth, py + overSetY);
      ctx.stroke();
      const text = `${bridgeFu}${bigBeamNumber}-${i2}`;
      ctx.save();
      ctx.translate(x + drawWidth + 10, py + overSetY - 34);
      ctx.rotate(90 * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
    for (let i2 = 1; i2 < beamCount; i2++) {
      const py = y2 + i2 * miniRectHeight;
      const text = `${bridgeFu}${bigBeamNumber}-${i2}`;
      ctx.save();
      ctx.translate(x - 16, py - 16);
      ctx.rotate(90 * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
    ctx.save();
    ctx.translate(x - 40, y2 + drawHeight / 2 - 24);
    ctx.rotate(90 * Math.PI / 180);
    ctx.fillText("铰缝编号", 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(x + drawWidth + 30, y2 + overSetY + drawHeight / 2 - 20);
    ctx.rotate(90 * Math.PI / 180);
    ctx.fillText("铰缝编号", 0, 0);
    ctx.restore();
    drawRuler(
      ctx,
      x + drawWidth,
      y2 + drawHeight + overSetY + 10,
      x,
      y2 + drawHeight + 10,
      "colunm",
      logicalWidth,
      20,
      unit
    );
  }
  const _imports_0$1 = "/static/image/hand.svg";
  const _imports_1 = "/static/image/line.svg";
  const _imports_2 = "/static/image/curve.svg";
  const _imports_3 = "/static/image/rect.svg";
  const _imports_4 = "/static/image/circle.svg";
  const _imports_5 = "/static/image/text.svg";
  const _imports_6 = "/static/image/back.svg";
  const _imports_7 = "/static/image/save.svg";
  const canvasId = "myCanvas";
  const transparentCanvasId = "transparentCanvas";
  const _sfc_main$3 = {
    __name: "canvas",
    setup(__props, { expose: __expose }) {
      __expose();
      const ctx = vue.ref(null);
      const transparentCtx = vue.ref(null);
      const screenWidth = vue.ref(0);
      const screenHeight = vue.ref(0);
      const canvasStyle = vue.ref({
        width: "100vw",
        height: "100vh"
      });
      const offsetX = vue.ref(0);
      const offsetY = vue.ref(0);
      const scale = vue.ref(1);
      const lastDistance = vue.ref(0);
      const isScaling = vue.ref(false);
      const mode = vue.ref("line");
      const startX = vue.ref(0);
      const startY = vue.ref(0);
      const currentX = vue.ref(0);
      const currentY = vue.ref(0);
      const offsetStartX = vue.ref(0);
      const offsetStartY = vue.ref(0);
      const offsetCurrentX = vue.ref(0);
      const offsetCurrentY = vue.ref(0);
      const drawing = vue.ref(false);
      const template = vue.ref("");
      const history = vue.ref([]);
      const curvePoints = vue.ref([]);
      const status = vue.ref("start");
      const drawColor = vue.ref("#ff0000");
      const textValue = vue.ref("");
      const showTextInput = vue.ref(false);
      const textInputX = vue.ref(0);
      const textInputY = vue.ref(0);
      const changingTextIndex = vue.ref(null);
      const beforeChangeText = vue.ref("");
      const canvasImagePath = vue.ref("");
      const textFontSize = vue.ref(20);
      const textSelecting = vue.ref(false);
      const textBox = vue.ref(null);
      const selectedObject = vue.ref(null);
      const selectedObjectOriginColor = vue.ref(null);
      const touchMoveMode = vue.ref("canvas");
      const events = vue.ref([]);
      const markSavedEvent = vue.ref(false);
      const inputAndChanged = vue.ref(false);
      const clickCandidates = vue.ref([]);
      const clickCycleIndex = vue.ref(0);
      const showParamPopup = vue.ref(false);
      const rectTemplateParam = vue.ref({
        logicalWidth: 8,
        logicalHeight: 8,
        unit: "cm"
      });
      const bridgeTemplateParam = vue.ref({
        logicalLength: 12.1,
        beamCount: 3,
        bigBeamNumber: 36,
        smallBeamNumber: 35,
        bridgeFu: "L",
        unit: "cm"
      });
      const rectTemplateParam4 = vue.ref({
        logicalWidth: 12,
        bigBeamNumber: 1,
        beamCount: 8,
        bridgeFu: "L",
        unit: "m"
      });
      const tempParams = vue.ref({});
      const fieldList = vue.reactive([
        {
          key: "logicalWidth",
          label: "逻辑宽度（单位数）",
          type: "number"
        },
        {
          key: "logicalHeight",
          label: "逻辑高度（单位数）",
          type: "number"
        },
        {
          key: "logicalLength",
          label: "逻辑长度",
          type: "number"
        },
        {
          key: "beamCount",
          label: "梁数",
          type: "number"
        },
        {
          key: "bigBeamNumber",
          label: "大桩号墩",
          type: "number"
        },
        {
          key: "smallBeamNumber",
          label: "小桩号墩",
          type: "number"
        },
        {
          key: "unit",
          label: "单位(cm / m)",
          type: "text"
        },
        {
          key: "bridge",
          label: "桥幅(L / R)",
          type: "text"
        }
      ]);
      const lastClick = vue.ref({
        x: null,
        y: null,
        index: -1
      });
      let lastRedrawTime = 0;
      vue.onMounted(() => {
        const systemInfo = uni.getSystemInfoSync();
        screenWidth.value = systemInfo.windowWidth;
        screenHeight.value = systemInfo.windowHeight;
        canvasStyle.value = {
          width: `${screenWidth.value}px`,
          height: `${screenHeight.value}px`
        };
        ctx.value = uni.createCanvasContext(canvasId);
        transparentCtx.value = uni.createCanvasContext(transparentCanvasId);
        ctx.value.setFontSize(textFontSize.value);
        redrawCanvas();
      });
      onLoad((options) => {
        switch (options.template) {
          case "1":
            template.value = "rect";
            break;
          case "2":
            template.value = "bridge";
            break;
          case "3":
            template.value = "rect4";
            break;
          default:
            template.value = "";
        }
      });
      const eventChannel = vue.getCurrentInstance().proxy.getOpenerEventChannel();
      const changeColor = (color) => {
        drawColor.value = color;
      };
      const chooseTemplate = (tem) => {
        if (tem !== null) {
          template.value = tem;
        }
        resetState();
      };
      const inputting = () => {
        if (changingTextIndex.value !== null) {
          history.value[changingTextIndex.value].textValue = textValue.value;
          inputAndChanged.value = true;
        } else {
          history.value[history.value.length - 1].textValue = textValue.value;
        }
        textBox.value.width = textValue.value == "" ? 20 : ctx.value.measureText(textValue.value).width;
        redrawCanvas();
      };
      const cancelText = () => {
        if (changingTextIndex.value !== null) {
          history.value[changingTextIndex.value].textValue = beforeChangeText.value;
          inputAndChanged.value = false;
        } else {
          history.value.pop();
          events.value.pop();
        }
        resetState();
      };
      const confirmText = () => {
        if (textValue.value === "") {
          history.value.pop();
        }
        if (inputAndChanged.value == true && beforeChangeText.value != textValue.value) {
          events.value.push({
            type: "textValueChange",
            object: {
              oldTextValue: beforeChangeText.value,
              newTextValue: textValue.value
            },
            id: history.value[changingTextIndex.value].id
          });
          inputAndChanged.value = false;
        }
        resetState();
      };
      const resetState = () => {
        showTextInput.value = false;
        textSelecting.value = false;
        changingTextIndex.value = null;
        textValue.value = "";
        redrawCanvas();
      };
      const setMode = (newMode) => {
        mode.value = newMode;
        if (showTextInput.value) {
          clickWithInputShowing();
        }
        resetState();
      };
      const clearCanvas = () => {
        events.value.push({
          type: "clear",
          object: {
            history: history.value,
            template: template.value
          }
        });
        history.value = [];
        resetState();
        redrawCanvas();
      };
      const zoomIn = () => {
        scale.value *= 1.1;
        redrawCanvas();
      };
      const zoomOut = () => {
        scale.value /= 1.1;
        redrawCanvas();
      };
      const undo = () => {
        let len = events.value.length;
        if (len > 0) {
          let type = events.value[len - 1].type;
          let obj = events.value[len - 1].object;
          let id = events.value[len - 1].id;
          let index = -1;
          if (id !== null) {
            index = history.value.findIndex((item) => item.id === id);
          }
          if (type == "add") {
            if (index !== -1) {
              history.value.splice(index, 1);
            }
          } else if (type == "delete") {
            history.value.push(obj);
          } else if (type == "move") {
            if (index !== -1) {
              backToOldPosition(index, obj);
            }
          } else if (type == "template") {
            template.value = obj.oldTemplateImage;
          } else if (type == "clear") {
            history.value = obj.history;
            template.value = obj.template;
          } else if (type == "textValueChange") {
            history.value[index].textValue = obj.oldTextValue;
          }
        }
        events.value.pop();
        resetState();
      };
      const backToOldPosition = (index, obj) => {
        if (history.value[index].mode === "line") {
          history.value[index].startX = obj.startX;
          history.value[index].startY = obj.startY;
          history.value[index].endX = obj.endX;
          history.value[index].endY = obj.endY;
        } else if (history.value[index].mode === "rect") {
          history.value[index].x = obj.x;
          history.value[index].y = obj.y;
          history.value[index].width = obj.width;
          history.value[index].height = obj.height;
        } else if (history.value[index].mode === "circle") {
          history.value[index].startX = obj.startX;
          history.value[index].startY = obj.startY;
          history.value[index].currentX = obj.currentX;
          history.value[index].currentY = obj.currentY;
        } else if (history.value[index].mode === "curve") {
          history.value[index].curvePoints = obj.curvePoints;
        } else if (history.value[index].mode === "text") {
          history.value[index].textInputX = obj.textInputX;
          history.value[index].textInputY = obj.textInputY;
        }
      };
      const deleteSelected = () => {
        if (!selectedObject.value)
          return;
        const index = history.value.findIndex((item) => item.id === selectedObject.value.id);
        if (index !== -1) {
          events.value.push({
            type: "delete",
            object: history.value[index]
          });
          history.value.splice(index, 1);
          selectedObject.value = null;
        }
        resetState();
        redrawCanvas();
      };
      const getDistance = (touches) => {
        const dx = touches[0].x - touches[1].x;
        const dy = touches[0].y - touches[1].y;
        return Math.sqrt(dx * dx + dy * dy);
      };
      function updateInputSize() {
        const text = textValue.value;
        const width = text.length ? text.length * 8 + 10 : 50;
        inputStyle.value.width = `${width}px`;
      }
      const touchStart = (e2) => {
        let {
          x,
          y: y2
        } = e2.touches[0];
        startX.value = x;
        startY.value = y2;
        offsetStartX.value = x - offsetX.value;
        offsetStartY.value = y2 - offsetY.value;
        drawing.value = true;
        if (mode.value === "curve") {
          curvePoints.value = [{
            x,
            y: y2
          }];
        }
        status.value = "start";
        markSavedEvent.value = false;
        if (mode.value === "select" && selectedObject.value !== null && isPointInShape(selectedObject.value, -1, offsetStartX.value, offsetStartY.value)) {
          touchMoveMode.value = "object";
        } else {
          touchMoveMode.value = "canvas";
        }
      };
      const touchMove = (e2) => {
        if (!drawing.value)
          return;
        let {
          x,
          y: y2
        } = e2.touches[0];
        currentX.value = x;
        currentY.value = y2;
        offsetCurrentX.value = x - offsetX.value;
        offsetCurrentY.value = y2 - offsetY.value;
        if (mode.value !== "select") {
          transparentCtx.value.clearRect(0, 0, screenWidth.value, screenHeight.value);
          transparentCtx.value.setStrokeStyle("#ff00ff");
          transparentCtx.value.setLineWidth(1);
          transparentCtx.value.beginPath();
        }
        if (mode.value === "line") {
          transparentCtx.value.moveTo(startX.value, startY.value);
          transparentCtx.value.lineTo(currentX.value, currentY.value);
        } else if (mode.value === "rect") {
          transparentCtx.value.rect(startX.value, startY.value, currentX.value - startX.value, currentY.value - startY.value);
        } else if (mode.value === "circle") {
          drawSmoothEllipse(transparentCtx.value, startX.value, startY.value, currentX.value, currentY.value);
        } else if (mode.value === "curve") {
          curvePoints.value.push({
            x,
            y: y2
          });
          transparentCtx.value.moveTo(curvePoints.value[0].x, curvePoints.value[0].y);
          curvePoints.value.forEach((point) => {
            transparentCtx.value.lineTo(point.x, point.y);
          });
        } else if (mode.value === "select") {
          if (e2.touches.length === 1) {
            const dx = e2.touches[0].x - startX.value;
            const dy = e2.touches[0].y - startY.value;
            if (touchMoveMode.value === "canvas") {
              offsetX.value += dx;
              offsetY.value += dy;
            } else {
              const index = history.value.findIndex((item) => item.id === selectedObject.value.id);
              if (index !== -1) {
                if (markSavedEvent.value == false) {
                  const objJSON = JSON.parse(JSON.stringify(history.value[index]));
                  events.value.push({
                    type: "move",
                    object: objJSON,
                    id: objJSON.id
                  });
                  markSavedEvent.value = true;
                }
                changeObjectPosition(history.value[index], dx, dy);
              }
            }
            startX.value = e2.touches[0].x;
            startY.value = e2.touches[0].y;
            redrawCanvas();
          } else if (e2.touches.length === 2) {
            const newDistance = getDistance(e2.touches);
            if (lastDistance.value == 0) {
              lastDistance.value = newDistance;
            }
            const scaleFactor = newDistance / lastDistance.value;
            scale.value *= scaleFactor;
            scale.value = Math.max(0.5, Math.min(scale.value, 3));
            lastDistance.value = newDistance;
            redrawCanvas();
          }
        }
        transparentCtx.value.stroke();
        transparentCtx.value.draw(false);
        if (mode.value !== "text") {
          status.value = "select";
        }
      };
      const touchEnd = (e2) => {
        if (!drawing.value)
          return;
        drawing.value = false;
        let {
          x,
          y: y2
        } = e2.changedTouches[0];
        x = x - offsetX.value;
        y2 = y2 - offsetY.value;
        if (mode.value !== "select" && mode.value !== "text" && status.value !== "start") {
          save();
        }
        if (mode.value === "text") {
          const clickIndex = clickOnText(x, y2);
          if (showTextInput.value) {
            clickWithInputShowing();
          } else {
            if (clickIndex === -1) {
              textInputX.value = x + offsetX.value;
              textInputY.value = y2 + 10 + offsetY.value;
              textValue.value = "";
              showTextInput.value = true;
              textSelecting.value = true;
              textBox.value = {
                x,
                y: y2 - 20,
                width: 20,
                height: 20
              };
              save();
            } else {
              changeText(clickIndex);
            }
          }
        }
        if (status.value === "start" && mode.value === "select") {
          currentX.value = startX.value;
          currentY.value = startY.value;
          if (!showTextInput.value) {
            clickOnObject(offsetStartX.value, offsetStartY.value);
          } else {
            clickWithInputShowing();
          }
        }
        if (status.value === "select" && mode.value === "select") {
          if (showTextInput.value) {
            clickWithInputShowing();
          }
        }
        transparentCtx.value.clearRect(0, 0, screenWidth.value, screenHeight.value);
        transparentCtx.value.draw(true);
        status.value = "end";
        setTimeout(() => {
          redrawCanvas();
        }, 50);
      };
      const clickWithInputShowing = () => {
        if (changingTextIndex.value !== null) {
          history.value[changingTextIndex.value].textValue = beforeChangeText.value;
          inputAndChanged.value = false;
        } else {
          history.value.pop();
          events.value.pop();
        }
        resetState();
      };
      const changeText = (clickIndex) => {
        let clickObj = history.value[clickIndex];
        const textWidth = ctx.value.measureText(clickObj.textValue).width;
        const textHeight = textFontSize.value;
        textValue.value = clickObj.textValue;
        changingTextIndex.value = clickIndex;
        beforeChangeText.value = JSON.parse(JSON.stringify(clickObj.textValue));
        showTextInput.value = true;
        textSelecting.value = true;
        textBox.value = {
          x: clickObj.textInputX,
          y: clickObj.textInputY - textHeight,
          width: textWidth,
          height: textHeight
        };
        textInputX.value = clickObj.textInputX + offsetX.value;
        textInputY.value = clickObj.textInputY + 10 + offsetY.value;
      };
      const clickOnText = (x, y2) => {
        const tolerance = 3;
        const isSamePos = lastClick.value.x !== null && Math.abs(lastClick.value.x - x) <= tolerance && Math.abs(lastClick.value.y - y2) <= tolerance;
        let found = false;
        let foundIndex = -1;
        for (let i2 = history.value.length - 1; i2 >= 0; i2--) {
          const action = history.value[i2];
          if (isSamePos && i2 === lastClick.value.index)
            continue;
          if (action.mode === "text" && isPointInText(action, i2, x, y2)) {
            found = true;
            foundIndex = i2;
            break;
          }
        }
        if (found) {
          lastClick.value = {
            x,
            y: y2,
            index: foundIndex
          };
          return foundIndex;
        } else {
          lastClick.value = {
            x: null,
            y: null,
            index: -1
          };
          return -1;
        }
      };
      const clickOnObject = (x, y2) => {
        const tolerance = 3;
        const isSamePos = lastClick.value.x !== null && Math.abs(lastClick.value.x - x) <= tolerance && Math.abs(lastClick.value.y - y2) <= tolerance;
        const candidates = [];
        for (let i2 = history.value.length - 1; i2 >= 0; i2--) {
          const action = history.value[i2];
          if (mode.value === "text" && action.mode !== "text")
            continue;
          if (isPointInShape(action, i2, x, y2)) {
            candidates.push({
              action,
              index: i2
            });
          }
        }
        if (candidates.length === 0) {
          changingTextIndex.value = -1;
          if (selectedObject.value !== null) {
            const index = history.value.findIndex((item) => item.id == selectedObject.value.id);
            if (index !== -1) {
              history.value[index].color = selectedObjectOriginColor.value;
            }
          }
          selectedObject.value = null;
          lastClick.value = {
            x: null,
            y: null,
            index: -1
          };
          clickCandidates.value = [];
          clickCycleIndex.value = 0;
          return;
        }
        let updatedHistory = history.value.map((action) => ({
          ...action
        }));
        let chosen;
        if (isSamePos && clickCandidates.value.length > 0 && JSON.stringify(clickCandidates.value.map((c2) => c2.index)) === JSON.stringify(candidates.map((c2) => c2.index))) {
          clickCycleIndex.value = (clickCycleIndex.value + 1) % candidates.length;
          chosen = candidates[clickCycleIndex.value];
        } else {
          clickCandidates.value = candidates;
          clickCycleIndex.value = 0;
          chosen = candidates[0];
        }
        if (chosen.action.mode !== "text") {
          if (selectedObject.value === null && candidates.length !== 0) {
            selectedObjectOriginColor.value = JSON.parse(JSON.stringify(history.value[chosen.index].color));
            updatedHistory[chosen.index].color = "#ff93c4";
            selectedObject.value = updatedHistory[chosen.index];
          } else if (selectedObject.value !== null && selectedObject.value.id === chosen.action.id)
            ;
          else if (selectedObject.value !== null && selectedObject.value.id !== chosen.action.id) {
            const index = updatedHistory.findIndex((item) => item.id == selectedObject.value.id);
            if (index !== -1) {
              updatedHistory[index].color = selectedObjectOriginColor.value;
            }
            selectedObjectOriginColor.value = JSON.parse(JSON.stringify(history.value[chosen.index].color));
            updatedHistory[chosen.index].color = "#ff93c4";
            selectedObject.value = updatedHistory[chosen.index];
          }
        }
        history.value = updatedHistory;
        selectedObject.value = chosen.action;
        lastClick.value = {
          x,
          y: y2,
          index: chosen.index
        };
        if (chosen.action.mode === "text") {
          changingTextIndex.value = chosen.index;
        }
      };
      const isPointInText = (action, historyIndex, x, y2) => {
        const textWidth = ctx.value.measureText(action.textValue).width;
        textFontSize.value;
        if (action.textInputY - y2 > 0 && action.textInputY - y2 < 20 && x - action.textInputX > 0 && x - action.textInputX < textWidth) {
          return true;
        }
        return false;
      };
      const isPointInShape = (action, historyIndex, x, y2) => {
        if (action === null) {
          return false;
        }
        if (action.mode === "rect") {
          if (Math.abs(x - action.x) < 5 && y2 > action.y && y2 < action.y + action.height) {
            return true;
          } else if (Math.abs(x - action.x - action.width) < 5 && y2 > action.y && y2 < action.y + action.height) {
            return true;
          } else if (Math.abs(y2 - action.y) < 5 && x > action.x && y2 < action.x + action.width) {
            return true;
          } else if (Math.abs(y2 - action.y - action.height) < 5 && x > action.x && y2 < action.x + action.width) {
            return true;
          } else {
            return false;
          }
        } else if (action.mode === "circle") {
          const cx = (action.startX + action.currentX) / 2;
          const cy = (action.startY + action.currentY) / 2;
          const dx = x - cx;
          const dy = y2 - cy;
          const longAxis = Math.abs(action.startX - action.currentX) / 2;
          const shortAxis = Math.abs(action.startY - action.currentY) / 2;
          const isOnEllipse = dx * dx / (longAxis * longAxis) + dy * dy / (shortAxis * shortAxis);
          return isOnEllipse >= 0.95 && isOnEllipse <= 1.05;
        } else if (action.mode === "line") {
          const dis = pointToSegmentDistance(action.startX, action.startY, action.endX, action.endY, x, y2);
          if (dis < 5) {
            return true;
          }
        } else if (action.mode === "curve") {
          return action.curvePoints.some((point) => {
            const distanceX = Math.abs(point.x - x);
            const distanceY = Math.abs(point.y - y2);
            return distanceX < 10 && distanceY < 10;
          });
        } else if (action.mode === "text") {
          const textWidth = ctx.value.measureText(action.textValue).width;
          textFontSize.value;
          if (action.textInputY - y2 > 0 && action.textInputY - y2 < 20 && x - action.textInputX > 0 && x - action.textInputX < textWidth) {
            if (historyIndex === -1) {
              historyIndex = history.value.findIndex((item) => item.id === action.id);
            } else {
              changeText(historyIndex);
            }
            return true;
          }
        }
        return false;
      };
      const changeObjectPosition = (object, dx, dy) => {
        if (!object)
          return;
        switch (object.mode) {
          case "line":
            object.startX += dx;
            object.startY += dy;
            object.endX += dx;
            object.endY += dy;
            break;
          case "rect":
            object.x += dx;
            object.y += dy;
            break;
          case "circle":
            object.startX += dx;
            object.startY += dy;
            object.currentX += dx;
            object.currentY += dy;
            break;
          case "curve":
            if (Array.isArray(object.curvePoints)) {
              object.curvePoints.forEach((point) => {
                point.x += dx;
                point.y += dy;
              });
            }
            break;
          case "text":
            object.textInputX += dx;
            object.textInputY += dy;
            if (showTextInput.value) {
              clickWithInputShowing();
            }
            break;
          default:
            formatAppLog("warn", "at pages/canvas/canvas.vue:1038", "Unknown object mode:", object.mode);
        }
        selectedObject.value = object;
      };
      const saveCanvasToImage = () => {
        resetState();
        uni.canvasToTempFilePath({
          canvasId,
          success: (res) => {
            const filePath = res.tempFilePath;
            canvasImagePath.value = filePath;
            eventChannel.emit("returnData", {
              msg: "SaveImage",
              src: filePath
            });
            uni.navigateBack();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/canvas/canvas.vue:1073", "保存画布失败", err);
          }
        });
      };
      const changeTemplateParam = () => {
        showParamPopup.value = true;
        if (template.value === "rect") {
          tempParams.value = JSON.parse(JSON.stringify(rectTemplateParam.value));
        } else if (template.value === "bridge") {
          tempParams.value = JSON.parse(JSON.stringify(bridgeTemplateParam.value));
        } else if (template.value === "rect4") {
          tempParams.value = JSON.parse(JSON.stringify(rectTemplateParam4.value));
        }
      };
      const applyTemplateChange = () => {
        showParamPopup.value = false;
        if (template.value === "rect") {
          rectTemplateParam.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "bridge") {
          bridgeTemplateParam.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "rect4") {
          rectTemplateParam4.value = JSON.parse(JSON.stringify(tempParams.value));
        }
        redrawCanvas();
      };
      const cancleTemplateChange = () => {
        showParamPopup.value = false;
      };
      const save = () => {
        let action;
        if (mode.value !== "select" && status.value !== "start") {
          if (mode.value === "line") {
            action = {
              mode: "line",
              startX: offsetStartX.value,
              startY: offsetStartY.value,
              endX: offsetCurrentX.value,
              endY: offsetCurrentY.value,
              color: drawColor.value,
              id: Math.random().toString(36).substr(2, 8)
            };
          } else if (mode.value === "rect") {
            action = {
              mode: "rect",
              x: offsetStartX.value,
              y: offsetStartY.value,
              width: offsetCurrentX.value - offsetStartX.value,
              height: offsetCurrentY.value - offsetStartY.value,
              color: drawColor.value,
              id: Math.random().toString(36).substr(2, 8)
            };
          } else if (mode.value === "circle") {
            (offsetStartX.value + offsetCurrentX.value) / 2;
            (offsetStartY.value + offsetCurrentY.value) / 2;
            Math.sqrt(Math.pow(offsetCurrentX.value - offsetStartX.value, 2) + Math.pow(
              offsetCurrentY.value - offsetStartY.value,
              2
            )) / 2;
            action = {
              mode: "circle",
              startX: offsetStartX.value,
              startY: offsetStartY.value,
              currentX: offsetCurrentX.value,
              currentY: offsetCurrentY.value,
              color: drawColor.value,
              id: Math.random().toString(36).substr(2, 8)
            };
          } else if (mode.value === "curve") {
            curvePoints.value.forEach((point) => {
              point.x = point.x - offsetX.value;
              point.y = point.y - offsetY.value;
            });
            action = {
              mode: "curve",
              curvePoints: curvePoints.value,
              color: drawColor.value,
              id: Math.random().toString(36).substr(2, 8)
            };
          }
        }
        if (mode.value === "text") {
          action = {
            mode: "text",
            textValue: textValue.value,
            textInputX: textInputX.value - offsetX.value,
            textInputY: textInputY.value - 10 - offsetY.value,
            id: Math.random().toString(36).substr(2, 8)
          };
        }
        action.scale = scale.value;
        if (action) {
          history.value.push(action);
          events.value.push({
            type: "add",
            object: null,
            id: action.id
          });
        }
      };
      const drawTemplate = () => {
        if (template.value === "rect") {
          drawRulerRectTemplate(ctx.value, {
            logicalWidth: Number(rectTemplateParam.value.logicalWidth),
            logicalHeight: Number(rectTemplateParam.value.logicalHeight),
            unit: rectTemplateParam.value.unit
            // 单位参数
          });
        } else if (template.value === "bridge") {
          drawArchBridgeTemplate(ctx.value, {
            logicalLength: Number(bridgeTemplateParam.value.logicalLength),
            beamCount: Number(bridgeTemplateParam.value.beamCount),
            unit: bridgeTemplateParam.value.unit,
            bigBeamNumber: Number(bridgeTemplateParam.value.bigBeamNumber),
            smallBeamNumber: Number(bridgeTemplateParam.value.smallBeamNumber),
            bridgeFu: bridgeTemplateParam.value.bridgeFu
          });
        } else if (template.value === "rect4") {
          drawRulerRectTemplate4(ctx.value, {
            logicalWidth: rectTemplateParam4.value.logicalWidth,
            bigBeamNumber: rectTemplateParam4.value.bigBeamNumber,
            beamCount: rectTemplateParam4.value.beamCount,
            bridgeFu: rectTemplateParam4.value.bridgeFu,
            unit: rectTemplateParam4.value.unit
          });
        }
      };
      const redrawCanvas = () => {
        const now = Date.now();
        if (now - lastRedrawTime < 16)
          return;
        lastRedrawTime = now;
        ctx.value.save();
        ctx.value.clearRect(0, 0, screenWidth.value, screenHeight.value);
        ctx.value.translate(offsetX.value, offsetY.value);
        ctx.value.translate(screenWidth.value / 2, screenHeight.value / 2);
        ctx.value.scale(scale.value, scale.value);
        ctx.value.translate(-screenWidth.value / 2, -screenHeight.value / 2);
        drawTemplate();
        ctx.value.restore();
        history.value.forEach((action) => {
          ctx.value.save();
          ctx.value.translate(screenWidth.value / 2, screenHeight.value / 2);
          ctx.value.scale(scale.value / action.scale, scale.value / action.scale);
          ctx.value.translate(-screenWidth.value / 2, -screenHeight.value / 2);
          ctx.value.setStrokeStyle(action.color);
          ctx.value.setLineWidth(1 / (scale.value / action.scale));
          ctx.value.beginPath();
          if (action.mode === "line") {
            ctx.value.moveTo(action.startX, action.startY);
            ctx.value.lineTo(action.endX, action.endY);
          } else if (action.mode === "rect") {
            ctx.value.rect(action.x, action.y, action.width, action.height);
          } else if (action.mode === "circle") {
            drawSmoothEllipse(ctx.value, action.startX, action.startY, action.currentX, action.currentY);
          } else if (action.mode === "curve") {
            ctx.value.moveTo(action.curvePoints[0].x, action.curvePoints[0].y);
            action.curvePoints.forEach((point, index) => {
              if (index > 0) {
                ctx.value.lineTo(point.x, point.y);
              }
            });
          } else if (action.mode === "text") {
            ctx.value.setFontSize(20);
            ctx.value.fillText(action.textValue, action.textInputX, action.textInputY);
          }
          ctx.value.stroke();
          ctx.value.restore();
        });
        if (textSelecting.value) {
          ctx.value.setStrokeStyle("#000000");
          ctx.value.setLineWidth(0.5);
          ctx.value.strokeRect(textBox.value.x - 2, textBox.value.y - 2, textBox.value.width + 8, textBox.value.height + 8);
        }
        ctx.value.restore();
        ctx.value.draw(true);
      };
      const pointToSegmentDistance = (x1, y1, x2, y2, x, y3) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const px = x - x1;
        const py = y3 - y1;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) {
          return Math.sqrt(px * px + py * py);
        }
        const param = Math.max(0, Math.min(1, (px * dx + py * dy) / lenSq));
        const xx = x1 + param * dx;
        const yy = y1 + param * dy;
        return Math.sqrt((x - xx) * (x - xx) + (y3 - yy) * (y3 - yy));
      };
      const drawEllipse = (ctx2, x1, y1, x2, y2) => {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.abs(x2 - x1) / 2;
        const ry = Math.abs(y2 - y1) / 2;
        ctx2.moveTo(cx + rx, cy);
        ctx2.bezierCurveTo(cx + rx, cy - ry * 0.5, cx + rx * 0.5, cy - ry, cx, cy - ry);
        ctx2.bezierCurveTo(cx - rx * 0.5, cy - ry, cx - rx, cy - ry * 0.5, cx - rx, cy);
        ctx2.bezierCurveTo(cx - rx, cy + ry * 0.5, cx - rx * 0.5, cy + ry, cx, cy + ry);
        ctx2.bezierCurveTo(cx + rx * 0.5, cy + ry, cx + rx, cy + ry * 0.5, cx + rx, cy);
      };
      const drawSmoothEllipse = (ctx2, x1, y1, x2, y2) => {
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.abs(x2 - x1) / 2;
        const ry = Math.abs(y2 - y1) / 2;
        const kappa = 0.5522848;
        const ox = rx * kappa;
        const oy = ry * kappa;
        ctx2.moveTo(cx + rx, cy);
        ctx2.bezierCurveTo(cx + rx, cy - oy, cx + ox, cy - ry, cx, cy - ry);
        ctx2.bezierCurveTo(cx - ox, cy - ry, cx - rx, cy - oy, cx - rx, cy);
        ctx2.bezierCurveTo(cx - rx, cy + oy, cx - ox, cy + ry, cx, cy + ry);
        ctx2.bezierCurveTo(cx + ox, cy + ry, cx + rx, cy + oy, cx + rx, cy);
      };
      const __returned__ = { canvasId, transparentCanvasId, ctx, transparentCtx, screenWidth, screenHeight, canvasStyle, offsetX, offsetY, scale, lastDistance, isScaling, mode, startX, startY, currentX, currentY, offsetStartX, offsetStartY, offsetCurrentX, offsetCurrentY, drawing, template, history, curvePoints, status, drawColor, textValue, showTextInput, textInputX, textInputY, changingTextIndex, beforeChangeText, canvasImagePath, textFontSize, textSelecting, textBox, selectedObject, selectedObjectOriginColor, touchMoveMode, events, markSavedEvent, inputAndChanged, clickCandidates, clickCycleIndex, showParamPopup, rectTemplateParam, bridgeTemplateParam, rectTemplateParam4, tempParams, fieldList, lastClick, get lastRedrawTime() {
        return lastRedrawTime;
      }, set lastRedrawTime(v2) {
        lastRedrawTime = v2;
      }, eventChannel, changeColor, chooseTemplate, inputting, cancelText, confirmText, resetState, setMode, clearCanvas, zoomIn, zoomOut, undo, backToOldPosition, deleteSelected, getDistance, updateInputSize, touchStart, touchMove, touchEnd, clickWithInputShowing, changeText, clickOnText, clickOnObject, isPointInText, isPointInShape, changeObjectPosition, saveCanvasToImage, changeTemplateParam, applyTemplateChange, cancleTemplateChange, save, drawTemplate, redrawCanvas, pointToSegmentDistance, drawEllipse, drawSmoothEllipse, ref: vue.ref, onMounted: vue.onMounted, reactive: vue.reactive, h: vue.h, nextTick: vue.nextTick, getCurrentInstance: vue.getCurrentInstance, get drawRulerRectTemplate() {
        return drawRulerRectTemplate;
      }, get drawArchBridgeTemplate() {
        return drawArchBridgeTemplate;
      }, get drawRulerRectTemplate4() {
        return drawRulerRectTemplate4;
      }, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "toolbar" }, [
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.setMode("select")),
            class: vue.normalizeClass(["iconButton", { active: $setup.mode === "select" }])
          },
          [
            vue.createElementVNode("image", {
              src: _imports_0$1,
              class: "icon"
            })
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.setMode("line")),
            class: vue.normalizeClass(["iconButton", { active: $setup.mode === "line" }])
          },
          [
            vue.createElementVNode("image", {
              src: _imports_1,
              class: "icon"
            })
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[2] || (_cache[2] = ($event) => $setup.setMode("curve")),
            class: vue.normalizeClass(["iconButton", { active: $setup.mode === "curve" }])
          },
          [
            vue.createElementVNode("image", {
              src: _imports_2,
              class: "icon"
            })
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[3] || (_cache[3] = ($event) => $setup.setMode("rect")),
            class: vue.normalizeClass(["iconButton", { active: $setup.mode === "rect" }])
          },
          [
            vue.createElementVNode("image", {
              src: _imports_3,
              class: "icon"
            })
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[4] || (_cache[4] = ($event) => $setup.setMode("circle")),
            class: vue.normalizeClass(["iconButton", { active: $setup.mode === "circle" }])
          },
          [
            vue.createElementVNode("image", {
              src: _imports_4,
              class: "icon"
            })
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[5] || (_cache[5] = ($event) => $setup.setMode("text")),
            class: vue.normalizeClass(["iconButton", { active: $setup.mode === "text" }])
          },
          [
            vue.createElementVNode("image", {
              src: _imports_5,
              class: "icon"
            })
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode("button", {
          onClick: $setup.undo,
          class: "iconButton"
        }, [
          vue.createElementVNode("image", {
            src: _imports_6,
            class: "icon"
          })
        ]),
        vue.createElementVNode("button", {
          onClick: $setup.saveCanvasToImage,
          class: "iconButton"
        }, [
          vue.createElementVNode("image", {
            src: _imports_7,
            class: "icon"
          })
        ]),
        vue.createElementVNode("button", {
          onClick: $setup.changeTemplateParam,
          class: "iconButton"
        }, [
          vue.createCommentVNode(` <image src='/static/image/save.svg' class="icon"></image> `),
          vue.createTextVNode(" 修改 ")
        ])
      ]),
      vue.createCommentVNode(" 参数设置弹窗 "),
      $setup.showParamPopup ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "popup"
      }, [
        vue.createElementVNode("view", { class: "popup-content" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.fieldList, (field) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: field.key
              }, [
                field.key in $setup.tempParams ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(field.label),
                    1
                    /* TEXT */
                  ),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": ($event) => $setup.tempParams[field.key] = $event,
                    type: field.type
                  }, null, 8, ["onUpdate:modelValue", "type"]), [
                    [vue.vModelDynamic, $setup.tempParams[field.key]]
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createCommentVNode(' <view v-if="tempParams.logicalWidth">\r\n					<text>逻辑宽度（单位数）</text>\r\n					<input v-model="tempParams.logicalWidth" type="number" />\r\n				</view>\r\n				<view v-if="tempParams.logicalHeight">\r\n					<text>逻辑高度（单位数）</text>\r\n					<input v-model="tempParams.logicalHeight" type="number" />\r\n				</view>\r\n				<view v-if="tempParams.logicalLengthl">\r\n					<text>逻辑长度 </text>\r\n					<input v-model="tempParams.logicalLength" type="number" />\r\n				</view>\r\n				<view v-if="tempParams.beamCount">\r\n					<text>梁数 </text>\r\n					<input v-model="tempParams.beamCount" type="number" />\r\n				</view>\r\n				<view v-if="tempParams.bigBeamNumber">\r\n					<text>大桩号墩 </text>\r\n					<input v-model="tempParams.bigBeamNumber" type="number" />\r\n				</view>\r\n				<view v-if="tempParams.smallBeamNumber">\r\n					<text>小桩号墩 </text>\r\n					<input v-model="tempParams.smallBeamNumber" type="number" />\r\n				</view>\r\n				<view v-if="tempParams.unit">\r\n					<text>单位（如 cm / m）</text>\r\n					<input v-model="tempParams.unit" type="text" />\r\n				</view>\r\n				<view v-if="tempParams.bridge">\r\n					<text>桥幅（L / R）</text>\r\n					<input v-model="tempParams.bridge" type="text" />\r\n				</view> '),
          vue.createElementVNode("view", { class: "popup-actions" }, [
            vue.createElementVNode("button", {
              onClick: $setup.applyTemplateChange,
              type: "primary"
            }, "确认"),
            vue.createElementVNode("button", { onClick: $setup.cancleTemplateChange }, "取消")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "functionBar" }, [
        vue.createElementVNode("button", {
          onClick: $setup.deleteSelected,
          class: "functionButton"
        }, "删除"),
        vue.createElementVNode("button", {
          onClick: $setup.clearCanvas,
          class: "functionButton"
        }, "清空"),
        vue.createElementVNode("button", {
          onClick: $setup.zoomIn,
          class: "functionButton"
        }, "放大"),
        vue.createElementVNode("button", {
          onClick: $setup.zoomOut,
          class: "functionButton"
        }, "缩小"),
        vue.createCommentVNode(` <button @click="chooseTemplate('rect')" class="functionButton">模板1</button>\r
			<button @click="chooseTemplate('bridge')" class="functionButton">模板2</button>\r
			<button @click="chooseTemplate('rect4')" class="functionButton">模板3</button> `)
      ]),
      $setup.showTextInput ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          class: "text-input",
          style: vue.normalizeStyle({ top: $setup.textInputY + "px", left: $setup.textInputX + "px" })
        },
        [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.textValue = $event),
              placeholder: "输入文字...",
              class: "input",
              onInput: $setup.inputting
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $setup.textValue]
          ]),
          vue.createElementVNode("view", { class: "textButtons" }, [
            vue.createElementVNode("button", { onClick: $setup.cancelText }, "取消"),
            vue.createElementVNode("button", { onClick: $setup.confirmText }, "确定")
          ])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode("  模拟输入框 "),
      vue.createCommentVNode(' <input v-if="showTextInput" v-model="textValue" :style="inputStyle" @input="updateInputSize" @blur="blur"\r\n			@confirm="confirmText" class="text-input" focus /> '),
      vue.createElementVNode("view", { class: "toolbar" }, [
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[7] || (_cache[7] = ($event) => $setup.changeColor("#ff0000")),
            class: "colorButton",
            style: { "background-color": "#ff0000" }
          },
          vue.toDisplayString($setup.drawColor == "#ff0000" ? "√" : ""),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[8] || (_cache[8] = ($event) => $setup.changeColor("#00ff00")),
            class: "colorButton",
            style: { "background-color": "#00ff00" }
          },
          vue.toDisplayString($setup.drawColor == "#00ff00" ? "√" : ""),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[9] || (_cache[9] = ($event) => $setup.changeColor("#0055ff")),
            class: "colorButton",
            style: { "background-color": "#0055ff" }
          },
          vue.toDisplayString($setup.drawColor == "#0055ff" ? "√" : ""),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[10] || (_cache[10] = ($event) => $setup.changeColor("#ffff00")),
            class: "colorButton",
            style: { "background-color": "#ffff00" }
          },
          vue.toDisplayString($setup.drawColor == "#ffff00" ? "√" : ""),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "button",
          {
            onClick: _cache[11] || (_cache[11] = ($event) => $setup.changeColor("#000000")),
            class: "colorButton",
            style: { "background-color": "#000000" }
          },
          vue.toDisplayString($setup.drawColor == "#000000" ? "√" : ""),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode(
        "canvas",
        {
          style: vue.normalizeStyle($setup.canvasStyle),
          "canvas-id": "myCanvas",
          id: "myCanvas",
          class: "canvas",
          "disable-scroll": "true"
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "canvas",
        {
          style: vue.normalizeStyle($setup.canvasStyle),
          "canvas-id": "transparentCanvas",
          id: "transparentCanvas",
          class: "canvas",
          "disable-scroll": "true",
          onTouchstart: $setup.touchStart,
          onTouchmove: $setup.touchMove,
          onTouchend: $setup.touchEnd
        },
        null,
        36
        /* STYLE, NEED_HYDRATION */
      ),
      vue.createCommentVNode(' <image :src="canvasImagePath" mode="widthFix" class="imgShow"></image> ')
    ]);
  }
  const PagesCanvasCanvas = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-3fb2435b"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/canvas/canvas.vue"]]);
  const _sfc_main$2 = {};
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "" });
  }
  const PagesInitDataTestInitDataTest = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/init_data_test/init_data_test.vue"]]);
  const _imports_0 = "/static/image/user1.png";
  const _sfc_main$1 = {};
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "System" }, [
      vue.createElementVNode("view", { class: "main" }, [
        vue.createElementVNode("view", { class: "titleBar" }, [
          vue.createElementVNode("image", {
            src: _imports_0,
            class: "avatar"
          }),
          vue.createElementVNode("view", { class: "textContainer" }, [
            vue.createElementVNode("view", { class: "code" }, "zs@znjc"),
            vue.createElementVNode("view", { class: "name" }, "张三")
          ]),
          vue.createElementVNode("view", { class: "button" }, [
            vue.createElementVNode("button", {
              size: "default",
              type: "default",
              style: { "color": "#ffffff", "backgroundColor": "#1677ff", "borderColor": "#1AAD19", "height": "38px", "line-height": "38px" },
              "hover-class": "is-hover",
              onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args))
            }, "修改密码"),
            vue.createElementVNode("button", {
              size: "default",
              type: "default",
              style: { "color": "#ffffff", "backgroundColor": "#1677ff", "borderColor": "#1AAD19", "height": "38px", "line-height": "38px" },
              "hover-class": "is-hover",
              onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args))
            }, "退出登录")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "model" }, [
        vue.createElementVNode("view", { class: "modelTitle" }, "运行模式"),
        vue.createElementVNode("view", { class: "switchContainer" }, [
          vue.createElementVNode("view", { class: "title" }, "离线"),
          vue.createElementVNode("view", null, [
            vue.createElementVNode("switch", { name: "switch" })
          ]),
          vue.createElementVNode("view", { class: "title" }, "在线")
        ])
      ]),
      vue.createElementVNode("view", { class: "divider" }),
      vue.createElementVNode("view", { class: "versionData" }, [
        vue.createElementVNode("view", { class: "versionTitle" }, "当前数据包版本"),
        vue.createElementVNode("view", { class: "versionNumber" }, "v25-05-20-zs@znjc")
      ]),
      vue.createElementVNode("view", { class: "divider" }),
      vue.createElementVNode("view", { class: "inData" }, [
        vue.createElementVNode("view", { class: "inDataTitle" }, "本地数据导入"),
        vue.createElementVNode("button", {
          size: "default",
          type: "default",
          style: { "color": "#ffffff", "backgroundColor": "#1677ff", "borderColor": "#1AAD19", "height": "38px", "line-height": "38px" },
          "hover-class": "is-hover",
          onClick: _cache[2] || (_cache[2] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args))
        }, "数据导入")
      ]),
      vue.createElementVNode("view", { class: "divider" }),
      vue.createElementVNode("view", { class: "outData" }, [
        vue.createElementVNode("view", { class: "outDataTitle" }, "本地数据导出"),
        vue.createElementVNode("button", {
          size: "default",
          type: "default",
          style: { "color": "#ffffff", "backgroundColor": "#1677ff", "borderColor": "#1AAD19", "height": "38px", "line-height": "38px", "margin-right": "0" },
          "hover-class": "is-hover",
          onClick: _cache[3] || (_cache[3] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args))
        }, "数据导出")
      ]),
      vue.createElementVNode("view", { class: "divider" }),
      vue.createElementVNode("view", { class: "versionApp" }, [
        vue.createElementVNode("view", { class: "appTitle" }, "当前应用版本"),
        vue.createElementVNode("view", null, "v25-050-20"),
        vue.createElementVNode("button", {
          size: "default",
          type: "default",
          style: { "color": "#ffffff", "backgroundColor": "#1677ff", "borderColor": "#1AAD19", "height": "38px", "line-height": "38px", "margin-right": "0" },
          "hover-class": "is-hover",
          onClick: _cache[4] || (_cache[4] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args))
        }, "版本更新")
      ])
    ]);
  }
  const PagesSystemSettingSystemSetting = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-524e171a"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/SystemSetting/SystemSetting.vue"]]);
  __definePage("pages/LoginPage/LoginPage", PagesLoginPageLoginPage);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/home/home", PagesHomeHome);
  __definePage("pages/message/message", PagesMessageMessage);
  __definePage("pages/userinfo/userinfo", PagesUserinfoUserinfo);
  __definePage("pages/setting/setting", PagesSettingSetting);
  __definePage("pages/versionInfo/versionInfo", PagesVersionInfoVersionInfo);
  __definePage("pages/testWrite/testWrite", PagesTestWriteTestWrite);
  __definePage("pages/bridge/bridge", PagesBridgeBridge);
  __definePage("pages/List/List", PagesListList);
  __definePage("pages/bridge-disease/bridge-disease", PagesBridgeDiseaseBridgeDisease);
  __definePage("pages/add-disease/add-disease", PagesAddDiseaseAddDisease);
  __definePage("pages/canvas/canvas", PagesCanvasCanvas);
  __definePage("pages/init_data_test/init_data_test", PagesInitDataTestInitDataTest);
  __definePage("pages/SystemSetting/SystemSetting", PagesSystemSettingSystemSetting);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
