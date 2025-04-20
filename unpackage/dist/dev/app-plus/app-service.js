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
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const getVal$1 = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$h = {
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
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal$1(this.size);
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
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const _sfc_main$g = {
    name: "UniStatusBar",
    data() {
      return {
        statusBarHeight: uni.getSystemInfoSync().statusBarHeight + "px"
      };
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle({ height: $data.statusBarHeight }),
        class: "uni-status-bar"
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      4
      /* STYLE */
    );
  }
  const statusBar = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-7920e3e0"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar.vue"]]);
  const getVal = (val) => typeof val === "number" ? val + "px" : val;
  const _sfc_main$f = {
    name: "UniNavBar",
    components: {
      statusBar
    },
    emits: ["clickLeft", "clickRight", "clickTitle"],
    props: {
      dark: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      leftText: {
        type: String,
        default: ""
      },
      rightText: {
        type: String,
        default: ""
      },
      leftIcon: {
        type: String,
        default: ""
      },
      rightIcon: {
        type: String,
        default: ""
      },
      fixed: {
        type: [Boolean, String],
        default: false
      },
      color: {
        type: String,
        default: ""
      },
      backgroundColor: {
        type: String,
        default: ""
      },
      statusBar: {
        type: [Boolean, String],
        default: false
      },
      shadow: {
        type: [Boolean, String],
        default: false
      },
      border: {
        type: [Boolean, String],
        default: true
      },
      height: {
        type: [Number, String],
        default: 44
      },
      leftWidth: {
        type: [Number, String],
        default: 60
      },
      rightWidth: {
        type: [Number, String],
        default: 60
      },
      stat: {
        type: [Boolean, String],
        default: ""
      }
    },
    computed: {
      themeBgColor() {
        if (this.dark) {
          if (this.backgroundColor) {
            return this.backgroundColor;
          } else {
            return this.dark ? "#333" : "#FFF";
          }
        }
        return this.backgroundColor || "#FFF";
      },
      themeColor() {
        if (this.dark) {
          if (this.color) {
            return this.color;
          } else {
            return this.dark ? "#fff" : "#333";
          }
        }
        return this.color || "#333";
      },
      navbarHeight() {
        return getVal(this.height);
      },
      leftIconWidth() {
        return getVal(this.leftWidth);
      },
      rightIconWidth() {
        return getVal(this.rightWidth);
      }
    },
    mounted() {
      if (uni.report && this.stat && this.title !== "") {
        uni.report("title", this.title);
      }
    },
    methods: {
      onClickLeft() {
        this.$emit("clickLeft");
      },
      onClickRight() {
        this.$emit("clickRight");
      },
      onClickTitle() {
        this.$emit("clickTitle");
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_status_bar = vue.resolveComponent("status-bar");
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$3);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-navbar", { "uni-dark": $props.dark, "uni-nvue-fixed": $props.fixed }])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-navbar__content", { "uni-navbar--fixed": $props.fixed, "uni-navbar--shadow": $props.shadow, "uni-navbar--border": $props.border }]),
            style: vue.normalizeStyle({ "background-color": $options.themeBgColor, "border-bottom-color": $options.themeColor })
          },
          [
            $props.statusBar ? (vue.openBlock(), vue.createBlock(_component_status_bar, { key: 0 })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "view",
              {
                style: vue.normalizeStyle({ color: $options.themeColor, backgroundColor: $options.themeBgColor, height: $options.navbarHeight }),
                class: "uni-navbar__header"
              },
              [
                vue.createElementVNode(
                  "view",
                  {
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.onClickLeft && $options.onClickLeft(...args)),
                    class: "uni-navbar__header-btns uni-navbar__header-btns-left",
                    style: vue.normalizeStyle({ width: $options.leftIconWidth })
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "left", {}, () => [
                      $props.leftIcon.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "uni-navbar__content_view"
                      }, [
                        vue.createVNode(_component_uni_icons, {
                          color: $options.themeColor,
                          type: $props.leftIcon,
                          size: "20"
                        }, null, 8, ["color", "type"])
                      ])) : vue.createCommentVNode("v-if", true),
                      $props.leftText.length ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 1,
                          class: vue.normalizeClass([{ "uni-navbar-btn-icon-left": !$props.leftIcon.length > 0 }, "uni-navbar-btn-text"])
                        },
                        [
                          vue.createElementVNode(
                            "text",
                            {
                              style: vue.normalizeStyle({ color: $options.themeColor, fontSize: "12px" })
                            },
                            vue.toDisplayString($props.leftText),
                            5
                            /* TEXT, STYLE */
                          )
                        ],
                        2
                        /* CLASS */
                      )) : vue.createCommentVNode("v-if", true)
                    ], true)
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", {
                  class: "uni-navbar__header-container",
                  onClick: _cache[1] || (_cache[1] = (...args) => $options.onClickTitle && $options.onClickTitle(...args))
                }, [
                  vue.renderSlot(_ctx.$slots, "default", {}, () => [
                    $props.title.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "uni-navbar__header-container-inner"
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "uni-nav-bar-text uni-ellipsis-1",
                          style: vue.normalizeStyle({ color: $options.themeColor })
                        },
                        vue.toDisplayString($props.title),
                        5
                        /* TEXT, STYLE */
                      )
                    ])) : vue.createCommentVNode("v-if", true)
                  ], true)
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    onClick: _cache[2] || (_cache[2] = (...args) => $options.onClickRight && $options.onClickRight(...args)),
                    class: "uni-navbar__header-btns uni-navbar__header-btns-right",
                    style: vue.normalizeStyle({ width: $options.rightIconWidth })
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "right", {}, () => [
                      $props.rightIcon.length ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                        vue.createVNode(_component_uni_icons, {
                          color: $options.themeColor,
                          type: $props.rightIcon,
                          size: "22"
                        }, null, 8, ["color", "type"])
                      ])) : vue.createCommentVNode("v-if", true),
                      $props.rightText.length && !$props.rightIcon.length ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "uni-navbar-btn-text"
                      }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "uni-nav-bar-right-text",
                            style: vue.normalizeStyle({ color: $options.themeColor })
                          },
                          vue.toDisplayString($props.rightText),
                          5
                          /* TEXT, STYLE */
                        )
                      ])) : vue.createCommentVNode("v-if", true)
                    ], true)
                  ],
                  4
                  /* STYLE */
                )
              ],
              4
              /* STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        ),
        $props.fixed ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-navbar__placeholder"
        }, [
          $props.statusBar ? (vue.openBlock(), vue.createBlock(_component_status_bar, { key: 0 })) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            {
              class: "uni-navbar__placeholder-view",
              style: vue.normalizeStyle({ height: $options.navbarHeight })
            },
            null,
            4
            /* STYLE */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-26544265"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue"]]);
  let __currentFilePath = null;
  function getFullPath$1(path) {
    const docPath = plus.io.convertLocalFileSystemURL("_doc/");
    return `${docPath}${path}`;
  }
  function saveData(data) {
    return new Promise((resolve, reject) => {
      if (!__currentFilePath) {
        return reject(new Error("请先执行读取操作获取文件路径"));
      }
      const fullPath = getFullPath$1(__currentFilePath);
      formatAppLog("log", "at utils/reviseJson.js:17", "准备保存文件到路径:", fullPath);
      plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
        formatAppLog("log", "at utils/reviseJson.js:20", "获取文件系统成功");
        fs.root.getFile(fullPath, { create: true }, (fileEntry) => {
          formatAppLog("log", "at utils/reviseJson.js:22", "获取文件入口成功");
          fileEntry.createWriter((writer) => {
            const wait = plus.nativeUI.showWaiting("正在保存信息");
            writer.seek(0);
            const jsonString = JSON.stringify(data, null, 2);
            formatAppLog("log", "at utils/reviseJson.js:28", "准备写入数据:", jsonString);
            writer.onwrite = () => {
              wait.close();
              formatAppLog("log", "at utils/reviseJson.js:32", "写入成功");
              plus.nativeUI.toast("保存成功");
              resolve(true);
            };
            writer.onerror = (e) => {
              wait.close();
              formatAppLog("error", "at utils/reviseJson.js:39", "写入失败:", e.message);
              plus.nativeUI.toast("保存失败");
              reject(e);
            };
            writer.write(jsonString);
          }, (error2) => {
            formatAppLog("error", "at utils/reviseJson.js:46", "创建写入器失败:", error2);
            reject(error2);
          });
        }, (error2) => {
          formatAppLog("error", "at utils/reviseJson.js:50", "获取文件入口失败:", error2);
          reject(error2);
        });
      }, (error2) => {
        formatAppLog("error", "at utils/reviseJson.js:54", "获取文件系统失败:", error2);
        reject(error2);
      });
    });
  }
  function trackReadPath(path) {
    formatAppLog("log", "at utils/reviseJson.js:62", "设置文件路径:", path);
    __currentFilePath = path;
  }
  const DOC_BASE_PATH = plus.io.convertLocalFileSystemURL("_doc/");
  const FILE_NAMING = {
    taskList: (userId) => `${userId}/taskList.json`,
    bridgeList: (userId, bridgeListId) => `${userId}/${bridgeListId}/bridgeList.json`,
    bridge: (userId, bridgeListId, bridgeId) => `${userId}/${bridgeListId}/${bridgeId}/bridge.json`
  };
  function getFullPath(fileName) {
    return `${DOC_BASE_PATH}${fileName}`;
  }
  async function getJsonData$1(fullPath) {
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
    } catch (error2) {
      formatAppLog("error", "at utils/readJson.js:54", `文件操作失败: ${fullPath}`, error2);
      throw error2;
    }
  }
  function getTaskList(userId) {
    const fileName = FILE_NAMING.taskList(userId);
    const fullPath = getFullPath(fileName);
    trackReadPath(fullPath);
    return getJsonData$1(fullPath).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      return data;
    });
  }
  function getBridgeList(userId, bridgeListId) {
    const fileName = FILE_NAMING.bridgeList(userId, bridgeListId);
    const fullPath = getFullPath(fileName);
    trackReadPath(fullPath);
    return getJsonData$1(fullPath);
  }
  function getBridge(userId, bridgeListId, bridgeId) {
    const fileName = FILE_NAMING.bridge(userId, bridgeListId, bridgeId);
    const fullPath = getFullPath(fileName);
    trackReadPath(fullPath);
    return getJsonData$1(fullPath);
  }
  const _sfc_main$e = {
    __name: "bridge",
    setup(__props, { expose: __expose }) {
      __expose();
      const detectUnit = vue.ref("");
      const detectPerson = vue.ref("");
      const years = vue.ref(["2024年度", "2025年度", "2026年度"]);
      const selectedYearIndex = vue.ref(0);
      const fileData = vue.ref(null);
      const getData = async () => {
        try {
          const data = await getTaskList(3);
          formatAppLog("log", "at pages/bridge/bridge.vue:66", "获取到的数据:", data);
          if (data) {
            fileData.value = data;
            formatAppLog("log", "at pages/bridge/bridge.vue:69", "处理后的数据:", fileData.value);
          } else {
            formatAppLog("error", "at pages/bridge/bridge.vue:71", "获取数据为空");
          }
        } catch (error2) {
          formatAppLog("error", "at pages/bridge/bridge.vue:74", "获取数据失败:", error2);
        }
      };
      const changeYear = (e) => {
        selectedYearIndex.value = e.detail.value;
      };
      const back = () => {
        uni.navigateBack();
      };
      const goToList = (item) => {
        uni.navigateTo({
          url: `/pages/List/List?projectId=${item.code || ""}&projectName=${encodeURIComponent(item.projectName || "")}&company=${encodeURIComponent(item.company || "")}&status=${encodeURIComponent(item.status || "")}&progress=${encodeURIComponent(item.progress || "")}`
        });
      };
      vue.onMounted(() => {
        getData();
      });
      const __returned__ = { detectUnit, detectPerson, years, selectedYearIndex, fileData, getData, changeYear, back, goToList, ref: vue.ref, onMounted: vue.onMounted, get getTaskList() {
        return getTaskList;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_nav_bar = resolveEasycom(vue.resolveDynamicComponent("uni-nav-bar"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 导航栏 "),
        vue.createVNode(_component_uni_nav_bar, {
          class: "uni-nav-bar",
          dark: "",
          fixed: true,
          shadow: "",
          "background-color": "#0F4687",
          "status-bar": "",
          "left-icon": "left",
          title: "桥梁定期检查项目列表",
          onClickLeft: $setup.back
        }),
        vue.createCommentVNode(" 内容区 "),
        vue.createElementVNode("view", { class: "container" }, [
          $setup.fileData ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "info-container"
          }, [
            vue.createElementVNode("view", { class: "info-box" }, [
              vue.createElementVNode("text", { class: "label" }, "检测单位"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($setup.fileData.unit || "暂无数据"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-box" }, [
              vue.createElementVNode("text", { class: "label" }, "检测人员"),
              vue.createElementVNode(
                "text",
                { class: "value" },
                vue.toDisplayString($setup.fileData.person || "暂无数据"),
                1
                /* TEXT */
              )
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
                    vue.toDisplayString($setup.years[$setup.selectedYearIndex]),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "arrows" }, [
                    vue.createElementVNode("text", { class: "arrow up" }, "▲"),
                    vue.createElementVNode("text", { class: "arrow down" }, "▼")
                  ])
                ])
              ], 40, ["value", "range"])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          $setup.fileData && $setup.fileData.bridgeInspectionList ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "list-container"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.fileData.bridgeInspectionList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "list-item",
                  key: index,
                  onClick: ($event) => $setup.goToList(item)
                }, [
                  vue.createElementVNode("view", { class: "item-left" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "project-code" },
                      vue.toDisplayString(item.code || "暂无编号"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "project-name" },
                      vue.toDisplayString(item.projectName || "暂无名称"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "project-company" },
                      vue.toDisplayString(item.company || "暂无公司"),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "item-right" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["status", { "completed": item.status === "已完成" }])
                      },
                      vue.toDisplayString(item.status || "未知状态"),
                      3
                      /* TEXT, CLASS */
                    ),
                    vue.createElementVNode("view", { class: "progress-wrapper" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "progress" },
                        vue.toDisplayString(item.progress || "0/0"),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "arrow-right" }, ">")
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesBridgeBridge = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-29b8df97"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/bridge/bridge.vue"]]);
  const _sfc_main$d = {
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
        try {
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          const options = currentPage.$page.options;
          const taskData = await getTaskList(3);
          if (options) {
            projectInfo.value = {
              projectName: decodeURIComponent(options.projectName || ""),
              code: options.projectId || "",
              status: decodeURIComponent(options.status || ""),
              company: decodeURIComponent(options.company || ""),
              progress: decodeURIComponent(options.progress || ""),
              year: (/* @__PURE__ */ new Date()).getFullYear() + "年度",
              timeRange: "0000-00-00 至 0000-00-00",
              detectionUnit: taskData ? taskData.unit : "",
              inspector: taskData && taskData.bridgeInspectionList ? taskData.bridgeInspectionList[0].inspector : ""
            };
          } else {
            if (taskData && taskData.bridgeInspectionList && taskData.bridgeInspectionList.length > 0) {
              projectInfo.value = {
                projectName: taskData.bridgeInspectionList[0].projectName,
                code: taskData.bridgeInspectionList[0].code,
                status: taskData.bridgeInspectionList[0].status,
                company: taskData.bridgeInspectionList[0].company,
                progress: taskData.bridgeInspectionList[0].progress,
                year: taskData.year,
                timeRange: "0000-00-00 至 0000-00-00",
                detectionUnit: taskData.unit,
                inspector: taskData.bridgeInspectionList[0].inspector
              };
            }
          }
          try {
            const bridgeData = await getBridgeList(3, 1);
            formatAppLog("log", "at pages/List/List.vue:123", "获取到的桥梁数据:", bridgeData);
            if (bridgeData && Array.isArray(bridgeData)) {
              bridges.value = bridgeData.map((bridge) => ({
                id: bridge.id || bridge.code,
                code: bridge.code,
                name: bridge.name,
                location: bridge.location || "",
                type: bridge.type || "small",
                length: bridge.length || "",
                class: bridge.class || ""
              }));
              formatAppLog("log", "at pages/List/List.vue:134", "处理后的桥梁列表:", bridges.value);
            } else {
              bridges.value = [];
              formatAppLog("error", "at pages/List/List.vue:137", "桥梁数据格式不正确");
              uni.showToast({
                title: "桥梁数据格式不正确",
                icon: "none"
              });
            }
          } catch (error2) {
            formatAppLog("error", "at pages/List/List.vue:144", "获取桥梁数据失败:", error2);
            uni.showToast({
              title: "获取桥梁数据失败",
              icon: "none"
            });
          }
        } catch (error2) {
          formatAppLog("error", "at pages/List/List.vue:151", "获取数据失败:", error2);
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
          url: `/pages/detail/detail?id=${bridge.id}`
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
        formatAppLog("log", "at pages/List/List.vue:199", "搜索关键词:", searchText.value);
      };
      const __returned__ = { back, projectInfo, searchText, bridges, getProjectData, getBridgeIcon, goToDetail, filteredBridges, handleSearch, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed, get getTaskList() {
        return getTaskList;
      }, get getBridgeList() {
        return getBridgeList;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_nav_bar = resolveEasycom(vue.resolveDynamicComponent("uni-nav-bar"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 导航栏 "),
      vue.createVNode(_component_uni_nav_bar, {
        class: "uni-nav-bar",
        dark: "",
        fixed: true,
        shadow: "",
        "background-color": "#0F4687",
        "status-bar": "",
        "left-icon": "left",
        title: "桥梁定期检查项目列表",
        onClickLeft: $setup.back
      }),
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
                ),
                vue.createElementVNode("text", { class: "arrow" }, ">")
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
  const PagesListList = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/List/List.vue"]]);
  const _sfc_main$c = {
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
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-e4e4508d"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/login/login.vue"]]);
  const _sfc_main$b = {
    __name: "test",
    setup(__props, { expose: __expose }) {
      __expose();
      const userId = vue.ref("");
      const bridgeListId = vue.ref("");
      const bridgeId = vue.ref("");
      const result = vue.ref("");
      const currentData = vue.ref(null);
      const handleGetTaskList = async () => {
        const idToUse = userId.value || "3";
        try {
          const data = await getTaskList(idToUse);
          result.value = JSON.stringify(data, null, 2);
          currentData.value = data;
          uni.showToast({
            title: "获取任务列表成功",
            icon: "success"
          });
        } catch (error2) {
          result.value = `错误: ${error2.message}`;
          uni.showToast({
            title: "获取任务列表失败",
            icon: "none"
          });
        }
      };
      const handleGetBridgeList = async () => {
        if (!userId.value || !bridgeListId.value) {
          uni.showToast({
            title: "请输入用户 ID 和桥梁列表 ID",
            icon: "none"
          });
          return;
        }
        try {
          const data = await getBridgeList(userId.value, bridgeListId.value);
          result.value = JSON.stringify(data, null, 2);
          currentData.value = data;
        } catch (error2) {
          result.value = `错误: ${error2.message}`;
          uni.showToast({
            title: "获取桥梁列表失败",
            icon: "none"
          });
        }
      };
      const handleGetBridge = async () => {
        if (!userId.value || !bridgeId.value) {
          uni.showToast({
            title: "请输入用户 ID 和桥梁 ID",
            icon: "none"
          });
          return;
        }
        try {
          const taskListData = await getTaskList(userId.value);
          if (!taskListData || !taskListData.bridgeInspectionList) {
            throw new Error("未找到任务列表数据");
          }
          const bridge = taskListData.bridgeInspectionList.find(
            (item) => item.id === bridgeId.value
          );
          if (!bridge) {
            throw new Error("未找到对应的桥梁信息");
          }
          result.value = JSON.stringify(bridge, null, 2);
          currentData.value = bridge;
          uni.showToast({
            title: "获取成功",
            icon: "success"
          });
        } catch (error2) {
          formatAppLog("error", "at pages/test/test.vue:111", "获取桥梁数据失败:", error2);
          result.value = `错误: ${error2.message}`;
          uni.showToast({
            title: "获取桥梁信息失败",
            icon: "none"
          });
        }
      };
      const handleSaveTest = async () => {
        if (!currentData.value) {
          uni.showToast({
            title: "请先获取数据",
            icon: "none"
          });
          return;
        }
        try {
          const updatedData = {
            ...currentData.value,
            person: "ykx"
          };
          await saveData(updatedData);
          result.value = JSON.stringify(updatedData, null, 2);
          currentData.value = updatedData;
          uni.showToast({
            title: "更新保存成功",
            icon: "success"
          });
        } catch (error2) {
          result.value = `更新保存错误: ${error2.message}`;
          uni.showToast({
            title: "更新保存失败",
            icon: "none"
          });
        }
      };
      const __returned__ = { userId, bridgeListId, bridgeId, result, currentData, handleGetTaskList, handleGetBridgeList, handleGetBridge, handleSaveTest, ref: vue.ref, get getTaskList() {
        return getTaskList;
      }, get getBridgeList() {
        return getBridgeList;
      }, get getBridge() {
        return getBridge;
      }, get saveData() {
        return saveData;
      }, get trackReadPath() {
        return trackReadPath;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "input-group" }, [
        vue.createElementVNode("text", { class: "label" }, "用户 ID:"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.userId = $event),
            placeholder: "请输入用户 ID"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.userId]
        ])
      ]),
      vue.createElementVNode("view", { class: "input-group" }, [
        vue.createElementVNode("text", { class: "label" }, "桥梁列表 ID:"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.bridgeListId = $event),
            placeholder: "请输入桥梁列表 ID"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.bridgeListId]
        ])
      ]),
      vue.createElementVNode("view", { class: "input-group" }, [
        vue.createElementVNode("text", { class: "label" }, "桥梁 ID:"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.bridgeId = $event),
            placeholder: "请输入桥梁 ID"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.bridgeId]
        ])
      ]),
      vue.createElementVNode("view", { class: "button-group" }, [
        vue.createElementVNode("button", { onClick: $setup.handleGetTaskList }, "获取任务列表"),
        vue.createElementVNode("button", { onClick: $setup.handleGetBridgeList }, "获取桥梁列表"),
        vue.createElementVNode("button", { onClick: $setup.handleGetBridge }, "获取桥梁信息"),
        vue.createElementVNode("button", {
          onClick: $setup.handleSaveTest,
          type: "primary"
        }, "修改并保存")
      ]),
      vue.createElementVNode("view", { class: "result" }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($setup.result),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const PagesTestTest = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-727d09f0"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/test/test.vue"]]);
  function getJsonData(path) {
    formatAppLog("log", "at utils/file.js:3", "getData");
    return new Promise((resolve) => {
      plus.io.requestFileSystem(
        plus.io.PUBLIC_DOCUMENTS,
        (fs) => {
          fs.root.getFile(
            path,
            {
              //请求地址文件  '/storage/emulated/0/config.txt'为根目录  '/config.txt'为/storage/Android/data/io.dcloud.HBuilder（包名）/documents/config.js
              create: true
              //当文件不存在时创建
            },
            (fileEntry) => {
              fileEntry.file(function(file) {
                let fileReader = new plus.io.FileReader();
                fileReader.readAsText(file, "utf-8");
                fileReader.onerror = (e) => {
                  formatAppLog("log", "at utils/file.js:15", "获取文件失败", fileReader.error);
                  plus.nativeUI.toast("获取文件失败,请重启应用", {
                    background: "rgba(255, 255, 255, 0.6)"
                  });
                  return;
                };
                fileReader.onload = (e) => {
                  formatAppLog("log", "at utils/file.js:22", "读取文件成功");
                  let txtData = e.target.result;
                  resolve(txtData);
                };
              });
            },
            (error2) => {
              formatAppLog("log", "at utils/file.js:29", "2新建获取文件失败", error2);
              plus.nativeUI.toast("获取文件失败,请重启应用", {
                background: "rgba(255, 255, 255, 0.6)"
              });
              return;
            }
          );
        },
        (e) => {
          formatAppLog("log", "at utils/file.js:37", "1请求文件系统失败", e.message);
          plus.nativeUI.toast("请求系统失败,请重启应用", {
            background: "rgba(255, 255, 255, 0.6)"
          });
          return;
        }
      );
    });
  }
  function changeData(path, seek, writeData) {
    return new Promise((resolve) => {
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
        fs.root.getFile(
          path,
          {
            create: true
          },
          (fileEntry) => {
            fileEntry.file((file) => {
              fileEntry.createWriter(
                (writer) => {
                  formatAppLog("log", "at utils/file.js:56", fs.root.toURL(), "路径111");
                  plus.nativeUI.showWaiting("正在保存信息");
                  writer.seek(seek);
                  const writeDataTemp = JSON.stringify(
                    writeData,
                    null,
                    "\r"
                  ).replace(/[\r]/g, "");
                  writer.write(writeDataTemp);
                  writer.onerror = function() {
                    formatAppLog("log", "at utils/file.js:63", "4写入文件失败", writer.error.message);
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.toast("修改信息失败,请重新操作", {
                      background: "rgba(255, 255, 255, 0.6)"
                    });
                    return;
                  };
                  writer.onsuccess = function() {
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.toast("保存成功", {
                      // background: "rgba(255, 255, 255, 0.6)",
                    });
                    resolve("1");
                  };
                },
                (error2) => {
                  formatAppLog("log", "at utils/file.js:80", "3创建creactWriter失败", error2);
                  plus.nativeUI.toast("保存文件失败,请重新操作", {
                    // background: "#ffa38c",
                  });
                  return;
                }
              );
            });
          },
          (error2) => {
            formatAppLog("log", "at utils/file.js:89", "2获取文件失败", error2);
            plus.nativeUI.toast("保存文件失败,请重新操作", {
              // background: "#ffa38c",
            });
            return;
          }
        );
      }, (e) => {
        formatAppLog("log", "at utils/file.js:97", "1请求文件系统失败", e.message);
        plus.nativeUI.toast("请求系统失败,请重新操作", {
          // background: "#ffa38c",
        });
        return;
      });
    });
  }
  async function saveFile(url, file, newfilename) {
    await creatDirs(url);
    let isokm = moveDirectyOrFile(file, url + "/", newfilename);
    return isokm;
  }
  async function creatDirs(url) {
    let urllist = url.split("/");
    formatAppLog("log", "at utils/file.js:119", urllist);
    let u = "";
    for (let i = 0; i < urllist.length - 1; i++) {
      let j = i;
      if (i == 0) {
        u = urllist[i];
      } else {
        u = u + "/" + urllist[i];
      }
      formatAppLog("log", "at utils/file.js:129", i + "-------------------");
      formatAppLog("log", "at utils/file.js:130", u);
      formatAppLog("log", "at utils/file.js:131", urllist[j + 1]);
      await CreateNewDir(u, urllist[j + 1]);
    }
  }
  function moveDirectyOrFile(srcUrl, dstUrl, newName) {
    plus.io.resolveLocalFileSystemURL(srcUrl, function(srcEntry) {
      plus.io.resolveLocalFileSystemURL(dstUrl, function(dstEntry) {
        if (srcEntry.isDirectory) {
          srcEntry.moveTo(dstEntry, newName, function(entry) {
            return true;
          }, function(e) {
            return e;
          });
        } else {
          srcEntry.moveTo(dstEntry, newName, function(entry) {
            return true;
          }, function(e) {
            return e;
          });
        }
      }, function(e) {
        uni.showToast({
          title: "获取目标目录失败:" + e.message,
          duration: 2e3,
          icon: "none"
        });
      });
    }, function(e) {
      uni.showToast({
        title: "获取目录失败:" + e.message,
        duration: 2e3,
        icon: "none"
      });
    });
  }
  function CreateNewDir(url, dirName) {
    return new Promise((resolver, reject) => {
      plus.io.resolveLocalFileSystemURL(url, function(entry) {
        entry.getDirectory(dirName, {
          create: true,
          exclusive: false
        }, function(dir) {
          resolver(true);
        }, function(error2) {
          reject(error2.message);
          uni.showToast({
            title: dirName + "目录创建失败:" + error2.message,
            duration: 2e3,
            icon: "none"
          });
        });
      }, function(e) {
        reject(error.message);
        uni.showToast({
          title: "获取目录失败:" + e.message,
          duration: 2e3,
          icon: "none"
        });
      });
    });
  }
  function copyFileTo(url, newUrl, dirName, newName) {
    if (url.length >= 7 && "file://" == url.substring(0, 7)) {
      url = url.substring(7);
    }
    let tempUrl = url.substring(0, url.lastIndexOf("/"));
    let addUrl = newUrl + "/" + dirName;
    formatAppLog("log", "at utils/file.js:215", addUrl, tempUrl);
    if (addUrl == tempUrl) {
      return url;
    }
    formatAppLog("log", "at utils/file.js:219", newUrl, dirName, newName);
    return new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(url, async (entry) => {
        if (entry.isFile) {
          await CreateNewDir(newUrl, dirName);
          let u = await getDirsys(addUrl);
          entry.copyTo(u, newName, (en2) => {
            resolve(en2.fullPath);
          }, (e) => {
            formatAppLog("log", "at utils/file.js:228", e);
            reject("错误：复制时出现错误");
            uni.showModal({
              title: "错误",
              content: "复制时出现错误"
            });
          });
        } else {
          reject("错误：路径必须是文件");
          uni.showModal({
            title: "错误",
            content: "路径必须是文件"
          });
        }
      }, (e) => {
        formatAppLog("log", "at utils/file.js:243", e);
        reject(e);
        uni.showModal({
          title: "错误",
          content: "打开文件系统时出错"
        });
      });
    });
  }
  function getDirsys(url) {
    return new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(url, (entry) => {
        resolve(entry);
      }, (e) => {
        reject(e);
        formatAppLog("log", "at utils/file.js:259", e);
      });
    });
  }
  const _sfc_main$a = {
    __name: "fileIO",
    setup(__props, { expose: __expose }) {
      __expose();
      const fileData = vue.ref(null);
      const fileName = vue.ref("bridgeinfo");
      const write = () => {
        const pathUrl = plus.io.convertLocalFileSystemURL("_doc/") + "/3" + fileName.value + ".json";
        const data = [
          {
            "studentId": "S12345",
            "studentName": "Jane Smith",
            "department": "Computer Science",
            "year": 2024,
            "courses": [
              {
                "courseId": "CSE101",
                "courseName": "Introduction to Programming",
                "instructor": "Dr. Johnson",
                "creditHours": 3,
                "grade": "A"
              },
              {
                "courseId": "MAT101",
                "courseName": "Calculus I",
                "instructor": "Prof. Brown",
                "creditHours": 4,
                "grade": "B+"
              },
              {
                "courseId": "PHY101",
                "courseName": "Physics I",
                "instructor": "Dr. Lee",
                "creditHours": 3,
                "grade": "A-"
              }
            ],
            "gpa": 3.7,
            "academicStanding": "Good Standing",
            "transcriptUrl": "https://example.com/transcript/S12345"
          }
        ];
        changeData(pathUrl, 0, data);
      };
      const read = async () => {
        const path = plus.io.convertLocalFileSystemURL("_doc/") + fileName.value + ".json";
        const rawData = await getJsonData(path);
        fileData.value = JSON.parse(rawData);
        uni.showToast({
          title: "文件读取成功",
          icon: "none"
        });
      };
      const revise = async () => {
        const path = plus.io.convertLocalFileSystemURL("_downloads/") + fileName.value + ".json";
        const rawData = await getJsonData(path);
        fileData.value = JSON.parse(rawData);
        const item_1 = fileData.value[0];
        item_1.name = "ykx";
        const item_2 = fileData.value[1];
        item_2.gender = "女性";
        const updatedData = JSON.stringify(fileData.value);
        await changeData(path, 0, JSON.parse(updatedData));
      };
      const saveFileToNewLocation = async () => {
        const newFileName = "ykxtest";
        const newPath = "_doc/" + newFileName + ".json";
        const originalPath = plus.io.convertLocalFileSystemURL("_downloads/") + fileName.value + ".json";
        try {
          await saveFile(newPath, originalPath, newFileName);
          uni.showToast({
            title: "文件保存成功",
            icon: "success"
          });
        } catch (error2) {
          uni.showToast({
            title: "保存失败：" + error2,
            icon: "none"
          });
        }
      };
      const copyFile = async () => {
        try {
          const sourcePath = plus.io.convertLocalFileSystemURL("_downloads/") + fileName.value + ".json";
          const targetDir = "_doc";
          const dirName = "copied_files";
          const newFileName = "copied_" + fileName.value + ".json";
          const result = await copyFileTo(sourcePath, targetDir, dirName, newFileName);
          if (result) {
            uni.showToast({
              title: "文件复制成功",
              icon: "success"
            });
            formatAppLog("log", "at pages/fileIO/fileIO.vue:143", "复制后的文件路径：", result);
          }
        } catch (error2) {
          formatAppLog("error", "at pages/fileIO/fileIO.vue:146", "复制文件失败：", error2);
        }
      };
      const __returned__ = { fileData, fileName, write, read, revise, saveFileToNewLocation, copyFile, ref: vue.ref, get changeData() {
        return changeData;
      }, get getJsonData() {
        return getJsonData;
      }, get CreateNewDir() {
        return CreateNewDir;
      }, get saveFile() {
        return saveFile;
      }, get copyFileTo() {
        return copyFileTo;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("button", { onClick: $setup.write }, "写文件"),
        vue.createElementVNode("button", { onClick: $setup.read }, "读文件"),
        vue.createElementVNode("button", { onClick: $setup.revise }, "修改文件"),
        vue.createElementVNode("button", { onClick: $setup.saveFileToNewLocation }, "保存文件"),
        vue.createElementVNode("button", { onClick: $setup.copyFile }, "复制文件"),
        vue.createCommentVNode(" 渲染数据 "),
        $setup.fileData ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "data-container"
        }, [
          vue.createCommentVNode(" 循环遍历数组 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.fileData, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "data-item"
              }, [
                vue.createElementVNode("text", { class: "label" }, "姓名："),
                vue.createElementVNode(
                  "text",
                  { class: "value" },
                  vue.toDisplayString(item.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "label" }, "性别："),
                vue.createElementVNode(
                  "text",
                  { class: "value" },
                  vue.toDisplayString(item.gender),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "label" }, "生日："),
                vue.createElementVNode(
                  "text",
                  { class: "value" },
                  vue.toDisplayString(item.birthday),
                  1
                  /* TEXT */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesFileIOFileIO = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/fileIO/fileIO.vue"]]);
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
  const _sfc_main$9 = {
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
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$8 = {
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
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-4dd3c44b"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const message = "/static/image/message.svg";
  const setting = "/static/image/setting.svg";
  const _imports_0$2 = "/static/image/zjl.png";
  const _sfc_main$7 = {
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
            url: "/pages/bridge/bridge"
          });
        } else if (name === "隧道病害采集") {
          formatAppLog("log", "at pages/home/home.vue:102", "隧道病害采集功能待开发");
          uni.navigateTo({
            url: "/pages/detail/detail"
          });
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
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/home/home.vue"]]);
  const noMessage = "/static/image/noMessage.svg";
  const _sfc_main$6 = {
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
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesMessageMessage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/message/message.vue"]]);
  const _sfc_main$5 = {
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
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
  const infoItem = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-e152a2e4"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/components/infoItem.vue"]]);
  const _sfc_main$4 = {
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
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesUserinfoUserinfo = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/userinfo/userinfo.vue"]]);
  const _imports_0$1 = "/static/image/exclamation.svg";
  const _imports_1 = "/static/image/rightArrow.svg";
  const _sfc_main$3 = {
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
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesSettingSetting = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/setting/setting.vue"]]);
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
  const _sfc_main$2 = {
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-d78c88b7"], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.vue"]]);
  const _imports_0 = "/static/image/bridge.svg";
  const _sfc_main$1 = {
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
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesVersionInfoVersionInfo = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/VUE_code/uniapp/BuildingInspectorFrontend/pages/versionInfo/versionInfo.vue"]]);
  __definePage("pages/bridge/bridge", PagesBridgeBridge);
  __definePage("pages/List/List", PagesListList);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/test/test", PagesTestTest);
  __definePage("pages/fileIO/fileIO", PagesFileIOFileIO);
  __definePage("pages/home/home", PagesHomeHome);
  __definePage("pages/message/message", PagesMessageMessage);
  __definePage("pages/userinfo/userinfo", PagesUserinfoUserinfo);
  __definePage("pages/setting/setting", PagesSettingSetting);
  __definePage("pages/versionInfo/versionInfo", PagesVersionInfoVersionInfo);
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
