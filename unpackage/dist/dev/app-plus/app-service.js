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
  const ON_LOAD = "onLoad";
  const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const onNavigationBarButtonTap = /* @__PURE__ */ createHook(ON_NAVIGATION_BAR_BUTTON_TAP);
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$d = {
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
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-e4e4508d"], ["__file", "E:/BI/BuildingInspectorFrontend/pages/login/login.vue"]]);
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
  const _sfc_main$c = {
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
        for (let i in styles) {
          let line = this.toLine(i);
          transform += line + ":" + styles[i] + ";";
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
        for (let i in obj) {
          try {
            if (typeof obj[i] === "object") {
              this.animation[i](...obj[i]);
            } else {
              this.animation[i](obj[i]);
            }
          } catch (e) {
            formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `方法 ${i} 不存在`);
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
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "E:/BI/BuildingInspectorFrontend/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$b = {
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
      clear(e) {
        e.stopPropagation();
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
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0$1);
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
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-4dd3c44b"], ["__file", "E:/BI/BuildingInspectorFrontend/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const message = "/static/image/message.svg";
  const setting = "/static/image/setting.svg";
  const _imports_0$2 = "/static/image/zjl.png";
  const _sfc_main$a = {
    __name: "home",
    setup(__props, { expose: __expose }) {
      __expose();
      const popup2 = vue.ref(null);
      const isOnline = vue.ref(false);
      const buildingInspector = vue.ref([{
        name: "桥梁病害采集",
        iconSrc: "../../static/image/bridge.svg"
      }, {
        name: "隧道病害采集",
        iconSrc: "../../static/image/tunnel.svg"
      }]);
      const toUserInfo = () => {
        uni.navigateTo({
          url: "/pages/userinfo/userinfo"
        });
      };
      const toMessage = () => {
        uni.navigateTo({
          url: "/pages/message/message"
        });
      };
      const toSetting = () => {
        uni.navigateTo({
          url: "/pages/setting/setting"
        });
      };
      onLoad(() => {
        isOnline.value = uni.getStorageSync("isOnline");
      });
      const showSidebar = () => {
        popup2.value.open();
      };
      const hideSidebar = () => {
        popup2.value.close();
      };
      onNavigationBarButtonTap(function(e) {
        if (e.index === 0) {
          showSidebar();
        }
      });
      const clickCard = (name) => {
        formatAppLog("log", "at pages/home/home.vue:95", "点击的卡片的名称为:" + name);
        if (name === "桥梁病害采集") {
          uni.navigateTo({
            url: "/pages/bridge-diseases/bridge-diseases"
          });
        } else if (name === "隧道病害采集") {
          formatAppLog("log", "at pages/home/home.vue:102", "隧道病害采集功能待开发");
        }
      };
      const __returned__ = { popup: popup2, isOnline, buildingInspector, toUserInfo, toMessage, toSetting, showSidebar, hideSidebar, clickCard, onMounted: vue.onMounted, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get message() {
        return message;
      }, get setting() {
        return setting;
      }, get onNavigationBarButtonTap() {
        return onNavigationBarButtonTap;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "home" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.buildingInspector, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "home-box",
                key: index,
                onClick: ($event) => $setup.clickCard(item.name)
              }, [
                vue.createElementVNode("image", {
                  src: item.iconSrc,
                  class: "home-box-image"
                }, null, 8, ["src"]),
                vue.createElementVNode(
                  "view",
                  { class: "home-box-text" },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 侧边栏 "),
        vue.createVNode(
          _component_uni_popup,
          {
            ref: "popup",
            type: "left",
            onMaskClick: $setup.hideSidebar
          },
          {
            default: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "sidebar" }, [
                vue.createElementVNode("view", {
                  class: "sidebar-userinfo",
                  onClick: $setup.toUserInfo
                }, [
                  vue.createElementVNode("image", {
                    class: "sidebar-userinfo-photo",
                    src: _imports_0$2
                  }),
                  vue.createElementVNode("view", { class: "sidebar-userinfo-info" }, [
                    vue.createElementVNode("view", { class: "sidebar-userinfo-info-nameAndStatus" }, [
                      vue.createElementVNode("view", { class: "sidebar-userinfo-info-nameAndStatus-name" }, "西工院检测05"),
                      vue.createElementVNode(
                        "view",
                        { class: "sidebar-userinfo-info-nameAndStatus-status" },
                        vue.toDisplayString($setup.isOnline ? "在线" : "离线"),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "sidebar-userinfo-info-number" }, "编号:xigy05")
                  ])
                ]),
                vue.createElementVNode("view", {
                  class: "sidebar-message",
                  onClick: $setup.toMessage
                }, [
                  vue.createElementVNode("image", {
                    class: "sidebar-message-icon",
                    src: $setup.message
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "sidebar-message-text" }, "消息管理")
                ]),
                vue.createElementVNode("view", {
                  class: "sidebar-setting",
                  onClick: $setup.toSetting
                }, [
                  vue.createElementVNode("image", {
                    class: "sidebar-setting-icon",
                    src: $setup.setting
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "sidebar-setting-text" }, "设置")
                ])
              ])
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
  const PagesHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "E:/BI/BuildingInspectorFrontend/pages/home/home.vue"]]);
  const noMessage = "/static/image/noMessage.svg";
  const _sfc_main$9 = {
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
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesMessageMessage = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "E:/BI/BuildingInspectorFrontend/pages/message/message.vue"]]);
  const _sfc_main$8 = {
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
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
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
  const infoItem = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-e152a2e4"], ["__file", "E:/BI/BuildingInspectorFrontend/components/infoItem.vue"]]);
  const _sfc_main$7 = {
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
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesUserinfoUserinfo = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "E:/BI/BuildingInspectorFrontend/pages/userinfo/userinfo.vue"]]);
  const _imports_0$1 = "/static/image/exclamation.svg";
  const _imports_1 = "/static/image/rightArrow.svg";
  const _sfc_main$6 = {
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
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "setting" }, [
      vue.createElementVNode("view", {
        class: "setting-versionInfo",
        onClick: $setup.toVersionInfo
      }, [
        vue.createElementVNode("view", { class: "setting-versionInfo-left" }, [
          vue.createElementVNode("image", {
            class: "setting-versionInfo-left-icon",
            src: _imports_0$1
          }),
          vue.createElementVNode("view", { class: "setting-versionInfo-left-text" }, "版本信息")
        ]),
        vue.createElementVNode("image", {
          class: "setting-versionInfo-rightArrow",
          src: _imports_1
        })
      ]),
      vue.createElementVNode("view", {
        class: "setting-logout",
        onClick: $setup.logout
      }, " 注销登录 ")
    ]);
  }
  const PagesSettingSetting = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "E:/BI/BuildingInspectorFrontend/pages/setting/setting.vue"]]);
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
    interpolate(message2, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message2];
      }
      let tokens = this._caches[message2];
      if (!tokens) {
        tokens = parse(message2, delimiters);
        this._caches[message2] = tokens;
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
    add(locale, message2, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message2);
        } else {
          Object.keys(message2).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message2[key];
            }
          });
        }
      } else {
        this.messages[locale] = message2;
      }
    }
    f(message2, values, delimiters) {
      return this.formater.interpolate(message2, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message2 = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message2 = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message2, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message2[key], values).join("");
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
      f(message2, values, delimiters) {
        return i18n.f(message2, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message2, override = true) {
        return i18n.add(locale2, message2, override);
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
  const en = {
    "uni-popup.cancel": "cancel",
    "uni-popup.ok": "ok",
    "uni-popup.placeholder": "pleace enter",
    "uni-popup.title": "Hint",
    "uni-popup.shareTitle": "Share to"
  };
  const zhHans = {
    "uni-popup.cancel": "取消",
    "uni-popup.ok": "确定",
    "uni-popup.placeholder": "请输入",
    "uni-popup.title": "提示",
    "uni-popup.shareTitle": "分享到"
  };
  const zhHant = {
    "uni-popup.cancel": "取消",
    "uni-popup.ok": "確定",
    "uni-popup.placeholder": "請輸入",
    "uni-popup.title": "提示",
    "uni-popup.shareTitle": "分享到"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$5 = {
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
        return this.confirmText || t("uni-popup.ok");
      },
      closeText() {
        return this.cancelText || t("uni-popup.cancel");
      },
      placeholderText() {
        return this.placeholder || t("uni-popup.placeholder");
      },
      titleText() {
        return this.title || t("uni-popup.title");
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
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-d78c88b7"], ["__file", "E:/BI/BuildingInspectorFrontend/uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.vue"]]);
  const _imports_0 = "/static/image/bridge.svg";
  const _sfc_main$4 = {
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
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup_dialog = resolveEasycom(vue.resolveDynamicComponent("uni-popup-dialog"), __easycom_0);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "versionInfo" }, [
          vue.createElementVNode("view", { class: "versionInfo-version" }, [
            vue.createElementVNode("image", {
              class: "versionInfo-version-icon",
              src: _imports_0
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
  const PagesVersionInfoVersionInfo = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "E:/BI/BuildingInspectorFrontend/pages/versionInfo/versionInfo.vue"]]);
  const _sfc_main$3 = {
    name: "disease-item",
    props: {
      disease: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        startX: 0,
        moveX: 0,
        translateX: 0,
        isSwiping: false,
        actionWidth: 160,
        // 操作按钮总宽度
        buttonsTranslateX: 100
        // 按钮位置的初始状态是100%（完全隐藏）
      };
    },
    computed: {
      formattedTime() {
        const now = /* @__PURE__ */ new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `(${month}-${day} ${hours}:${minutes}:${seconds})`;
      },
      formattedDescription() {
        const {
          length,
          delta,
          remark
        } = this.disease;
        const parts = [];
        if (length)
          parts.push(`长度:${length}m`);
        if (delta)
          parts.push(`Δ=${delta}mm`);
        if (remark)
          parts.push(`(${remark})`);
        return parts.join("/");
      },
      buttonsStyle() {
        return {
          transform: `translateX(${this.buttonsTranslateX}%)`
        };
      }
    },
    methods: {
      // 触摸开始事件
      touchStart(e) {
        e.stopPropagation();
        this.startX = e.touches[0].clientX;
        this.isSwiping = true;
      },
      // 触摸移动事件
      touchMove(e) {
        e.stopPropagation();
        if (!this.isSwiping)
          return;
        this.moveX = e.touches[0].clientX;
        let offsetX = this.moveX - this.startX;
        if (offsetX < 0) {
          if (Math.abs(offsetX) > this.actionWidth) {
            offsetX = -this.actionWidth;
          }
          this.translateX = offsetX;
          this.buttonsTranslateX = 100 + offsetX / this.actionWidth * 100;
        } else {
          if (this.translateX < 0) {
            offsetX = Math.min(offsetX, Math.abs(this.translateX));
            this.translateX = this.translateX + offsetX;
            this.buttonsTranslateX = 100 + this.translateX / this.actionWidth * 100;
          }
        }
      },
      // 触摸结束事件
      touchEnd(e) {
        e.stopPropagation();
        this.isSwiping = false;
        if (Math.abs(this.translateX) > this.actionWidth / 2) {
          this.translateX = -this.actionWidth;
          this.buttonsTranslateX = 0;
        } else {
          this.translateX = 0;
          this.buttonsTranslateX = 100;
        }
      },
      // 编辑操作
      handleEdit(e) {
        e.stopPropagation();
        this.$emit("edit", this.disease);
        this.translateX = 0;
        this.buttonsTranslateX = 100;
      },
      // 删除操作
      handleDelete(e) {
        e.stopPropagation();
        this.$emit("delete", this.disease);
        this.translateX = 0;
        this.buttonsTranslateX = 100;
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "swipe-container",
        onTouchstart: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.touchStart && $options.touchStart(...args), ["stop"])),
        onTouchmove: _cache[3] || (_cache[3] = vue.withModifiers((...args) => $options.touchMove && $options.touchMove(...args), ["stop"])),
        onTouchend: _cache[4] || (_cache[4] = vue.withModifiers((...args) => $options.touchEnd && $options.touchEnd(...args), ["stop"]))
      },
      [
        vue.createCommentVNode(" 主内容区域 "),
        vue.createElementVNode(
          "view",
          {
            class: "disease-item",
            style: vue.normalizeStyle({ transform: `translateX(${$data.translateX}px)` })
          },
          [
            vue.createElementVNode("view", { class: "disease-content" }, [
              vue.createCommentVNode(" 左侧图片 "),
              vue.createElementVNode("view", { class: "disease-left" }, [
                vue.createElementVNode("image", {
                  src: $props.disease.imageUrl || $props.disease.imageSrc || "/static/image/zjl.png",
                  mode: "aspectFill",
                  class: "disease-image"
                }, null, 8, ["src"])
              ]),
              vue.createCommentVNode(" 左侧内容区 "),
              vue.createElementVNode("view", { class: "disease-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "disease-time" },
                  "本次采集(时间:" + vue.toDisplayString($props.disease.time) + ")",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "disease-components" },
                  " 构件:" + vue.toDisplayString($props.disease.component) + vue.toDisplayString($props.disease.spanNumber) + "-" + vue.toDisplayString($props.disease.beamNumber) + "(" + vue.toDisplayString($props.disease.position) + ") ",
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "disease-type" },
                  "病害:" + vue.toDisplayString($props.disease.subclass),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "disease-description" },
                  "描述:" + vue.toDisplayString($options.formattedDescription),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createCommentVNode(" 右侧属性区（使用绝对定位） "),
            vue.createElementVNode("view", { class: "disease-attributes" }, [
              vue.createElementVNode(
                "view",
                { class: "disease-rating" },
                "标度:" + vue.toDisplayString($props.disease.rating) + "类",
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "disease-range" },
                " 范围:(" + vue.toDisplayString($props.disease.rangeX1) + "," + vue.toDisplayString($props.disease.rangeY1) + ")~(" + vue.toDisplayString($props.disease.rangeX2) + "," + vue.toDisplayString($props.disease.rangeY2) + ")",
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                { class: "disease-quantity" },
                "数量:" + vue.toDisplayString($props.disease.quantity),
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" 最右侧箭头图标 "),
            vue.createElementVNode("view", { class: "disease-actions" }, [
              vue.createElementVNode("text", { class: "action-icon" }, "《")
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 滑动显示的操作按钮 "),
        vue.createElementVNode(
          "view",
          {
            class: "swipe-actions",
            style: vue.normalizeStyle($options.buttonsStyle)
          },
          [
            vue.createElementVNode("view", {
              class: "action-btn edit-btn",
              onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.handleEdit && $options.handleEdit(...args), ["stop"]))
            }, "编辑"),
            vue.createElementVNode("view", {
              class: "action-btn delete-btn",
              onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.handleDelete && $options.handleDelete(...args), ["stop"]))
            }, "删除")
          ],
          4
          /* STYLE */
        )
      ],
      32
      /* NEED_HYDRATION */
    );
  }
  const DiseaseItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-e8b45b33"], ["__file", "E:/BI/BuildingInspectorFrontend/components/disease-item/disease-item.vue"]]);
  const _sfc_main$2 = {
    name: "add-disease",
    data() {
      return {
        visible: false,
        // 构件选项
        componentOptions: ["小箱梁", "大箱梁", "桥墩", "桥台", "支座", "横梁"],
        componentIndex: 0,
        // 跨号选项
        spanOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        spanIndex: 0,
        // 梁号选项
        beamOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        beamIndex: 0,
        // 位置选项
        positionOptions: ["左腹板", "右腹板", "底板", "顶板", "内侧", "外侧"],
        positionIndex: 0,
        // 病害类型选项
        subclassOptions: ["斜向裂缝", "竖向裂缝", "水平裂缝", "网状裂缝", "剥落", "麻面", "锈蚀"],
        subclassIndex: 0,
        // 标度选项
        ratingOptions: ["1", "2", "3", "4", "5"],
        ratingIndex: 2,
        // 表单数据
        formData: {
          component: "小箱梁",
          spanNumber: "1",
          beamNumber: "1",
          position: "左腹板",
          subclass: "斜向裂缝",
          rating: "3",
          quantity: "1",
          length: "",
          delta: "",
          remark: "",
          rangeX1: "",
          rangeY1: "",
          rangeX2: "",
          rangeY2: "",
          imageUrl: "",
          imageInfo: null
        },
        // 编辑模式标记
        isEditMode: false,
        // 原病害ID
        originalId: null
      };
    },
    methods: {
      // 选择器改变事件
      bindComponentChange(e) {
        this.componentIndex = e.detail.value;
        this.formData.component = this.componentOptions[this.componentIndex];
      },
      bindSpanChange(e) {
        this.spanIndex = e.detail.value;
        this.formData.spanNumber = this.spanOptions[this.spanIndex];
      },
      bindBeamChange(e) {
        this.beamIndex = e.detail.value;
        this.formData.beamNumber = this.beamOptions[this.beamIndex];
      },
      bindPositionChange(e) {
        this.positionIndex = e.detail.value;
        this.formData.position = this.positionOptions[this.positionIndex];
      },
      bindSubclassChange(e) {
        this.subclassIndex = e.detail.value;
        this.formData.subclass = this.subclassOptions[this.subclassIndex];
      },
      bindRatingChange(e) {
        this.ratingIndex = e.detail.value;
        this.formData.rating = this.ratingOptions[this.ratingIndex];
      },
      // 选择图片
      chooseImage() {
        uni.chooseImage({
          count: 1,
          // 只能选择1张图片
          sizeType: ["compressed"],
          // 压缩图片
          sourceType: ["album", "camera"],
          // 相册或相机
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            uni.getImageInfo({
              src: tempFilePath,
              success: (imageInfo) => {
                this.formData.imageUrl = tempFilePath;
                this.formData.imageInfo = {
                  path: tempFilePath,
                  width: imageInfo.width,
                  height: imageInfo.height,
                  size: res.tempFiles[0].size,
                  type: res.tempFiles[0].type || "image/jpeg"
                };
              }
            });
          }
        });
      },
      // 删除图片
      deleteImage() {
        this.formData.imageUrl = "";
        this.formData.imageInfo = null;
      },
      // 打开弹窗 - 可接收现有病害数据进行编辑
      openModal(existingDisease = null) {
        if (existingDisease) {
          this.isEditMode = true;
          this.originalId = existingDisease.id;
          this.formData = {
            component: existingDisease.component || "小箱梁",
            spanNumber: existingDisease.spanNumber || "1",
            beamNumber: existingDisease.beamNumber || "1",
            position: existingDisease.position || "左腹板",
            subclass: existingDisease.subclass || "斜向裂缝",
            rating: existingDisease.rating || "3",
            quantity: existingDisease.quantity || "1",
            length: existingDisease.length || "",
            delta: existingDisease.delta || "",
            remark: existingDisease.remark || "",
            rangeX1: existingDisease.rangeX1 || "",
            rangeY1: existingDisease.rangeY1 || "",
            rangeX2: existingDisease.rangeX2 || "",
            rangeY2: existingDisease.rangeY2 || "",
            imageUrl: existingDisease.imageUrl || "",
            imageInfo: existingDisease.imageInfo || null
          };
          this.componentIndex = this.componentOptions.indexOf(this.formData.component);
          if (this.componentIndex === -1)
            this.componentIndex = 0;
          this.spanIndex = this.spanOptions.indexOf(this.formData.spanNumber);
          if (this.spanIndex === -1)
            this.spanIndex = 0;
          this.beamIndex = this.beamOptions.indexOf(this.formData.beamNumber);
          if (this.beamIndex === -1)
            this.beamIndex = 0;
          this.positionIndex = this.positionOptions.indexOf(this.formData.position);
          if (this.positionIndex === -1)
            this.positionIndex = 0;
          this.subclassIndex = this.subclassOptions.indexOf(this.formData.subclass);
          if (this.subclassIndex === -1)
            this.subclassIndex = 0;
          this.ratingIndex = this.ratingOptions.indexOf(this.formData.rating);
          if (this.ratingIndex === -1)
            this.ratingIndex = 2;
        } else {
          this.isEditMode = false;
          this.originalId = null;
          this.formData = {
            component: this.componentOptions[this.componentIndex],
            spanNumber: this.spanOptions[this.spanIndex],
            beamNumber: this.beamOptions[this.beamIndex],
            position: this.positionOptions[this.positionIndex],
            subclass: this.subclassOptions[this.subclassIndex],
            rating: this.ratingOptions[this.ratingIndex],
            quantity: "1",
            length: "",
            delta: "",
            remark: "",
            rangeX1: "",
            rangeY1: "",
            rangeX2: "",
            rangeY2: "",
            imageUrl: "",
            imageInfo: null
          };
        }
        this.visible = true;
      },
      // 关闭弹窗
      closeModal() {
        this.visible = false;
      },
      // 粘贴病害信息
      pasteDiseaseInfo() {
        uni.showToast({
          title: "粘贴病害功能待实现",
          icon: "none"
        });
      },
      // 确认添加或编辑
      confirmAdd() {
        const now = /* @__PURE__ */ new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const currentTime = `${month}-${day} ${hours}:${minutes}:${seconds}`;
        const submitData = {
          ...this.formData,
          time: currentTime
        };
        if (this.isEditMode && this.originalId !== null) {
          submitData.id = this.originalId;
        }
        this.$emit("add-disease", submitData);
        this.closeModal();
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.visible ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "popup-container"
    }, [
      vue.createElementVNode("view", {
        class: "popup-mask",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.closeModal && $options.closeModal(...args))
      }),
      vue.createElementVNode("view", { class: "popup-content" }, [
        vue.createElementVNode("view", { class: "popup-header" }, [
          vue.createElementVNode(
            "text",
            { class: "popup-title" },
            vue.toDisplayString($data.isEditMode ? "编辑病害" : "3-新增病害"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", {
            class: "popup-close",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.closeModal && $options.closeModal(...args))
          }, "×")
        ]),
        vue.createElementVNode("view", { class: "popup-body" }, [
          vue.createCommentVNode(" 构件和位置 "),
          vue.createElementVNode("view", { class: "form-row" }, [
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "构件:"),
              vue.createElementVNode("picker", {
                onChange: _cache[2] || (_cache[2] = (...args) => $options.bindComponentChange && $options.bindComponentChange(...args)),
                value: $data.componentIndex,
                range: $data.componentOptions
              }, [
                vue.createElementVNode("view", { class: "form-picker" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString($data.componentOptions[$data.componentIndex]),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value", "range"])
            ]),
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "位置:"),
              vue.createElementVNode("picker", {
                onChange: _cache[3] || (_cache[3] = (...args) => $options.bindPositionChange && $options.bindPositionChange(...args)),
                value: $data.positionIndex,
                range: $data.positionOptions
              }, [
                vue.createElementVNode("view", { class: "form-picker" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString($data.positionOptions[$data.positionIndex]),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createCommentVNode(" 跨号和梁号 "),
          vue.createElementVNode("view", { class: "form-row" }, [
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "跨号:"),
              vue.createElementVNode("picker", {
                onChange: _cache[4] || (_cache[4] = (...args) => $options.bindSpanChange && $options.bindSpanChange(...args)),
                value: $data.spanIndex,
                range: $data.spanOptions
              }, [
                vue.createElementVNode("view", { class: "form-picker" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString($data.spanOptions[$data.spanIndex]),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value", "range"])
            ]),
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "梁号:"),
              vue.createElementVNode("picker", {
                onChange: _cache[5] || (_cache[5] = (...args) => $options.bindBeamChange && $options.bindBeamChange(...args)),
                value: $data.beamIndex,
                range: $data.beamOptions
              }, [
                vue.createElementVNode("view", { class: "form-picker" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString($data.beamOptions[$data.beamIndex]),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createCommentVNode(" 病害类型和标度 "),
          vue.createElementVNode("view", { class: "form-row" }, [
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "病害类型:"),
              vue.createElementVNode("picker", {
                onChange: _cache[6] || (_cache[6] = (...args) => $options.bindSubclassChange && $options.bindSubclassChange(...args)),
                value: $data.subclassIndex,
                range: $data.subclassOptions
              }, [
                vue.createElementVNode("view", { class: "form-picker" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString($data.subclassOptions[$data.subclassIndex]),
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value", "range"])
            ]),
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "标度:"),
              vue.createElementVNode("picker", {
                onChange: _cache[7] || (_cache[7] = (...args) => $options.bindRatingChange && $options.bindRatingChange(...args)),
                value: $data.ratingIndex,
                range: $data.ratingOptions
              }, [
                vue.createElementVNode("view", { class: "form-picker" }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker-text" },
                    vue.toDisplayString($data.ratingOptions[$data.ratingIndex]) + "类 ",
                    1
                    /* TEXT */
                  )
                ])
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createCommentVNode(" 数量和范围坐标放在同一行 "),
          vue.createElementVNode("view", { class: "form-row" }, [
            vue.createElementVNode("view", { class: "form-item form-item-quantity" }, [
              vue.createElementVNode("text", { class: "form-label" }, "数量:"),
              vue.createElementVNode("view", { class: "form-input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.formData.quantity = $event),
                    placeholder: "数量",
                    value: "1"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.quantity]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item form-item-coordinates" }, [
              vue.createElementVNode("text", { class: "form-label" }, "范围坐标:"),
              vue.createElementVNode("view", { class: "coordinate-inputs" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.formData.rangeX1 = $event),
                    class: "coordinate-input",
                    placeholder: "X1"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.rangeX1]
                ]),
                vue.createElementVNode("text", { class: "coordinate-separator" }, "-"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.formData.rangeY1 = $event),
                    class: "coordinate-input",
                    placeholder: "Y1"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.rangeY1]
                ]),
                vue.createElementVNode("text", { class: "coordinate-separator" }, "-"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.formData.rangeX2 = $event),
                    class: "coordinate-input",
                    placeholder: "X2"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.rangeX2]
                ]),
                vue.createElementVNode("text", { class: "coordinate-separator" }, "-"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.formData.rangeY2 = $event),
                    class: "coordinate-input",
                    placeholder: "Y2"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.rangeY2]
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 长度和Δ值 "),
          vue.createElementVNode("view", { class: "form-row" }, [
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "长度 L(m):"),
              vue.createElementVNode("view", { class: "form-input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "digit",
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.formData.length = $event),
                    placeholder: "请输入长度"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.length]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item form-item-half" }, [
              vue.createElementVNode("text", { class: "form-label" }, "Δ值 (mm):"),
              vue.createElementVNode("view", { class: "form-input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "digit",
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.formData.delta = $event),
                    placeholder: "请输入Δ值"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.formData.delta]
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 添加图片上传区域 "),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "病害图片:"),
            vue.createElementVNode("view", { class: "image-upload-area" }, [
              vue.createElementVNode("view", { class: "image-list" }, [
                $data.formData.imageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "image-item"
                }, [
                  vue.createElementVNode("image", {
                    src: $data.formData.imageUrl,
                    mode: "aspectFill",
                    class: "preview-image"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("text", {
                    class: "delete-icon",
                    onClick: _cache[15] || (_cache[15] = (...args) => $options.deleteImage && $options.deleteImage(...args))
                  }, "×")
                ])) : vue.createCommentVNode("v-if", true),
                !$data.formData.imageUrl ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "image-add-btn",
                  onClick: _cache[16] || (_cache[16] = (...args) => $options.chooseImage && $options.chooseImage(...args))
                }, [
                  vue.createElementVNode("text", { class: "add-icon" }, "+")
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ])
          ]),
          vue.createCommentVNode(" 备注 "),
          vue.createElementVNode("view", { class: "form-item" }, [
            vue.createElementVNode("text", { class: "form-label" }, "备注:"),
            vue.createElementVNode("view", { class: "form-input textarea-box" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "text",
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.formData.remark = $event),
                  placeholder: "请输入备注信息"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.formData.remark]
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "popup-footer" }, [
          vue.createElementVNode("button", {
            class: "btn-cancel",
            onClick: _cache[18] || (_cache[18] = (...args) => $options.closeModal && $options.closeModal(...args))
          }, "关闭"),
          vue.createElementVNode("button", {
            class: "btn-middle",
            onClick: _cache[19] || (_cache[19] = (...args) => $options.pasteDiseaseInfo && $options.pasteDiseaseInfo(...args))
          }, "粘贴病害"),
          vue.createElementVNode("button", {
            class: "btn-confirm",
            onClick: _cache[20] || (_cache[20] = (...args) => $options.confirmAdd && $options.confirmAdd(...args))
          }, "保存")
        ])
      ])
    ])) : vue.createCommentVNode("v-if", true);
  }
  const AddDisease = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-b5cb9a44"], ["__file", "E:/BI/BuildingInspectorFrontend/components/add-disease/add-disease.vue"]]);
  const __default__ = {
    data() {
      return {
        tabs: ["上部结构", "下部结构", "桥面系"],
        activeTab: 0,
        currentSpan: 1,
        beamStart: 1,
        beamEnd: 20,
        supportCount: 0,
        touchStartX: 0,
        touchEndX: 0,
        minSwipeDistance: 50,
        // 最小滑动距离
        isSwipeLocked: false,
        // 是否锁定滑动（防止与其他滑动操作冲突）
        touchStartTarget: null,
        // 记录起始触摸的目标元素
        hasMove: false,
        // 添加标记，记录是否发生了移动
        diseaseList: [
          // 示例病害数据
          {
            id: 0,
            imageSrc: "/static/image/zjl.png",
            // 使用已有的图片资源
            time: "02-26 09:02:68",
            component: "小箱梁",
            //构件
            spanNumber: "1",
            //跨号
            beamNumber: "1",
            //梁号
            position: "左腹板",
            //位置
            subclass: "斜向裂缝",
            //亚类
            rating: "4",
            //标度
            rangeX1: "23",
            //范围x1
            rangeY1: "14",
            //范围y1
            rangeX2: "12",
            //范围x2
            rangeY2: "25",
            //范围y2
            quantity: "1",
            //数量
            length: "12.0",
            //长度
            delta: "0.15",
            //Δ
            remark: "刚才"
            //备注
          },
          {
            id: 1,
            imageSrc: "/static/image/zjl.png",
            // 使用已有的图片资源
            time: "02-26 09:02:68",
            component: "小箱梁",
            //构件
            spanNumber: "1",
            //跨号
            beamNumber: "2",
            //梁号
            position: "右腹板",
            //位置
            subclass: "竖向裂缝",
            //亚类
            rating: "3",
            //标度
            rangeX1: "23",
            //范围x1
            rangeY1: "14",
            //范围y1
            rangeX2: "12",
            //范围x2
            rangeY2: "25",
            //范围y2
            quantity: "1",
            //数量
            length: "20.0",
            //长度
            delta: "0.22",
            //Δ
            remark: "第二个"
            //备注
          },
          {
            id: 2,
            imageSrc: "/static/image/zjl.png",
            // 使用已有的图片资源
            time: "02-26 09:02:68",
            component: "小箱梁",
            //构件
            spanNumber: "2",
            //跨号
            beamNumber: "2",
            //梁号
            position: "右腹板",
            //位置
            subclass: "竖向裂缝",
            //亚类
            rating: "3",
            //标度
            rangeX1: "23",
            //范围x1
            rangeY1: "14",
            //范围y1
            rangeX2: "12",
            //范围x2
            rangeY2: "25",
            //范围y2
            quantity: "1",
            //数量
            length: "20.0",
            //长度
            delta: "0.22",
            //Δ
            remark: "第三个"
            //备注
          }
        ],
        storageFileName: "bridge_diseases_data.json",
        // 存储文件名称
        hasStoragePermissions: false
        // 存储权限状态
      };
    },
    computed: {
      // 计算滑动指示器的样式
      indicatorStyle() {
        const width = `${100 / this.tabs.length}%`;
        return {
          width,
          transform: `translateX(${this.activeTab * 100}%)`
        };
      },
      filteredDiseaseList() {
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:167", "当前筛选条件:", {
          currentSpan: this.currentSpan,
          beamStart: this.beamStart,
          beamEnd: this.beamEnd
        });
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:172", "所有病害数据:", this.diseaseList);
        if (!this.currentSpan && !this.beamStart && !this.beamEnd) {
          return this.diseaseList;
        }
        const result = this.diseaseList.filter((item) => {
          const spanMatch = !this.currentSpan || item.spanNumber === String(this.currentSpan);
          const beamNumber = parseInt(item.beamNumber || "0");
          const beamMatch = !this.beamStart || !this.beamEnd || beamNumber >= this.beamStart && beamNumber <= this.beamEnd;
          return spanMatch && beamMatch;
        });
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:191", "筛选后的数据:", result);
        return result;
      }
    },
    methods: {
      changeSpan(delta) {
        const newSpan = this.currentSpan + delta;
        if (newSpan > 0) {
          this.currentSpan = newSpan;
        }
      },
      // 触摸开始事件
      touchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartTarget = e.target;
        this.isSwipeLocked = false;
        this.hasMove = false;
        if (this.isInteractiveElement(e.target)) {
          this.isSwipeLocked = true;
        }
      },
      // 触摸移动事件
      touchMove(e) {
        if (this.isSwipeLocked)
          return;
        if (this.isInteractiveElement(e.target)) {
          this.isSwipeLocked = true;
          return;
        }
        const currentX = e.touches[0].clientX;
        const diffX = Math.abs(currentX - this.touchStartX);
        if (diffX > 5) {
          this.hasMove = true;
          this.touchEndX = currentX;
        }
      },
      // 触摸结束事件
      touchEnd(e) {
        if (this.isSwipeLocked) {
          this.isSwipeLocked = false;
          return;
        }
        if (this.isInteractiveElement(this.touchStartTarget)) {
          return;
        }
        if (!this.hasMove) {
          return;
        }
        const swipeDistance = this.touchEndX - this.touchStartX;
        if (Math.abs(swipeDistance) > this.minSwipeDistance) {
          if (swipeDistance > 0) {
            if (this.activeTab > 0) {
              this.activeTab--;
              try {
                uni.vibrateShort();
              } catch (e2) {
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:268", "振动反馈不可用");
              }
            }
          } else {
            if (this.activeTab < this.tabs.length - 1) {
              this.activeTab++;
              try {
                uni.vibrateShort();
              } catch (e2) {
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:278", "振动反馈不可用");
              }
            }
          }
        }
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartTarget = null;
        this.hasMove = false;
      },
      // 检查是否为交互元素
      isInteractiveElement(className) {
        const classStr = String(className);
        return classStr.indexOf("input") !== -1 || classStr.indexOf("btn") !== -1 || classStr.indexOf("button") !== -1;
      },
      // 添加病害
      addDisease() {
        this.$refs.addDiseaseRef.openModal();
      },
      // 处理编辑病害事件
      handleEditDisease(disease) {
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:309", "编辑病害:", disease);
        uni.showToast({
          title: "编辑病害功能待实现",
          icon: "none"
        });
      },
      // 保存数据到本地JSON文件
      saveToLocalStorage() {
        try {
          const dataToSave = JSON.parse(JSON.stringify(this.diseaseList));
          dataToSave.forEach((disease) => {
            if (!Array.isArray(disease.images)) {
              disease.images = [];
            }
          });
          const diseaseDataJson = JSON.stringify(dataToSave);
          uni.setStorage({
            key: this.storageFileName,
            data: diseaseDataJson,
            success: () => {
              formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:341", "病害数据已保存到本地存储");
            },
            fail: (err) => {
              formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:344", "保存病害数据失败", err);
              uni.showToast({
                title: "保存数据失败，请检查存储空间",
                icon: "none",
                duration: 2e3
              });
            }
          });
        } catch (e) {
          formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:354", "保存病害数据时出错", e);
          uni.showToast({
            title: "保存数据时出错",
            icon: "none",
            duration: 2e3
          });
        }
      },
      // 从本地存储加载数据
      loadFromLocalStorage() {
        uni.showLoading({
          title: "加载病害数据..."
        });
        uni.getStorage({
          key: this.storageFileName,
          success: (res) => {
            try {
              const diseaseData = JSON.parse(res.data);
              if (Array.isArray(diseaseData) && diseaseData.length > 0) {
                this.diseaseList = diseaseData;
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:379", "json加载完成");
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:380", "从本地存储加载了", diseaseData.length, "条病害记录");
              }
            } catch (e) {
              formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:383", "解析本地病害数据失败", e);
              uni.showToast({
                title: "病害数据格式错误",
                icon: "none",
                duration: 2e3
              });
            }
            uni.hideLoading();
          },
          fail: (err) => {
            formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:394", "本地无病害数据或读取失败", err);
            uni.hideLoading();
            if (err.errMsg && err.errMsg.indexOf("not exist") === -1) {
              uni.showToast({
                title: "读取病害数据失败",
                icon: "none",
                duration: 2e3
              });
            }
          }
        });
      },
      // 处理删除病害事件
      handleDeleteDisease(disease) {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条病害记录吗？",
          success: (res) => {
            if (res.confirm) {
              const index = this.diseaseList.findIndex((item) => item.id === disease.id);
              if (index !== -1) {
                this.diseaseList.splice(index, 1);
                this.saveToLocalStorage();
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            }
          }
        });
      },
      // 处理添加病害事件
      handleAddDisease(formData) {
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:438", "添加/编辑病害:", formData);
        this.saveImageToLocal(formData, (savedImagePath) => {
          if (formData.id !== void 0) {
            const index = this.diseaseList.findIndex((item) => item.id === formData.id);
            if (index !== -1) {
              const updatedDisease = {
                ...formData,
                imageUrl: savedImagePath || this.diseaseList[index].imageUrl || "/static/image/zjl.png",
                // 兼容旧版本
                imageSrc: savedImagePath || this.diseaseList[index].imageSrc || "/static/image/zjl.png"
              };
              this.diseaseList.splice(index, 1, updatedDisease);
              this.saveToLocalStorage();
              this.saveDiseaseAsJsonFile(updatedDisease);
              uni.showToast({
                title: "病害更新成功",
                icon: "success"
              });
            }
          } else {
            const newDisease = {
              ...formData,
              id: Date.now(),
              // 生成唯一ID
              imageUrl: savedImagePath || "/static/image/zjl.png",
              // 使用保存后的图片路径或默认图片
              // 兼容旧版本
              imageSrc: savedImagePath || "/static/image/zjl.png"
            };
            this.diseaseList.unshift(newDisease);
            this.saveToLocalStorage();
            this.saveDiseaseAsJsonFile(newDisease);
            uni.showToast({
              title: "病害添加成功",
              icon: "success"
            });
          }
        });
      },
      // 将图片保存到本地永久存储
      saveImageToLocal(formData, callback) {
        if (!formData.imageUrl || formData.imageUrl.startsWith("/static/")) {
          formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:498", "无需保存图片");
          callback(formData.imageUrl || null);
          return;
        }
        if (formData.imageUrl.indexOf("_doc/images/") > -1 || formData.imageUrl.indexOf("storage/") > -1) {
          formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:506", "图片已是永久路径:", formData.imageUrl);
          callback(formData.imageUrl);
          return;
        }
        try {
          const now = /* @__PURE__ */ new Date();
          const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
          const timeStr = `${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}`;
          const rand = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
          const imageName = `病害图片_${formData.component}_${formData.subclass}_${dateStr}${timeStr}${rand}.jpg`;
          this.saveImageInApp(formData.imageUrl, imageName, callback);
        } catch (e) {
          formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:529", "保存图片出错:", e);
          callback(formData.imageUrl);
        }
      },
      // 检查并请求存储权限
      checkAndRequestPermissions() {
        if (plus.os.name.toLowerCase() === "android") {
          const permissions = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"];
          plus.android.requestPermissions(
            permissions,
            (resultObj) => {
              if (resultObj.granted.length === permissions.length) {
                this.hasStoragePermissions = true;
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:545", "已获得存储权限");
              } else {
                uni.showToast({
                  title: "未获得完整存储权限，某些功能可能受限",
                  icon: "none",
                  duration: 2e3
                });
              }
            },
            (error) => {
              formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:555", "请求权限错误:", error.message);
            }
          );
        }
      },
      // 创建Hbuilder文件夹
      createHbuilderFolder(callback) {
        if (plus.os.name.toLowerCase() === "android") {
          try {
            const context = plus.android.runtimeMainActivity();
            const filesDir = context.getFilesDir();
            if (filesDir) {
              const hbuilderPath = filesDir.getAbsolutePath() + "/Hbuilder";
              formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:572", "Hbuilder文件夹物理路径:", hbuilderPath);
              const File = plus.android.importClass("java.io.File");
              const hbuilderDir = new File(hbuilderPath);
              if (!hbuilderDir.exists()) {
                const success = hbuilderDir.mkdirs();
                if (!success) {
                  formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:580", "无法创建Hbuilder文件夹");
                  callback(null);
                  return;
                }
              }
              plus.io.resolveLocalFileSystemURL("file://" + hbuilderPath, (dirEntry) => {
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:588", "已创建Hbuilder文件夹:", hbuilderPath);
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:589", "Hbuilder文件夹URL路径:", "file://" + hbuilderPath);
                callback(dirEntry);
              }, (err) => {
                formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:592", "无法解析Hbuilder文件夹路径:", err);
                callback(null);
              });
            } else {
              plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
                fs.root.getDirectory("Hbuilder", { create: true }, (dirEntry) => {
                  const fullPath = plus.io.convertLocalFileSystemURL(dirEntry.fullPath);
                  formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:600", "(备选方案)Hbuilder文件夹路径:", fullPath);
                  callback(dirEntry);
                }, (err) => {
                  formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:603", "创建Hbuilder文件夹失败:", err);
                  callback(null);
                });
              }, (err) => {
                formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:607", "获取私有文档目录失败:", err);
                callback(null);
              });
            }
          } catch (e) {
            formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:612", "创建Hbuilder文件夹失败:", e);
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
              fs.root.getDirectory("Hbuilder", { create: true }, (dirEntry) => {
                const fullPath = plus.io.convertLocalFileSystemURL(dirEntry.fullPath);
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:618", "(备选方案)Hbuilder文件夹路径:", fullPath);
                callback(dirEntry);
              }, (err) => {
                formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:621", "创建Hbuilder文件夹失败:", err);
                callback(null);
              });
            }, (err) => {
              formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:625", "获取私有文档目录失败:", err);
              callback(null);
            });
          }
        } else {
          plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
            fs.root.getDirectory("Hbuilder", { create: true }, (dirEntry) => {
              const fullPath = plus.io.convertLocalFileSystemURL(dirEntry.fullPath);
              formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:634", "iOS Hbuilder文件夹路径:", fullPath);
              callback(dirEntry);
            }, (err) => {
              formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:637", "创建Hbuilder文件夹失败:", err);
              callback(null);
            });
          }, (err) => {
            formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:641", "获取私有文档目录失败:", err);
            callback(null);
          });
        }
      },
      // App环境下保存图片
      saveImageInApp(imagePath, imageName, callback) {
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:655", "开始保存图片，原始路径:", imagePath);
        this.createHbuilderFolder((hbuilderDirEntry) => {
          if (!hbuilderDirEntry) {
            formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:660", "无法创建Hbuilder文件夹");
            uni.showToast({
              title: "无法保存图片",
              icon: "none",
              duration: 2e3
            });
            callback(imagePath);
            return;
          }
          formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:670", "Hbuilder文件夹完整路径:", hbuilderDirEntry.fullPath);
          hbuilderDirEntry.getDirectory("images", { create: true }, (imagesDirEntry) => {
            formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:674", "images文件夹完整路径:", imagesDirEntry.fullPath);
            plus.io.resolveLocalFileSystemURL(imagePath, (entry) => {
              entry.copyTo(imagesDirEntry, imageName, () => {
                let fullPath = "";
                if (plus.os.name.toLowerCase() === "android") {
                  try {
                    const fullPathWithoutProtocol = imagesDirEntry.fullPath + "/" + imageName;
                    fullPath = "file://" + fullPathWithoutProtocol;
                    formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:690", "Android图片完整路径:", fullPath);
                    formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:691", "文件夹物理路径:", hbuilderDirEntry.fullPath);
                    const context = plus.android.runtimeMainActivity();
                    const filesDir = context.getFilesDir();
                    if (filesDir) {
                      formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:697", "应用内部存储根路径:", filesDir.getAbsolutePath());
                    }
                    try {
                      const Environment = plus.android.importClass("android.os.Environment");
                      formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:703", "应用外部存储路径:", context.getExternalFilesDir(null).getAbsolutePath());
                      formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:704", "设备下载目录:", Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());
                    } catch (e) {
                      formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:706", "获取参考路径时出错:", e);
                    }
                  } catch (e) {
                    formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:709", "构建图片路径出错:", e);
                    fullPath = "file://" + hbuilderDirEntry.fullPath + "/images/" + imageName;
                    formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:712", "(备选方案)图片完整路径:", fullPath);
                  }
                } else {
                  fullPath = plus.io.convertLocalFileSystemURL(
                    imagesDirEntry.fullPath + "/" + imageName
                  );
                  formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:719", "iOS图片完整路径:", fullPath);
                }
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:722", "图片已保存至应用存储的Hbuilder文件夹，路径:", fullPath);
                uni.showToast({
                  title: "图片保存成功",
                  icon: "success",
                  duration: 1500
                });
                callback(fullPath);
              }, (err) => {
                formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:733", "复制图片出错:", err);
                uni.showToast({
                  title: "复制图片失败",
                  icon: "none",
                  duration: 2e3
                });
                callback(imagePath);
              });
            }, (err) => {
              formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:742", "解析源图片路径出错:", err);
              uni.showToast({
                title: "解析图片路径失败",
                icon: "none",
                duration: 2e3
              });
              callback(imagePath);
            });
          }, (err) => {
            formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:751", "创建images文件夹出错:", err);
            uni.showToast({
              title: "创建图片目录失败",
              icon: "none",
              duration: 2e3
            });
            callback(imagePath);
          });
        });
      },
      // 保存文件到Hbuilder文件夹
      saveFileToHbuilderFolder(fileName, content) {
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:764", "开始保存文件:", fileName);
        this.createHbuilderFolder((hbuilderDirEntry) => {
          if (!hbuilderDirEntry) {
            formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:769", "无法创建Hbuilder文件夹");
            uni.showToast({
              title: "无法创建存储目录",
              icon: "none",
              duration: 2e3
            });
            return;
          }
          formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:778", "Hbuilder文件夹完整路径:", hbuilderDirEntry.fullPath);
          hbuilderDirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
            formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:782", "JSON文件创建成功，路径:", fileEntry.fullPath);
            fileEntry.createWriter((writer) => {
              writer.onwrite = () => {
                let fullPath = "";
                let physicalPath = "";
                if (plus.os.name.toLowerCase() === "android") {
                  try {
                    const context = plus.android.runtimeMainActivity();
                    const filesDir = context.getFilesDir();
                    if (filesDir) {
                      physicalPath = filesDir.getAbsolutePath() + "/Hbuilder/" + fileName;
                      formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:797", "文件物理路径:", physicalPath);
                    }
                  } catch (e) {
                    formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:800", "获取物理路径失败:", e);
                  }
                  fullPath = "应用存储/Hbuilder/" + fileName;
                } else {
                  fullPath = "Hbuilder/" + fileName;
                  try {
                    physicalPath = plus.io.convertLocalFileSystemURL(fileEntry.fullPath);
                    formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:808", "iOS文件物理路径:", physicalPath);
                  } catch (e) {
                    formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:810", "获取iOS物理路径失败:", e);
                  }
                }
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:814", "病害JSON文件已保存到应用存储中的Hbuilder文件夹:");
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:815", "- 相对路径:", fullPath);
                formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:816", "- 文件URL路径:", "file://" + hbuilderDirEntry.fullPath + "/" + fileName);
                uni.showToast({
                  title: `已保存到${fullPath}`,
                  icon: "success",
                  duration: 2e3
                });
              };
              writer.onerror = (e) => {
                formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:825", "写入JSON文件失败:", e);
                uni.showToast({
                  title: "保存文件失败",
                  icon: "none",
                  duration: 2e3
                });
              };
              writer.write(new Blob([content], { type: "text/plain" }));
              formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:834", "开始写入文件内容，大小:", content.length, "字节");
            }, (err) => {
              formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:836", "创建writer失败:", err);
              uni.showToast({
                title: "创建文件写入器失败",
                icon: "none",
                duration: 2e3
              });
            });
          }, (err) => {
            formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:844", "创建JSON文件失败:", err);
            uni.showToast({
              title: "创建文件失败",
              icon: "none",
              duration: 2e3
            });
          });
        });
      },
      // 小程序或H5环境下保存图片
      saveImageInMP(imagePath, imageName, callback) {
        try {
          const fs = uni.getFileSystemManager();
          const imageDir = `${uni.env.USER_DATA_PATH}/images`;
          const targetPath = `${imageDir}/${imageName}`;
          try {
            fs.accessSync(imageDir);
          } catch (e) {
            fs.mkdirSync(imageDir, true);
          }
          fs.copyFileSync(imagePath, targetPath);
          formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:870", "图片已保存至:", targetPath);
          callback(targetPath);
        } catch (e) {
          formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:873", "保存图片失败:", e);
          callback(imagePath);
        }
      },
      // 将单条病害保存为JSON文件
      saveDiseaseAsJsonFile(disease) {
        try {
          const diseaseCopy = JSON.parse(JSON.stringify(disease));
          const jsonStr = JSON.stringify(diseaseCopy, null, 2);
          const now = /* @__PURE__ */ new Date();
          const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
          const timeStr = `${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;
          const fileName = `病害_${disease.component}_${disease.subclass}_${dateStr}${timeStr}_${disease.id}.json`;
          this.saveFileInApp(fileName, jsonStr);
        } catch (e) {
          formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:904", "保存病害到JSON文件时出错:", e);
          uni.showToast({
            title: "保存文件出错",
            icon: "none"
          });
        }
      },
      // 判断是否为平板设备
      isTabletDevice() {
        const info = uni.getSystemInfoSync();
        return info.windowWidth >= 768 || info.windowHeight >= 768;
      },
      // App环境下的文件保存实现
      saveFileInApp(fileName, content) {
        const isTablet = this.isTabletDevice();
        try {
          if (isTablet) {
            this.saveFileToHbuilderFolder(fileName, content);
          } else {
            plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
              fs.root.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
                fileEntry.createWriter((writer) => {
                  writer.onwrite = () => {
                    formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:935", "病害JSON文件已保存到公共文档目录:", fileName);
                    uni.showToast({
                      title: "已保存到文档目录",
                      icon: "success"
                    });
                  };
                  writer.onerror = (e) => {
                    formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:942", "写入JSON文件失败:", e);
                    uni.showToast({
                      title: "保存文件失败",
                      icon: "none"
                    });
                  };
                  writer.write(new Blob([content], { type: "text/plain" }));
                });
              });
            });
          }
        } catch (e) {
          formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:955", "App环境保存文件失败:", e);
          uni.showToast({
            title: "保存文件失败",
            icon: "none"
          });
        }
      },
      // 小程序或H5环境下的文件保存实现
      saveFileInMP(fileName, content) {
        try {
          const fs = uni.getFileSystemManager();
          const tempFilePath = `${uni.env.USER_DATA_PATH}/${fileName}`;
          fs.writeFileSync(
            tempFilePath,
            content,
            "utf8"
          );
        } catch (e) {
          formatAppLog("error", "at pages/bridge-diseases/bridge-diseases.vue:1017", "小程序环境保存文件失败:", e);
          uni.showToast({
            title: "保存文件失败",
            icon: "none",
            duration: 2e3
          });
        }
      },
      // 处理图片路径
      processImagePaths(images) {
        if (!Array.isArray(images)) {
          return [];
        }
        return images.map((img) => {
          return img;
        });
      }
    },
    // 添加生命周期钩子
    onLoad() {
      this.loadFromLocalStorage();
      this.checkAndRequestPermissions();
    },
    // 页面卸载时保存数据
    onUnload() {
      this.saveToLocalStorage();
    },
    components: {
      // 使用setup脚本中的组件导入，所以这里不需要了
    }
  };
  const _sfc_main$1 = /* @__PURE__ */ Object.assign(__default__, {
    __name: "bridge-diseases",
    setup(__props, { expose: __expose }) {
      __expose();
      const addDiseaseRef = vue.ref(null);
      vue.onMounted(() => {
        formatAppLog("log", "at pages/bridge-diseases/bridge-diseases.vue:1071", "bridge-diseases页面已加载");
      });
      const __returned__ = { addDiseaseRef, onMounted: vue.onMounted, ref: vue.ref, DiseaseItem, AddDisease };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "page-container",
        onTouchstart: _cache[6] || (_cache[6] = (...args) => $options.touchStart && $options.touchStart(...args)),
        onTouchmove: _cache[7] || (_cache[7] = (...args) => $options.touchMove && $options.touchMove(...args)),
        onTouchend: _cache[8] || (_cache[8] = (...args) => $options.touchEnd && $options.touchEnd(...args))
      },
      [
        vue.createCommentVNode(" 标签页部分 "),
        vue.createElementVNode("view", { class: "tabs" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.tabs, (tab, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["tab", $data.activeTab === index ? "active" : ""]),
                onClick: ($event) => $data.activeTab = index
              }, vue.toDisplayString(tab), 11, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createCommentVNode(" 添加滑动指示器 "),
          vue.createElementVNode(
            "view",
            {
              class: "tab-indicator",
              style: vue.normalizeStyle($options.indicatorStyle)
            },
            null,
            4
            /* STYLE */
          )
        ]),
        vue.createCommentVNode(" 过滤/筛选区域 "),
        vue.createElementVNode("view", { class: "filter-section" }, [
          vue.createElementVNode("view", { class: "filter-row" }, [
            vue.createCommentVNode(" 跨区域 "),
            vue.createElementVNode("view", { class: "span-section" }, [
              vue.createElementVNode("view", {
                class: "minus-btn",
                onClick: _cache[0] || (_cache[0] = ($event) => $options.changeSpan(-1))
              }, [
                vue.createElementVNode("text", { class: "btn-icon" }, "-")
              ]),
              vue.createElementVNode("view", { class: "span-label" }, "第"),
              vue.createElementVNode("view", { class: "span-input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    class: "number-input",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.currentSpan = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.currentSpan]
                ])
              ]),
              vue.createElementVNode("view", { class: "span-label" }, "跨"),
              vue.createElementVNode("view", {
                class: "add-btn",
                onClick: _cache[2] || (_cache[2] = ($event) => $options.changeSpan(1))
              }, [
                vue.createElementVNode("text", { class: "btn-icon" }, "+")
              ])
            ]),
            vue.createCommentVNode(" 梁号区域 "),
            vue.createElementVNode("view", { class: "beam-section" }, [
              vue.createElementVNode("view", { class: "beam-label" }, "梁号:"),
              vue.createElementVNode("view", { class: "beam-input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    class: "number-input small-input",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.beamStart = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.beamStart]
                ])
              ]),
              vue.createElementVNode("view", { class: "beam-separator" }, "~"),
              vue.createElementVNode("view", { class: "beam-input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    class: "number-input small-input",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.beamEnd = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.beamEnd]
                ])
              ])
            ]),
            vue.createCommentVNode(" 支座数区域 "),
            vue.createElementVNode("view", { class: "support-section" }, [
              vue.createElementVNode("view", { class: "support-label" }, "支座数:"),
              vue.createElementVNode(
                "view",
                { class: "support-value" },
                vue.toDisplayString($data.supportCount || "/"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "dropdown-icon" }, "▼")
            ])
          ])
        ]),
        vue.createCommentVNode(" 内容区域 "),
        vue.createElementVNode("view", { class: "content" }, [
          vue.createCommentVNode(" 列表标题 "),
          vue.createElementVNode(
            "view",
            { class: "list-title" },
            "病害列表 (共" + vue.toDisplayString($options.filteredDiseaseList.length) + "条记录)",
            1
            /* TEXT */
          ),
          vue.createCommentVNode(" 病害列表 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.filteredDiseaseList, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "disease-list-item"
              }, [
                vue.createVNode($setup["DiseaseItem"], {
                  disease: item,
                  onEdit: $options.handleEditDisease,
                  onDelete: $options.handleDeleteDisease
                }, null, 8, ["disease", "onEdit", "onDelete"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createCommentVNode(" 显示无数据提示 "),
          $options.filteredDiseaseList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "no-data"
          }, " 暂无符合条件的病害记录 ")) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createCommentVNode(" 添加按钮 "),
        vue.createElementVNode("view", {
          class: "add-button",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.addDisease && $options.addDisease(...args))
        }, "+"),
        vue.createCommentVNode(" 添加病害弹窗组件 "),
        vue.createVNode($setup["AddDisease"], {
          ref: "addDiseaseRef",
          onAddDisease: $options.handleAddDisease
        }, null, 8, ["onAddDisease"])
      ],
      32
      /* NEED_HYDRATION */
    );
  }
  const PagesBridgeDiseasesBridgeDiseases = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "E:/BI/BuildingInspectorFrontend/pages/bridge-diseases/bridge-diseases.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/home/home", PagesHomeHome);
  __definePage("pages/message/message", PagesMessageMessage);
  __definePage("pages/userinfo/userinfo", PagesUserinfoUserinfo);
  __definePage("pages/setting/setting", PagesSettingSetting);
  __definePage("pages/versionInfo/versionInfo", PagesVersionInfoVersionInfo);
  __definePage("pages/bridge-diseases/bridge-diseases", PagesBridgeDiseasesBridgeDiseases);
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/BI/BuildingInspectorFrontend/App.vue"]]);
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
