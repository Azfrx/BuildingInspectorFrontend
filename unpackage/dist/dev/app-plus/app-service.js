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
  function trackPath(path) {
    formatAppLog("log", "at utils/reviseJson.js:64", "设置文件路径:", path);
  }
  const DOC_BASE_PATH$1 = "_doc/";
  function getCurrentDateStr$1() {
    const now2 = /* @__PURE__ */ new Date();
    const year = now2.getFullYear().toString().slice(-2);
    const month = (now2.getMonth() + 1).toString().padStart(2, "0");
    const day = now2.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getUserDir$1(userName) {
    return `UD${getCurrentDateStr$1()}-${userName}`;
  }
  const FILE_NAMING$1 = {
    project: (userName) => `${getUserDir$1(userName)}/project/projects.json`,
    task: (userName, projectId2) => `${getUserDir$1(userName)}/project/${projectId2}/task.json`,
    property: (userName, buildingId) => `${getUserDir$1(userName)}/building/${buildingId}/property.json`,
    object: (userName, buildingId) => `${getUserDir$1(userName)}/building/${buildingId}/object.json`,
    disease: (userName, buildingId, yearId) => `${getUserDir$1(userName)}/building/${buildingId}/disease/${yearId}.json`,
    AllUserInfo: (userName) => `${getUserDir$1(userName)}/AllUserInfo.json`,
    diseaseImages: (userName, buildingId) => `${getUserDir$1(userName)}/building/${buildingId}/disease/images`,
    bridgeImages: (userName, buildingId) => `${getUserDir$1(userName)}/building/${buildingId}/images`,
    targetBridgeZip: (userName, buildingId) => `${getUserDir$1(userName)}/building/${buildingId}`,
    frontPhoto: (userName, buildingId) => `${getUserDir$1(userName)}/building/${buildingId}/frontPhoto.json`
  };
  async function setJsonData(path, data) {
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
            const jsonData = JSON.stringify(data, null, 2);
            writer.write(jsonData);
          }, reject);
        }, reject);
      }, reject);
    });
  }
  function setProject(userName, data) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.project(userName);
    trackPath(path);
    return setJsonData(path, data);
  }
  function setTask(userName, projectId2, data) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.task(userName, projectId2);
    trackPath(path);
    return setJsonData(path, data);
  }
  function setProperty(userName, buildingId, data) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.property(userName, buildingId);
    trackPath(path);
    return setJsonData(path, data);
  }
  function setObject(userName, buildingId, data) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.object(userName, buildingId);
    trackPath(path);
    return setJsonData(path, data);
  }
  function setDisease(userName, buildingId, yearId, data) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.disease(userName, buildingId, yearId);
    trackPath(path);
    return setJsonData(path, data);
  }
  function setAllUserInfo(userName, data) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.AllUserInfo(userName);
    trackPath(path);
    return setJsonData(path, data);
  }
  function saveDiseaseImages(userName, buildingId, tempImagePaths) {
    formatAppLog("log", "at utils/writeNew.js:94", "保存的图片tempImagePaths:", tempImagePaths);
    return new Promise((resolve, reject) => {
      const targetDirPath = DOC_BASE_PATH$1 + FILE_NAMING$1.diseaseImages(userName, buildingId);
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs2) => {
        fs2.root.getDirectory(targetDirPath, { create: true }, (dirEntry) => {
          const savePromises = tempImagePaths.map((tempPath, index) => {
            formatAppLog("log", "at utils/writeNew.js:105", "准备保存图片:", tempPath);
            return new Promise((resolveFile, rejectFile) => {
              const fileName = `disease_${Date.now()}_${index}.jpg`;
              const targetPath = `${targetDirPath}/${fileName}`;
              if (tempPath.startsWith("http://") || tempPath.startsWith("https://")) {
                formatAppLog("log", "at utils/writeNew.js:114", `开始下载网络图片: ${tempPath}`);
                const downloadTask2 = plus.downloader.createDownload(tempPath, {
                  filename: targetPath
                }, (d2, status) => {
                  if (status === 200) {
                    formatAppLog("log", "at utils/writeNew.js:119", `网络图片 ${index + 1} 下载成功:`, d2.filename);
                    const relativePath = `${buildingId}/disease/images/${fileName}`;
                    resolveFile(relativePath);
                  } else {
                    formatAppLog("error", "at utils/writeNew.js:123", `网络图片 ${index + 1} 下载失败:`, status);
                    rejectFile(new Error(`下载失败，状态码: ${status}`));
                  }
                });
                downloadTask2.start();
              } else {
                plus.io.resolveLocalFileSystemURL(tempPath, (fileEntry) => {
                  fileEntry.copyTo(dirEntry, fileName, (newFile) => {
                    formatAppLog("log", "at utils/writeNew.js:133", `图片 ${index + 1} 保存成功:`, newFile.fullPath);
                    const relativePath = `${buildingId}/disease/images/${fileName}`;
                    resolveFile(relativePath);
                  }, (error) => {
                    formatAppLog("error", "at utils/writeNew.js:137", `图片 ${index + 1} 保存失败:`, error);
                    rejectFile(error);
                  });
                }, (error) => {
                  formatAppLog("error", "at utils/writeNew.js:141", `无法访问临时文件 ${tempPath}:`, error);
                  rejectFile(error);
                });
              }
            });
          });
          formatAppLog("log", "at utils/writeNew.js:149", `开始等待 ${savePromises.length} 个图片保存完成`);
          Promise.all(savePromises).then((savedPaths) => {
            formatAppLog("log", "at utils/writeNew.js:152", "Promise.all 已完成，所有图片保存成功:", savedPaths);
            if (typeof wait !== "undefined" && wait && wait.close) {
              wait.close();
            }
            resolve(savedPaths);
          }).catch((error) => {
            formatAppLog("error", "at utils/writeNew.js:159", "Promise.all 出错，图片保存失败:", error);
            if (typeof wait !== "undefined" && wait && wait.close) {
              wait.close();
            }
            plus.nativeUI.toast("图片保存失败");
            reject(error);
          });
        }, (error) => {
          if (typeof wait !== "undefined" && wait && wait.close) {
            wait.close();
          }
          formatAppLog("error", "at utils/writeNew.js:170", "创建目录失败:", error);
          plus.nativeUI.toast("创建图片目录失败");
          reject(error);
        });
      }, (error) => {
        if (typeof wait !== "undefined" && wait && wait.close) {
          wait.close();
        }
        formatAppLog("error", "at utils/writeNew.js:178", "文件系统访问失败:", error);
        plus.nativeUI.toast("文件系统访问失败");
        reject(error);
      });
    });
  }
  function saveBridgeImages(userName, buildingId, tempImagePaths) {
    formatAppLog("log", "at utils/writeNew.js:186", "保存的图片tempImagePaths:", tempImagePaths);
    return new Promise((resolve, reject) => {
      const targetDirPath = DOC_BASE_PATH$1 + FILE_NAMING$1.bridgeImages(userName, buildingId);
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs2) => {
        fs2.root.getDirectory(targetDirPath, { create: true }, (dirEntry) => {
          const savePromises = tempImagePaths.map((tempPath, index) => {
            formatAppLog("log", "at utils/writeNew.js:198", "准备保存图片:", tempPath);
            return new Promise((resolveFile, rejectFile) => {
              const fileName = `bridge_${Date.now()}_${index}.jpg`;
              const targetPath = `${targetDirPath}/${fileName}`;
              if (tempPath.startsWith("http://") || tempPath.startsWith("https://")) {
                formatAppLog("log", "at utils/writeNew.js:207", `开始下载网络图片: ${tempPath}`);
                const downloadTask2 = plus.downloader.createDownload(tempPath, {
                  filename: targetPath
                }, (d2, status) => {
                  if (status === 200) {
                    formatAppLog("log", "at utils/writeNew.js:212", `网络图片 ${index + 1} 下载成功:`, d2.filename);
                    const relativePath = `${buildingId}/images/${fileName}`;
                    resolveFile(relativePath);
                  } else {
                    formatAppLog("error", "at utils/writeNew.js:216", `网络图片 ${index + 1} 下载失败:`, status);
                    rejectFile(new Error(`下载失败，状态码: ${status}`));
                  }
                });
                downloadTask2.start();
              } else {
                plus.io.resolveLocalFileSystemURL(tempPath, (fileEntry) => {
                  fileEntry.copyTo(dirEntry, fileName, (newFile) => {
                    formatAppLog("log", "at utils/writeNew.js:226", `图片 ${index + 1} 保存成功:`, newFile.fullPath);
                    const relativePath = `${buildingId}/images/${fileName}`;
                    resolveFile(relativePath);
                  }, (error) => {
                    formatAppLog("error", "at utils/writeNew.js:230", `图片 ${index + 1} 保存失败:`, error);
                    rejectFile(error);
                  });
                }, (error) => {
                  formatAppLog("error", "at utils/writeNew.js:234", `无法访问临时文件 ${tempPath}:`, error);
                  rejectFile(error);
                });
              }
            });
          });
          formatAppLog("log", "at utils/writeNew.js:242", `开始等待 ${savePromises.length} 个图片保存完成`);
          Promise.all(savePromises).then((savedPaths) => {
            formatAppLog("log", "at utils/writeNew.js:245", "Promise.all 已完成，所有图片保存成功:", savedPaths);
            if (typeof wait !== "undefined" && wait && wait.close) {
              wait.close();
            }
            resolve(savedPaths);
          }).catch((error) => {
            formatAppLog("error", "at utils/writeNew.js:252", "Promise.all 出错，图片保存失败:", error);
            if (typeof wait !== "undefined" && wait && wait.close) {
              wait.close();
            }
            plus.nativeUI.toast("图片保存失败");
            reject(error);
          });
        }, (error) => {
          if (typeof wait !== "undefined" && wait && wait.close) {
            wait.close();
          }
          formatAppLog("error", "at utils/writeNew.js:263", "创建目录失败:", error);
          plus.nativeUI.toast("创建图片目录失败");
          reject(error);
        });
      }, (error) => {
        if (typeof wait !== "undefined" && wait && wait.close) {
          wait.close();
        }
        formatAppLog("error", "at utils/writeNew.js:271", "文件系统访问失败:", error);
        plus.nativeUI.toast("文件系统访问失败");
        reject(error);
      });
    });
  }
  function saveBridgeImage(userName, buildingId, tempImagePath) {
    return new Promise(async (resolve, reject) => {
      try {
        const imageUrls = await saveBridgeImages(userName, buildingId, [tempImagePath]);
        if (imageUrls && imageUrls.length > 0) {
          resolve(imageUrls[0]);
        } else {
          reject(new Error("未能保存图片"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  function saveBridgeZip(userName, buildingId) {
    return new Promise((resolve, reject) => {
      const src = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH$1 + FILE_NAMING$1.targetBridgeZip(userName, buildingId));
      const zipfile = plus.io.convertLocalFileSystemURL(DOC_BASE_PATH$1 + getUserDir$1(userName) + "/building/" + buildingId);
      plus.zip.compress(
        src,
        zipfile,
        function() {
          formatAppLog("log", "at utils/writeNew.js:302", "Compress success!");
          resolve(zipfile + ".zip");
        },
        function(error) {
          formatAppLog("log", "at utils/writeNew.js:306", "Compress error:", error);
          reject(error);
        }
      );
    });
  }
  function setFrontPhoto(userName, buildingId, data) {
    const path = DOC_BASE_PATH$1 + FILE_NAMING$1.frontPhoto(userName, buildingId);
    return setJsonData(path, data);
  }
  var isVue2 = false;
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e2) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e2) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o2) {
    return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const USE_DEVTOOLS = IS_CLIENT;
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name2, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name2, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e2) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e2) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : (
    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
    typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
      // Use msSaveOrOpenBlob as a second approach
      "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
        // Fallback to using FileReader and a popup
        fileSaverSaveAs
      )
    )
  );
  function downloadSaveAs(blob, name2 = "download", opts) {
    const a2 = document.createElement("a");
    a2.download = name2;
    a2.rel = "noopener";
    if (typeof blob === "string") {
      a2.href = blob;
      if (a2.origin !== location.origin) {
        if (corsEnabled(a2.href)) {
          download(blob, name2, opts);
        } else {
          a2.target = "_blank";
          click(a2);
        }
      } else {
        click(a2);
      }
    } else {
      a2.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a2.href);
      }, 4e4);
      setTimeout(function() {
        click(a2);
      }, 0);
    }
  }
  function msSaveAs(blob, name2 = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name2, opts);
      } else {
        const a2 = document.createElement("a");
        a2.href = blob;
        a2.target = "_blank";
        setTimeout(function() {
          click(a2);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name2);
    }
  }
  function fileSaverSaveAs(blob, name2, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name2, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "🍍 " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o2) {
    return "_a" in o2 && "install" in o2;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia) {
    try {
      saveAs(new Blob([JSON.stringify(pinia.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia) {
    try {
      const open2 = getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      loadStoresState(pinia, JSON.parse(text));
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function loadStoresState(pinia, state) {
    for (const key in state) {
      const storeState = pinia.state.value[key];
      if (storeState) {
        Object.assign(storeState, state[key]);
      } else {
        pinia.state.value[key] = state[key];
      }
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event) => {
        data.keys.push(event.key);
        data.operations.push(event.type);
        data.oldValue[event.key] = event.oldValue;
        data.newValue[event.key] = event.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const { assign: assign$1 } = Object;
  const getStoreType = (id) => "🍍 " + id;
  function registerPiniaDevtools(app, pinia) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia 🍍`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia 🍍",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: 'Reset the state (with "$reset")',
            action: (nodeId) => {
              const store = pinia._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (typeof store.$reset !== "function") {
                toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : (
                // NOTE: workaround to unwrap transferred refs
                Object.keys(store.$state).reduce((state, key) => {
                  state[key] = store.$state[key];
                  return state;
                }, {})
              )
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia];
          stores = stores.concat(Array.from(pinia._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("🍍")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
        // useEmojis: {
        //   label: 'Use emojis in messages ⚡️',
        //   type: 'boolean',
        //   defaultValue: true,
        // },
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name: name2, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛫 " + name2,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name2),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "🛬 " + name2,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name2),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "💥 " + name2,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name2),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name2) => {
        vue.watch(() => vue.unref(store[name2]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name2,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
          groupId: activeAction
        };
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "⤵️";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "🧩";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🔥 " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames, wrapWithProxy) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = wrapWithProxy ? new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        }) : store;
        activeAction = _actionId;
        const retValue = actions[actionName].apply(trackedStore, arguments);
        activeAction = void 0;
        return retValue;
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    store._isOptionsAPI = !!options.state;
    patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
    const originalHotUpdate = store._hotUpdate;
    vue.toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
    };
    addStoreToDevtools(
      app,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(app, pinia);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
      pinia.use(devtoolsPlugin);
    }
    return pinia;
  }
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  const noop$1 = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o2) {
    return !!(vue.isRef(o2) && o2.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? (
        // use ref() to unwrap refs inside state TODO: check if this is still necessary
        vue.toRefs(vue.ref(state ? state() : {}).value)
      ) : vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name2) => {
        if (name2 in localState) {
          console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name2}" in store "${id}".`);
        }
        computedGetters[name2] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name2].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      () => {
        throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
      }
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name2, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: name2,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(assign(
      {
        _hmrPayload,
        _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    ));
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(setup)));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? (
            // @ts-expect-error
            options.getters[key]
          ) : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || // @ts-expect-error: same
            (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? (
            // special handling of options api
            vue.computed(() => {
              setActivePinia(pinia);
              return getter.call(store, store);
            })
          ) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (USE_DEVTOOLS) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        // avoid warning on devtools trying to display this property
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p2) => {
        Object.defineProperty(store, p2, assign({ value: store[p2] }, nonEnumerable));
      });
    }
    pinia._p.forEach((extender) => {
      if (USE_DEVTOOLS) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
      if (typeof id !== "string") {
        throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
      }
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      if (!activePinia) {
        throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
      }
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
        {
          useStore._pinia = pinia;
        }
      }
      const store = pinia._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
        hot._hotUpdate(newStore);
        delete pinia.state.value[hotId];
        pinia._s.delete(hotId);
      }
      if (IS_CLIENT) {
        const currentInstance = vue.getCurrentInstance();
        if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
        !hot) {
          const vm = currentInstance.proxy;
          const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
          cache[id] = store;
        }
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const userStore = defineStore("user", () => {
    const username = vue.ref("");
    const password = vue.ref("");
    const setUserInfo = (userinfo) => {
      username.value = userinfo.username;
      password.value = userinfo.password;
    };
    return {
      username,
      password,
      setUserInfo
    };
  });
  const idStore = defineStore("Id", () => {
    const userId = vue.ref("");
    const projectId2 = vue.ref("");
    const buildingId = vue.ref("");
    const currentDir = vue.ref("");
    const setUserId = (Id) => {
      userId.value = Id.value;
    };
    const setProjectId = (Id) => {
      projectId2.value = Id.value;
    };
    const setTaskId = (Id) => {
      taskId.value = Id.value;
    };
    const setBuildingId = (Id) => {
      buildingId.value = Id.value;
    };
    const setDir = (dir) => {
      currentDir.value = dir.value;
    };
    return {
      currentDir,
      userId,
      projectId: projectId2,
      buildingId,
      setUserId,
      setProjectId,
      setTaskId,
      setBuildingId,
      setDir
    };
  });
  const _imports_0$7 = "/static/image/loginLogo.jpg";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$C = {
    __name: "LoginPage",
    setup(__props, { expose: __expose }) {
      __expose();
      const username = vue.ref("");
      const password = vue.ref("");
      const userInfo = userStore();
      const rememberPassword2 = vue.ref(true);
      const showPassword = vue.ref(false);
      const loading = vue.ref(false);
      const idInfo = idStore();
      const toggleRememberPassword = () => {
        formatAppLog("log", "at pages/LoginPage/LoginPage.vue:72", "切换记住密码状态，当前状态:", rememberPassword2.value);
        rememberPassword2.value = !rememberPassword2.value;
        formatAppLog("log", "at pages/LoginPage/LoginPage.vue:74", "切换后的状态:", rememberPassword2.value);
      };
      vue.onMounted(async () => {
      });
      vue.onMounted(() => {
        const lastUsername = uni.getStorageSync("lastUsername");
        const lastPassword = uni.getStorageSync("lastPassword");
        if (lastUsername && lastPassword) {
          username.value = lastUsername;
          password.value = lastPassword;
        }
      });
      const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
      };
      const handleLogin = async () => {
        if (!username.value || !password.value) {
          uni.showToast({
            title: "请输入用户名和密码",
            icon: "none"
          });
          return;
        }
        loading.value = true;
        try {
          const response = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${username.value}&password=${password.value}`,
            method: "POST"
          });
          formatAppLog("log", "at pages/LoginPage/LoginPage.vue:132", "登录响应:", response.data);
          if (response.data.code === 0) {
            userInfo.setUserInfo({
              username: username.value,
              password: password.value
            });
            idInfo.setUserId(response.data.userId);
            formatAppLog("log", "at pages/LoginPage/LoginPage.vue:152", "登录成功，准备跳转");
            uni.navigateTo({
              url: "/pages/home/home"
            });
            formatAppLog("log", "at pages/LoginPage/LoginPage.vue:157", "记住密码状态:", rememberPassword2.value);
            if (rememberPassword2.value) {
              formatAppLog("log", "at pages/LoginPage/LoginPage.vue:159", "准备保存用户信息");
              let accountArray = uni.getStorageSync("accountArray") || null;
              if (!Array.isArray(accountArray)) {
                accountArray = [{
                  username: username.value,
                  password: password.value
                }];
              } else {
                accountArray.push({
                  username: username.value,
                  password: password.value
                });
              }
              uni.removeStorageSync("accountArray");
              uni.setStorageSync("accountArray", accountArray);
              uni.removeStorageSync("lastUsername");
              uni.removeStorageSync("lastPassword");
              uni.setStorageSync("lastUsername", username.value);
              uni.setStorageSync("lastPassword", password.value);
            } else {
              formatAppLog("log", "at pages/LoginPage/LoginPage.vue:180", "未勾选记住密码，下次不填充，但是本地缓存的账号密码不删除");
              uni.removeStorageSync("lastUsername");
              uni.removeStorageSync("lastPassword");
            }
          } else {
            uni.showToast({
              title: response.data.msg || "登录失败",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/LoginPage/LoginPage.vue:191", "离线登录");
          const accountArray = uni.getStorageSync("accountArray");
          let findAccount = false;
          for (let i2 = 0; i2 < accountArray.length; i2++) {
            if (accountArray[i2].username === username.value && accountArray[i2].password === password.value) {
              findAccount = true;
              break;
            }
          }
          if (findAccount) {
            formatAppLog("log", "at pages/LoginPage/LoginPage.vue:202", "离线登录成功，准备跳转");
            uni.navigateTo({
              url: "/pages/home/home"
            });
          } else {
            formatAppLog("log", "at pages/LoginPage/LoginPage.vue:208", "离线登录失败：用户名或密码不匹配");
            uni.showToast({
              title: "用户名或密码错误",
              icon: "none"
            });
          }
        } finally {
          loading.value = false;
        }
      };
      const __returned__ = { username, password, userInfo, rememberPassword: rememberPassword2, showPassword, loading, idInfo, toggleRememberPassword, togglePasswordVisibility, handleLogin, ref: vue.ref, onMounted: vue.onMounted, get setAllUserInfo() {
        return setAllUserInfo;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "loginPage" }, [
      vue.createElementVNode("view", { class: "logo" }, [
        vue.createElementVNode("view", { class: "logo-container" }, [
          vue.createElementVNode("image", {
            src: _imports_0$7,
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
              placeholder: "请输入用户名",
              "placeholder-style": "color: #cccccc"
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
                placeholder: "请输入密码",
                "placeholder-style": "color: #cccccc"
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
            vue.createElementVNode("label", null, [
              vue.createElementVNode("radio", {
                checked: $setup.rememberPassword,
                onClick: vue.withModifiers($setup.toggleRememberPassword, ["stop"])
              }, null, 8, ["checked"]),
              vue.createElementVNode("span", {
                onClick: vue.withModifiers($setup.toggleRememberPassword, ["stop"])
              }, "记住密码")
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
  const PagesLoginPageLoginPage = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$B], ["__scopeId", "data-v-314e8b73"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/LoginPage/LoginPage.vue"]]);
  const _imports_0$6 = "/static/image/loginLogo.png";
  const _imports_1$3 = "/static/image/bridgeTrue.png";
  const _imports_2$2 = "/static/image/settingTrue.png";
  const _sfc_main$B = {
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
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode("view", { class: "navbar" }, "湖北交投桥梁定检现场检测"),
        vue.createElementVNode("view", {
          id: "homePage",
          class: "homePage"
        }, [
          vue.createElementVNode("view", { class: "logo" }, [
            vue.createElementVNode("image", {
              src: _imports_0$6,
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
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$A], ["__scopeId", "data-v-07e72d3c"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/home/home.vue"]]);
  const _sfc_main$A = {
    __name: "LoadingMask",
    props: {
      text: {
        type: String,
        default: "加载中..."
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = {};
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "mask-container" }, [
      vue.createElementVNode("view", { class: "mask-loading-box" }, [
        vue.createElementVNode("view", { class: "spinner-css" }),
        vue.createElementVNode(
          "text",
          { class: "loading-text" },
          vue.toDisplayString($props.text),
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const __easycom_0$8 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$z], ["__scopeId", "data-v-66e20d01"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/LoadingMask/LoadingMask.vue"]]);
  const DOC_BASE_PATH = "_doc/";
  function getCurrentDateStr() {
    const now2 = /* @__PURE__ */ new Date();
    const year = now2.getFullYear().toString().slice(-2);
    const month = (now2.getMonth() + 1).toString().padStart(2, "0");
    const day = now2.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getUserDir(userName) {
    return `UD${getCurrentDateStr()}-${userName}`;
  }
  const FILE_NAMING = {
    project: (userName) => `${getUserDir(userName)}/project/projects.json`,
    task: (userName, projectId2) => `${getUserDir(userName)}/project/${projectId2}/task.json`,
    property: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/property.json`,
    disease: (userName, buildingId, yearId) => `${getUserDir(userName)}/building/${buildingId}/disease/${yearId}.json`,
    Object: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/object.json`,
    // 新增用户信息路径规则
    user: (userName) => `${getUserDir(userName)}/user.json`,
    historyYear: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/disease`,
    AllUserInfo: (userName) => `${getUserDir(userName)}/AllUserInfo.json`,
    frontPhoto: (userName, buildingId) => `${getUserDir(userName)}/building/${buildingId}/frontPhoto.json`
  };
  async function getJsonData(path) {
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
  function getProject(userName) {
    const path = DOC_BASE_PATH + FILE_NAMING.project(userName);
    trackPath(path);
    return getJsonData(path);
  }
  function getTask(userName, projectId2) {
    const path = DOC_BASE_PATH + FILE_NAMING.task(userName, projectId2);
    trackPath(path);
    return getJsonData(path);
  }
  function getProperty(userName, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.property(userName, buildingId);
    trackPath(path);
    return getJsonData(path);
  }
  function getDisease(userName, buildingId, yearId) {
    const path = DOC_BASE_PATH + FILE_NAMING.disease(userName, buildingId, yearId);
    trackPath(path);
    return getJsonData(path);
  }
  function getObject(userName, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.Object(userName, buildingId);
    trackPath(path);
    return getJsonData(path);
  }
  function getAllUserInfo(userName) {
    const path = DOC_BASE_PATH + FILE_NAMING.AllUserInfo(userName);
    trackPath(path);
    return getJsonData(path);
  }
  async function getHistoryYear(userName, buildingId) {
    const dirPath = DOC_BASE_PATH + FILE_NAMING.historyYear(userName, buildingId);
    formatAppLog("log", "at utils/readJsonNew.js:96", `历史病害目标目录: ${dirPath}`);
    const files = await listDirectoryFiles(dirPath);
    const yearFiles = files.filter(
      (file) => file.name && /^\d{4}\.json$/.test(file.name)
    );
    const years = yearFiles.map(
      (file) => file.name.split(".")[0]
      // 直接返回字符串
    );
    const currentYear = String((/* @__PURE__ */ new Date()).getFullYear());
    const filteredYears = years.filter((year) => year !== currentYear).sort((a2, b2) => {
      return Number(b2) - Number(a2);
    });
    formatAppLog("log", "at utils/readJsonNew.js:122", `找到历史年份: ${filteredYears.join(",")}`);
    return filteredYears;
  }
  function listDirectoryFiles(path) {
    return new Promise((resolve, reject) => {
      const fullPath = plus.io.convertLocalFileSystemURL(path);
      plus.io.resolveLocalFileSystemURL(fullPath, (entry) => {
        if (entry.isDirectory) {
          const directoryReader = entry.createReader();
          directoryReader.readEntries(
            (entries) => resolve(Array.from(entries)),
            reject
          );
        } else {
          reject(new Error("路径不是目录"));
        }
      }, reject);
    });
  }
  function readDiseaseImages(userName, buildingId, relativePaths) {
    if (Array.isArray(relativePaths)) {
      return relativePaths.map((path) => {
        const fullPath = DOC_BASE_PATH + getUserDir(userName) + "/building/" + path;
        return plus.io.convertLocalFileSystemURL(fullPath);
      });
    } else {
      const path = DOC_BASE_PATH + getUserDir(userName) + "/building/" + relativePaths;
      const imagePath = plus.io.convertLocalFileSystemURL(path);
      return imagePath;
    }
  }
  function readBridgeImage(userName, buildingId, relativePaths) {
    if (Array.isArray(relativePaths)) {
      return relativePaths.map((path) => {
        const fullPath = DOC_BASE_PATH + getUserDir(userName) + "/building/" + path;
        return plus.io.convertLocalFileSystemURL(fullPath);
      });
    } else {
      const path = DOC_BASE_PATH + getUserDir(userName) + "/building/" + relativePaths;
      const imagePath = plus.io.convertLocalFileSystemURL(path);
      return imagePath;
    }
  }
  function getAllFirstLevelDirs() {
    return new Promise((resolve, reject) => {
      const fullPath = DOC_BASE_PATH;
      plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs2) => {
        fs2.root.getDirectory(fullPath, { create: false }, (dirEntry) => {
          const directoryReader = dirEntry.createReader();
          directoryReader.readEntries((entries) => {
            const dirNames = entries.filter((entry) => entry.isDirectory).map((entry) => entry.name);
            resolve(dirNames);
          }, reject);
        }, (err) => {
          if (err.code === err.NOT_FOUND_ERR) {
            resolve([]);
          } else {
            reject(`无法访问目录: ${fullPath}`);
          }
        });
      }, reject);
    });
  }
  function getFrontPhoto(userName, buildingId) {
    const path = DOC_BASE_PATH + FILE_NAMING.frontPhoto(userName, buildingId);
    trackPath(path);
    return getJsonData(path);
  }
  function removeDiseaseImage(paths) {
    return new Promise((resolve, reject) => {
      try {
        if (Array.isArray(paths)) {
          const results = [];
          const errors = [];
          paths.forEach((absolutePath, index) => {
            plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
              entry.remove(
                () => {
                  formatAppLog("log", "at utils/readJsonNew.js:224", `成功删除图片: ${absolutePath}`);
                  results.push({
                    path: absolutePath,
                    success: true
                  });
                  if (results.length + errors.length === paths.length) {
                    resolve({
                      success: errors.length === 0,
                      results,
                      errors
                    });
                  }
                },
                (err) => {
                  formatAppLog("error", "at utils/readJsonNew.js:240", `删除图片失败: ${absolutePath}`, err);
                  errors.push({
                    path: absolutePath,
                    error: err.message || "删除失败"
                  });
                  if (results.length + errors.length === paths.length) {
                    resolve({
                      success: errors.length === 0,
                      results,
                      errors
                    });
                  }
                }
              );
            }, (err) => {
              formatAppLog("error", "at utils/readJsonNew.js:257", `无法解析文件路径: ${absolutePath}`, err);
              errors.push({
                path: absolutePath,
                error: "无法解析文件路径"
              });
              if (results.length + errors.length === paths.length) {
                resolve({
                  success: errors.length === 0,
                  results,
                  errors
                });
              }
            });
          });
        } else {
          const absolutePath = paths;
          plus.io.resolveLocalFileSystemURL(absolutePath, (entry) => {
            entry.remove(
              () => {
                formatAppLog("log", "at utils/readJsonNew.js:280", `成功删除图片: ${absolutePath}`);
                resolve({
                  success: true,
                  path: absolutePath
                });
              },
              (err) => {
                formatAppLog("error", "at utils/readJsonNew.js:287", `删除图片失败: ${absolutePath}`, err);
                reject({
                  success: false,
                  path: absolutePath,
                  error: err.message || "删除失败"
                });
              }
            );
          }, (err) => {
            formatAppLog("error", "at utils/readJsonNew.js:296", `无法解析文件路径: ${absolutePath}`, err);
            reject({
              success: false,
              path: absolutePath,
              error: "无法解析文件路径"
            });
          });
        }
      } catch (error) {
        formatAppLog("error", "at utils/readJsonNew.js:305", "删除图片时发生错误:", error);
        reject({
          success: false,
          error: error.message || "删除过程中发生错误"
        });
      }
    });
  }
  async function readDiseaseCommit(userName, buildingId, yearId) {
    try {
      const diseaseData = await getDisease(userName, buildingId, yearId);
      if (!diseaseData || !diseaseData.diseases || !Array.isArray(diseaseData.diseases)) {
        formatAppLog("log", "at utils/readJsonNew.js:321", "没有找到病害数据或数据格式不正确");
        return false;
      }
      const hasUncommittedDiseases = diseaseData.diseases.some((disease) => disease.commit_type === 1);
      formatAppLog("log", "at utils/readJsonNew.js:328", `检查未提交病害: ${hasUncommittedDiseases ? "有未提交病害" : "全部已提交"}`);
      return hasUncommittedDiseases;
    } catch (error) {
      formatAppLog("error", "at utils/readJsonNew.js:331", "检查病害提交状态时出错:", error);
      return false;
    }
  }
  var extendStatics = function(d2, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
      d3.__proto__ = b3;
    } || function(d3, b3) {
      for (var p2 in b3)
        if (Object.prototype.hasOwnProperty.call(b3, p2))
          d3[p2] = b3[p2];
    };
    return extendStatics(d2, b2);
  };
  function __extends(d2, b2) {
    if (typeof b2 !== "function" && b2 !== null)
      throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
    extendStatics(d2, b2);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  }
  function __values(o2) {
    var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o2[s2], i2 = 0;
    if (m2)
      return m2.call(o2);
    if (o2 && typeof o2.length === "number")
      return {
        next: function() {
          if (o2 && i2 >= o2.length)
            o2 = void 0;
          return { value: o2 && o2[i2++], done: !o2 };
        }
      };
    throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2)
      return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done)
        ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"]))
          m2.call(i2);
      } finally {
        if (e2)
          throw e2.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
        if (ar || !(i2 in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i2);
          ar[i2] = from[i2];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e2 = new Error(message);
    return e2.name = "SuppressedError", e2.error = error, e2.suppressed = suppressed, e2;
  };
  function isFunction(value) {
    return typeof value === "function";
  }
  function createErrorClass(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }
  var UnsubscriptionError = createErrorClass(function(_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i2) {
        return i2 + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
    };
  });
  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }
  var Subscription = function() {
    function Subscription2(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription2.prototype.unsubscribe = function() {
      var e_1, _a, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                  _a.call(_parentage_1);
              } finally {
                if (e_1)
                  throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e2) {
            errors = e2 instanceof UnsubscriptionError ? e2.errors : [e2];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return))
                _b.call(_finalizers_1);
            } finally {
              if (e_2)
                throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError(errors);
        }
      }
    };
    Subscription2.prototype.add = function(teardown) {
      var _a;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription2) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
        }
      }
    };
    Subscription2.prototype._hasParent = function(parent) {
      var _parentage = this._parentage;
      return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
    };
    Subscription2.prototype._addParent = function(parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription2.prototype._removeParent = function(parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove(_parentage, parent);
      }
    };
    Subscription2.prototype.remove = function(teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription2) {
        teardown._removeParent(this);
      }
    };
    Subscription2.EMPTY = function() {
      var empty = new Subscription2();
      empty.closed = true;
      return empty;
    }();
    return Subscription2;
  }();
  Subscription.EMPTY;
  function isSubscription(value) {
    return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }
  var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false
  };
  var timeoutProvider = {
    setTimeout: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function(handle) {
      var delegate = timeoutProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: void 0
  };
  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function() {
      {
        throw err;
      }
    });
  }
  function noop() {
  }
  function errorContext(cb) {
    {
      cb();
    }
  }
  var Subscriber = function(_super) {
    __extends(Subscriber2, _super);
    function Subscriber2(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber2.create = function(next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber2.prototype.next = function(value) {
      if (this.isStopped)
        ;
      else {
        this._next(value);
      }
    };
    Subscriber2.prototype.error = function(err) {
      if (this.isStopped)
        ;
      else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber2.prototype.complete = function() {
      if (this.isStopped)
        ;
      else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber2.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber2.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber2.prototype._error = function(err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber2.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber2;
  }(Subscription);
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = function() {
    function ConsumerObserver2(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver2.prototype.next = function(value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver2.prototype.error = function(err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver2.prototype.complete = function() {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver2;
  }();
  var SafeSubscriber = function(_super) {
    __extends(SafeSubscriber2, _super);
    function SafeSubscriber2(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
          error: error !== null && error !== void 0 ? error : void 0,
          complete: complete !== null && complete !== void 0 ? complete : void 0
        };
      } else {
        var context_1;
        if (_this && config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function() {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber2;
  }(Subscriber);
  function handleUnhandledError(error) {
    {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop
  };
  var observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();
  function identity(x) {
    return x;
  }
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }
  var Observable = function() {
    function Observable2(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable2.prototype.lift = function(operator) {
      var observable2 = new Observable2();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    };
    Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
      var _this = this;
      var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(function() {
        var _a = _this, operator = _a.operator, source = _a.source;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
      });
      return subscriber;
    };
    Observable2.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    };
    Observable2.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var subscriber = new SafeSubscriber({
          next: function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
        _this.subscribe(subscriber);
      });
    };
    Observable2.prototype._subscribe = function(subscriber) {
      var _a;
      return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable2.prototype[observable] = function() {
      return this;
    };
    Observable2.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      return pipeFromArray(operations)(this);
    };
    Observable2.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var value;
        _this.subscribe(function(x) {
          return value = x;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve(value);
        });
      });
    };
    Observable2.create = function(subscribe) {
      return new Observable2(subscribe);
    };
    return Observable2;
  }();
  function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
  }
  function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
  }
  var dateTimestampProvider = {
    now: function() {
      return Date.now();
    },
    delegate: void 0
  };
  var Action = function(_super) {
    __extends(Action2, _super);
    function Action2(scheduler, work) {
      return _super.call(this) || this;
    }
    Action2.prototype.schedule = function(state, delay) {
      return this;
    };
    return Action2;
  }(Subscription);
  var intervalProvider = {
    setInterval: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearInterval: function(handle) {
      var delegate = intervalProvider.delegate;
      return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
    },
    delegate: void 0
  };
  var AsyncAction = function(_super) {
    __extends(AsyncAction2, _super);
    function AsyncAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      _this.pending = false;
      return _this;
    }
    AsyncAction2.prototype.schedule = function(state, delay) {
      var _a;
      if (delay === void 0) {
        delay = 0;
      }
      if (this.closed) {
        return this;
      }
      this.state = state;
      var id = this.id;
      var scheduler = this.scheduler;
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, delay);
      }
      this.pending = true;
      this.delay = delay;
      this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay);
      return this;
    };
    AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay != null && this.delay === delay && this.pending === false) {
        return id;
      }
      if (id != null) {
        intervalProvider.clearInterval(id);
      }
      return void 0;
    };
    AsyncAction2.prototype.execute = function(state, delay) {
      if (this.closed) {
        return new Error("executing a cancelled action");
      }
      this.pending = false;
      var error = this._execute(state, delay);
      if (error) {
        return error;
      } else if (this.pending === false && this.id != null) {
        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
      }
    };
    AsyncAction2.prototype._execute = function(state, _delay) {
      var errored = false;
      var errorValue;
      try {
        this.work(state);
      } catch (e2) {
        errored = true;
        errorValue = e2 ? e2 : new Error("Scheduled action threw falsy error");
      }
      if (errored) {
        this.unsubscribe();
        return errorValue;
      }
    };
    AsyncAction2.prototype.unsubscribe = function() {
      if (!this.closed) {
        var _a = this, id = _a.id, scheduler = _a.scheduler;
        var actions = scheduler.actions;
        this.work = this.state = this.scheduler = null;
        this.pending = false;
        arrRemove(actions, this);
        if (id != null) {
          this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
        _super.prototype.unsubscribe.call(this);
      }
    };
    return AsyncAction2;
  }(Action);
  var Scheduler = function() {
    function Scheduler2(schedulerActionCtor, now2) {
      if (now2 === void 0) {
        now2 = Scheduler2.now;
      }
      this.schedulerActionCtor = schedulerActionCtor;
      this.now = now2;
    }
    Scheduler2.prototype.schedule = function(work, delay, state) {
      if (delay === void 0) {
        delay = 0;
      }
      return new this.schedulerActionCtor(this, work).schedule(state, delay);
    };
    Scheduler2.now = dateTimestampProvider.now;
    return Scheduler2;
  }();
  var AsyncScheduler = function(_super) {
    __extends(AsyncScheduler2, _super);
    function AsyncScheduler2(SchedulerAction, now2) {
      if (now2 === void 0) {
        now2 = Scheduler.now;
      }
      var _this = _super.call(this, SchedulerAction, now2) || this;
      _this.actions = [];
      _this._active = false;
      return _this;
    }
    AsyncScheduler2.prototype.flush = function(action) {
      var actions = this.actions;
      if (this._active) {
        actions.push(action);
        return;
      }
      var error;
      this._active = true;
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (action = actions.shift());
      this._active = false;
      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    return AsyncScheduler2;
  }(Scheduler);
  var asyncScheduler = new AsyncScheduler(AsyncAction);
  var async = asyncScheduler;
  function isScheduler(value) {
    return value && isFunction(value.schedule);
  }
  function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
  }
  function timer(dueTime, intervalOrScheduler, scheduler) {
    if (dueTime === void 0) {
      dueTime = 0;
    }
    if (scheduler === void 0) {
      scheduler = async;
    }
    var intervalDuration = -1;
    if (intervalOrScheduler != null) {
      if (isScheduler(intervalOrScheduler)) {
        scheduler = intervalOrScheduler;
      } else {
        intervalDuration = intervalOrScheduler;
      }
    }
    return new Observable(function(subscriber) {
      var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
      if (due < 0) {
        due = 0;
      }
      var n2 = 0;
      return scheduler.schedule(function() {
        if (!subscriber.closed) {
          subscriber.next(n2++);
          if (0 <= intervalDuration) {
            this.schedule(void 0, intervalDuration);
          } else {
            subscriber.complete();
          }
        }
      }, due);
    });
  }
  function interval(period, scheduler) {
    if (period === void 0) {
      period = 0;
    }
    if (scheduler === void 0) {
      scheduler = asyncScheduler;
    }
    if (period < 0) {
      period = 0;
    }
    return timer(period, period, scheduler);
  }
  async function getAllDataAndSetToLocal(projects, token, username) {
    for (const project of projects) {
      const projectId2 = project.id;
      const buildings = await getBuildingIdByProjectId(projectId2, token, username);
      for (const building of buildings) {
        const buildingId = building.buildingId;
        await propertyRequest(buildingId, token, username);
        await diseaseRequest(buildingId, token, username);
        await getStructureInfoByBuildingId(buildingId, token, username);
      }
    }
  }
  const getBuildingIdByProjectId = async (projectId2, token, username) => {
    try {
      const response = await uni.request({
        url: `http://60.205.13.156:8090/api/project/${projectId2}/task`,
        method: "GET",
        header: {
          "Authorization": `${token}`
        }
      });
      if (response.data.code === 0) {
        setTask(username, projectId2, response.data);
        return response.data.data.tasks;
      } else {
        uni.showToast({
          title: response.data.msg || "获取BuildingId失败",
          icon: "none"
        });
      }
    } catch (error) {
      formatAppLog("error", "at utils/request.js:50", "获取BuildingId失败:", error);
      uni.showToast({
        title: "获取BuildingId失败，请稍后重试",
        icon: "none"
      });
    }
  };
  async function propertyRequest(buildingId, token, username) {
    try {
      const response = await uni.request({
        url: `http://60.205.13.156:8090/api/building/${buildingId}/property`,
        method: "GET",
        header: {
          "Authorization": `${token}`
        }
      });
      if (response.data.code === 0) {
        const bridgedata = response.data.data;
        if (bridgedata.property.children[7].children[0].value !== "/") {
          try {
            const savedImageUrl = await saveBridgeImage(username, buildingId, bridgedata.property.children[7].children[0].value);
            if (savedImageUrl) {
              bridgedata.property.children[7].children[0].value = savedImageUrl;
            } else {
              formatAppLog("error", "at utils/request.js:79", "保存图片1失败: 返回的URL为空");
            }
          } catch (error) {
            formatAppLog("error", "at utils/request.js:82", "保存图片1出错:", error);
          }
        }
        if (bridgedata.property.children[7].children[1].value !== "/") {
          try {
            const savedImageUrl = await saveBridgeImage(username, buildingId, bridgedata.property.children[7].children[1].value);
            if (savedImageUrl) {
              bridgedata.property.children[7].children[1].value = savedImageUrl;
            } else {
              formatAppLog("error", "at utils/request.js:93", "保存图片2失败: 返回的URL为空");
            }
          } catch (error) {
            formatAppLog("error", "at utils/request.js:96", "保存图片2出错:", error);
          }
        }
        await setProperty(username, buildingId, bridgedata);
      } else {
        uni.showToast({
          title: response.data.msg || "获取桥梁卡片数据失败",
          icon: "none"
        });
      }
    } catch (error) {
      formatAppLog("error", "at utils/request.js:108", "获取桥梁卡片数据失败:", error);
      uni.showToast({
        title: "获取桥梁卡片数据失败，请稍后重试",
        icon: "none"
      });
    }
  }
  async function diseaseRequest(buildingId, token, username) {
    formatAppLog("log", "at utils/request.js:117", "开始从后端获取历史病害数据...........");
    try {
      const response = await uni.request({
        //桥梁id改为全局
        url: `http://60.205.13.156:8090/api/building/${buildingId}/disease`,
        method: "GET",
        header: {
          "Authorization": `${token}`
        }
      });
      formatAppLog("log", "at utils/request.js:127", "从后端接口获取到的历史病害数据:", response.data.data);
      if (response.data.code === 0) {
        for (const yearDisease of response.data.data) {
          const year = yearDisease.year;
          for (const disease of yearDisease.diseases) {
            if (disease.images && Array.isArray(disease.images)) {
              disease.images = await saveDiseaseImages(username, buildingId, disease.images);
            }
            if (disease.ADImgs && Array.isArray(disease.ADImgs)) {
              disease.ADImgs = await saveDiseaseImages(username, buildingId, disease.ADImgs);
            }
          }
          await setDisease(username, buildingId, year, yearDisease);
        }
      } else {
        uni.showToast({
          title: response.data.msg || "获取历史病害数据失败",
          icon: "none"
        });
      }
    } catch (error) {
      formatAppLog("error", "at utils/request.js:156", "获取历史病害数据失败:", error);
    }
  }
  const getStructureInfoByBuildingId = async (buildingId, token, username) => {
    try {
      const response = await uni.request({
        //寫死 因爲只有55是最新數據
        url: `http://60.205.13.156:8090/api/building/${buildingId}/object`,
        method: "GET",
        header: {
          "Authorization": `${token}`
        }
      });
      if (response.data.code === 0) {
        setObject(username, buildingId, response.data.data);
      } else {
        uni.showToast({
          title: response.data.msg || "获取桥梁构件数据失败",
          icon: "none"
        });
      }
    } catch (error) {
      formatAppLog("error", "at utils/request.js:180", "获取桥梁构件数据失败:", error);
      uni.showToast({
        title: "获取桥梁构件数据失败，请稍后重试",
        icon: "none"
      });
    }
  };
  const _imports_0$5 = "/static/image/RightOutline.svg";
  const _sfc_main$z = {
    __name: "bridge",
    setup(__props, { expose: __expose }) {
      __expose();
      function getCurrentDateStr2() {
        const now2 = /* @__PURE__ */ new Date();
        const year = now2.getFullYear().toString().slice(-2);
        const month = (now2.getMonth() + 1).toString().padStart(2, "0");
        const day = now2.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      function getUserDir2(userName) {
        return `UD${getCurrentDateStr2()}-${userName}`;
      }
      function extractUserNameFromDir(dirName) {
        if (dirName && dirName.startsWith("UD") && dirName.includes("-")) {
          const lastDashIndex = dirName.lastIndexOf("-");
          if (lastDashIndex !== -1 && lastDashIndex < dirName.length - 1) {
            return dirName.substring(lastDashIndex + 1);
          }
        }
        return "";
      }
      const currentYear = vue.ref((/* @__PURE__ */ new Date()).getFullYear());
      const initData = vue.ref(null);
      const infoData = vue.ref({});
      const userInfo = userStore();
      const idInfo = idStore();
      const dir = vue.ref("");
      const selectedYearIndex = vue.ref(0);
      const years = vue.ref([]);
      const tasksNumber = vue.ref(0);
      const loading = vue.ref(false);
      const init = async () => {
        try {
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          formatAppLog("log", "at pages/bridge/bridge.vue:137", "用户信息:", responseLogin.data);
          const token = responseLogin.data.token;
          infoData.value = responseLogin.data;
          if (userInfo.username) {
            dir.value = getUserDir2(userInfo.username);
            formatAppLog("log", "at pages/bridge/bridge.vue:145", "当前用户目录:", dir.value);
            idInfo.setDir(dir.value);
          }
          if (token) {
            const getData = async () => {
              try {
                const projectResponse = await uni.request({
                  url: "http://60.205.13.156:8090/api/project",
                  method: "GET",
                  header: {
                    "Authorization": `${token}`
                  }
                });
                formatAppLog("log", "at pages/bridge/bridge.vue:159", "获取到的项目数据:", projectResponse.data);
                const allProjects = projectResponse.data.data.projects || [];
                loading.value = true;
                await getAllDataAndSetToLocal(allProjects, token, userInfo.username);
                if (projectResponse.data.code === 0) {
                  await getProjectsTasks(allProjects, token);
                  const repeatYears = allProjects.map((item) => {
                    return item.year;
                  });
                  years.value = [...new Set(repeatYears)].sort((a2, b2) => b2 - a2);
                  formatAppLog("log", "at pages/bridge/bridge.vue:172", years.value);
                  initData.value = projectResponse.data;
                  const fileArray = await getAllFirstLevelDirs();
                  let userDirExists = false;
                  for (let i2 = 0; i2 < fileArray.length; i2++) {
                    const dir2 = fileArray[i2];
                    const name2 = extractUserNameFromDir(dir2);
                    if (name2 === userInfo.username) {
                      userDirExists = true;
                      break;
                    }
                  }
                  if (!userDirExists) {
                    await setProject(userInfo.username, initData.value);
                  } else {
                    formatAppLog("log", "at pages/bridge/bridge.vue:193", "用户目录已存在，跳过创建");
                  }
                } else {
                  formatAppLog("error", "at pages/bridge/bridge.vue:197", "API返回错误:", projectResponse.data.msg);
                  uni.showToast({
                    title: projectResponse.data.msg || "获取数据失败",
                    icon: "none"
                  });
                }
              } catch (error) {
                if (error.errMsg && (error.errMsg.includes("request:fail") || error.errMsg.includes("timeout"))) {
                  formatAppLog("error", "at pages/bridge/bridge.vue:207", "网络请求失败:", error);
                  uni.showToast({
                    title: "网络连接失败，请检查网络",
                    icon: "none"
                  });
                } else {
                  formatAppLog("error", "at pages/bridge/bridge.vue:213", "获取项目数据失败:", error);
                  if (!initData.value || !initData.value.data) {
                    uni.showToast({
                      title: "获取数据失败，请稍后重试",
                      icon: "none"
                    });
                  }
                }
              } finally {
                loading.value = false;
              }
            };
            await getData();
          } else {
            formatAppLog("error", "at pages/bridge/bridge.vue:229", "未获取到有效token");
            uni.showToast({
              title: "登录信息无效，请重新登录",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/bridge/bridge.vue:236", "初始化数据失败:", error);
        }
      };
      const filteredProjects = vue.computed(() => {
        if (!initData.value || !initData.value.data || !initData.value.data.projects) {
          return [];
        }
        return initData.value.data.projects.filter((project) => {
          return project.year == currentYear.value;
        });
      });
      const filteredProjectsTasks = vue.ref([]);
      const changeYear = (e2) => {
        selectedYearIndex.value = e2.detail.value;
        currentYear.value = years.value[selectedYearIndex.value];
        formatAppLog("log", "at pages/bridge/bridge.vue:262", `已选择${currentYear.value}年度，筛选出${filteredProjects.value.length}个项目`);
      };
      const back = () => {
        uni.navigateBack();
      };
      const goToList = (item) => {
        idInfo.setProjectId({
          value: item.id
        });
        uni.navigateTo({
          url: `/pages/List/List?projectId=${item.id}`
        });
      };
      const getProjectsTasks = async (projects, token) => {
        for (const item of projects) {
          const response = await uni.request({
            url: `http://60.205.13.156:8090/api/project/${item.id}/task`,
            method: "GET",
            header: {
              "Authorization": `${token}`
            }
          });
          filteredProjectsTasks.value.push({
            projectId: item.id,
            tastsNumber: response.data.data.tasks.length
          });
        }
      };
      const getTasksNumber = (id) => {
        return filteredProjectsTasks.value.find((item) => item.projectId === id).tastsNumber;
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
      const currentProject = vue.computed(() => {
        if (!initData.value || !initData.value.data || !initData.value.data.projects) {
          return null;
        }
        const project = initData.value.data.projects.find((p2) => p2.id == projectId.value);
        return project || initData.value.data.projects[0];
      });
      vue.onMounted(async () => {
        await init();
      });
      const handleRadioChange = (e2) => {
        const value = e2.detail.value;
        if (value === "remember") {
          rememberPassword.value = true;
          offlineLogin.value = false;
        } else if (value === "offline") {
          offlineLogin.value = true;
          rememberPassword.value = false;
        }
      };
      const __returned__ = { getCurrentDateStr: getCurrentDateStr2, getUserDir: getUserDir2, extractUserNameFromDir, currentYear, initData, infoData, userInfo, idInfo, dir, selectedYearIndex, years, tasksNumber, loading, init, filteredProjects, filteredProjectsTasks, changeYear, back, goToList, getProjectsTasks, getTasksNumber, getStatusText, currentProject, handleRadioChange, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed, get getAllUserInfo() {
        return getAllUserInfo;
      }, get getProject() {
        return getProject;
      }, get setProject() {
        return setProject;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      }, get getAllFirstLevelDirs() {
        return getAllFirstLevelDirs;
      }, get interval() {
        return interval;
      }, get getAllDataAndSetToLocal() {
        return getAllDataAndSetToLocal;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_LoadingMask = resolveEasycom(vue.resolveDynamicComponent("LoadingMask"), __easycom_0$8);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 内容区 "),
        vue.createElementVNode("view", { class: "container" }, [
          $setup.loading ? (vue.openBlock(), vue.createBlock(_component_LoadingMask, {
            key: 0,
            text: "正在加载完整数据..."
          })) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 信息卡片 "),
          vue.createElementVNode("view", { class: "info-card" }, [
            vue.createElementVNode("view", { class: "info-boxes" }, [
              vue.createElementVNode("view", { class: "info-box" }, [
                vue.createElementVNode("text", { class: "label" }, "检测单位"),
                vue.createElementVNode(
                  "text",
                  { class: "value" },
                  vue.toDisplayString($setup.infoData.userDept || "暂无数据"),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-box" }, [
                vue.createElementVNode("text", { class: "label" }, "检测人员"),
                vue.createElementVNode(
                  "text",
                  { class: "value" },
                  vue.toDisplayString($setup.infoData.userName || "暂无数据"),
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
                      vue.toDisplayString($setup.currentYear) + "年度",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("image", {
                      src: _imports_0$5,
                      mode: "scaleToFill"
                    })
                  ])
                ], 40, ["value", "range"])
              ])
            ])
          ]),
          vue.createCommentVNode(" 项目列表 "),
          vue.createElementVNode("view", { class: "bridge-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.filteredProjects, (item, index) => {
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
                        vue.toDisplayString(`0/${$setup.getTasksNumber(item.id)}` || "0/0"),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("image", {
                      src: _imports_0$5,
                      mode: "scaleToFill"
                    })
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const PagesBridgeBridge = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/bridge/bridge.vue"]]);
  const _sfc_main$y = {
    __name: "List",
    setup(__props, { expose: __expose }) {
      __expose();
      const back = () => {
        uni.navigateBack();
      };
      const projectInfo = vue.ref({});
      const searchText = vue.ref("");
      const bridges = vue.ref([]);
      const projectId2 = vue.ref(2);
      const initData = vue.ref(null);
      const initTaskData = vue.ref(null);
      const taskBridgeId = vue.ref(0);
      const userInfo = userStore();
      const idInfo = idStore();
      const getURLParams = () => {
        var _a;
        const pages2 = getCurrentPages();
        if (pages2.length > 0) {
          const currentPage = pages2[pages2.length - 1];
          const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
          if (options && options.projectId) {
            projectId2.value = options.projectId;
            formatAppLog("log", "at pages/List/List.vue:103", "接收到的项目ID:", projectId2.value);
          } else {
            formatAppLog("log", "at pages/List/List.vue:105", "未接收到项目ID，使用默认值:", projectId2.value);
          }
        }
      };
      const init = async () => {
        getURLParams();
        const responseLogin = await uni.request({
          url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
          method: "POST"
        });
        formatAppLog("log", "at pages/List/List.vue:119", "用户信息:", responseLogin.data);
        const token = responseLogin.data.token;
        const getData = async () => {
          try {
            const response = await uni.request({
              //Bug1 这里的项目id是写死的
              url: `http://60.205.13.156:8090/api/project/${projectId2.value}/task`,
              method: "GET",
              header: {
                "Authorization": `${token}`
              }
            });
            formatAppLog("log", "at pages/List/List.vue:132", "获取到的任务数据:", response.data);
            if (response.data.code === 0) {
              initTaskData.value = response.data;
              setTask(userInfo.username, projectId2.value, initTaskData.value);
            } else {
              uni.showToast({
                title: response.data.msg || "获取数据失败",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at pages/List/List.vue:156", "获取任务数据失败:", error);
            uni.showToast({
              title: "获取数据失败，请稍后重试",
              icon: "none"
            });
          }
        };
        await getData();
        projectInfo.value = await getProject(userInfo.username);
        formatAppLog("log", "at pages/List/List.vue:167", "项目数据111", projectInfo.value);
        formatAppLog("log", "at pages/List/List.vue:168", "currentProject的值:", currentProject.value.name);
      };
      vue.onMounted(() => {
        getURLParams();
        init();
      });
      const currentProject = vue.computed(() => {
        if (!projectInfo.value || !projectInfo.value.data || !projectInfo.value.data.projects) {
          return {};
        }
        const project = projectInfo.value.data.projects.find((p2) => p2.id == projectId2.value);
        return project || projectInfo.value.data.projects[0] || {};
      });
      const getBridgeIcon = (type) => {
        const icons = {
          "2": "/static/image/bridge1.png",
          //拱桥
          "1": "/static/image/bridge2.png",
          //梁式桥
          "4": "/static/image/bridge3.png",
          //斜拉桥
          "3": "/static/images/bridge4.png"
          //悬索桥
        };
        return icons[type] || icons["arch"];
      };
      const goToDetail = (bridge) => {
        idInfo.setBuildingId({ value: bridge.buildingId });
        uni.navigateTo({
          url: `/pages/bridge-disease/bridge-disease?bridgeId=${bridge.buildingId}`
        });
      };
      const filteredBridges = vue.computed(() => {
        if (!initTaskData.value || !initTaskData.value.data || !initTaskData.value.data.tasks) {
          return [];
        }
        if (!searchText.value) {
          return initTaskData.value.data.tasks;
        }
        const searchLower = searchText.value.toLowerCase();
        return initTaskData.value.data.tasks.filter((bridge) => {
          var _a, _b, _c, _d;
          return ((_a = bridge.building) == null ? void 0 : _a.name) && bridge.building.name.toLowerCase().includes(searchLower) || ((_b = bridge.building) == null ? void 0 : _b.buildingCode) && bridge.building.buildingCode.toLowerCase().includes(searchLower) || ((_c = bridge.building) == null ? void 0 : _c.routeName) && bridge.building.routeName.toLowerCase().includes(searchLower) || ((_d = bridge.building) == null ? void 0 : _d.bridgePileNumber) && bridge.building.bridgePileNumber.toLowerCase().includes(searchLower);
        });
      });
      const handleSearch = () => {
        formatAppLog("log", "at pages/List/List.vue:231", "搜索关键词:", searchText.value);
      };
      const __returned__ = { back, projectInfo, searchText, bridges, projectId: projectId2, initData, initTaskData, taskBridgeId, userInfo, idInfo, getURLParams, init, currentProject, getBridgeIcon, goToDetail, filteredBridges, handleSearch, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed, get getProject() {
        return getProject;
      }, get getTask() {
        return getTask;
      }, get setTask() {
        return setTask;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e2;
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 顶部信息卡片 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("view", { class: "content-box" }, [
          vue.createElementVNode(
            "view",
            { class: "title" },
            vue.toDisplayString($setup.currentProject.name || "项目名称"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "项目编号: " + vue.toDisplayString($setup.currentProject.code || ""),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "检测状态: " + vue.toDisplayString($setup.currentProject.status === "0" ? "未完成" : $setup.currentProject.status === "1" ? "已完成" : ""),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "项目单位: " + vue.toDisplayString(((_a = $setup.currentProject.ownerDept) == null ? void 0 : _a.deptName) || ""),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "检测数量: " + vue.toDisplayString(((_d = (_c = (_b = $setup.initTaskData) == null ? void 0 : _b.data) == null ? void 0 : _c.tasks) == null ? void 0 : _d.length) || 0),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "检测年度: " + vue.toDisplayString($setup.currentProject.year || "") + "年度",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              null,
              "起止时间: " + vue.toDisplayString($setup.currentProject.createTime || ""),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "检测单位: " + vue.toDisplayString(((_e2 = $setup.currentProject.dept) == null ? void 0 : _e2.deptName) || ""),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-row" }, [
            vue.createElementVNode(
              "text",
              null,
              "检测人员: " + vue.toDisplayString($setup.currentProject.inspectors ? $setup.currentProject.inspectors.map((inspector) => inspector.userName).join("/") : ""),
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
      vue.createCommentVNode(" 桥梁任务列表 "),
      vue.createElementVNode("view", { class: "bridge-list" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.filteredBridges, (bridge) => {
            var _a2, _b2, _c2, _d2;
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "bridge-item",
              key: bridge.id,
              onClick: ($event) => $setup.goToDetail(bridge)
            }, [
              vue.createElementVNode("view", { class: "bridge-icon" }, [
                vue.createElementVNode("image", {
                  src: $setup.getBridgeIcon(bridge.building.bridgeType),
                  mode: "aspectFit"
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode("view", { class: "bridge-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "bridge-code" },
                  vue.toDisplayString(bridge.building.buildingCode),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "bridge-name" },
                  vue.toDisplayString(bridge.building.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "bridge-location" },
                  vue.toDisplayString((((_a2 = bridge == null ? void 0 : bridge.building) == null ? void 0 : _a2.routeCode) || "") + "/" + (((_b2 = bridge == null ? void 0 : bridge.building) == null ? void 0 : _b2.routeName) || "") + "/" + (((_c2 = bridge == null ? void 0 : bridge.building) == null ? void 0 : _c2.bridgePileNumber) || "")),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "bridge-meta" }, [
                vue.createElementVNode("view", { class: "text-group" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "bridge-length" },
                    vue.toDisplayString(bridge.building.bridgeLength) + "m",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "bridge-class" },
                    vue.toDisplayString(((_d2 = bridge.building) == null ? void 0 : _d2.bridgeRank) || "/") + "类",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("image", { src: _imports_0$5 })
              ])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 无搜索结果提示 "),
      $setup.filteredBridges.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "no-result"
      }, [
        vue.createElementVNode("text", null, "未找到匹配的桥梁")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesListList = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/List/List.vue"]]);
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
  const _sfc_main$x = {
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
        let code = this.icons.find((v2) => v2.font_class === this.type);
        if (code) {
          return code.unicode;
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
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$7 = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
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
  const _sfc_main$w = {
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
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$7);
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
  const __easycom_0$6 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-a149a6be"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue"]]);
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
  const _sfc_main$v = {
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
      getSwipeAction(name2 = "uniSwipeAction") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name2) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
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
    block0(_sfc_main$v);
  if (typeof block1 === "function")
    block1(_sfc_main$v);
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-82a5303b"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item.vue"]]);
  const _sfc_main$u = {
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
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.renderSlot(_ctx.$slots, "default")
    ]);
  }
  const __easycom_1$4 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action.vue"]]);
  const _imports_0$4 = "/static/image/disease.png";
  const _sfc_main$t = {
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
          "developmentTrend": "稳定",
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
      },
      editMode: {
        type: String,
        default: "history"
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
      const editDisease = () => {
        const itemData = encodeURIComponent(JSON.stringify(props.item));
        uni.navigateTo({
          url: `/pages/add-disease/add-disease?mode=${props.editMode}&id=${props.item.id}&data=${itemData}`
        });
      };
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
                  id: props.item.id
                };
                formatAppLog("log", "at components/disease-item/disease-item.vue:221", "准备发送deleteDisease事件，ID:", props.item.id);
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
      const __returned__ = { props, emit, isSelected, swipeAction, swipeOptions, editDisease, handleSwipeClick, handleItemClick, closeSwipe, swipeChange, ref: vue.ref, watch: vue.watch, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_swipe_action_item = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action-item"), __easycom_0$5);
    const _component_uni_swipe_action = resolveEasycom(vue.resolveDynamicComponent("uni-swipe-action"), __easycom_1$4);
    return $props.editMode !== "history" ? (vue.openBlock(), vue.createBlock(
      _component_uni_swipe_action,
      {
        key: 0,
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
                vue.createElementVNode("view", {
                  class: "disease-content",
                  onClick: _cache[0] || (_cache[0] = ($event) => $props.selectMode ? null : $setup.editDisease())
                }, [
                  vue.createElementVNode("view", { class: "item-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "title" },
                      vue.toDisplayString($props.item.component.name) + "/" + vue.toDisplayString($props.item.type),
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
                          vue.toDisplayString($props.item.participateAssess === "1" ? "是" : "否") + "/" + vue.toDisplayString($props.item.participateAssess === "1" ? $props.item.level : "-"),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ]),
                  vue.createElementVNode("image", {
                    class: "image-icon",
                    src: _imports_0$4,
                    mode: "aspectFit"
                  })
                ])
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
    )) : (vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      { key: 1 },
      [
        vue.createCommentVNode(" 历史病害模式下不可滑动的版本 "),
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
          vue.createElementVNode("view", {
            class: "disease-content",
            onClick: _cache[1] || (_cache[1] = ($event) => $props.selectMode ? null : $setup.editDisease())
          }, [
            vue.createElementVNode("view", { class: "item-header" }, [
              vue.createElementVNode(
                "text",
                { class: "title" },
                vue.toDisplayString($props.item.component.name) + "/" + vue.toDisplayString($props.item.type),
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
                    vue.toDisplayString($props.item.participateAssess === "1" ? "是" : "否") + "/" + vue.toDisplayString($props.item.participateAssess === "1" ? $props.item.level : "-"),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ]),
            vue.createElementVNode("image", {
              class: "image-icon",
              src: _imports_0$4,
              mode: "aspectFit"
            })
          ])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    ));
  }
  const __easycom_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-e8b45b33"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/disease-item/disease-item.vue"]]);
  const _sfc_main$s = {
    __name: "current-disease",
    setup(__props, { expose: __expose }) {
      __expose();
      const tabItems = vue.ref(["上部结构", "下部结构", "桥面系", "附属设施"]);
      const activeTab = vue.ref(0);
      const searchText = vue.ref("");
      const showAddPopup = vue.ref(false);
      const diseaseList = vue.ref([]);
      const isJson = vue.ref(1);
      const userInfo = userStore();
      const submitButtonEnabled = vue.ref(false);
      const userId = vue.ref(20);
      const idStorageInfo = idStore();
      const buildingId = vue.ref(idStorageInfo.buildingId);
      const bridgeIdFromURL = vue.computed(() => {
        var _a;
        const pages2 = getCurrentPages();
        if (pages2.length > 0) {
          const currentPage = pages2[pages2.length - 1];
          const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
          if (options && options.bridgeId) {
            return options.bridgeId;
          }
        }
        return 0;
      });
      vue.watch(bridgeIdFromURL, (newVal) => {
        if (newVal) {
          buildingId.value = newVal;
        }
      });
      const readCurrentYearDiseaseDataByJson = async () => {
        try {
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const yearData = await getDisease(userInfo.username, buildingId.value, currentYear);
          formatAppLog("log", "at components/current-disease.vue:103", `获取到${currentYear}年病害数据:`, yearData);
          if (yearData && yearData.diseases && yearData.diseases.length > 0) {
            diseaseList.value = yearData.diseases;
          } else {
            diseaseList.value = [];
          }
          formatAppLog("log", "at components/current-disease.vue:112", "病害数据加载完成:", diseaseList.value);
        } catch (error) {
          isJson.value = 0;
          formatAppLog("error", "at components/current-disease.vue:115", "读取当前病害数据失败:", error);
        }
      };
      const loadCurrentYearDiseaseData = async () => {
        if (bridgeIdFromURL.value) {
          buildingId.value = bridgeIdFromURL.value;
        }
        await readCurrentYearDiseaseDataByJson();
        if (isJson.value === 0) {
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          formatAppLog("log", "at components/current-disease.vue:130", "用户信息:", responseLogin.data);
          const token = responseLogin.data.token;
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const getData = async () => {
            formatAppLog("log", "at components/current-disease.vue:134", "开始从后端获取当前病害数据...........");
            try {
              const response = await uni.request({
                //桥梁id改为全局
                url: `http://60.205.13.156:8090/api/building/${buildingId.value}/disease?year=${currentYear}`,
                method: "GET",
                header: {
                  "Authorization": `${token}`
                }
              });
              if (response.data.code === 0) {
                formatAppLog("log", "at components/current-disease.vue:145", "后端接口返回当前病害数据:", response.data.data);
                const saveData = response.data.data[0];
                formatAppLog("log", "at components/current-disease.vue:153", "准备保存的当前病害数据:", saveData);
                for (const disease of saveData.diseases) {
                  if (disease.images && Array.isArray(disease.images)) {
                    disease.images = await saveDiseaseImages(userInfo.username, buildingId.value, disease.images);
                  }
                  if (disease.ADImgs && Array.isArray(disease.ADImgs)) {
                    disease.ADImgs = await saveDiseaseImages(userInfo.username, buildingId.value, disease.ADImgs);
                  }
                }
                await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
              } else {
                uni.showToast({
                  title: response.data.msg || "获取数据失败",
                  icon: "none"
                });
              }
            } catch (error) {
              formatAppLog("error", "at components/current-disease.vue:176", "获取当前病害数据失败:", error);
              uni.showToast({
                title: "获取数据失败，请稍后重试",
                icon: "none"
              });
            }
          };
          await getData();
        }
        await readCurrentYearDiseaseDataByJson();
      };
      const addNewDiseaseData = async (newDisease) => {
        try {
          formatAppLog("log", "at components/current-disease.vue:191", "接收到新增病害数据:", newDisease);
          diseaseList.value.push(newDisease);
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const saveData = {
            year: parseInt(currentYear),
            buildingId: parseInt(buildingId.value),
            diseases: diseaseList.value
          };
          formatAppLog("log", "at components/current-disease.vue:205", "准备保存的数据:", saveData);
          await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
          formatAppLog("log", "at components/current-disease.vue:210", "新增病害数据保存成功");
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:216", "保存新增病害数据失败:", error);
          uni.showToast({
            title: "保存失败",
            icon: "none"
          });
        }
      };
      const handleDeleteDisease = async (deleteData) => {
        try {
          formatAppLog("log", "at components/current-disease.vue:227", "接收到删除病害事件:", deleteData);
          if (!deleteData || !deleteData.id) {
            formatAppLog("error", "at components/current-disease.vue:230", "删除数据无效");
            return;
          }
          const index = diseaseList.value.findIndex((item) => item.id == deleteData.id);
          if (index === -1) {
            formatAppLog("error", "at components/current-disease.vue:237", "未找到要删除的病害数据:", deleteData.id);
            return;
          }
          diseaseList.value[index].commit_type = 2;
          formatAppLog("log", "at components/current-disease.vue:243", `病害ID:${deleteData.id}已标记为删除(commit_type=2)`);
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const saveData = {
            year: parseInt(currentYear),
            buildingId: parseInt(buildingId.value),
            diseases: diseaseList.value
          };
          formatAppLog("log", "at components/current-disease.vue:255", "准备保存更新后的数据:", saveData);
          await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
          formatAppLog("log", "at components/current-disease.vue:260", "删除标记保存成功");
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:262", "保存删除失败:", error);
          uni.showToast({
            title: "删除失败",
            icon: "none"
          });
        }
      };
      const handleUpdateDisease = async (updatedDisease) => {
        try {
          formatAppLog("log", "at components/current-disease.vue:273", "接收到更新病害事件:", updatedDisease);
          if (!updatedDisease || !updatedDisease.id) {
            formatAppLog("error", "at components/current-disease.vue:276", "更新数据无效");
            return;
          }
          const index = diseaseList.value.findIndex((item) => item.id == updatedDisease.id);
          if (index === -1) {
            formatAppLog("error", "at components/current-disease.vue:283", "未找到要更新的病害数据:", updatedDisease.id);
            return;
          }
          diseaseList.value[index] = updatedDisease;
          formatAppLog("log", "at components/current-disease.vue:289", `病害ID:${updatedDisease.id}已更新`);
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const saveData = {
            year: parseInt(currentYear),
            buildingId: parseInt(buildingId),
            diseases: diseaseList.value
          };
          formatAppLog("log", "at components/current-disease.vue:301", "准备保存更新后的数据:", saveData);
          await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
          formatAppLog("log", "at components/current-disease.vue:306", "更新数据保存成功");
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:308", "保存更新数据失败:", error);
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
          if (item.commit_type === 2) {
            return false;
          }
          if (((_a = item.component) == null ? void 0 : _a.grandObjectName) !== selectedType) {
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
        formatAppLog("log", "at components/current-disease.vue:344", "搜索内容:", e2);
      };
      const changeTab = (index) => {
        activeTab.value = index;
      };
      const getTpyeItemCount = (type) => {
        return diseaseList.value.filter(
          (item) => {
            var _a;
            return ((_a = item.component) == null ? void 0 : _a.grandObjectName) === type && item.commit_type !== 2;
          }
        ).length;
      };
      const addNewDisease = () => {
        uni.navigateTo({
          url: `/pages/add-disease/add-disease`
        });
      };
      const submitZip = async () => {
        formatAppLog("log", "at components/current-disease.vue:366", "提交压缩文件,buildingId", buildingId.value);
        try {
          uni.showLoading({
            title: "正在提交",
            mask: true
          });
          const zipFilePath = await saveBridgeZip(userInfo.username, buildingId.value);
          formatAppLog("log", "at components/current-disease.vue:376", "压缩完成，文件路径:", zipFilePath);
          uni.showLoading({
            title: "正在提交",
            mask: true
          });
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          if (!responseLogin.data || !responseLogin.data.token) {
            uni.hideLoading();
            uni.showToast({
              title: "获取授权失败",
              icon: "none"
            });
            return;
          }
          const token = responseLogin.data.token;
          formatAppLog("log", "at components/current-disease.vue:399", "授权成功，开始上传文件", zipFilePath);
          uni.showLoading({
            title: "正在提交",
            mask: true
          });
          const response = await uni.uploadFile({
            url: `http://60.205.13.156:8090/api/upload/bridgeData`,
            filePath: zipFilePath,
            name: "file",
            // 后端接收文件的参数名（根据后端API文档确定）
            header: {
              "Authorization": token
            }
          });
          uni.hideLoading();
          formatAppLog("log", "at components/current-disease.vue:420", "后端响应:", response.data);
          let responseData;
          try {
            responseData = JSON.parse(response.data);
          } catch (e2) {
            responseData = response.data;
          }
          if (responseData && responseData.code === 0) {
            let hasChanges = false;
            diseaseList.value.forEach((disease) => {
              if (disease.commit_type === 1) {
                disease.commit_type = 0;
                hasChanges = true;
              }
            });
            if (hasChanges) {
              const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
              const saveData = {
                year: parseInt(currentYear),
                buildingId: parseInt(buildingId.value),
                diseases: diseaseList.value
              };
              try {
                await setDisease(userInfo.username, buildingId.value, currentYear, saveData);
                formatAppLog("log", "at components/current-disease.vue:456", "成功更新病害提交状态");
              } catch (error) {
                formatAppLog("error", "at components/current-disease.vue:458", "更新病害提交状态失败:", error);
              }
            }
            uni.showToast({
              title: "提交成功",
              icon: "success",
              duration: 2e3
            });
          } else {
            uni.showToast({
              title: (responseData == null ? void 0 : responseData.msg) || "提交失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at components/current-disease.vue:478", "提交数据错误:", error);
          uni.showToast({
            title: "提交数据出错，请稍后重试",
            icon: "none"
          });
        }
      };
      const checkUncommittedDiseases = async () => {
        try {
          const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
          const hasUncommittedDiseases = await readDiseaseCommit(userInfo.username, buildingId.value, currentYear);
          formatAppLog("log", "at components/current-disease.vue:491", "检查未提交病害结果:", hasUncommittedDiseases);
          submitButtonEnabled.value = hasUncommittedDiseases;
        } catch (error) {
          formatAppLog("error", "at components/current-disease.vue:494", "检查未提交病害出错:", error);
          submitButtonEnabled.value = false;
        }
      };
      vue.watch(diseaseList, async () => {
        formatAppLog("log", "at components/current-disease.vue:501", "diseaseList发生变化，检查未提交病害");
        await checkUncommittedDiseases();
      }, { deep: true });
      vue.onMounted(() => {
        formatAppLog("log", "at components/current-disease.vue:507", "current-disease组件挂载，准备加载数据");
        loadCurrentYearDiseaseData();
        uni.$on("addNewDisease", addNewDiseaseData);
        uni.$on("deleteDisease", handleDeleteDisease);
        uni.$on("updateDisease", handleUpdateDisease);
        uni.$on("getDiseasesOfType", (data) => {
          if (!data || !data.type || !data.callback) {
            formatAppLog("error", "at components/current-disease.vue:523", "获取同类型病害列表参数不完整");
            return;
          }
          const filteredList = diseaseList.value.filter(
            (item) => {
              var _a;
              return ((_a = item.component) == null ? void 0 : _a.grandObjectName) === data.type;
            }
          );
          formatAppLog("log", "at components/current-disease.vue:532", `获取${data.type}类型的病害列表，共${filteredList.length}条`);
          data.callback(filteredList);
        });
        checkUncommittedDiseases();
      });
      vue.onUnmounted(() => {
        uni.$off("addNewDisease");
        uni.$off("deleteDisease");
        uni.$off("updateDisease");
        uni.$off("getDiseasesOfType");
      });
      const __returned__ = { tabItems, activeTab, searchText, showAddPopup, diseaseList, isJson, userInfo, submitButtonEnabled, userId, idStorageInfo, buildingId, bridgeIdFromURL, readCurrentYearDiseaseDataByJson, loadCurrentYearDiseaseData, addNewDiseaseData, handleDeleteDisease, handleUpdateDisease, filteredDiseases, search, changeTab, getTpyeItemCount, addNewDisease, submitZip, checkUncommittedDiseases, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, watch: vue.watch, onUnmounted: vue.onUnmounted, get getDisease() {
        return getDisease;
      }, get readDiseaseCommit() {
        return readDiseaseCommit;
      }, get saveBridgeZip() {
        return saveBridgeZip;
      }, get saveDiseaseImages() {
        return saveDiseaseImages;
      }, get setDisease() {
        return setDisease;
      }, get setObject() {
        return setObject;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_search_bar = resolveEasycom(vue.resolveDynamicComponent("uni-search-bar"), __easycom_0$6);
    const _component_disease_item = resolveEasycom(vue.resolveDynamicComponent("disease-item"), __easycom_1$3);
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
          class: "submit-button",
          onClick: $setup.submitZip,
          disabled: !$setup.submitButtonEnabled
        }, " 提交", 8, ["disabled"]),
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
                editMode: "edit"
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
  const currentDisease = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-0ae3eae8"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/current-disease.vue"]]);
  const _sfc_main$r = /* @__PURE__ */ Object.assign({
    name: "history-disease"
  }, {
    __name: "history-disease",
    setup(__props, { expose: __expose }) {
      __expose();
      const userInfo = userStore();
      const tabItems = vue.ref([]);
      const activeTab = vue.ref(0);
      const searchText = vue.ref("");
      const isSelectMode = vue.ref(false);
      const showCopyButton = vue.ref(false);
      const selectedItems = vue.ref([]);
      const currentOpenSwipe = vue.ref(null);
      const diseaseItems = vue.ref(null);
      const diseaseMap = vue.ref({});
      const isJson = vue.ref(1);
      const userId = vue.ref(20);
      const idStorageInfo = idStore();
      const buildingId = vue.ref(0);
      const bridgeIdFromURL = vue.computed(() => {
        var _a;
        const pages2 = getCurrentPages();
        if (pages2.length > 0) {
          const currentPage = pages2[pages2.length - 1];
          const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
          if (options && options.bridgeId) {
            return options.bridgeId;
          }
        }
        return 0;
      });
      vue.watch(bridgeIdFromURL, (newVal) => {
        if (newVal) {
          buildingId.value = newVal;
        }
      });
      const readHistoryDiseaseData = async () => {
        try {
          const years = await getHistoryYear(userInfo.username, buildingId.value);
          tabItems.value = years;
          diseaseMap.value = {};
          for (const year of years) {
            try {
              const yearData = await getDisease(userInfo.username, buildingId.value, year);
              formatAppLog("log", "at components/history-disease.vue:144", `获取到${year}年病害数据:`, yearData);
              if (yearData && yearData.diseases && yearData.diseases.length > 0) {
                diseaseMap.value[yearData.year] = yearData.diseases;
              } else {
                diseaseMap.value[year] = [];
              }
            } catch (yearError) {
              formatAppLog("warn", "at components/history-disease.vue:153", `获取${year}年数据失败:`, yearError);
              diseaseMap.value[year] = [];
            }
          }
        } catch (error) {
          formatAppLog("error", "at components/history-disease.vue:159", "读取病害数据失败:", error);
          isJson.value = 0;
        }
      };
      const loadDiseaseData = async () => {
        if (bridgeIdFromURL.value) {
          buildingId.value = bridgeIdFromURL.value;
        }
        await readHistoryDiseaseData();
        if (isJson.value === 0) {
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          const token = responseLogin.data.token;
          const getData = async () => {
            formatAppLog("log", "at components/history-disease.vue:178", "开始从后端获取历史病害数据...........");
            try {
              const response = await uni.request({
                //桥梁id改为全局
                url: `http://60.205.13.156:8090/api/building/${buildingId.value}/disease`,
                method: "GET",
                header: {
                  "Authorization": `${token}`
                }
              });
              formatAppLog("log", "at components/history-disease.vue:188", "从后端接口获取到的历史病害数据:", response.data.data);
              if (response.data.code === 0) {
                for (const yearDisease of response.data.data) {
                  const year = yearDisease.year;
                  for (const disease of yearDisease.diseases) {
                    if (disease.images && Array.isArray(disease.images)) {
                      disease.images = await saveDiseaseImages(userInfo.username, buildingId.value, disease.images);
                    }
                    if (disease.ADImgs && Array.isArray(disease.ADImgs)) {
                      disease.ADImgs = await saveDiseaseImages(userInfo.username, buildingId.value, disease.ADImgs);
                    }
                  }
                  await setDisease(userInfo.username, buildingId.value, year, yearDisease);
                }
              } else {
                uni.showToast({
                  title: response.data.msg || "获取数据失败",
                  icon: "none"
                });
              }
            } catch (error) {
              formatAppLog("error", "at components/history-disease.vue:215", "获取历史病害数据失败:", error);
            }
          };
          await getData();
          await readHistoryDiseaseData();
        }
        formatAppLog("log", "at components/history-disease.vue:222", "历史病害数据", diseaseMap.value);
      };
      const expandedTypes = vue.reactive({
        "上部结构": true,
        "下部结构": true,
        "桥面系": true,
        "附属设施": true
      });
      const filteredDiseases = vue.computed(() => {
        const selectedYear = tabItems.value[activeTab.value];
        let list = diseaseMap.value[selectedYear] || [];
        if (searchText.value) {
          list = list.filter(
            (item) => {
              var _a, _b, _c, _d;
              return ((_a = item.description) == null ? void 0 : _a.includes(searchText.value)) || ((_b = item.type) == null ? void 0 : _b.includes(searchText.value)) || ((_d = (_c = item.component) == null ? void 0 : _c.grandObjectName) == null ? void 0 : _d.includes(searchText.value));
            }
          );
        }
        return list;
      });
      const deleteDisease = (itemId) => {
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这条病害记录吗？",
          success: (res) => {
            if (res.confirm) {
              const selectedYear = tabItems.value[activeTab.value];
              const list = diseaseMap.value[selectedYear] || [];
              const index = list.findIndex((item) => item.id === itemId);
              if (index !== -1) {
                list.splice(index, 1);
                diseaseMap.value[selectedYear] = [...list];
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
        formatAppLog("log", "at components/history-disease.vue:303", "当前选中项:", selectedItems.value);
      };
      const copyDisease = () => {
        if (selectedItems.value.length === 0) {
          uni.showToast({
            title: "请先选择要复制的病害",
            icon: "none"
          });
          return;
        }
        const selectedDiseases = [];
        Object.keys(diseaseMap.value).forEach((year) => {
          const yearDiseases = diseaseMap.value[year] || [];
          const selected = yearDiseases.filter((item) => selectedItems.value.includes(item.id));
          selectedDiseases.push(...selected);
        });
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
            disease.nature = "旧害";
            formatAppLog("log", "at components/history-disease.vue:350", "发送添加新病害事件给current-disease组件:", disease);
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
          formatAppLog("error", "at components/history-disease.vue:365", "复制病害失败:", error);
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
        formatAppLog("log", "at components/history-disease.vue:388", "搜索内容:", e2);
        closeAllSwipeActions();
        expandAllTypes();
      };
      const changeTab = (index) => {
        activeTab.value = index;
        closeAllSwipeActions();
        expandAllTypes();
      };
      const getYearItemCount = (year) => {
        var _a;
        return ((_a = diseaseMap.value[year]) == null ? void 0 : _a.length) || 0;
      };
      const getFilteredDiseasesByType = (type) => {
        const selectedYear = tabItems.value[activeTab.value];
        let list = diseaseMap.value[selectedYear] || [];
        list = list.filter((item) => {
          var _a, _b, _c;
          const grandObjectName = (_a = item.component) == null ? void 0 : _a.grandObjectName;
          if (grandObjectName !== type) {
            return false;
          }
          if (searchText.value) {
            return ((_b = item.description) == null ? void 0 : _b.includes(searchText.value)) || ((_c = item.type) == null ? void 0 : _c.includes(searchText.value));
          }
          return true;
        });
        return list;
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
        formatAppLog("log", "at components/history-disease.vue:466", "history-disease组件挂载，准备加载数据");
        loadDiseaseData();
        expandAllTypes();
      });
      const __returned__ = { userInfo, tabItems, activeTab, searchText, isSelectMode, showCopyButton, selectedItems, currentOpenSwipe, diseaseItems, diseaseMap, isJson, userId, idStorageInfo, buildingId, bridgeIdFromURL, readHistoryDiseaseData, loadDiseaseData, expandedTypes, filteredDiseases, deleteDisease, toggleSelectMode, handleItemSelect, copyDisease, formatDateTime, search, changeTab, getYearItemCount, getFilteredDiseasesByType, handleSwipeOpened, closeAllSwipeActions, closeSwipeExcept, toggleTypeExpand, expandAllTypes, ref: vue.ref, reactive: vue.reactive, computed: vue.computed, nextTick: vue.nextTick, watch: vue.watch, onMounted: vue.onMounted, get getDisease() {
        return getDisease;
      }, get getHistoryYear() {
        return getHistoryYear;
      }, get saveDiseaseImages() {
        return saveDiseaseImages;
      }, get setDisease() {
        return setDisease;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_search_bar = resolveEasycom(vue.resolveDynamicComponent("uni-search-bar"), __easycom_0$6);
    const _component_disease_item = resolveEasycom(vue.resolveDynamicComponent("disease-item"), __easycom_1$3);
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
                              editMode: "history",
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
  const historyDisease = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-5a6538ca"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/history-disease.vue"]]);
  const _sfc_main$q = {
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
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-33f748f2"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/administrative-identification-data/administrative-identification-data.vue"]]);
  const _sfc_main$p = {
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
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-43eb6c80"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/bridge-tech/bridge-tech.vue"]]);
  const _sfc_main$o = {
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
        return structureData.value.find((item) => item.name === "桥梁分孔(m)" || item.name === "桥梁分孔") || {};
      };
      const getStructuralSystemData = () => {
        return structureData.value.find((item) => item.name === "结构体系") || {};
      };
      const getStructureTypes = () => {
        const excludeNames = ["桥梁分孔", "桥梁分孔(m)", "结构体系"];
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
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-7725a9a4"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/bridge-structure/bridge-structure.vue"]]);
  const _sfc_main$n = {
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
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-a88cecdd"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/bridge-files/bridge-files.vue"]]);
  const _sfc_main$m = {
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
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-23cde231"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/bridge-inspection-history/bridge-inspection-history.vue"]]);
  const _sfc_main$l = {
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
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-277d9f90"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/maintenance-records/maintenance-records.vue"]]);
  const _sfc_main$k = {
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
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-429be1cf"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/notes/notes.vue"]]);
  const _sfc_main$j = {
    __name: "other-info",
    props: {
      data: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const userInfo = userStore();
      const idStorageInfo = idStore();
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
        formatAppLog("log", "at components/other-info/other-info.vue:75", "图片value", value);
        if (!value || value === "/") {
          return "/static/image/disease.png";
        }
        return readBridgeImage(userInfo.username, idStorageInfo.buildingId, value);
      };
      const clickImg = (item) => {
        const url = getImageUrl(item.value);
        uni.previewImage({
          urls: [url],
          current: 0
        });
      };
      const __returned__ = { userInfo, idStorageInfo, props, dataArray, imageItems, textItems, getImageUrl, clickImg, ref: vue.ref, computed: vue.computed, get readBridgeImage() {
        return readBridgeImage;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-2aa7c852"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/other-info/other-info.vue"]]);
  const _sfc_main$i = {
    __name: "bridge-archive",
    emits: ["dataLoaded"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const emit = __emit;
      const userInfo = userStore();
      const bridgeArchive2 = vue.ref({
        children: [{}, {}, {}, {}, {}, {}, {}, {}]
        // 初始化8个空对象，对应8个标签页
      });
      const tabItems = vue.ref(["行政识别数据", "桥梁技术指标", "桥梁结构信息", "桥梁档案资料", "桥梁检测评定历史", "养护处置记录", "需要说明的事项", "其他"]);
      const activeTab = vue.ref(0);
      const userId = vue.ref(20);
      const buildingId = vue.ref(0);
      const isJson = vue.ref(1);
      const dataLoaded = vue.ref(false);
      const idStorageInfo = idStore();
      const bridgeIdFromURL = vue.computed(() => {
        var _a;
        const pages2 = getCurrentPages();
        if (pages2.length > 0) {
          const currentPage = pages2[pages2.length - 1];
          const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
          if (options && options.bridgeId) {
            return options.bridgeId;
          }
        }
        return 0;
      });
      vue.watch(bridgeIdFromURL, (newVal) => {
        if (newVal) {
          buildingId.value = newVal;
        }
      });
      const changeTab = (index) => {
        activeTab.value = index;
      };
      const readPropetryDataByJson = async () => {
        if (bridgeIdFromURL.value) {
          buildingId.value = bridgeIdFromURL.value;
        }
        try {
          const data = await getProperty(userInfo.username, buildingId.value);
          formatAppLog("log", "at components/bridge-archive.vue:109", "获取到桥梁档案数据:", data);
          if (data && Object.keys(data).length > 0) {
            bridgeArchive2.value = data.property;
          }
        } catch (error) {
          formatAppLog("error", "at components/bridge-archive.vue:116", "本地json获取桥梁档案数据失败:", error);
          isJson.value = 0;
        }
      };
      const loadDiseaseData = async () => {
        await readPropetryDataByJson();
        if (isJson.value === 0) {
          formatAppLog("log", "at components/bridge-archive.vue:127", "开始从后端接口获取桥梁卡片数据...");
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          const token = responseLogin.data.token;
          const getData = async () => {
            try {
              const response = await uni.request({
                url: `http://60.205.13.156:8090/api/building/${buildingId.value}/property`,
                method: "GET",
                header: {
                  "Authorization": `${token}`
                }
              });
              formatAppLog("log", "at components/bridge-archive.vue:142", "从后端接口获取到的桥梁卡片数据:", response.data.data);
              if (response.data.code === 0) {
                const bridgedata = response.data.data;
                if (bridgedata.property.children[7].children[0].value !== "/") {
                  try {
                    const savedImageUrl = await saveBridgeImage(userInfo.username, buildingId.value, bridgedata.property.children[7].children[0].value);
                    if (savedImageUrl) {
                      bridgedata.property.children[7].children[0].value = savedImageUrl;
                    } else {
                      formatAppLog("error", "at components/bridge-archive.vue:154", "保存图片1失败: 返回的URL为空");
                    }
                  } catch (error) {
                    formatAppLog("error", "at components/bridge-archive.vue:157", "保存图片1出错:", error);
                  }
                }
                if (bridgedata.property.children[7].children[1].value !== "/") {
                  try {
                    const savedImageUrl = await saveBridgeImage(userInfo.username, buildingId.value, bridgedata.property.children[7].children[1].value);
                    if (savedImageUrl) {
                      bridgedata.property.children[7].children[1].value = savedImageUrl;
                    } else {
                      formatAppLog("error", "at components/bridge-archive.vue:167", "保存图片2失败: 返回的URL为空");
                    }
                  } catch (error) {
                    formatAppLog("error", "at components/bridge-archive.vue:170", "保存图片2出错:", error);
                  }
                }
                formatAppLog("log", "at components/bridge-archive.vue:175", "保存后的桥梁卡片数据:", bridgedata);
                await setProperty(userInfo.username, buildingId.value, bridgedata);
              } else {
                uni.showToast({
                  title: response.data.msg || "获取数据失败",
                  icon: "none"
                });
              }
            } catch (error) {
              formatAppLog("error", "at components/bridge-archive.vue:185", "获取桥梁卡片数据失败:", error);
              uni.showToast({
                title: "获取数据失败，请稍后重试",
                icon: "none"
              });
            }
          };
          await getData();
          await readPropetryDataByJson();
        }
        dataLoaded.value = true;
        formatAppLog("log", "at components/bridge-archive.vue:200", "桥梁卡片数据加载完成，发送dataLoaded事件");
        emit("dataLoaded", true);
      };
      vue.onMounted(async () => {
        await loadDiseaseData();
      });
      __expose({
        dataLoaded
      });
      const __returned__ = { emit, userInfo, bridgeArchive: bridgeArchive2, tabItems, activeTab, userId, buildingId, isJson, dataLoaded, idStorageInfo, bridgeIdFromURL, changeTab, readPropetryDataByJson, loadDiseaseData, ref: vue.ref, watch: vue.watch, onMounted: vue.onMounted, computed: vue.computed, get getDisease() {
        return getDisease;
      }, get getHistoryYear() {
        return getHistoryYear;
      }, get getProperty() {
        return getProperty;
      }, get saveBridgeImages() {
        return saveBridgeImages;
      }, get setProperty() {
        return setProperty;
      }, get saveBridgeImage() {
        return saveBridgeImage;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_administrative_identification_data = resolveEasycom(vue.resolveDynamicComponent("administrative-identification-data"), __easycom_0$4);
    const _component_bridge_tech = resolveEasycom(vue.resolveDynamicComponent("bridge-tech"), __easycom_1$2);
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
  const bridgeArchive = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-8bcf311a"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/bridge-archive.vue"]]);
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
    _animateRun(styles = {}, config2 = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, {
          styles,
          ...config2
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
          config: config2
        } = obj;
        this._animateRun(styles, config2).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config2 = {}) {
      this.animation.step(config2);
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
  const _sfc_main$h = {
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
      step(obj, config2 = {}) {
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
        this.animation.step(config2);
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
      toLine(name2) {
        return name2.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$g = {
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
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0$3);
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
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-4dd3c44b"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  function obj2strClass(obj) {
    let classess = "";
    for (let key in obj) {
      const val = obj[key];
      if (val) {
        classess += `${key} `;
      }
    }
    return classess;
  }
  function obj2strStyle(obj) {
    let style = "";
    for (let key in obj) {
      const val = obj[key];
      style += `${key}:${val};`;
    }
    return style;
  }
  const _sfc_main$f = {
    name: "uni-easyinput",
    emits: [
      "click",
      "iconClick",
      "update:modelValue",
      "input",
      "focus",
      "blur",
      "confirm",
      "clear",
      "eyes",
      "change",
      "keyboardheightchange"
    ],
    model: {
      prop: "modelValue",
      event: "update:modelValue"
    },
    options: {
      virtualHost: true
    },
    inject: {
      form: {
        from: "uniForm",
        default: null
      },
      formItem: {
        from: "uniFormItem",
        default: null
      }
    },
    props: {
      name: String,
      value: [Number, String],
      modelValue: [Number, String],
      type: {
        type: String,
        default: "text"
      },
      clearable: {
        type: Boolean,
        default: true
      },
      autoHeight: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: " "
      },
      placeholderStyle: String,
      focus: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: [Number, String],
        default: 140
      },
      confirmType: {
        type: String,
        default: "done"
      },
      clearSize: {
        type: [Number, String],
        default: 24
      },
      inputBorder: {
        type: Boolean,
        default: true
      },
      prefixIcon: {
        type: String,
        default: ""
      },
      suffixIcon: {
        type: String,
        default: ""
      },
      trim: {
        type: [Boolean, String],
        default: false
      },
      cursorSpacing: {
        type: Number,
        default: 0
      },
      passwordIcon: {
        type: Boolean,
        default: true
      },
      adjustPosition: {
        type: Boolean,
        default: true
      },
      primaryColor: {
        type: String,
        default: "#2979ff"
      },
      styles: {
        type: Object,
        default() {
          return {
            color: "#333",
            backgroundColor: "#fff",
            disableColor: "#F7F6F6",
            borderColor: "#e5e5e5"
          };
        }
      },
      errorMessage: {
        type: [String, Boolean],
        default: ""
      }
    },
    data() {
      return {
        focused: false,
        val: "",
        showMsg: "",
        border: false,
        isFirstBorder: false,
        showClearIcon: false,
        showPassword: false,
        focusShow: false,
        localMsg: "",
        isEnter: false
        // 用于判断当前是否是使用回车操作
      };
    },
    computed: {
      // 输入框内是否有值
      isVal() {
        const val = this.val;
        if (val || val === 0) {
          return true;
        }
        return false;
      },
      msg() {
        return this.localMsg || this.errorMessage;
      },
      // 因为uniapp的input组件的maxlength组件必须要数值，这里转为数值，用户可以传入字符串数值
      inputMaxlength() {
        return Number(this.maxlength);
      },
      // 处理外层样式的style
      boxStyle() {
        return `color:${this.inputBorder && this.msg ? "#e43d33" : this.styles.color};`;
      },
      // input 内容的类和样式处理
      inputContentClass() {
        return obj2strClass({
          "is-input-border": this.inputBorder,
          "is-input-error-border": this.inputBorder && this.msg,
          "is-textarea": this.type === "textarea",
          "is-disabled": this.disabled,
          "is-focused": this.focusShow
        });
      },
      inputContentStyle() {
        const focusColor = this.focusShow ? this.primaryColor : this.styles.borderColor;
        const borderColor = this.inputBorder && this.msg ? "#dd524d" : focusColor;
        return obj2strStyle({
          "border-color": borderColor || "#e5e5e5",
          "background-color": this.disabled ? this.styles.disableColor : this.styles.backgroundColor
        });
      },
      // input右侧样式
      inputStyle() {
        const paddingRight = this.type === "password" || this.clearable || this.prefixIcon ? "" : "10px";
        return obj2strStyle({
          "padding-right": paddingRight,
          "padding-left": this.prefixIcon ? "" : "10px"
        });
      }
    },
    watch: {
      value(newVal) {
        if (newVal === null) {
          this.val = "";
          return;
        }
        this.val = newVal;
      },
      modelValue(newVal) {
        if (newVal === null) {
          this.val = "";
          return;
        }
        this.val = newVal;
      },
      focus(newVal) {
        this.$nextTick(() => {
          this.focused = this.focus;
          this.focusShow = this.focus;
        });
      }
    },
    created() {
      this.init();
      if (this.form && this.formItem) {
        this.$watch("formItem.errMsg", (newVal) => {
          this.localMsg = newVal;
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.focused = this.focus;
        this.focusShow = this.focus;
      });
    },
    methods: {
      /**
       * 初始化变量值
       */
      init() {
        if (this.value || this.value === 0) {
          this.val = this.value;
        } else if (this.modelValue || this.modelValue === 0 || this.modelValue === "") {
          this.val = this.modelValue;
        } else {
          this.val = "";
        }
      },
      /**
       * 点击图标时触发
       * @param {Object} type
       */
      onClickIcon(type) {
        this.$emit("iconClick", type);
      },
      /**
       * 显示隐藏内容，密码框时生效
       */
      onEyes() {
        this.showPassword = !this.showPassword;
        this.$emit("eyes", this.showPassword);
      },
      /**
       * 输入时触发
       * @param {Object} event
       */
      onInput(event) {
        let value = event.detail.value;
        if (this.trim) {
          if (typeof this.trim === "boolean" && this.trim) {
            value = this.trimStr(value);
          }
          if (typeof this.trim === "string") {
            value = this.trimStr(value, this.trim);
          }
        }
        if (this.errMsg)
          this.errMsg = "";
        this.val = value;
        this.$emit("input", value);
        this.$emit("update:modelValue", value);
      },
      /**
       * 外部调用方法
       * 获取焦点时触发
       * @param {Object} event
       */
      onFocus() {
        this.$nextTick(() => {
          this.focused = true;
        });
        this.$emit("focus", null);
      },
      _Focus(event) {
        this.focusShow = true;
        this.$emit("focus", event);
      },
      /**
       * 外部调用方法
       * 失去焦点时触发
       * @param {Object} event
       */
      onBlur() {
        this.focused = false;
        this.$emit("blur", null);
      },
      _Blur(event) {
        event.detail.value;
        this.focusShow = false;
        this.$emit("blur", event);
        if (this.isEnter === false) {
          this.$emit("change", this.val);
        }
        if (this.form && this.formItem) {
          const { validateTrigger } = this.form;
          if (validateTrigger === "blur") {
            this.formItem.onFieldChange();
          }
        }
      },
      /**
       * 按下键盘的发送键
       * @param {Object} e
       */
      onConfirm(e2) {
        this.$emit("confirm", this.val);
        this.isEnter = true;
        this.$emit("change", this.val);
        this.$nextTick(() => {
          this.isEnter = false;
        });
      },
      /**
       * 清理内容
       * @param {Object} event
       */
      onClear(event) {
        this.val = "";
        this.$emit("input", "");
        this.$emit("update:modelValue", "");
        this.$emit("clear");
      },
      /**
       * 键盘高度发生变化的时候触发此事件
       * 兼容性：微信小程序2.7.0+、App 3.1.0+
       * @param {Object} event
       */
      onkeyboardheightchange(event) {
        this.$emit("keyboardheightchange", event);
      },
      /**
       * 去除空格
       */
      trimStr(str, pos = "both") {
        if (pos === "both") {
          return str.trim();
        } else if (pos === "left") {
          return str.trimLeft();
        } else if (pos === "right") {
          return str.trimRight();
        } else if (pos === "start") {
          return str.trimStart();
        } else if (pos === "end") {
          return str.trimEnd();
        } else if (pos === "all") {
          return str.replace(/\s+/g, "");
        } else if (pos === "none") {
          return str;
        }
        return str;
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$7);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-easyinput", { "uni-easyinput-error": $options.msg }]),
        style: vue.normalizeStyle($options.boxStyle)
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-easyinput__content", $options.inputContentClass]),
            style: vue.normalizeStyle($options.inputContentStyle)
          },
          [
            $props.prefixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
              key: 0,
              class: "content-clear-icon",
              type: $props.prefixIcon,
              color: "#c0c4cc",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.onClickIcon("prefix")),
              size: "22"
            }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true),
            vue.renderSlot(_ctx.$slots, "left", {}, void 0, true),
            $props.type === "textarea" ? (vue.openBlock(), vue.createElementBlock("textarea", {
              key: 1,
              class: vue.normalizeClass(["uni-easyinput__content-textarea", { "input-padding": $props.inputBorder }]),
              name: $props.name,
              value: $data.val,
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              disabled: $props.disabled,
              "placeholder-class": "uni-easyinput__placeholder-class",
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              autoHeight: $props.autoHeight,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onInput: _cache[1] || (_cache[1] = (...args) => $options.onInput && $options.onInput(...args)),
              onBlur: _cache[2] || (_cache[2] = (...args) => $options._Blur && $options._Blur(...args)),
              onFocus: _cache[3] || (_cache[3] = (...args) => $options._Focus && $options._Focus(...args)),
              onConfirm: _cache[4] || (_cache[4] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[5] || (_cache[5] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 42, ["name", "value", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "autoHeight", "cursor-spacing", "adjust-position"])) : (vue.openBlock(), vue.createElementBlock("input", {
              key: 2,
              type: $props.type === "password" ? "text" : $props.type,
              class: "uni-easyinput__content-input",
              style: vue.normalizeStyle($options.inputStyle),
              name: $props.name,
              value: $data.val,
              password: !$data.showPassword && $props.type === "password",
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              "placeholder-class": "uni-easyinput__placeholder-class",
              disabled: $props.disabled,
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              confirmType: $props.confirmType,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onFocus: _cache[6] || (_cache[6] = (...args) => $options._Focus && $options._Focus(...args)),
              onBlur: _cache[7] || (_cache[7] = (...args) => $options._Blur && $options._Blur(...args)),
              onInput: _cache[8] || (_cache[8] = (...args) => $options.onInput && $options.onInput(...args)),
              onConfirm: _cache[9] || (_cache[9] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[10] || (_cache[10] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 44, ["type", "name", "value", "password", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "confirmType", "cursor-spacing", "adjust-position"])),
            $props.type === "password" && $props.passwordIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 3 },
              [
                vue.createCommentVNode(" 开启密码时显示小眼睛 "),
                $options.isVal ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: $data.showPassword ? "eye-slash-filled" : "eye-filled",
                  size: 22,
                  color: $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onEyes
                }, null, 8, ["class", "type", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true),
            $props.suffixIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 4 },
              [
                $props.suffixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: "content-clear-icon",
                  type: $props.suffixIcon,
                  color: "#c0c4cc",
                  onClick: _cache[11] || (_cache[11] = ($event) => $options.onClickIcon("suffix")),
                  size: "22"
                }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 5 },
              [
                $props.clearable && $options.isVal && !$props.disabled && $props.type !== "textarea" ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: "clear",
                  size: $props.clearSize,
                  color: $options.msg ? "#dd524d" : $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onClear
                }, null, 8, ["class", "size", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )),
            vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-f7a14e66"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.vue"]]);
  const _sfc_main$e = {
    __name: "CustomSwitch",
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      activeColor: {
        type: String,
        default: "#409EFF"
      },
      inactiveColor: {
        type: String,
        default: "#F56C6C"
      }
    },
    emits: ["update:modelValue", "change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const toggle = () => {
        emit("update:modelValue", !props.modelValue);
        emit("change", !props.modelValue);
      };
      const __returned__ = { props, emit, toggle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["custom-switch", { "is-checked": $props.modelValue }]),
        onClick: $setup.toggle
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "switch-track",
            style: vue.normalizeStyle({ backgroundColor: $props.modelValue ? $props.activeColor : $props.inactiveColor })
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: "switch-thumb",
                style: vue.normalizeStyle({ transform: $props.modelValue ? "translateX(100%)" : "translateX(0)" })
              },
              null,
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        )
      ],
      2
      /* CLASS */
    );
  }
  const CustomSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-1fd8a634"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/CustomSwitch.vue"]]);
  const _sfc_main$d = {
    __name: "structure-info",
    setup(__props, { expose: __expose }) {
      __expose();
      const confirmed = vue.ref(false);
      const confirmPopup = vue.ref(null);
      const structureData = vue.ref(null);
      const selectedIndex = vue.ref(0);
      const selectedSecondIndex = vue.ref(0);
      const selectedThirdIndex = vue.ref(-1);
      const editPopup = vue.ref(null);
      const currentEditItem = vue.ref(null);
      const currentEditItemBoolean = vue.computed(() => {
        return currentEditItem.value.status === "0" ? true : false;
      });
      const TaskBridgeId = vue.ref(0);
      const resultData = vue.ref(null);
      const userInfo = userStore();
      const bridgeIdFromURL = vue.computed(() => {
        var _a;
        const pages2 = getCurrentPages();
        if (pages2.length > 0) {
          const currentPage = pages2[pages2.length - 1];
          const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
          if (options && options.bridgeId) {
            return options.bridgeId;
          }
        }
        return 0;
      });
      vue.watch(bridgeIdFromURL, (newVal) => {
        if (newVal) {
          TaskBridgeId.value = newVal;
          formatAppLog("log", "at components/structure-info.vue:172", "接收到的桥梁ID:", TaskBridgeId.value);
        }
      });
      const init = async () => {
        if (bridgeIdFromURL.value) {
          TaskBridgeId.value = bridgeIdFromURL.value;
        }
        const responseLogin = await uni.request({
          url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
          method: "POST"
        });
        formatAppLog("log", "at components/structure-info.vue:186", "用户信息:", responseLogin.data);
        const token = responseLogin.data.token;
        const getData = async () => {
          try {
            const response = await uni.request({
              //寫死 因爲只有55是最新數據
              url: `http://60.205.13.156:8090/api/building/${TaskBridgeId.value}/object`,
              method: "GET",
              header: {
                "Authorization": `${token}`
              }
            });
            formatAppLog("log", "at components/structure-info.vue:198", "获取到的桥梁构件数据:", response.data);
            if (response.data.code === 0) {
              structureData.value = response.data;
              resultData.value = response.data.data;
              setObject(userInfo.username, TaskBridgeId.value, resultData.value);
              formatAppLog("log", "at components/structure-info.vue:204", "structureData:", structureData.value);
              formatAppLog("log", "at components/structure-info.vue:205", "resultData:", resultData.value);
              formatAppLog("log", "at components/structure-info.vue:207", "第一层结构数据:", structureData.value.children);
              if (structureData.value.children) {
                structureData.value.children.forEach((item, index) => {
                  formatAppLog("log", "at components/structure-info.vue:210", `第一层结构 ${index + 1}:`, item.name);
                });
              }
              normalizeStatusFields(resultData.value);
            } else {
              uni.showToast({
                title: response.data.msg || "获取数据失败",
                icon: "none"
              });
            }
          } catch (error) {
            formatAppLog("error", "at components/structure-info.vue:225", "获取桥梁构件数据失败:", error);
            uni.showToast({
              title: "获取数据失败，请稍后重试",
              icon: "none"
            });
          }
        };
        await getData();
      };
      const secondLevelItems = vue.computed(() => {
        var _a, _b, _c;
        if (!((_c = (_b = (_a = structureData.value) == null ? void 0 : _a.data.children) == null ? void 0 : _b[selectedIndex.value]) == null ? void 0 : _c.children)) {
          return [];
        }
        return structureData.value.data.children[selectedIndex.value].children;
      });
      const thirdLevelItems = vue.computed(() => {
        var _a, _b;
        if (!((_b = (_a = secondLevelItems.value) == null ? void 0 : _a[selectedSecondIndex.value]) == null ? void 0 : _b.children)) {
          return [];
        }
        return secondLevelItems.value[selectedSecondIndex.value].children;
      });
      const confirmStructure = () => {
        formatAppLog("log", "at components/structure-info.vue:254", "准备提交的数据:", resultData.value);
        confirmPopup.value.open();
      };
      const confirmConfirm = () => {
        saveEdit();
        calculateAndUpdateCounts();
        storeDataLocally();
        confirmPopup.value.close();
        uni.showToast({
          title: "构件信息已保存",
          icon: "success",
          duration: 2e3
        });
      };
      const calculateAndUpdateCounts = () => {
        if (!resultData.value || !resultData.value.children) {
          formatAppLog("warn", "at components/structure-info.vue:287", "resultData结构不完整，无法计算count总和");
          return;
        }
        resultData.value.children.forEach((firstLevel) => {
          if (!firstLevel || !firstLevel.children)
            return;
          let firstLevelTotal = 0;
          firstLevel.children.forEach((secondLevel) => {
            if (!secondLevel || !secondLevel.children)
              return;
            let secondLevelTotal = 0;
            secondLevel.children.forEach((thirdLevel) => {
              if (!thirdLevel)
                return;
              const count = Number(thirdLevel.count || 0);
              secondLevelTotal += count;
              formatAppLog("log", "at components/structure-info.vue:311", `第三层节点 ${thirdLevel.name || "未命名"} 的count: ${count}`);
            });
            secondLevel.count = secondLevelTotal;
            firstLevelTotal += secondLevelTotal;
            formatAppLog("log", "at components/structure-info.vue:318", `第二层节点 ${secondLevel.name || "未命名"} 的count总和: ${secondLevelTotal}`);
          });
          firstLevel.count = firstLevelTotal;
          formatAppLog("log", "at components/structure-info.vue:324", `第一层节点 ${firstLevel.name || "未命名"} 的count总和: ${firstLevelTotal}`);
        });
        let totalCount = 0;
        resultData.value.children.forEach((firstLevel) => {
          totalCount += Number(firstLevel.count || 0);
        });
        resultData.value.count = totalCount;
        formatAppLog("log", "at components/structure-info.vue:336", `所有节点的count总和: ${totalCount}`);
        formatAppLog("log", "at components/structure-info.vue:337", "更新后的resultData:", resultData.value);
      };
      const closeConfirmPopup = () => {
        confirmPopup.value.close();
      };
      const changeTab = (index) => {
        var _a, _b, _c;
        selectedIndex.value = index;
        selectedSecondIndex.value = 0;
        selectedThirdIndex.value = -1;
        const firstLevelItem = (_c = (_b = (_a = structureData.value) == null ? void 0 : _a.data) == null ? void 0 : _b.children) == null ? void 0 : _c[index];
        if (firstLevelItem) {
          formatAppLog("log", "at components/structure-info.vue:352", "选中的第一层结构:", firstLevelItem.name);
        } else {
          formatAppLog("log", "at components/structure-info.vue:354", "选中的第一层结构不存在或数据结构有问题");
        }
      };
      const changeSecondTab = (index) => {
        var _a;
        selectedSecondIndex.value = index;
        selectedThirdIndex.value = -1;
        const secondLevelItem = (_a = secondLevelItems.value) == null ? void 0 : _a[index];
        if (secondLevelItem) {
          formatAppLog("log", "at components/structure-info.vue:365", "选中的第二层结构:", secondLevelItem.name);
          if (!secondLevelItem.children || secondLevelItem.children.length === 0) {
            formatAppLog("log", "at components/structure-info.vue:368", "该第二层结构没有第三层数据");
          }
        } else {
          formatAppLog("log", "at components/structure-info.vue:371", "选中的第二层结构不存在或数据结构有问题");
        }
      };
      const changeThirdTab = (index) => {
        if (selectedThirdIndex.value === index) {
          selectedThirdIndex.value = -1;
        } else {
          selectedThirdIndex.value = index;
        }
        formatAppLog("log", "at components/structure-info.vue:382", "选中的第三层结构:", thirdLevelItems.value[index]);
      };
      const handleCancel = () => {
        selectedThirdIndex.value = -1;
      };
      const handleEdit = (index) => {
        currentEditItem.value = JSON.parse(JSON.stringify(thirdLevelItems.value[index]));
        if (currentEditItem.value) {
          if (currentEditItem.value.status === void 0) {
            currentEditItem.value.status = true;
          }
          if (currentEditItem.value.quantity === void 0) {
            currentEditItem.value.quantity = 0;
          }
        }
        editPopup.value.open();
      };
      const handleDisable = (index) => {
        formatAppLog("log", "at components/structure-info.vue:404", "切换状态前:", thirdLevelItems.value[index].status);
        const currentStatus = thirdLevelItems.value[index].status;
        thirdLevelItems.value[index].status = currentStatus === "0" ? "1" : "0";
        formatAppLog("log", "at components/structure-info.vue:409", "切换状态后:", thirdLevelItems.value[index].status);
        const item = thirdLevelItems.value[index];
        item.count = item.status === "0" ? Number(item.quantity || 0) : 0;
        formatAppLog("log", "at components/structure-info.vue:416", `已更新${item.name}的count为${item.count}, status为${item.status}`);
        updateResultData(item);
        formatAppLog("log", "at components/structure-info.vue:422", "所有第三层构件信息:");
        thirdLevelItems.value.forEach((item2) => {
          formatAppLog("log", "at components/structure-info.vue:424", `构件名称: ${item2.name}, 构件数量: ${item2.count || 0}, 状态标志: ${item2.status || "0"}`);
        });
        selectedThirdIndex.value = -1;
        formatAppLog("log", "at components/structure-info.vue:429", "最终存的resultData.value", resultData.value);
        setObject(userInfo.username, TaskBridgeId.value, resultData.value);
      };
      const setStatus = (e2) => {
        if (currentEditItem.value) {
          currentEditItem.value.status = e2 ? "0" : "1";
          formatAppLog("log", "at components/structure-info.vue:438", "Switch toggled, new status:", currentEditItem.value.status);
          if (currentEditItem.value.status === "1") {
            currentEditItem.value.quantity = 0;
            formatAppLog("log", "at components/structure-info.vue:443", "状态改为停用，数量自动置为0");
          }
        }
      };
      const saveEdit = () => {
        const originalItem = thirdLevelItems.value.find((item) => item.name === currentEditItem.value.name);
        if (originalItem) {
          originalItem.status = currentEditItem.value.status;
          if (originalItem.status === "1") {
            originalItem.quantity = 0;
          } else {
            originalItem.quantity = Number(currentEditItem.value.quantity);
          }
          originalItem.count = originalItem.status === "0" ? originalItem.quantity : 0;
          formatAppLog("log", "at components/structure-info.vue:462", `已更新${originalItem.name}的count为${originalItem.count}`);
          updateResultData(originalItem);
          formatAppLog("log", "at components/structure-info.vue:468", "所有第三层构件信息:");
          thirdLevelItems.value.forEach((item) => {
            formatAppLog("log", "at components/structure-info.vue:470", `构件名称: ${item.name}, 构件数量: ${item.count || 0}, 状态标志: ${item.status || "0"}`);
          });
        }
        closeEditPopup();
      };
      const closeEditPopup = () => {
        editPopup.value.close();
        selectedThirdIndex.value = -1;
      };
      const updateResultData = (updatedItem) => {
        if (!resultData.value || !resultData.value.children) {
          formatAppLog("error", "at components/structure-info.vue:485", "resultData未正确初始化");
          return;
        }
        const firstLevelIndex = selectedIndex.value;
        const secondLevelIndex = selectedSecondIndex.value;
        const itemName = updatedItem.name;
        if (resultData.value.children[firstLevelIndex] && resultData.value.children[firstLevelIndex].children[secondLevelIndex]) {
          const thirdLevelItems2 = resultData.value.children[firstLevelIndex].children[secondLevelIndex].children;
          if (thirdLevelItems2) {
            const targetItem = thirdLevelItems2.find((item) => item.name === itemName);
            if (targetItem) {
              const updateData = {
                count: updatedItem.count,
                status: updatedItem.status,
                name: updatedItem.name,
                quantity: updatedItem.quantity
              };
              Object.assign(targetItem, updateData);
              formatAppLog("log", "at components/structure-info.vue:518", `已更新resultData中${itemName}的count为${updatedItem.count}, status为${targetItem.status}`);
            } else {
              formatAppLog("warn", "at components/structure-info.vue:520", `未在resultData中找到名称为${itemName}的项`);
            }
          } else {
            formatAppLog("warn", "at components/structure-info.vue:523", "resultData中没有第三层数据");
          }
        } else {
          formatAppLog("warn", "at components/structure-info.vue:526", "resultData中的层级结构不完整");
        }
        formatAppLog("log", "at components/structure-info.vue:530", "更新后的resultData:", resultData.value);
      };
      const storeDataLocally = async () => {
        try {
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          if (!responseLogin.data) {
            uni.showToast({
              title: "获取用户信息失败",
              icon: "none"
            });
            return;
          }
          setObject(userInfo.username, TaskBridgeId.value, resultData.value);
          formatAppLog("log", "at components/structure-info.vue:551", "已将数据存储到本地:", resultData.value);
        } catch (error) {
          formatAppLog("error", "at components/structure-info.vue:554", "存储数据错误:", error);
          uni.showToast({
            title: "存储数据出错，请稍后重试",
            icon: "none"
          });
        }
      };
      const normalizeStatusFields = (data) => {
        if (!data || !data.children)
          return;
        data.children.forEach((firstLevel) => {
          if (!firstLevel)
            return;
          if (typeof firstLevel.status === "boolean") {
            firstLevel.status = firstLevel.status ? "0" : "1";
          }
          if (firstLevel.children) {
            firstLevel.children.forEach((secondLevel) => {
              if (!secondLevel)
                return;
              if (typeof secondLevel.status === "boolean") {
                secondLevel.status = secondLevel.status ? "0" : "1";
              }
              if (secondLevel.children) {
                secondLevel.children.forEach((thirdLevel) => {
                  if (!thirdLevel)
                    return;
                  if (typeof thirdLevel.status === "boolean") {
                    thirdLevel.status = thirdLevel.status ? "0" : "1";
                  }
                });
              }
            });
          }
        });
        formatAppLog("log", "at components/structure-info.vue:602", '已规范化所有status字段为"0"/"1"格式，"0"表示启用，"1"表示停用');
      };
      vue.onMounted(async () => {
        formatAppLog("log", "at components/structure-info.vue:606", "初始bridgeId:", bridgeIdFromURL.value);
        if (bridgeIdFromURL.value) {
          TaskBridgeId.value = bridgeIdFromURL.value;
        }
        await init();
      });
      const __returned__ = { confirmed, confirmPopup, structureData, selectedIndex, selectedSecondIndex, selectedThirdIndex, editPopup, currentEditItem, currentEditItemBoolean, TaskBridgeId, resultData, userInfo, bridgeIdFromURL, init, secondLevelItems, thirdLevelItems, confirmStructure, confirmConfirm, calculateAndUpdateCounts, closeConfirmPopup, changeTab, changeSecondTab, changeThirdTab, handleCancel, handleEdit, handleDisable, setStatus, saveEdit, closeEditPopup, updateResultData, storeDataLocally, normalizeStatusFields, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, watch: vue.watch, CustomSwitch, get setObject() {
        return setObject;
      }, get userStore() {
        return userStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_0$2);
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_1$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(` <view class="confirm-row">\r
			<span class="confirm-text">结构信息状态：</span>\r
			<span class="confirm-status"\r
				:style="{color: confirmed ? '#00dd00': '#f56c6c'}">{{ confirmed ? '已确认': '未确认'}}</span>\r
			<view class="confirm-button-container">\r
				<button @click="confirmStructure" class="confirm-button" :disabled="confirmed">保存构件信息</button>\r
			</view>\r
		</view> `),
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
      vue.createCommentVNode(" 添加侧边栏 "),
      vue.createElementVNode("view", { class: "content-layout" }, [
        vue.createCommentVNode(" 第一个侧边栏 "),
        vue.createElementVNode("view", { class: "sidebar" }, [
          vue.createCommentVNode(" Bug 后端接口json文件对不上 还是旧版本 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(((_a = $setup.structureData) == null ? void 0 : _a.data.children) || [], (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["sidebar-item", $setup.selectedIndex === index ? "active" : ""]),
                onClick: ($event) => $setup.changeTab(index)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "sidebar-item-content" },
                  vue.toDisplayString(item.name || "未命名"),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 第二个侧边栏 "),
        vue.createElementVNode("view", { class: "sidebar second-sidebar" }, [
          $setup.secondLevelItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.secondLevelItems, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: vue.normalizeClass(["sidebar-item", $setup.selectedSecondIndex === index ? "active" : ""]),
                  onClick: ($event) => $setup.changeSecondTab(index)
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "sidebar-item-content" },
                    vue.toDisplayString(item.name || "未命名"),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "no-data-tip"
          }, " 不存在第二层数据 "))
        ]),
        vue.createCommentVNode(" 第三个侧边栏 "),
        $setup.thirdLevelItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "sidebar third-sidebar"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.thirdLevelItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: vue.normalizeClass(["sidebar-item", $setup.selectedThirdIndex === index ? "active" : ""]),
                onClick: ($event) => $setup.changeThirdTab(index)
              }, [
                vue.createElementVNode("view", { class: "sidebar-item-content" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["item-name", { "disabled-text": item.status === "1" }])
                    },
                    vue.toDisplayString(item.name || "未命名"),
                    3
                    /* TEXT, CLASS */
                  ),
                  vue.createElementVNode("view", { class: "item-info-right" }, [
                    item.status === "0" ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "item-quantity"
                      },
                      "数量 " + vue.toDisplayString(item.quantity || 0),
                      1
                      /* TEXT */
                    )) : (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "disabled-button"
                    }, "已停用")),
                    vue.createElementVNode("image", {
                      src: _imports_0$5,
                      class: "rightarrow"
                    })
                  ])
                ]),
                $setup.selectedThirdIndex === index ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "action-buttons"
                }, [
                  vue.createElementVNode("button", {
                    onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => $setup.handleCancel(), ["stop"]))
                  }, "取消"),
                  vue.createElementVNode("button", {
                    onClick: vue.withModifiers(($event) => $setup.handleEdit(index), ["stop"])
                  }, "编辑", 8, ["onClick"]),
                  vue.createElementVNode("button", {
                    onClick: vue.withModifiers(($event) => $setup.handleDisable(index), ["stop"]),
                    "data-status": item.status === "0" ? "disabled" : "enabled"
                  }, vue.toDisplayString(item.status === "0" ? "停用" : "启用"), 9, ["onClick", "data-status"])
                ])) : vue.createCommentVNode("v-if", true)
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            vue.createCommentVNode(" 当没有第三层数据时显示提示 "),
            vue.createElementVNode("view", { class: "sidebar third-sidebar" }, [
              vue.createElementVNode("view", { class: "no-data-tip" }, " 不存在構件 ")
            ])
          ],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 添加编辑弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "editPopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => {
            var _a2;
            return [
              vue.createElementVNode("view", { class: "edit-popup-content" }, [
                vue.createElementVNode("view", { class: "popup-title" }, "构件信息编辑"),
                vue.createElementVNode("view", { class: "edit-row" }, [
                  vue.createElementVNode("text", { class: "edit-label" }, "构件名称"),
                  vue.createElementVNode(
                    "text",
                    { class: "edit-value" },
                    vue.toDisplayString((_a2 = $setup.currentEditItem) == null ? void 0 : _a2.name),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "edit-row" }, [
                  vue.createElementVNode("text", { class: "edit-label" }, "构件状态"),
                  vue.createElementVNode("view", { class: "status-toggle" }, [
                    vue.createElementVNode("text", { class: "status-text" }, "停用"),
                    vue.createVNode($setup["CustomSwitch"], {
                      modelValue: $setup.currentEditItemBoolean,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.currentEditItemBoolean = $event),
                      onChange: $setup.setStatus,
                      "active-color": "#409EFF",
                      "inactive-color": "#ff3141"
                    }, null, 8, ["modelValue"]),
                    vue.createElementVNode("text", { class: "status-text" }, "启用")
                  ])
                ]),
                vue.createElementVNode("view", { class: "edit-row" }, [
                  vue.createElementVNode("text", { class: "edit-label" }, "构件数量"),
                  vue.createVNode(_component_uni_easyinput, {
                    modelValue: $setup.currentEditItem.quantity,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.currentEditItem.quantity = $event),
                    type: "number",
                    placeholder: "请输入数量",
                    clearSize: "40",
                    class: "quantity-input",
                    inputStyle: { fontSize: "18rpx" },
                    placeholderStyle: "font-size: 18rpx;"
                  }, null, 8, ["modelValue"])
                ]),
                vue.createElementVNode("view", { class: "popup-buttons" }, [
                  vue.createElementVNode("button", {
                    class: "popup-btn cancel-btn",
                    onClick: $setup.closeEditPopup
                  }, "取消"),
                  vue.createCommentVNode(' <button class="popup-btn confirm-btn" @click="saveEdit">确定</button> '),
                  vue.createElementVNode("button", {
                    class: "popup-btn confirm-btn",
                    onClick: $setup.confirmConfirm
                  }, "确定")
                ])
              ])
            ];
          }),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const structureInfo = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-8f2488a5"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/structure-info.vue"]]);
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
      path: "pages/home/home",
      style: {
        navigationBarTitleText: "湖北交投桥梁定检现场检测",
        navigationBarBackgroundColor: "#0F4687",
        navigationStyle: "custom",
        "app-plus": {
          titleNView: {}
        }
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
        navigationBarTitleText: "",
        navigationBarBackgroundColor: "#0F4687",
        navigationStyle: "custom",
        screenOrientation: "landscape"
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
    },
    {
      path: "uni_modules/uni-upgrade-center-app/pages/upgrade-popup",
      style: {
        disableScroll: true,
        "app-plus": {
          backgroundColorTop: "transparent",
          background: "transparent",
          titleNView: false,
          scrollIndicator: false,
          popGesture: "none",
          animationType: "fade-in",
          animationDuration: 200
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
  const S = true, b = "app", T = I(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), A = b, P = I('{"address":["127.0.0.1","26.243.31.100","10.151.1.229"],"servePort":7002,"debugPort":9002,"initialLaunchType":"local","skipFiles":["<node_internals>/**","D:/HBuilderX/plugins/unicloud/**/*.js"]}'), C = I('[{"provider":"aliyun","spaceName":"hubeijiaotou-projects","spaceId":"mp-7d09721a-c5bc-4c38-8165-a1419ee971b8","clientSecret":"Q9SksrsW1LSsFMlUc7AUvQ==","endpoint":"https://api.next.bspapp.com"}]') || [];
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
  const get_file_ext = (name2) => {
    const last_len = name2.lastIndexOf(".");
    const len = name2.length;
    return {
      name: name2.substring(0, last_len),
      ext: name2.substring(last_len + 1, len)
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
  const _sfc_main$c = {
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
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
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
  const uploadImage = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-6f3c6077"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-file-picker/upload-image.vue"]]);
  const _sfc_main$b = {
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
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
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
  const uploadFile = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-86fc2bba"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-file-picker/upload-file.vue"]]);
  const _sfc_main$a = {
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
      getFileExt(name2) {
        const last_len = name2.lastIndexOf(".");
        const len = name2.length;
        return {
          name: name2.substring(0, last_len),
          ext: name2.substring(last_len + 1, len)
        };
      },
      /**
       * 处理返回事件
       */
      setEmit() {
        let data = [];
        if (this.returnType === "object") {
          data = this.backObject(this.files)[0];
          this.localValue = data ? data : null;
        } else {
          data = this.backObject(this.files);
          if (!this.localValue) {
            this.localValue = [];
          }
          this.localValue = [...data];
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
      getForm(name2 = "uniForms") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name2) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-418f48eb"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue"]]);
  const _sfc_main$9 = {
    __name: "front-photo",
    props: {
      isDataLoaded: {
        type: Boolean,
        default: false
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const isJson = vue.ref(1);
      const isSubmit = vue.ref(false);
      const frontLeft = vue.ref([]);
      const frontRight = vue.ref([]);
      const sideLeft = vue.ref([]);
      const sideRight = vue.ref([]);
      const originalFrontLeft = vue.ref([]);
      const originalFrontRight = vue.ref([]);
      const originalSideLeft = vue.ref([]);
      const originalSideRight = vue.ref([]);
      const idStorageInfo = idStore();
      const userInfo = userStore();
      const imageStyles = vue.reactive({
        width: "200rpx",
        height: "200rpx"
      });
      vue.watch(() => props.isDataLoaded, (newVal) => {
        formatAppLog("log", "at components/front-photo.vue:115", "front-photo组件检测到isDataLoaded变化:", newVal);
        if (newVal === true) {
          readBridgeImageByJson();
        }
      }, { immediate: true });
      const frontLeftSelect = (e2) => {
        if (e2 && e2.tempFiles && e2.tempFiles.length > 0) {
          formatAppLog("log", "at components/front-photo.vue:123", "选择的文件数量:", e2.tempFiles.length);
          frontLeft.value = e2.tempFiles.map((file) => {
            return {
              name: file.name,
              url: file.url || file.path || file.file && file.file.path || file.image && file.image.location || file.tempFilePath,
              extname: file.extname || "jpg"
            };
          });
        }
      };
      const frontRightSelect = (e2) => {
        if (e2 && e2.tempFiles && e2.tempFiles.length > 0) {
          formatAppLog("log", "at components/front-photo.vue:137", "选择的文件数量:", e2.tempFiles.length);
          frontRight.value = e2.tempFiles.map((file) => {
            return {
              name: file.name,
              url: file.url || file.path || file.file && file.file.path || file.image && file.image.location || file.tempFilePath,
              extname: file.extname || "jpg"
            };
          });
        }
      };
      const sideLeftSelect = (e2) => {
        if (e2 && e2.tempFiles && e2.tempFiles.length > 0) {
          formatAppLog("log", "at components/front-photo.vue:151", "选择的文件数量:", e2.tempFiles.length);
          sideLeft.value = e2.tempFiles.map((file) => {
            return {
              name: file.name,
              url: file.url || file.path || file.file && file.file.path || file.image && file.image.location || file.tempFilePath,
              extname: file.extname || "jpg"
            };
          });
        }
      };
      const sideRightSelect = (e2) => {
        if (e2 && e2.tempFiles && e2.tempFiles.length > 0) {
          formatAppLog("log", "at components/front-photo.vue:165", "选择的文件数量:", e2.tempFiles.length);
          sideRight.value = e2.tempFiles.map((file) => {
            return {
              name: file.name,
              url: file.url || file.path || file.file && file.file.path || file.image && file.image.location || file.tempFilePath,
              extname: file.extname || "jpg"
            };
          });
        }
      };
      const createPhotoDate = async () => {
        const result = {
          frontLeft: [],
          frontRight: [],
          sideLeft: [],
          sideRight: []
        };
        if (hasImageChanged(frontLeft.value, originalFrontLeft.value)) {
          result.frontLeft = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, frontLeft.value.map((img) => img.url));
        } else {
          const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
          result.frontLeft = data.frontLeft || [];
        }
        if (hasImageChanged(frontRight.value, originalFrontRight.value)) {
          result.frontRight = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, frontRight.value.map((img) => img.url));
        } else {
          const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
          result.frontRight = data.frontRight || [];
        }
        if (hasImageChanged(sideLeft.value, originalSideLeft.value)) {
          result.sideLeft = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, sideLeft.value.map((img) => img.url));
        } else {
          const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
          result.sideLeft = data.sideLeft || [];
        }
        if (hasImageChanged(sideRight.value, originalSideRight.value)) {
          result.sideRight = await saveBridgeImages(userInfo.username, idStorageInfo.buildingId, sideRight.value.map((img) => img.url));
        } else {
          const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
          result.sideRight = data.sideRight || [];
        }
        return result;
      };
      const hasImageChanged = (currentImages, originalImages) => {
        if (currentImages.length !== originalImages.length) {
          return true;
        }
        for (let i2 = 0; i2 < currentImages.length; i2++) {
          if (currentImages[i2].url !== originalImages[i2].url) {
            return true;
          }
        }
        return false;
      };
      const savePhoto = async () => {
        const savePhotoData = await createPhotoDate();
        formatAppLog("log", "at components/front-photo.vue:245", "保存的图片json数据:", savePhotoData);
        await setFrontPhoto(userInfo.username, idStorageInfo.buildingId, savePhotoData);
        uni.showToast({
          title: "保存成功",
          icon: "success"
        });
        isSubmit.value = true;
      };
      const readBridgeImageByJson = async () => {
        try {
          const data = await getFrontPhoto(userInfo.username, idStorageInfo.buildingId);
          formatAppLog("log", "at components/front-photo.vue:257", "获取正立面照数据成功:", data);
          if (data.frontLeft && Array.isArray(data.frontLeft)) {
            const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.frontLeft);
            frontLeft.value = imagesPaths.map((url, index) => ({
              name: `图片${index + 1}`,
              url,
              extname: "jpg"
            }));
            originalFrontLeft.value = JSON.parse(JSON.stringify(frontLeft.value));
          }
          if (data.frontRight && Array.isArray(data.frontRight)) {
            const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.frontRight);
            frontRight.value = imagesPaths.map((url, index) => ({
              name: `图片${index + 1}`,
              url,
              extname: "jpg"
            }));
            originalFrontRight.value = JSON.parse(JSON.stringify(frontRight.value));
          }
          if (data.sideLeft && Array.isArray(data.sideLeft)) {
            const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.sideLeft);
            sideLeft.value = imagesPaths.map((url, index) => ({
              name: `图片${index + 1}`,
              url,
              extname: "jpg"
            }));
            originalSideLeft.value = JSON.parse(JSON.stringify(sideLeft.value));
          }
          if (data.sideRight && Array.isArray(data.sideRight)) {
            const imagesPaths = readBridgeImage(userInfo.username, idStorageInfo.buildingId, data.sideRight);
            sideRight.value = imagesPaths.map((url, index) => ({
              name: `图片${index + 1}`,
              url,
              extname: "jpg"
            }));
            originalSideRight.value = JSON.parse(JSON.stringify(sideRight.value));
          }
        } catch (error) {
          formatAppLog("error", "at components/front-photo.vue:301", "读取正立面照失败:", error);
        }
      };
      vue.onMounted(async () => {
        if (props.isDataLoaded) {
          await readBridgeImageByJson();
        }
      });
      const __returned__ = { props, isJson, isSubmit, frontLeft, frontRight, sideLeft, sideRight, originalFrontLeft, originalFrontRight, originalSideLeft, originalSideRight, idStorageInfo, userInfo, imageStyles, frontLeftSelect, frontRightSelect, sideLeftSelect, sideRightSelect, createPhotoDate, hasImageChanged, savePhoto, readBridgeImageByJson, computed: vue.computed, onMounted: vue.onMounted, reactive: vue.reactive, ref: vue.ref, watch: vue.watch, get getFrontPhoto() {
        return getFrontPhoto;
      }, get getProperty() {
        return getProperty;
      }, get readBridgeImage() {
        return readBridgeImage;
      }, get idStore() {
        return idStore;
      }, get userStore() {
        return userStore;
      }, get saveBridgeImages() {
        return saveBridgeImages;
      }, get setFrontPhoto() {
        return setFrontPhoto;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_file_picker = resolveEasycom(vue.resolveDynamicComponent("uni-file-picker"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $props.isDataLoaded ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createElementVNode("view", { class: "title" }, [
          vue.createElementVNode("view", { class: "status-text" }, [
            vue.createTextVNode(" 正立面照状态: "),
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass({ "not-submitted": !$setup.isSubmit })
              },
              vue.toDisplayString($setup.isSubmit ? "已提交" : "未提交"),
              3
              /* TEXT, CLASS */
            )
          ]),
          vue.createElementVNode("button", {
            class: "save",
            onClick: $setup.savePhoto
          }, "保存")
        ]),
        vue.createElementVNode("view", { class: "photo-container" }, [
          vue.createElementVNode("view", { class: "photo-item" }, [
            vue.createElementVNode("view", { class: "head" }, [
              vue.createElementVNode("view", { class: "head-text" }, " 左正面照 ")
            ]),
            vue.createVNode(_component_uni_file_picker, {
              class: "file-picker",
              limit: "1",
              "image-styles": $setup.imageStyles,
              modelValue: $setup.frontLeft,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.frontLeft = $event),
              "file-mediatype": "image",
              mode: "grid",
              onSelect: $setup.frontLeftSelect,
              "auto-upload": false
            }, null, 8, ["image-styles", "modelValue"])
          ]),
          vue.createElementVNode("view", { class: "photo-item" }, [
            vue.createElementVNode("view", { class: "head" }, [
              vue.createElementVNode("view", { class: "head-text" }, " 右正面照 ")
            ]),
            vue.createVNode(_component_uni_file_picker, {
              class: "file-picker",
              limit: "1",
              "image-styles": $setup.imageStyles,
              modelValue: $setup.frontRight,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.frontRight = $event),
              "file-mediatype": "image",
              mode: "grid",
              onSelect: $setup.frontRightSelect,
              "auto-upload": false
            }, null, 8, ["image-styles", "modelValue"])
          ])
        ]),
        vue.createElementVNode("view", { class: "photo-container" }, [
          vue.createElementVNode("view", { class: "photo-item" }, [
            vue.createElementVNode("view", { class: "head" }, [
              vue.createElementVNode("view", { class: "head-text" }, " 左侧面照 ")
            ]),
            vue.createVNode(_component_uni_file_picker, {
              class: "file-picker",
              limit: "1",
              "image-styles": $setup.imageStyles,
              modelValue: $setup.sideLeft,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.sideLeft = $event),
              "file-mediatype": "image",
              mode: "grid",
              onSelect: $setup.sideLeftSelect,
              "auto-upload": false
            }, null, 8, ["image-styles", "modelValue"])
          ]),
          vue.createElementVNode("view", { class: "photo-item" }, [
            vue.createElementVNode("view", { class: "head" }, [
              vue.createElementVNode("view", { class: "head-text" }, " 右侧面照 ")
            ]),
            vue.createVNode(_component_uni_file_picker, {
              class: "file-picker",
              limit: "1",
              "image-styles": $setup.imageStyles,
              modelValue: $setup.sideRight,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.sideRight = $event),
              "file-mediatype": "image",
              mode: "grid",
              onSelect: $setup.sideRightSelect,
              "auto-upload": false
            }, null, 8, ["image-styles", "modelValue"])
          ])
        ])
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "loading-container"
      }, [
        vue.createElementVNode("text", { class: "loading-text" }, "正在加载桥梁数据...")
      ]))
    ]);
  }
  const frontPhoto = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-95007593"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/components/front-photo.vue"]]);
  const _sfc_main$8 = {
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
          name: "桥梁卡片"
        },
        {
          name: "正立面照"
        },
        {
          name: "结构信息"
        }
      ]);
      const activeTab = vue.ref(0);
      const bridgeDataLoaded = vue.ref(false);
      const bridgeArchiveRef = vue.ref(null);
      const switchTab = (index) => {
        activeTab.value = index;
      };
      const handleDataLoaded = (loaded) => {
        formatAppLog("log", "at pages/bridge-disease/bridge-disease.vue:86", "接收到桥梁卡片数据加载完成事件:", loaded);
        bridgeDataLoaded.value = loaded;
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
      vue.onMounted(() => {
        formatAppLog("log", "at pages/bridge-disease/bridge-disease.vue:102", "bridge-disease页面挂载");
        if (activeTab.value === 3) {
          activeTab.value = 2;
          setTimeout(() => {
            activeTab.value = 3;
          }, 100);
        }
      });
      const __returned__ = { tabs, activeTab, bridgeDataLoaded, bridgeArchiveRef, switchTab, handleDataLoaded, indicatorStyle, currentDisease, historyDisease, bridgeArchive, structureInfo, frontPhoto, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
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
            vue.createCommentVNode(" 桥梁卡片内容 "),
            vue.createVNode(
              $setup["bridgeArchive"],
              {
                ref: "bridgeArchiveRef",
                onDataLoaded: $setup.handleDataLoaded
              },
              null,
              512
              /* NEED_PATCH */
            )
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
            vue.createCommentVNode(" 正面立照内容 "),
            vue.createVNode($setup["frontPhoto"], { isDataLoaded: $setup.bridgeDataLoaded }, null, 8, ["isDataLoaded"])
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
  const PagesBridgeDiseaseBridgeDisease = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/bridge-disease/bridge-disease.vue"]]);
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
  const _sfc_main$7 = {
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
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-9245e42c"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  const _sfc_main$6 = {
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
      getForm(name2 = "uniForms") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name2) {
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
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-149d584b"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.vue"]]);
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
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$7);
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
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-a8e6b638"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/node_modules/@dcloudio/uni-ui/lib/uni-combox/uni-combox.vue"]]);
  function generateDiseaseDescription(data) {
    const {
      componentName,
      // 构件名称
      diseaseType,
      // 病害类型
      diseasePosition,
      // 病害位置
      crackFeature = [],
      // 裂缝特征（可选）
      defects = [],
      // 缺损数据数组
      counts = 0
      // 病害数量（可选）
    } = data;
    const count = defects.length;
    if (count === 0)
      return "还未填写病害数据";
    let description = `${componentName}${diseasePosition}${diseaseType}`;
    if (counts < 10) {
      const details = defects.map((item) => {
        item.reference1LocationStart;
        item.reference2LocationStart;
        const length = item.length;
        const width = item.width;
        (length * width).toFixed(2);
        return `${crackFeature[item.crackTypeIndex].text}裂缝，距${item.reference1Location} ${item.reference1LocationStart}m， 距${item.reference1Location} ${item.reference2LocationStart}m， L=${item.length}m， W=${item.width}m， S=${item.length}×${item.width}m²`;
      }).join("；");
      return `${description}, ${details}`;
    } else {
      const lengths = defects.map((d2) => d2.length);
      const widths = defects.map((d2) => d2.width);
      Math.min(...lengths);
      Math.max(...lengths);
      Math.min(...widths);
      Math.max(...widths);
      const reference1Location = defects[0].reference1Location;
      const reference2Location = defects[0].reference2Location;
      const distanceToRef1 = defects[0].reference1LocationStart;
      const distanceToRef2 = defects[0].reference2LocationStart;
      const lengthRangeStart = defects[0].lengthRangeStart;
      const lengthRangeEnd = defects[0].lengthRangeEnd;
      const widthRangeStart = defects[0].widthRangeStart;
      const widthRangeEnd = defects[0].widthRangeEnd;
      defects[0].heightDepthRangeStart;
      defects[0].heightDepthRangeEnd;
      defects[0].crackWidthRangeStart;
      defects[0].crackWidthRangeEnd;
      defects[0].areaRangeStart;
      defects[0].areaRangeEnd;
      defects[0].volumeRangeStart;
      defects[0].volumeRangeEnd;
      return `${description}，${crackFeature[defects[0].crackTypeIndex].text}裂缝${counts}条，距${reference1Location} ${distanceToRef1}m，距${reference2Location} ${distanceToRef2}m，L=${lengthRangeStart}m~${lengthRangeEnd}m，W=${widthRangeStart}m~${widthRangeEnd}m，S=${lengthRangeStart}×${widthRangeStart}m²~${lengthRangeEnd}×${widthRangeEnd}m²`;
    }
  }
  const _imports_0$3 = "/static/image/AD.svg";
  const _imports_1$2 = "/static/image/template_kxb1.png";
  const _imports_2$1 = "/static/image/template_kxb2.png";
  const _imports_3$1 = "/static/image/template_kxb3.png";
  const _imports_4$1 = "/static/image/template_kxb4.png";
  const _imports_5$1 = "/static/image/template_kxb5.png";
  const _imports_6 = "/static/image/template_kxb6.png";
  const _imports_7 = "/static/image/template_tl1.png";
  const _imports_8 = "/static/image/template_xl1.png";
  const _imports_9 = "/static/image/template_blmxl1.png";
  const _imports_10 = "/static/image/template_blmxl2.png";
  const _imports_11 = "/static/image/template_blmxl3.png";
  const _imports_12 = "/static/image/template_blmxl4.png";
  const _imports_13 = "/static/image/template_qt1.png";
  const _imports_14 = "/static/image/template_qt2.png";
  const _imports_15 = "/static/image/template_hgb1.png";
  const _imports_16 = "/static/image/template_hgb2.png";
  const _imports_17 = "/static/image/template_yq1.png";
  const _imports_18 = "/static/image/template_gl1.png";
  const _imports_19 = "/static/image/template_yzd1.png";
  const _sfc_main$4 = {
    __name: "add-disease",
    setup(__props, { expose: __expose }) {
      __expose();
      const userId = vue.ref(20);
      const userInfo = userStore();
      const idStorageInfo = idStore();
      const buildingId = vue.ref(0);
      const bridgeIdFromURL = vue.computed(() => {
        var _a;
        const pages2 = getCurrentPages();
        if (pages2.length > 0) {
          const currentPage = pages2[pages2.length - 2];
          const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
          if (options && options.bridgeId) {
            return options.bridgeId;
          }
        }
        return 0;
      });
      vue.watch(bridgeIdFromURL, (newVal) => {
        if (newVal) {
          buildingId.value = newVal;
        }
      });
      const openMode = vue.ref("history");
      const popup = vue.ref(null);
      const ADImgs = vue.ref([]);
      const isEdit = vue.ref(false);
      const structureData = vue.ref(null);
      const parentObjectName = vue.ref("");
      const grandObjectName = vue.ref("");
      const biObjectNameOptions = vue.ref([]);
      const diseaseTypeOptions = vue.ref([]);
      const componentNamePicker = vue.ref("");
      const biObjectindex = vue.ref(-1);
      const componentCode = vue.ref([]);
      const componentCodeindex = vue.ref(-1);
      const filteredComponentCodes = vue.ref([]);
      let allDiseaseTypes = [];
      const type = vue.ref("");
      const typeindex = vue.ref(-1);
      const typePicker = vue.ref("");
      const typeInput = vue.ref("");
      const position = vue.ref("");
      const positionPicker = vue.ref("");
      const positionInput = vue.ref("");
      const diseaseDataList = vue.ref([]);
      const quantity = vue.ref(1);
      vue.watch(quantity, (newValue) => {
        const numValue = parseInt(newValue);
        if (isNaN(numValue) || numValue <= 0) {
          updateDiseaseDataList(1);
        } else if (numValue >= 10) {
          quantity.value = numValue;
          updateDiseaseDataList(numValue);
        } else {
          updateDiseaseDataList(numValue);
        }
      });
      const createDescription = () => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:889", "diseaseDataList.value", diseaseDataList.value);
        const createDescription2 = generateDiseaseDescription({
          componentName: getComponentName(),
          // 构件名称
          diseaseType: type.value,
          // 病害类型
          diseasePosition: position.value,
          // 病害位置
          crackFeature: crackType.value,
          // 裂缝特征数组
          defects: diseaseDataList.value,
          // 病害定量数据数组
          counts: quantity.value
          // 病害数量
        });
        description.value = createDescription2;
      };
      const updateDiseaseDataList = (count) => {
        const existingData = [...diseaseDataList.value];
        const newList = [];
        const useRangeMode = count >= 10;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:911", `数量: ${count}, 使用范围模式: ${useRangeMode}`);
        if (useRangeMode) {
          const firstItem = existingData.length > 0 ? existingData[0] : null;
          formatAppLog("log", "at pages/add-disease/add-disease.vue:917", "范围模式，使用第一条记录作为基础:", firstItem ? firstItem : "null");
          newList.push({
            reference1Location: (firstItem == null ? void 0 : firstItem.reference1Location) || "",
            reference1LocationStart: (firstItem == null ? void 0 : firstItem.reference1LocationStart) || "",
            reference1LocationEnd: (firstItem == null ? void 0 : firstItem.reference1LocationEnd) || "",
            reference2Location: (firstItem == null ? void 0 : firstItem.reference2Location) || "",
            reference2LocationStart: (firstItem == null ? void 0 : firstItem.reference2LocationStart) || "",
            reference2LocationEnd: (firstItem == null ? void 0 : firstItem.reference2LocationEnd) || "",
            // 范围输入字段 - 保留现有的范围数据
            lengthRangeStart: (firstItem == null ? void 0 : firstItem.lengthRangeStart) || (firstItem == null ? void 0 : firstItem.length) || "",
            lengthRangeEnd: (firstItem == null ? void 0 : firstItem.lengthRangeEnd) || "",
            widthRangeStart: (firstItem == null ? void 0 : firstItem.widthRangeStart) || (firstItem == null ? void 0 : firstItem.width) || "",
            widthRangeEnd: (firstItem == null ? void 0 : firstItem.widthRangeEnd) || "",
            heightDepthRangeStart: (firstItem == null ? void 0 : firstItem.heightDepthRangeStart) || (firstItem == null ? void 0 : firstItem.heightDepth) || "",
            heightDepthRangeEnd: (firstItem == null ? void 0 : firstItem.heightDepthRangeEnd) || "",
            crackWidthRangeStart: (firstItem == null ? void 0 : firstItem.crackWidthRangeStart) || (firstItem == null ? void 0 : firstItem.crackWidth) || "",
            crackWidthRangeEnd: (firstItem == null ? void 0 : firstItem.crackWidthRangeEnd) || "",
            areaRangeStart: (firstItem == null ? void 0 : firstItem.areaRangeStart) || (firstItem == null ? void 0 : firstItem.area) || "",
            areaRangeEnd: (firstItem == null ? void 0 : firstItem.areaRangeEnd) || "",
            volumeRangeStart: (firstItem == null ? void 0 : firstItem.volumeRangeStart) || (firstItem == null ? void 0 : firstItem.volume) || "",
            volumeRangeEnd: (firstItem == null ? void 0 : firstItem.volumeRangeEnd) || "",
            angleRangeStart: (firstItem == null ? void 0 : firstItem.angleRangeStart) || (firstItem == null ? void 0 : firstItem.angle) || "",
            angleRangeEnd: (firstItem == null ? void 0 : firstItem.angleRangeEnd) || "",
            percentageRangeStart: (firstItem == null ? void 0 : firstItem.percentageRangeStart) || (firstItem == null ? void 0 : firstItem.percentage) || "",
            percentageRangeEnd: (firstItem == null ? void 0 : firstItem.percentageRangeEnd) || "",
            // 保留原有字段为空
            length: "",
            width: "",
            heightDepth: "",
            crackWidth: "",
            area: "",
            volume: "",
            angle: "",
            percentage: "",
            crackTypeIndex: (firstItem == null ? void 0 : firstItem.crackTypeIndex) || 0,
            developmentTrendIndex: (firstItem == null ? void 0 : firstItem.developmentTrendIndex) || 0,
            useRangeMode: true
          });
          formatAppLog("log", "at pages/add-disease/add-disease.vue:957", "更新后的范围模式数据:", newList[0]);
        } else {
          for (let i2 = 0; i2 < count; i2++) {
            if (i2 < existingData.length) {
              if (existingData[i2].useRangeMode) {
                newList.push({
                  reference1Location: existingData[i2].reference1Location || "",
                  reference1LocationStart: existingData[i2].reference1LocationStart || "",
                  reference1LocationEnd: existingData[i2].reference1LocationEnd || "",
                  reference2Location: existingData[i2].reference2Location || "",
                  reference2LocationStart: existingData[i2].reference2LocationStart || "",
                  reference2LocationEnd: existingData[i2].reference2LocationEnd || "",
                  // 使用Min值作为普通模式的值
                  length: existingData[i2].lengthRangeStart || "",
                  width: existingData[i2].widthRangeStart || "",
                  heightDepth: existingData[i2].heightDepthRangeStart || "",
                  crackWidth: existingData[i2].crackWidthRangeStart || "",
                  area: existingData[i2].areaRangeStart || "",
                  volume: existingData[i2].volumeRangeStart || "",
                  angle: existingData[i2].angleRangeStart || "",
                  percentage: existingData[i2].percentageRangeStart || "",
                  crackTypeIndex: existingData[i2].crackTypeIndex || 0,
                  developmentTrendIndex: existingData[i2].developmentTrendIndex || 0,
                  useRangeMode: false
                });
              } else {
                newList.push(existingData[i2]);
              }
            } else {
              newList.push({
                reference1Location: "",
                reference1LocationStart: "",
                reference1LocationEnd: "",
                reference2Location: "",
                reference2LocationStart: "",
                reference2LocationEnd: "",
                length: "",
                width: "",
                crackWidth: "",
                heightDepth: "",
                area: "",
                volume: "",
                angle: "",
                percentage: "",
                crackTypeIndex: 0,
                developmentTrendIndex: 0,
                useRangeMode: false
              });
            }
          }
        }
        diseaseDataList.value = newList;
      };
      const length = vue.ref("");
      const width = vue.ref("");
      const crackWidth = vue.ref("");
      const heightDepth = vue.ref("");
      const area = vue.ref("");
      const description = vue.ref("");
      const fileList = vue.ref([]);
      const diseasePosition = vue.ref([]);
      const diseasePositionPopup = vue.ref(null);
      const selectedPosition = vue.ref("");
      const structureTypes = vue.ref(["上部结构", "下部结构", "桥面系", "附属设施"]);
      const typeMultiArray = vue.ref([
        structureTypes.value,
        [],
        []
      ]);
      const typeMultiIndex = vue.ref([0, 0, 0]);
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
      }, {
        text: "5",
        value: 5
      }]);
      const levelindex = vue.ref(1);
      const crackTypeIndex = vue.ref(0);
      const crackType = vue.ref([
        {
          text: "纵向",
          value: 0
        },
        {
          text: "横向",
          value: 1
        },
        {
          text: "斜向",
          value: 2
        },
        {
          text: "L型",
          value: 3
        },
        {
          text: "U型",
          value: 4
        }
      ]);
      const developmentTrend = vue.ref([
        {
          text: "稳定",
          value: 0
        },
        {
          text: "发展",
          value: 1
        },
        {
          text: "新增",
          value: 2
        },
        {
          text: "已维修",
          value: 3
        }
      ]);
      const developmentTrendindex = vue.ref(0);
      const reference1Location = vue.ref("");
      const reference2Location = vue.ref("");
      const referenceSurfacePopup = vue.ref(null);
      const currentReferenceSurface = vue.ref(1);
      const referenceSurfaceInput = vue.ref("");
      const referenceSurfaceOptions = vue.ref([]);
      const initMultiPickerColumns = () => {
        const structureType = structureTypes.value[typeMultiIndex.value[0]];
        grandObjectName.value = structureType;
        if (structureData.value && structureData.value.children) {
          const structurePart = structureData.value.children.find(
            (item) => item.name === grandObjectName.value
          );
          if (structurePart && structurePart.children) {
            biObjectNameOptions.value = structurePart.children;
            typeMultiArray.value[1] = [...structurePart.children.map((item) => item.name)];
            if (typeMultiIndex.value[1] >= typeMultiArray.value[1].length) {
              typeMultiIndex.value[1] = 0;
            }
            updateThirdColumn();
          } else {
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1189", "未找到对应的结构部分或其子项");
            typeMultiArray.value[1] = [];
            typeMultiArray.value[2] = [];
          }
        } else {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1194", "结构数据尚未加载完成");
        }
      };
      const updateThirdColumn = () => {
        if (typeMultiIndex.value[1] < 0 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
          typeMultiArray.value[2] = [];
          return;
        }
        if (typeMultiIndex.value[1] >= biObjectNameOptions.value.length) {
          typeMultiArray.value[2] = [];
          return;
        }
        const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
        if (!selectedSecondLevel || !selectedSecondLevel.children || !Array.isArray(selectedSecondLevel.children)) {
          typeMultiArray.value[2] = [];
          return;
        }
        const thirdLevelNames = selectedSecondLevel.children.filter((item) => item.status === "0").map((item) => item.name);
        typeMultiArray.value[2] = [...thirdLevelNames];
        if (typeMultiIndex.value[2] >= typeMultiArray.value[2].length) {
          typeMultiIndex.value[2] = 0;
        }
      };
      const typeColumnChange = (e2) => {
        const {
          column,
          value
        } = e2.detail;
        typeMultiIndex.value[column] = value;
        if (column === 0) {
          grandObjectName.value = structureTypes.value[value];
          typeMultiIndex.value[1] = 0;
          typeMultiIndex.value[2] = 0;
          initMultiPickerColumns();
        } else if (column === 1) {
          updateThirdColumn();
        }
      };
      const updateComponentNameValues = () => {
        grandObjectName.value = structureTypes.value[typeMultiIndex.value[0]];
        if (typeMultiIndex.value[1] >= 0 && typeMultiIndex.value[1] < typeMultiArray.value[1].length) {
          parentObjectName.value = typeMultiArray.value[1][typeMultiIndex.value[1]];
        }
      };
      const typeMultiPickerChange = (e2) => {
        typeMultiIndex.value = e2.detail.value;
        updateComponentNameValues();
        let selectedComponentName = "";
        if (typeMultiIndex.value[2] >= 0 && typeMultiArray.value[2].length > 0) {
          selectedComponentName = typeMultiArray.value[2][typeMultiIndex.value[2]];
        } else if (typeMultiIndex.value[1] >= 0 && typeMultiArray.value[1].length > 0) {
          selectedComponentName = typeMultiArray.value[1][typeMultiIndex.value[1]];
        }
        componentNamePicker.value = selectedComponentName;
        if (typeMultiIndex.value[1] >= 0 && typeMultiIndex.value[1] < biObjectNameOptions.value.length) {
          biObjectindex.value = typeMultiIndex.value[1];
        } else {
          biObjectindex.value = -1;
        }
        updateDiseaseTypeOptions();
        updateDiseasePositionOptions();
        typePicker.value = "";
        positionPicker.value = "";
        typeInput.value = "";
        positionInput.value = "";
      };
      vue.watch(grandObjectName, (newVal) => {
        const index = structureTypes.value.findIndex((item) => item === newVal);
        if (index !== -1 && index !== typeMultiIndex.value[0]) {
          typeMultiIndex.value[0] = index;
          initMultiPickerColumns();
        }
      });
      vue.onMounted(async () => {
        var _a;
        if (bridgeIdFromURL.value) {
          buildingId.value = bridgeIdFromURL.value;
        }
        await fetchStructureData();
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
        initMultiPickerColumns();
        if (options && options.mode === "edit") {
          isEdit.value = true;
          openMode.value = "edit";
          if (options.data) {
            try {
              const diseaseData = JSON.parse(decodeURIComponent(options.data));
              formatAppLog("log", "at pages/add-disease/add-disease.vue:1341", "接收到的编辑数据:", diseaseData);
              fillFormWithData(diseaseData);
            } catch (error) {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:1346", "解析编辑数据失败:", error);
              uni.showToast({
                title: "加载编辑数据失败",
                icon: "none"
              });
            }
          }
        } else if (options && options.mode === "history") {
          openMode.value = "history";
          if (options.data) {
            try {
              const diseaseData = JSON.parse(decodeURIComponent(options.data));
              formatAppLog("log", "at pages/add-disease/add-disease.vue:1359", "接收到的编辑数据:", diseaseData);
              fillFormWithData(diseaseData);
            } catch (error) {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:1364", "解析编辑数据失败:", error);
              uni.showToast({
                title: "加载编辑数据失败",
                icon: "none"
              });
            }
          }
        } else {
          openMode.value = "create";
        }
        filteredComponentCodes.value = [...componentCode.value];
        updateDiseaseDataList(quantity.value);
      });
      const fillFormWithData = (data) => {
        var _a, _b, _c, _d, _e2, _f;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1386", "开始填充表单数据:", data);
        if ((_a = data.component) == null ? void 0 : _a.grandObjectName) {
          grandObjectName.value = data.component.grandObjectName;
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1391", "设置病害所属大类:", grandObjectName.value);
          const parentIndex = structureTypes.value.findIndex((item) => item === grandObjectName.value);
          if (parentIndex !== -1) {
            typeMultiIndex.value[0] = parentIndex;
            initMultiPickerColumns();
            if (typeMultiArray.value[1] && typeMultiArray.value[1].length > 0) {
              if ((_b = data.component) == null ? void 0 : _b.parentObjectName) {
                parentObjectName.value = data.component.parentObjectName;
                formatAppLog("log", "at pages/add-disease/add-disease.vue:1406", "设置部件父级名称:", parentObjectName.value);
                const secondLevelIndex = typeMultiArray.value[1].findIndex((item) => item === parentObjectName.value);
                formatAppLog("log", "at pages/add-disease/add-disease.vue:1411", "第二级索引:", secondLevelIndex);
                if (secondLevelIndex !== -1) {
                  typeMultiIndex.value[1] = secondLevelIndex;
                  updateThirdColumn();
                  if (data.component.biObject.name) {
                    const componentName = data.biObjectName;
                    componentNamePicker.value = data.component.biObject.name;
                    if (typeMultiArray.value[2] && typeMultiArray.value[2].length > 0) {
                      const thirdLevelIndex = typeMultiArray.value[2].findIndex((item) => item === componentNamePicker.value);
                      if (thirdLevelIndex !== -1 && componentNamePicker.value !== "其他") {
                        typeMultiIndex.value[2] = thirdLevelIndex;
                        formatAppLog("log", "at pages/add-disease/add-disease.vue:1431", "成功设置构件名称(第三级):", componentNamePicker.value);
                        if (typeMultiIndex.value[1] >= 0 && typeMultiIndex.value[1] < biObjectNameOptions.value.length) {
                          biObjectindex.value = typeMultiIndex.value[1];
                          formatAppLog("log", "at pages/add-disease/add-disease.vue:1437", "成功设置biObjectindex:", biObjectindex.value);
                        }
                      } else if (componentNamePicker.value === "其他") {
                        componentNameInput.value = componentName;
                        formatAppLog("log", "at pages/add-disease/add-disease.vue:1442", "设置自定义构件名称:", componentName);
                      }
                    } else {
                      componentNameInput.value = componentName;
                      formatAppLog("log", "at pages/add-disease/add-disease.vue:1447", "第三级列表为空，设置自定义构件名称:", componentName);
                    }
                  }
                } else {
                  if ((_c = data.component) == null ? void 0 : _c.name) {
                    componentNamePicker.value = data.component.name;
                    componentNameInput.value = data.component.name;
                    formatAppLog("log", "at pages/add-disease/add-disease.vue:1456", "设置自定义构件名称:", data.component.name);
                  }
                }
              } else if ((_d = data.component) == null ? void 0 : _d.name) {
                componentNamePicker.value = data.component.name;
                componentNameInput.value = data.component.name;
                formatAppLog("log", "at pages/add-disease/add-disease.vue:1463", "设置自定义构件名称:", data.component.name);
              }
            } else {
              formatAppLog("log", "at pages/add-disease/add-disease.vue:1466", "第二维数据初始化失败，无法设置构件名称");
              if ((_e2 = data.component) == null ? void 0 : _e2.name) {
                componentNamePicker.value = data.component.name;
                componentNameInput.value = data.component.name;
                formatAppLog("log", "at pages/add-disease/add-disease.vue:1471", "设置自定义构件名称:", data.component.name);
              }
            }
          }
        }
        if ((_f = data.component) == null ? void 0 : _f.code) {
          componentCodeInput.value = data.component.code;
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1480", "成功设置构件编号:", data.component.code);
        }
        if (data.type) {
          updateDiseaseTypeOptions();
          type.value = data.type;
          if (diseaseTypeOptions.value.includes(data.type)) {
            typePicker.value = data.type;
            typeInput.value = "";
          } else {
            typePicker.value = "其他";
            typeInput.value = data.type;
          }
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1498", "成功设置病害类型:", data.type);
        }
        if (data.position) {
          updateDiseasePositionOptions();
          position.value = data.position;
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1506", "预设选项:", diseasePosition.value);
          if (diseasePosition.value.includes(data.position)) {
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1509", "在预设选项中:", data.position);
            positionPicker.value = data.position;
            positionInput.value = "";
          } else {
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1513", "不在预设选项中:", data.position);
            positionPicker.value = "其他";
            positionInput.value = data.position;
          }
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1518", "成功设置病害位置:", data.position);
        }
        if (data.quantity) {
          quantity.value = parseInt(data.quantity) || 1;
        }
        if (data.participateAssess !== void 0) {
          participateAssessindex.value = data.participateAssess === "0" ? 0 : 1;
        }
        if (data.nature) {
          const natureItem = nature.value.find((item) => item.text === data.nature);
          if (natureItem) {
            natureindex.value = natureItem.value;
          }
        }
        if (data.level) {
          const levelVal = parseInt(data.level);
          if (data.diseaseType && data.diseaseType.maxScale && data.diseaseType.minScale) {
            const minScale = parseInt(data.diseaseType.minScale) || 1;
            const maxScale = parseInt(data.diseaseType.maxScale) || 4;
            const newLevelOptions = [];
            for (let i2 = minScale; i2 <= maxScale; i2++) {
              newLevelOptions.push({
                text: String(i2),
                value: i2
              });
            }
            level.value = newLevelOptions;
            levelindex.value = Math.max(minScale, Math.min(maxScale, levelVal));
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1562", "根据病害类型设置评定标度范围:", minScale, "至", maxScale, "选中值:", levelindex.value);
          } else {
            levelindex.value = levelVal;
          }
        }
        if (data.description) {
          description.value = data.description;
        }
        if (data.diseaseDetails && Array.isArray(data.diseaseDetails) && data.diseaseDetails.length > 0) {
          const quantity2 = parseInt(data.quantity) || 0;
          const isRangeMode = quantity2 >= 10;
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1580", "根据quantity判断范围模式:", quantity2, isRangeMode);
          if (isRangeMode) {
            const detail = data.diseaseDetails[0];
            const rangeData = {
              useRangeMode: true,
              // 最小值
              lengthRangeStart: detail.lengthRangeStart || "",
              lengthRangeEnd: detail.lengthRangeEnd || "",
              widthRangeStart: detail.widthRangeStart || "",
              widthRangeEnd: detail.widthRangeEnd || "",
              heightDepthRangeStart: detail.heightDepthRangeStart || "",
              heightDepthRangeEnd: detail.heightDepthRangeEnd || "",
              crackWidthRangeStart: detail.crackWidthRangeStart || "",
              crackWidthRangeEnd: detail.crackWidthRangeEnd || "",
              areaRangeStart: detail.areaRangeStart || "",
              areaRangeEnd: detail.areaRangeEnd || "",
              volumeRangeStart: detail.volumeRangeStart || "",
              volumeRangeEnd: detail.volumeRangeEnd || "",
              angleRangeStart: detail.angleRangeStart || "",
              angleRangeEnd: detail.angleRangeEnd || "",
              percentageRangeStart: detail.percentageRangeStart || "",
              percentageRangeEnd: detail.percentageRangeEnd || "",
              // 参考面信息
              reference1Location: detail.reference1Location || "",
              reference1LocationStart: detail.reference1LocationStart || "",
              reference1LocationEnd: detail.reference1LocationEnd || "",
              reference2Location: detail.reference2Location || "",
              reference2LocationStart: detail.reference2LocationStart || "",
              reference2LocationEnd: detail.reference2LocationEnd || "",
              // 裂缝特征和趋势 - 查找索引值
              crackTypeIndex: findIndexByText(crackType.value, detail.crackType) || 0,
              developmentTrendIndex: findIndexByText(developmentTrend.value, detail.developmentTrend) || 0
            };
            diseaseDataList.value = [rangeData];
          } else {
            const newList = data.diseaseDetails.map((detail) => {
              return {
                useRangeMode: false,
                length: detail.length || "",
                width: detail.width || "",
                heightDepth: detail.heightDepth || "",
                crackWidth: detail.crackWidth || "",
                area: detail.area || "",
                volume: detail.volume || "",
                angle: detail.angle || "",
                percentage: detail.percentage || "",
                // 参考面信息
                reference1Location: detail.reference1Location || "",
                reference1LocationStart: detail.reference1LocationStart || "",
                reference1LocationEnd: detail.reference1LocationEnd || "",
                reference2Location: detail.reference2Location || "",
                reference2LocationStart: detail.reference2LocationStart || "",
                reference2LocationEnd: detail.reference2LocationEnd || "",
                // 裂缝特征和趋势 - 查找索引值
                crackTypeIndex: findIndexByText(crackType.value, detail.crackType) || 0,
                developmentTrendIndex: findIndexByText(developmentTrend.value, detail.developmentTrend) || 0
              };
            });
            diseaseDataList.value = newList;
          }
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1658", "成功设置diseaseDetails数据, 条目数量:", diseaseDataList.value.length);
        } else {
          const defaultData = {
            useRangeMode: false,
            length: data.length || "",
            width: data.width || "",
            heightDepth: data.heightDepth || "",
            crackWidth: data.crackWidth || "",
            area: data.area || "",
            volume: "",
            angle: "",
            percentage: "",
            reference1Location: "",
            reference1LocationStart: "",
            reference1LocationEnd: "",
            reference2Location: "",
            reference2LocationStart: "",
            reference2LocationEnd: "",
            crackTypeIndex: 0,
            developmentTrendIndex: findIndexByText(developmentTrend.value, data.developmentTrend) || 0
          };
          diseaseDataList.value = [defaultData];
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1683", "使用老格式数据创建默认记录");
        }
        if (data.images && Array.isArray(data.images)) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1688", "开始处理图片数据......:", data.images);
          const imagesPaths = readDiseaseImages(userInfo.username, buildingId.value, data.images);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1690", "处理后的图片路径:", imagesPaths);
          fileList.value = imagesPaths.map((url, index) => ({
            name: `图片${index + 1}`,
            url,
            extname: "jpg",
            size: 0
          }));
        }
        if (data.ADImgs && Array.isArray(data.ADImgs)) {
          const ADImgsPaths = readDiseaseImages(userInfo.username, buildingId.value, data.ADImgs);
          ADImgs.value = ADImgsPaths.map((src, index) => ({
            src
          }));
        }
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1707", "表单数据填充完成");
      };
      const findIndexByText = (optionsArray, targetText) => {
        if (!optionsArray || !Array.isArray(optionsArray) || !targetText)
          return 0;
        const index = optionsArray.findIndex(
          (item) => item.text && item.text === targetText || item === targetText
        );
        return index !== -1 ? index : 0;
      };
      const imageStyles = vue.reactive({
        width: "150rpx",
        height: "150rpx"
      });
      const beforedisease = () => {
        var _a;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1728", "上一条");
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
        const currentId = options == null ? void 0 : options.id;
        if (!currentId || !grandObjectName.value) {
          uni.showToast({
            title: "无法获取当前病害信息",
            icon: "none"
          });
          return;
        }
        uni.$emit("getDiseasesOfType", {
          type: grandObjectName.value,
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
            const currentIndex = validDiseases.findIndex((item) => String(item.id) === String(
              currentId
            ));
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
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1781", "下一条");
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
        const currentId = options == null ? void 0 : options.id;
        if (!currentId || !grandObjectName.value) {
          uni.showToast({
            title: "无法获取当前病害信息",
            icon: "none"
          });
          return;
        }
        uni.$emit("getDiseasesOfType", {
          type: grandObjectName.value,
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
            const currentIndex = validDiseases.findIndex((item) => String(item.id) === String(
              currentId
            ));
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
            formatAppLog("log", "at pages/add-disease/add-disease.vue:1850", "成功导航到病害:", disease.id);
          },
          fail: (error) => {
            formatAppLog("error", "at pages/add-disease/add-disease.vue:1853", "导航失败:", error);
            uni.showToast({
              title: "切换失败，请重试",
              icon: "none"
            });
          }
        });
      };
      const savetonextdisease = () => {
        var _a, _b, _c, _d;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1863", "保存并复制到下一条");
        const diseaseData = createDiseaseData();
        if (diseaseData) {
          saveWithoutNavigateBack(diseaseData);
        }
        diseaseData.id = ((_b = (_a = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _a.options) == null ? void 0 : _b.id) || (/* @__PURE__ */ new Date()).getTime();
        diseaseData.local_id = ((_d = (_c = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _c.options) == null ? void 0 : _d.id) || (/* @__PURE__ */ new Date()).getTime();
      };
      const createDiseaseData = () => {
        var _a, _b, _c, _d, _e2, _f;
        let diseaseTypeObj = null;
        if (typePicker.value && allDiseaseTypes.length > 0) {
          diseaseTypeObj = allDiseaseTypes.find((item) => item.name === typePicker.value);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1880", "找到的病害类型对象:", diseaseTypeObj ? diseaseTypeObj.name : "未找到");
        }
        let biObjectObj = null;
        if (biObjectindex.value !== -1 && biObjectNameOptions.value && biObjectNameOptions.value[biObjectindex.value]) {
          biObjectObj = biObjectNameOptions.value[biObjectindex.value];
        }
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1889", "选中的第二级构件对象:", biObjectObj);
        let diseaseDetails = [];
        const numValue = parseInt(quantity.value);
        const isRangeMode = numValue >= 10;
        formatAppLog("log", "at pages/add-disease/add-disease.vue:1895", "保存时使用的模式:", isRangeMode ? "范围模式" : "普通模式", "缺损数量:", numValue);
        if (isRangeMode) {
          const rangeData = diseaseDataList.value[0];
          diseaseDetails.push({
            // 普通模式字段设为空
            length: "",
            width: "",
            heightDepth: "",
            crackWidth: "",
            area: "",
            volume: "",
            angle: "",
            percentage: "",
            // 范围模式字段
            lengthRangeStart: rangeData.lengthRangeStart || "",
            lengthRangeEnd: rangeData.lengthRangeEnd || "",
            widthRangeStart: rangeData.widthRangeStart || "",
            widthRangeEnd: rangeData.widthRangeEnd || "",
            heightDepthRangeStart: rangeData.heightDepthRangeStart || "",
            heightDepthRangeEnd: rangeData.heightDepthRangeEnd || "",
            crackWidthRangeStart: rangeData.crackWidthRangeStart || "",
            crackWidthRangeEnd: rangeData.crackWidthRangeEnd || "",
            areaRangeStart: rangeData.areaRangeStart || "",
            areaRangeEnd: rangeData.areaRangeEnd || "",
            volumeRangeStart: rangeData.volumeRangeStart || "",
            volumeRangeEnd: rangeData.volumeRangeEnd || "",
            angleRangeStart: rangeData.angleRangeStart || "",
            angleRangeEnd: rangeData.angleRangeEnd || "",
            percentageRangeStart: rangeData.percentageRangeStart || "",
            percentageRangeEnd: rangeData.percentageRangeEnd || "",
            // 公共字段
            crackType: ((_a = crackType.value[rangeData.crackTypeIndex]) == null ? void 0 : _a.text) || "纵向",
            developmentTrend: ((_b = developmentTrend.value[rangeData.developmentTrendIndex]) == null ? void 0 : _b.text) || "稳定",
            reference1Location: rangeData.reference1Location || "",
            reference1LocationStart: rangeData.reference1LocationStart || "",
            reference1LocationEnd: rangeData.reference1LocationEnd || "",
            reference2Location: rangeData.reference2Location || "",
            reference2LocationStart: rangeData.reference2LocationStart || "",
            reference2LocationEnd: rangeData.reference2LocationEnd || ""
          });
          formatAppLog("log", "at pages/add-disease/add-disease.vue:1943", "保存时生成的范围模式数据结构:", JSON.stringify(diseaseDetails[0]));
        } else {
          diseaseDataList.value.forEach((item) => {
            var _a2, _b2;
            diseaseDetails.push({
              // 普通模式字段
              length: item.length || "",
              width: item.width || "",
              heightDepth: item.heightDepth || "",
              crackWidth: item.crackWidth || "",
              area: item.area || "",
              volume: item.volume || "",
              angle: item.angle || "",
              percentage: item.percentage || "",
              // 范围模式字段设为空
              lengthRangeStart: "",
              lengthRangeEnd: "",
              widthRangeStart: "",
              widthRangeEnd: "",
              heightDepthRangeStart: "",
              heightDepthRangeEnd: "",
              crackWidthRangeStart: "",
              crackWidthRangeEnd: "",
              areaRangeStart: "",
              areaRangeEnd: "",
              volumeRangeStart: "",
              volumeRangeEnd: "",
              angleRangeStart: "",
              angleRangeEnd: "",
              percentageRangeStart: "",
              percentageRangeEnd: "",
              // 公共字段
              crackType: ((_a2 = crackType.value[item.crackTypeIndex]) == null ? void 0 : _a2.text) || "纵向",
              developmentTrend: ((_b2 = developmentTrend.value[item.developmentTrendIndex]) == null ? void 0 : _b2.text) || "稳定",
              reference1Location: item.reference1Location || "",
              reference1LocationStart: item.reference1LocationStart || "",
              reference1LocationEnd: item.reference1LocationEnd || "",
              reference2Location: item.reference2Location || "",
              reference2LocationStart: item.reference2LocationStart || "",
              reference2LocationEnd: item.reference2LocationEnd || ""
            });
          });
        }
        const componentName = getComponentName();
        const thirdLevelComponentId = getThirdLevelComponentId();
        const thirdLevelComponentName = getThirdLevelComponentName();
        return {
          createBy: "",
          createTime: formatDateTime(),
          updateTime: formatDateTime(),
          id: ((_d = (_c = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _c.options) == null ? void 0 : _d.id) || (/* @__PURE__ */ new Date()).getTime(),
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
          level: parseInt(levelindex.value) || 1,
          quantity: parseInt(quantity.value),
          // 直接存储详细数据
          diseaseDetails,
          type: type.value,
          // 直接使用type.value而不是通过索引获取
          nature: nature.value[natureindex.value].text,
          participateAssess: participateAssessindex.value.toString(),
          biObjectId: thirdLevelComponentId || (biObjectObj ? biObjectObj.id : null),
          projectId: idStorageInfo.projectId,
          biObjectName: componentName,
          //使用三级选择或输入框中的值
          component: {
            createBy: "",
            createTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            updateTime: formatDateTime(new Date((/* @__PURE__ */ new Date()).setFullYear(2025))),
            id: null,
            // 第一级id设为null
            code: componentCodeInput.value,
            // 使用输入的构件编号
            name: componentName + "#" + componentCodeInput.value,
            // 使用第三级选择的值或输入框中的值#构件编号
            biObjectId: thirdLevelComponentId || (biObjectObj ? biObjectObj.id : null),
            status: "0",
            delFlag: "0",
            biObject: {
              id: thirdLevelComponentId || (biObjectObj ? biObjectObj.id : null),
              name: thirdLevelComponentName || (biObjectObj ? biObjectObj.name : ""),
              // 使用第三级选择的值
              count: 0
            },
            parentObjectName: parentObjectName.value,
            // 使用第二级选择的值
            grandObjectName: grandObjectName.value
            // 使用第一级选择的值
          },
          componentId: null,
          // 组件ID也设为null
          buildingId: buildingId.value,
          images: [],
          // 初始化为空数组，等待图片保存后更新
          ADImgs: [],
          // 添加AD图片字段
          commit_type: 1,
          //0为已提交 1为未提交 2为删除
          local_id: ((_f = (_e2 = getCurrentPages()[getCurrentPages().length - 1].$page) == null ? void 0 : _e2.options) == null ? void 0 : _f.id) || (/* @__PURE__ */ new Date()).getTime()
        };
      };
      const saveWithoutNavigateBack = (diseaseData) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2053", "保存但不返回");
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
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2073", "已清空图片列表，保留其他表单数据");
            uni.showToast({
              title: "已保存，可继续添加下一条",
              icon: "none",
              duration: 1500
            });
          }, 500);
        }).catch((error) => {
          formatAppLog("error", "at pages/add-disease/add-disease.vue:2084", "保存失败:", error);
          uni.hideLoading();
          uni.showToast({
            title: "保存失败，请重试",
            icon: "none"
          });
        });
      };
      const saveImagesAndUpdateDisease = async (diseaseData, isEditMode) => {
        var _a;
        const pages2 = getCurrentPages();
        const currentPage = pages2[pages2.length - 1];
        const options = (_a = currentPage.$page) == null ? void 0 : _a.options;
        let originalImages = [];
        let originalADImages = [];
        if (isEditMode && options && options.data) {
          try {
            const originalData = JSON.parse(decodeURIComponent(options.data));
            originalImages = readDiseaseImages(userInfo.username, buildingId.value, originalData.images) || [];
            originalADImages = readDiseaseImages(userInfo.username, buildingId.value, originalData.ADImgs) || [];
          } catch (error) {
            formatAppLog("error", "at pages/add-disease/add-disease.vue:2110", "解析原始数据失败:", error);
          }
        }
        const currentImageUrls = fileList.value.map((img) => img.url);
        const currentADImages = ADImgs.value.map((img) => img.src);
        try {
          let imageRelativePaths = [];
          if (currentImageUrls.length > 0) {
            imageRelativePaths = await saveDiseaseImages(userInfo.username, buildingId.value, currentImageUrls);
            diseaseData.images = imageRelativePaths;
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2124", "保存当前所有病害图片，相对路径:", imageRelativePaths);
          } else {
            diseaseData.images = [];
          }
          let adImageRelativePaths = [];
          if (currentADImages.length > 0) {
            adImageRelativePaths = await saveDiseaseImages(userInfo.username, buildingId.value, currentADImages);
            diseaseData.ADImgs = adImageRelativePaths;
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2134", "保存当前所有AD图片，相对路径:", adImageRelativePaths);
          } else {
            diseaseData.ADImgs = [];
          }
          if (originalImages.length > 0) {
            await removeDiseaseImage(originalImages).then((result) => {
              formatAppLog("log", "at pages/add-disease/add-disease.vue:2143", "删除原有病害图片成功:", result);
            }).catch((error) => {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:2146", "删除原有病害图片失败:", error);
            });
          }
          if (originalADImages.length > 0) {
            await removeDiseaseImage(originalADImages).then((result) => {
              formatAppLog("log", "at pages/add-disease/add-disease.vue:2154", "删除原有AD图片成功:", result);
            }).catch((error) => {
              formatAppLog("error", "at pages/add-disease/add-disease.vue:2157", "删除原有AD图片失败:", error);
            });
          }
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2161", "已保存病害图片，更新病害数据...:", diseaseData);
          if (isEditMode) {
            uni.$emit("updateDisease", diseaseData);
          } else {
            uni.$emit("addNewDisease", diseaseData);
          }
        } catch (error) {
          formatAppLog("error", "at pages/add-disease/add-disease.vue:2169", "保存图片过程中发生错误:", error);
          plus.nativeUI.toast("保存图片失败");
          throw error;
        }
      };
      const getComponentName = () => {
        let componentName = "";
        if (componentNamePicker.value === "其他") {
          componentName = componentNameInput.value;
        } else if (typeMultiIndex.value[2] >= 0 && typeMultiIndex.value[2] < typeMultiArray.value[2].length) {
          componentName = typeMultiArray.value[2][typeMultiIndex.value[2]];
        } else {
          componentName = parentObjectName.value;
        }
        return componentName;
      };
      const savedisease = () => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2191", "保存按钮点击");
        const diseaseData = createDiseaseData();
        if (!diseaseData.type || !diseaseData.component || !diseaseData.position || !diseaseData.description) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2198", "数据不完整，请确保选择了构件名称、构件编号、病害类型和病害位置");
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
                  id: currentId
                };
                formatAppLog("log", "at pages/add-disease/add-disease.vue:2269", "准备发送deleteDisease事件，标记删除ID:", currentId);
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
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2294", "复制并新增");
        fileList.value = [];
        ADImgs.value = [];
        openMode.value = "create";
        uni.showToast({
          title: "复制成功",
          icon: "none",
          duration: 500
        });
      };
      const editDisease = () => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2315", "编辑");
        const diseaseData = createDiseaseData();
        diseaseData.commit_type = 1;
        if (!diseaseData.type || !diseaseData.component || !diseaseData.position || !diseaseData.description) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2323", "数据不完整，请确保选择了构件名称、构件编号、病害类型和病害位置");
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
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2361", "文件选择事件", e2);
        if (e2 && e2.tempFiles && e2.tempFiles.length > 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2364", "选择的文件数量:", e2.tempFiles.length);
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
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2400", "更新后的fileList:", fileList.value);
          const paths = getImagePaths(fileList.value);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2404", "当前有效路径数:", paths.length);
        }
      };
      const handleFileDelete = (e2) => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2409", "文件删除事件", e2);
        if (e2 && e2.tempFile && e2.tempFile.name) {
          const fileName = e2.tempFile.name;
          fileList.value = fileList.value.filter((file) => file.name !== fileName);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2418", "删除后的文件列表:", fileList.value);
        } else if (e2 && e2.index !== void 0 && e2.index >= 0) {
          fileList.value.splice(e2.index, 1);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2422", "删除后的文件列表:", fileList.value);
        }
      };
      const getImagePaths = (fileListData) => {
        const paths = [];
        if (!fileListData || !Array.isArray(fileListData) || fileListData.length === 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2431", "文件列表为空");
          return paths;
        }
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2435", "处理文件列表:", fileListData);
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
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2455", `文件[${index}]有效路径:`, path);
            paths.push(path);
          } else {
            formatAppLog("warn", "at pages/add-disease/add-disease.vue:2458", `文件[${index}]没有有效路径:`, file);
          }
        });
        return paths;
      };
      const onClickTemplate = (templateIndex) => {
        uni.navigateTo({
          url: `/pages/canvas/canvas?template=${templateIndex}`,
          success: (res) => {
            res.eventChannel.once("returnData", (data) => {
              ADImgs.value.push({
                src: data.src
              });
            });
            popup.value.close();
          }
        });
      };
      const selectCanvasTemplate = () => {
        popup.value.open();
      };
      const removeImage = (index) => {
        ADImgs.value.splice(index, 1);
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
          const data = await getObject(userInfo.username, buildingId.value);
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2504", "结构数据获取成功:", data);
          structureData.value = data;
          return Promise.resolve(data);
        } catch (error) {
          formatAppLog("error", "at pages/add-disease/add-disease.vue:2510", "获取结构数据失败:", error);
          uni.showToast({
            title: "获取结构数据失败",
            icon: "none"
          });
          return Promise.reject(error);
        }
      };
      const updateDiseaseTypeOptions = () => {
        if (typeMultiIndex.value[1] < 0 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2525", "无效的部件类型选择");
          diseaseTypeOptions.value = [];
          return;
        }
        if (typeMultiIndex.value[1] >= biObjectNameOptions.value.length) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2532", "部件类型选择超出范围");
          diseaseTypeOptions.value = [];
          return;
        }
        const selectedBiObject = biObjectNameOptions.value[typeMultiIndex.value[1]];
        if (!selectedBiObject) {
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2540", "选中的部件类型不存在");
          diseaseTypeOptions.value = [];
          return;
        }
        allDiseaseTypes = [];
        if (selectedBiObject.diseaseTypes && Array.isArray(selectedBiObject.diseaseTypes)) {
          allDiseaseTypes = [...selectedBiObject.diseaseTypes];
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2551", "第二级病害类型:", allDiseaseTypes);
        }
        if (typeMultiIndex.value[2] >= 0 && selectedBiObject.children && Array.isArray(selectedBiObject.children) && typeMultiIndex.value[2] < selectedBiObject.children.length) {
          const selectedThirdLevel = selectedBiObject.children[typeMultiIndex.value[2]];
          if (selectedThirdLevel && selectedThirdLevel.diseaseTypes && Array.isArray(selectedThirdLevel.diseaseTypes)) {
            selectedThirdLevel.diseaseTypes.forEach((item) => {
              if (!allDiseaseTypes.some((existing) => existing.id === item.id)) {
                allDiseaseTypes.push(item);
              }
            });
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2568", "添加第三级后的病害类型:", allDiseaseTypes);
          }
        }
        diseaseTypeOptions.value = allDiseaseTypes.map((item) => item.name);
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2575", "最终缺损类型选项更新为:", diseaseTypeOptions.value);
        if (type.value) {
          const index = diseaseTypeOptions.value.findIndex((item) => item === type.value);
          if (index !== -1) {
            typeindex.value = index;
            typePicker.value = type.value;
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2583", "成功设置病害类型索引:", index);
          } else {
            typePicker.value = "其他";
            typeInput.value = type.value;
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2588", "当前病害类型不在选项中，设为自定义输入:", type.value);
          }
        }
      };
      const clearQuantity = () => {
        quantity.value = "";
      };
      const componentNameInput = vue.ref("");
      const componentCodeInput = vue.ref("");
      const updateDiseasePositionOptions = () => {
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2606", "开始更新病害位置选项");
        if (typeMultiIndex.value[1] < 0 || !biObjectNameOptions.value || biObjectNameOptions.value.length === 0) {
          diseasePosition.value = [];
          return;
        }
        const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
        if (!selectedSecondLevel) {
          diseasePosition.value = [];
          return;
        }
        if (typeMultiArray.value[2].length > 0 && typeMultiIndex.value[2] >= 0) {
          if (selectedSecondLevel.children && Array.isArray(selectedSecondLevel.children) && typeMultiIndex.value[2] < selectedSecondLevel.children.length) {
            const selectedThirdLevel = selectedSecondLevel.children[typeMultiIndex.value[2]];
            if (selectedThirdLevel && selectedThirdLevel.children && Array.isArray(selectedThirdLevel.children)) {
              diseasePosition.value = selectedThirdLevel.children.map((item) => item.name);
              formatAppLog("log", "at pages/add-disease/add-disease.vue:2632", "更新病害位置选项为第三级子组件:", diseasePosition.value);
              return;
            }
          }
        }
        diseasePosition.value = [];
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2640", "使用默认病害位置选项");
      };
      const openReferenceSurfacePopup = (surfaceNumber = 1, diseaseIndex = 0) => {
        currentReferenceSurface.value = surfaceNumber;
        currentDiseaseIndex.value = diseaseIndex;
        referenceSurfaceInput.value = "";
        if (!position.value) {
          uni.showToast({
            title: "请先选择病害位置",
            icon: "none"
          });
          return;
        }
        let positionProps = "";
        let selectedComponent = null;
        if (typeMultiIndex.value[2] >= 0 && typeMultiArray.value[2].length > 0 && biObjectNameOptions.value && biObjectNameOptions.value[typeMultiIndex.value[1]] && biObjectNameOptions.value[typeMultiIndex.value[1]].children) {
          selectedComponent = biObjectNameOptions.value[typeMultiIndex.value[1]].children[typeMultiIndex.value[2]];
        } else if (typeMultiIndex.value[1] >= 0 && biObjectNameOptions.value && biObjectNameOptions.value.length > 0) {
          selectedComponent = biObjectNameOptions.value[typeMultiIndex.value[1]];
        }
        if (selectedComponent && selectedComponent.children && Array.isArray(selectedComponent.children)) {
          const matchingChild = selectedComponent.children.find((child) => child.name === position.value);
          if (matchingChild && matchingChild.props) {
            positionProps = matchingChild.props;
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2697", "找到匹配的病害位置组件:", matchingChild.name, "其props:", positionProps);
          }
        }
        if (!positionProps && selectedComponent && selectedComponent.props) {
          positionProps = selectedComponent.props;
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2704", "使用当前选中组件的props:", positionProps);
        }
        if (positionProps) {
          const options = parsePropsForRef(positionProps, `ref${surfaceNumber}`);
          if (options && options.length > 0) {
            referenceSurfaceOptions.value = options;
            formatAppLog("log", "at pages/add-disease/add-disease.vue:2712", `解析到参考面${surfaceNumber}选项:`, options);
          } else {
            setDefaultReferenceSurfaceOptions(surfaceNumber);
          }
        } else {
          setDefaultReferenceSurfaceOptions(surfaceNumber);
        }
        referenceSurfacePopup.value.open();
      };
      const setDefaultReferenceSurfaceOptions = (surfaceNumber) => {
        if (surfaceNumber === 1) {
          referenceSurfaceOptions.value = [];
        } else {
          referenceSurfaceOptions.value = [];
        }
        formatAppLog("log", "at pages/add-disease/add-disease.vue:2733", `使用默认参考面${surfaceNumber}选项:`, referenceSurfaceOptions.value);
      };
      const parsePropsForRef = (propsString, refKey) => {
        if (!propsString)
          return [];
        const refParts = propsString.split("&&");
        for (const refPart of refParts) {
          if (refPart.startsWith(refKey + ":=")) {
            const parts = refPart.split(":=");
            if (parts.length === 2) {
              const values = parts[1].split("、");
              return values.filter((value) => value.trim() !== "");
            }
          }
        }
        return [];
      };
      const confirmreferenceSurfaceInput = () => {
        if (!referenceSurfaceInput.value.trim()) {
          uni.showToast({
            title: "请输入参考面",
            icon: "none"
          });
          return;
        }
        if (currentReferenceSurface.value === 1) {
          diseaseDataList.value[currentDiseaseIndex.value].reference1Location = referenceSurfaceInput.value.trim();
        } else {
          diseaseDataList.value[currentDiseaseIndex.value].reference2Location = referenceSurfaceInput.value.trim();
        }
        referenceSurfacePopup.value.close();
      };
      const selectReferenceSurfaceItem = (item) => {
        if (currentReferenceSurface.value === 1) {
          diseaseDataList.value[currentDiseaseIndex.value].reference1Location = item;
        } else {
          diseaseDataList.value[currentDiseaseIndex.value].reference2Location = item;
        }
        referenceSurfacePopup.value.close();
      };
      const clearReferenceSurfaceStart = (diseaseIndex, surfaceNumber) => {
        if (surfaceNumber === 1) {
          diseaseDataList.value[diseaseIndex].reference1LocationStart = "";
        } else {
          diseaseDataList.value[diseaseIndex].reference2LocationStart = "";
        }
      };
      const clearReferenceSurfaceEnd = (diseaseIndex, surfaceNumber) => {
        if (surfaceNumber === 1) {
          diseaseDataList.value[diseaseIndex].reference1LocationEnd = "";
        } else {
          diseaseDataList.value[diseaseIndex].reference2LocationEnd = "";
        }
      };
      const currentDiseaseIndex = vue.ref(0);
      const getThirdLevelComponentId = () => {
        let thirdLevelComponentId = null;
        if (typeMultiIndex.value[2] >= 0 && !isThirdLevelOther()) {
          const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
          if (selectedSecondLevel && selectedSecondLevel.children && Array.isArray(selectedSecondLevel.children) && typeMultiIndex.value[2] < selectedSecondLevel.children.length) {
            const selectedThirdLevel = selectedSecondLevel.children[typeMultiIndex.value[2]];
            if (selectedThirdLevel && selectedThirdLevel.id) {
              thirdLevelComponentId = selectedThirdLevel.id;
              formatAppLog("log", "at pages/add-disease/add-disease.vue:2821", "找到第三级组件ID:", thirdLevelComponentId);
            }
          }
        }
        return thirdLevelComponentId;
      };
      const getThirdLevelComponentName = () => {
        let thirdLevelComponentName = null;
        if (typeMultiIndex.value[2] >= 0 && !isThirdLevelOther()) {
          const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
          if (selectedSecondLevel && selectedSecondLevel.children && Array.isArray(selectedSecondLevel.children) && typeMultiIndex.value[2] < selectedSecondLevel.children.length) {
            const selectedThirdLevel = selectedSecondLevel.children[typeMultiIndex.value[2]];
            if (selectedThirdLevel && selectedThirdLevel.name) {
              thirdLevelComponentName = selectedThirdLevel.name;
              formatAppLog("log", "at pages/add-disease/add-disease.vue:2839", "找到第三级组件Name:", thirdLevelComponentName);
            }
          }
        }
        return thirdLevelComponentName;
      };
      const isThirdLevelOther = () => {
        if (typeMultiIndex.value[1] < 0 || typeMultiIndex.value[2] < 0) {
          return true;
        }
        const selectedSecondLevel = biObjectNameOptions.value[typeMultiIndex.value[1]];
        if (!selectedSecondLevel || !selectedSecondLevel.children || !Array.isArray(selectedSecondLevel.children)) {
          return true;
        }
        return typeMultiIndex.value[2] >= selectedSecondLevel.children.length;
      };
      vue.watch([typePicker, typeInput], ([newTypePicker, newTypeInput]) => {
        if (newTypePicker === "其他" && newTypeInput) {
          type.value = newTypeInput;
        } else {
          type.value = newTypePicker;
        }
      }, {
        deep: true
      });
      const onDiseaseTypeChange = (e2) => {
        const index = e2.detail.value;
        if (index >= 0 && index < diseaseTypeOptions.value.length) {
          typePicker.value = diseaseTypeOptions.value[index];
          typeindex.value = index;
          if (typePicker.value === "其他") {
            typeInput.value = "";
          } else {
            type.value = typePicker.value;
            const selectedDiseaseType = allDiseaseTypes.find((item) => item.name === typePicker.value);
            if (selectedDiseaseType && selectedDiseaseType.maxScale && selectedDiseaseType.minScale) {
              const minScale = parseInt(selectedDiseaseType.minScale) || 1;
              const maxScale = parseInt(selectedDiseaseType.maxScale) || 4;
              const newLevelOptions = [];
              for (let i2 = minScale; i2 <= maxScale; i2++) {
                newLevelOptions.push({
                  text: String(i2),
                  value: i2
                });
              }
              level.value = newLevelOptions;
              if (levelindex.value < minScale || levelindex.value > maxScale) {
                levelindex.value = minScale;
              }
              formatAppLog("log", "at pages/add-disease/add-disease.vue:2909", "更新评定标度范围:", minScale, "至", maxScale);
            }
          }
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2913", "病害类型选择变更为:", typePicker.value);
        }
      };
      const onDiseasePositionChange = (e2) => {
        const index = e2.detail.value;
        if (index >= 0 && index < diseasePosition.value.length) {
          positionPicker.value = diseasePosition.value[index];
          if (positionPicker.value === "其他") {
            positionInput.value = "";
          } else {
            position.value = positionPicker.value;
          }
          formatAppLog("log", "at pages/add-disease/add-disease.vue:2931", "病害位置选择变更为:", positionPicker.value);
        }
      };
      vue.watch([positionPicker, positionInput], ([newPositionPicker, newPositionInput]) => {
        if (newPositionPicker === "其他" && newPositionInput) {
          position.value = newPositionInput;
        } else if (newPositionPicker !== "其他") {
          position.value = newPositionPicker;
        }
      }, {
        deep: true
      });
      const __returned__ = { userId, userInfo, idStorageInfo, buildingId, bridgeIdFromURL, openMode, popup, ADImgs, isEdit, structureData, parentObjectName, grandObjectName, biObjectNameOptions, diseaseTypeOptions, componentNamePicker, biObjectindex, componentCode, componentCodeindex, filteredComponentCodes, get allDiseaseTypes() {
        return allDiseaseTypes;
      }, set allDiseaseTypes(v2) {
        allDiseaseTypes = v2;
      }, type, typeindex, typePicker, typeInput, position, positionPicker, positionInput, diseaseDataList, quantity, createDescription, updateDiseaseDataList, length, width, crackWidth, heightDepth, area, description, fileList, diseasePosition, diseasePositionPopup, selectedPosition, structureTypes, typeMultiArray, typeMultiIndex, natureindex, nature, participateAssess, participateAssessindex, level, levelindex, crackTypeIndex, crackType, developmentTrend, developmentTrendindex, reference1Location, reference2Location, referenceSurfacePopup, currentReferenceSurface, referenceSurfaceInput, referenceSurfaceOptions, initMultiPickerColumns, updateThirdColumn, typeColumnChange, updateComponentNameValues, typeMultiPickerChange, fillFormWithData, findIndexByText, imageStyles, beforedisease, nextdisease, navigateToEditDisease, savetonextdisease, createDiseaseData, saveWithoutNavigateBack, saveImagesAndUpdateDisease, getComponentName, savedisease, canceldisease, formatDateTime, deleteDisease, copyAndAddDisease, editDisease, handleFileSelect, handleFileDelete, getImagePaths, onClickTemplate, selectCanvasTemplate, removeImage, closeDiseasePositionPopup, confirmDiseasePosition, fetchStructureData, updateDiseaseTypeOptions, clearQuantity, componentNameInput, componentCodeInput, updateDiseasePositionOptions, openReferenceSurfacePopup, setDefaultReferenceSurfaceOptions, parsePropsForRef, confirmreferenceSurfaceInput, selectReferenceSurfaceItem, clearReferenceSurfaceStart, clearReferenceSurfaceEnd, currentDiseaseIndex, getThirdLevelComponentId, getThirdLevelComponentName, isThirdLevelOther, onDiseaseTypeChange, onDiseasePositionChange, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted, watch: vue.watch, computed: vue.computed, get getObject() {
        return getObject;
      }, get readDiseaseImages() {
        return readDiseaseImages;
      }, get removeDiseaseImage() {
        return removeDiseaseImage;
      }, get saveDiseaseImages() {
        return saveDiseaseImages;
      }, get userStore() {
        return userStore;
      }, get idStore() {
        return idStore;
      }, get generateDiseaseDescription() {
        return generateDiseaseDescription;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_data_checkbox = resolveEasycom(vue.resolveDynamicComponent("uni-data-checkbox"), __easycom_0);
    const _component_uni_file_picker = resolveEasycom(vue.resolveDynamicComponent("uni-file-picker"), __easycom_1);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_0$2);
    const _component_uni_combox = resolveEasycom(vue.resolveDynamicComponent("uni-combox"), __easycom_3);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 新增病害时显示 "),
      $setup.openMode === "create" ? (vue.openBlock(), vue.createElementBlock("view", {
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
      ])) : $setup.openMode === "edit" ? (vue.openBlock(), vue.createElementBlock(
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
      )) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 历史病害时不显示 "),
      vue.createCommentVNode(" 表单内容容器 - 添加form-container类以便横屏时调整布局 "),
      vue.createElementVNode("view", { class: "form-container" }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { class: "head" }, [
            vue.createElementVNode("view", { class: "head-text" }, " 病害基础信息 ")
          ]),
          vue.createCommentVNode(" 将原来的部件类型picker改为multiSelector "),
          vue.createElementVNode("view", { class: "component-name" }, [
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
                  vue.createElementVNode("view", { class: "picker-title" }, " 构件名称 ")
                ]),
                vue.createElementVNode("view", { class: "picker-right" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "picker-content",
                      style: vue.normalizeStyle($setup.componentNamePicker === "" ? "color: #CCCCCC;" : "")
                    },
                    vue.toDisplayString($setup.componentNamePicker || "请选择构件名称"),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createElementVNode("text", { class: "picker-icon" }, ">"),
                  vue.withDirectives(vue.createElementVNode(
                    "view",
                    { class: "component-name-input" },
                    [
                      vue.withDirectives(vue.createElementVNode(
                        "input",
                        {
                          class: "component-code-input",
                          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.componentNameInput = $event),
                          placeholder: "请输入构件名称",
                          "placeholder-style": "color: #CCCCCC;",
                          onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
                          }, ["stop"]))
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vModelText, $setup.componentNameInput]
                      ]),
                      vue.createElementVNode("view", {
                        class: "clear-input",
                        onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => $setup.componentNameInput = "", ["stop"]))
                      }, "×")
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vShow, $setup.componentNamePicker === "其他"]
                  ])
                ])
              ])
            ], 40, ["value", "range"])
          ]),
          vue.createCommentVNode(" 替换原来的构件编号picker为input输入框 "),
          vue.createElementVNode("view", { class: "picker" }, [
            vue.createElementVNode("view", { class: "picker-titleAndContent" }, [
              vue.createElementVNode("view", { class: "picker-left" }, [
                vue.createElementVNode("text", { class: "picker-must" }, "*"),
                vue.createElementVNode("view", { class: "picker-title" }, " 构件编号 ")
              ]),
              vue.createElementVNode("view", { class: "input-right" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "component-code-input",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.componentCodeInput = $event),
                    placeholder: "请输入构件编号",
                    "placeholder-style": "color: #CCCCCC;"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.componentCodeInput]
                ]),
                vue.createElementVNode("view", {
                  class: "clear-input",
                  onClick: _cache[4] || (_cache[4] = ($event) => $setup.componentCodeInput = "")
                }, "×")
              ])
            ])
          ]),
          vue.createCommentVNode(" 修改病害类型选择器 "),
          vue.createElementVNode("view", { class: "picker" }, [
            vue.createElementVNode("view", { class: "picker-titleAndContent" }, [
              vue.createElementVNode("view", { class: "picker-left" }, [
                vue.createElementVNode("text", { class: "picker-must" }, "*"),
                vue.createElementVNode("view", { class: "picker-title" }, " 病害类型 ")
              ]),
              vue.createElementVNode("view", { class: "picker-right" }, [
                vue.createElementVNode("picker", {
                  class: "picker",
                  range: $setup.diseaseTypeOptions,
                  onChange: $setup.onDiseaseTypeChange
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "picker-content",
                      style: vue.normalizeStyle(!$setup.typePicker ? "color: #CCCCCC;" : "")
                    },
                    vue.toDisplayString($setup.typePicker || "请选择病害类型"),
                    5
                    /* TEXT, STYLE */
                  )
                ], 40, ["range"]),
                vue.createElementVNode("text", { class: "picker-icon" }, ">"),
                vue.withDirectives(vue.createElementVNode(
                  "view",
                  { class: "component-name-input" },
                  [
                    vue.withDirectives(vue.createElementVNode(
                      "input",
                      {
                        class: "component-code-input",
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.typeInput = $event),
                        placeholder: "请输入病害类型",
                        "placeholder-style": "color: #CCCCCC;",
                        onClick: _cache[6] || (_cache[6] = vue.withModifiers(() => {
                        }, ["stop"]))
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vModelText, $setup.typeInput]
                    ]),
                    vue.createElementVNode("view", {
                      class: "clear-input",
                      onClick: _cache[7] || (_cache[7] = vue.withModifiers(($event) => $setup.typeInput = "", ["stop"]))
                    }, "×")
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $setup.typePicker === "其他"]
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 修改病害位置区域 - 从弹窗改为picker和input组合 "),
          vue.createElementVNode("view", { class: "picker" }, [
            vue.createElementVNode("view", { class: "picker-titleAndContent" }, [
              vue.createElementVNode("view", { class: "picker-left" }, [
                vue.createElementVNode("text", { class: "picker-must" }, "*"),
                vue.createElementVNode("view", { class: "picker-title" }, " 病害位置 ")
              ]),
              vue.createElementVNode("view", { class: "picker-right" }, [
                vue.createElementVNode("picker", {
                  class: "picker",
                  range: $setup.diseasePosition,
                  onChange: $setup.onDiseasePositionChange
                }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "picker-content",
                      style: vue.normalizeStyle(!$setup.positionPicker ? "color: #CCCCCC;" : "")
                    },
                    vue.toDisplayString($setup.positionPicker || "请选择病害位置"),
                    5
                    /* TEXT, STYLE */
                  )
                ], 40, ["range"]),
                vue.createElementVNode("text", { class: "picker-icon" }, ">"),
                vue.withDirectives(vue.createElementVNode(
                  "view",
                  { class: "component-name-input" },
                  [
                    vue.withDirectives(vue.createElementVNode(
                      "input",
                      {
                        class: "component-code-input",
                        "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.positionInput = $event),
                        placeholder: "请输入病害位置",
                        "placeholder-style": "color: #CCCCCC;",
                        onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
                        }, ["stop"]))
                      },
                      null,
                      512
                      /* NEED_PATCH */
                    ), [
                      [vue.vModelText, $setup.positionInput]
                    ]),
                    vue.createElementVNode("view", {
                      class: "clear-input",
                      onClick: _cache[10] || (_cache[10] = vue.withModifiers(($event) => $setup.positionInput = "", ["stop"]))
                    }, "×")
                  ],
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vShow, $setup.positionPicker === "其他"]
                ])
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { class: "head" }, [
            vue.createElementVNode("view", { class: "head-text" }, " 病害定量数据 ")
          ]),
          vue.createElementVNode("view", { class: "quantitative-data" }, [
            vue.createElementVNode("view", { class: "quantitative-data-left" }, [
              vue.createElementVNode("text", { class: "picker-must" }, "*"),
              vue.createElementVNode("view", null, "缺损数量")
            ]),
            vue.createElementVNode("view", { class: "quantitative-data-right" }, [
              vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "quantitative-data-right-value-input",
                    placeholder: "请填写",
                    type: "number",
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.quantity = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.quantity]
                ]),
                vue.createElementVNode("view", {
                  class: "clear-input",
                  onClick: $setup.clearQuantity
                }, "×")
              ]),
              vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " 个 ")
              ])
            ])
          ]),
          vue.createCommentVNode(" 使用v-for循环生成多组定量数据输入框 "),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.diseaseDataList, (diseaseData, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: ""
              }, [
                vue.createCommentVNode(" 如果缺损数量大于1，显示缺损编号 "),
                $setup.diseaseDataList.length > 1 ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "disease-index-title"
                  },
                  " 缺损-" + vue.toDisplayString(index + 1),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("view", { class: "line-select" }, [
                  vue.createElementVNode("view", { class: "line-select-left" }, [
                    vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
                    vue.createElementVNode("view", null, "裂缝特征")
                  ]),
                  vue.createElementVNode("view", { class: "line-select-right" }, [
                    vue.createVNode(_component_uni_data_checkbox, {
                      mode: "tag",
                      modelValue: diseaseData.crackTypeIndex,
                      "onUpdate:modelValue": ($event) => diseaseData.crackTypeIndex = $event,
                      localdata: $setup.crackType
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "localdata"])
                  ])
                ]),
                vue.createElementVNode("view", { class: "location-description" }, [
                  vue.createElementVNode("view", { class: "location-description-left" }, " 据参考面1位置 "),
                  vue.createElementVNode("view", { class: "location-description-right" }, [
                    vue.createTextVNode(" 距 "),
                    vue.createElementVNode("view", {
                      class: "location-description-right-position",
                      onClick: ($event) => $setup.openReferenceSurfacePopup(1, index)
                    }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "location-description-right-position-input",
                          style: vue.normalizeStyle(!diseaseData.reference1Location ? "color: #CCCCCC;" : "")
                        },
                        vue.toDisplayString(diseaseData.reference1Location || "请选择"),
                        5
                        /* TEXT, STYLE */
                      ),
                      vue.createElementVNode("view", { class: "right-icon" }, ">")
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", { class: "reference-start" }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        placeholder: "起点位置",
                        "onUpdate:modelValue": ($event) => diseaseData.reference1LocationStart = $event
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, diseaseData.reference1LocationStart]
                      ]),
                      vue.createElementVNode("view", {
                        class: "clear-input",
                        onClick: ($event) => $setup.clearReferenceSurfaceStart(index, 1)
                      }, "×", 8, ["onClick"])
                    ]),
                    vue.createElementVNode("view", { class: "reference-end" }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        placeholder: "终点位置",
                        "onUpdate:modelValue": ($event) => diseaseData.reference1LocationEnd = $event
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, diseaseData.reference1LocationEnd]
                      ]),
                      vue.createElementVNode("view", {
                        class: "clear-input",
                        onClick: ($event) => $setup.clearReferenceSurfaceEnd(index, 1)
                      }, "×", 8, ["onClick"])
                    ]),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " m ")
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "location-description" }, [
                  vue.createElementVNode("view", { class: "location-description-left" }, " 据参考面2位置 "),
                  vue.createElementVNode("view", { class: "location-description-right" }, [
                    vue.createTextVNode(" 距 "),
                    vue.createElementVNode("view", {
                      class: "location-description-right-position",
                      onClick: ($event) => $setup.openReferenceSurfacePopup(2, index)
                    }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "location-description-right-position-input",
                          style: vue.normalizeStyle(!diseaseData.reference2Location ? "color: #CCCCCC;" : "")
                        },
                        vue.toDisplayString(diseaseData.reference2Location || "请选择"),
                        5
                        /* TEXT, STYLE */
                      ),
                      vue.createElementVNode("view", { class: "right-icon" }, ">")
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", { class: "reference-start" }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        placeholder: "起点位置",
                        "onUpdate:modelValue": ($event) => diseaseData.reference2LocationStart = $event
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, diseaseData.reference2LocationStart]
                      ]),
                      vue.createElementVNode("view", {
                        class: "clear-input",
                        onClick: ($event) => $setup.clearReferenceSurfaceStart(index, 2)
                      }, "×", 8, ["onClick"])
                    ]),
                    vue.createElementVNode("view", { class: "reference-end" }, [
                      vue.withDirectives(vue.createElementVNode("input", {
                        type: "text",
                        placeholder: "终点位置",
                        "onUpdate:modelValue": ($event) => diseaseData.reference2LocationEnd = $event
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, diseaseData.reference2LocationEnd]
                      ]),
                      vue.createElementVNode("view", {
                        class: "clear-input",
                        onClick: ($event) => $setup.clearReferenceSurfaceEnd(index, 2)
                      }, "×", 8, ["onClick"])
                    ]),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " m ")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 长度 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 长度 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.lengthRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.lengthRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.lengthRangeStart = ""
                        }, "×", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.lengthRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.lengthRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.lengthRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.length = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.length]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.length = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " m ")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 宽度 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 宽度 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.widthRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.widthRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.widthRangeStart = ""
                        }, "×", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.widthRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.widthRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.widthRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.width = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.width]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.width = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " m")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 高度/深度 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 高度/深度 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.heightDepthRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.heightDepthRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.heightDepthRangeStart = ""
                        }, "× ", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.heightDepthRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.heightDepthRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.heightDepthRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.heightDepth = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.heightDepth]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.heightDepth = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " m ")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 缝宽 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 缝宽 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.crackWidthRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.crackWidthRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.crackWidthRangeStart = ""
                        }, "× ", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.crackWidthRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.crackWidthRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.crackWidthRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.crackWidth = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.crackWidth]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.crackWidth = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " mm ")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 面积 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 面积 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.areaRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.areaRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.areaRangeStart = ""
                        }, "×", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.areaRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.areaRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.areaRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.area = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.area]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.area = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " m² ")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 体积 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 体积 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.volumeRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.volumeRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.volumeRangeStart = ""
                        }, "×", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.volumeRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.volumeRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.volumeRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.volume = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.volume]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.volume = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " m³ ")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 角度 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 角度 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.angleRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.angleRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.angleRangeStart = ""
                        }, "×", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.angleRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.angleRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.angleRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.angle = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.angle]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.angle = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " 度 ")
                    ])
                  ])
                ]),
                vue.createCommentVNode(" 百分比 - 根据模式显示不同的输入框 "),
                vue.createElementVNode("view", { class: "quantitative-data" }, [
                  vue.createElementVNode("view", { class: "quantitative-data-left" }, " 百分比 "),
                  vue.createElementVNode("view", { class: "quantitative-data-right" }, [
                    vue.createCommentVNode(" 范围模式 "),
                    diseaseData.useRangeMode ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "quantitative-data-right-range"
                    }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最小值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.percentageRangeStart = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.percentageRangeStart]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.percentageRangeStart = ""
                        }, "× ", 8, ["onClick"])
                      ]),
                      vue.createElementVNode("view", { class: "range-separator" }, "-"),
                      vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                        vue.withDirectives(vue.createElementVNode("input", {
                          class: "quantitative-data-right-value-input",
                          placeholder: "最大值",
                          type: "number",
                          "onUpdate:modelValue": ($event) => diseaseData.percentageRangeEnd = $event
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vue.vModelText, diseaseData.percentageRangeEnd]
                        ]),
                        vue.createElementVNode("view", {
                          class: "clear-input",
                          onClick: ($event) => diseaseData.percentageRangeEnd = ""
                        }, "×", 8, ["onClick"])
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createCommentVNode(" 普通模式 "),
                        vue.createElementVNode("view", { class: "quantitative-data-right-value" }, [
                          vue.withDirectives(vue.createElementVNode("input", {
                            class: "quantitative-data-right-value-input",
                            placeholder: "请填写",
                            type: "number",
                            "onUpdate:modelValue": ($event) => diseaseData.percentage = $event
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vue.vModelText, diseaseData.percentage]
                          ]),
                          vue.createElementVNode("view", {
                            class: "clear-input",
                            onClick: ($event) => diseaseData.percentage = ""
                          }, "×", 8, ["onClick"])
                        ])
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )),
                    vue.createElementVNode("view", { class: "quantitative-data-right-unit" }, [
                      vue.createElementVNode("view", { class: "quantitative-data-right-unit-input" }, " % ")
                    ])
                  ])
                ]),
                vue.createElementVNode("view", { class: "line-select" }, [
                  vue.createElementVNode("view", { class: "line-select-left" }, [
                    vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
                    vue.createElementVNode("view", null, "发展趋势")
                  ]),
                  vue.createElementVNode("view", { class: "line-select-right" }, [
                    vue.createVNode(_component_uni_data_checkbox, {
                      mode: "tag",
                      modelValue: diseaseData.developmentTrendIndex,
                      "onUpdate:modelValue": ($event) => diseaseData.developmentTrendIndex = $event,
                      localdata: $setup.developmentTrend
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "localdata"])
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { class: "head" }, [
            vue.createElementVNode("view", { class: "head-text" }, " 病害定性数据 ")
          ]),
          vue.createElementVNode("view", { class: "input-area" }, [
            vue.createElementVNode("view", { class: "input-area-title" }, [
              vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
              vue.createElementVNode("view", null, "病害描述"),
              vue.createElementVNode("view", {
                class: "input-right-button",
                onClick: _cache[12] || (_cache[12] = ($event) => $setup.createDescription())
              }, "生成病害描述")
            ]),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "input-area-content",
                "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $setup.description = $event),
                placeholder: "请填写病害信息",
                "auto-height": ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.description]
            ])
          ]),
          vue.createElementVNode("view", { class: "line-select" }, [
            vue.createElementVNode("view", { class: "line-select-left" }, [
              vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
              vue.createElementVNode("view", null, "病害性质")
            ]),
            vue.createElementVNode("view", { class: "line-select-right" }, [
              vue.createVNode(_component_uni_data_checkbox, {
                mode: "tag",
                modelValue: $setup.natureindex,
                "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $setup.natureindex = $event),
                localdata: $setup.nature
              }, null, 8, ["modelValue", "localdata"])
            ])
          ]),
          vue.withDirectives(vue.createElementVNode(
            "view",
            { class: "line-select" },
            [
              vue.createElementVNode("view", { class: "line-select-left" }, [
                vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
                vue.createElementVNode("view", null, "参与评定")
              ]),
              vue.createElementVNode("view", { class: "line-select-right" }, [
                vue.createVNode(_component_uni_data_checkbox, {
                  mode: "tag",
                  modelValue: $setup.participateAssessindex,
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $setup.participateAssessindex = $event),
                  localdata: $setup.participateAssess
                }, null, 8, ["modelValue", "localdata"])
              ])
            ],
            512
            /* NEED_PATCH */
          ), [
            [vue.vShow, $setup.typePicker !== "其他"]
          ]),
          vue.withDirectives(vue.createElementVNode(
            "view",
            { class: "line-select" },
            [
              vue.createElementVNode("view", { class: "line-select-left" }, [
                vue.createElementVNode("text", { style: { "color": "red" } }, "*"),
                vue.createElementVNode("view", null, "评定标度")
              ]),
              vue.createElementVNode("view", { class: "line-select-right" }, [
                vue.createVNode(_component_uni_data_checkbox, {
                  mode: "tag",
                  modelValue: $setup.levelindex,
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $setup.levelindex = $event),
                  localdata: $setup.level
                }, null, 8, ["modelValue", "localdata"])
              ])
            ],
            512
            /* NEED_PATCH */
          ), [
            [vue.vShow, $setup.typePicker !== "其他"]
          ])
        ]),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { class: "head" }, [
            vue.createElementVNode("view", { class: "head-text" }, " 病害附件信息 ")
          ]),
          vue.createElementVNode("view", { class: "part-UploadImage" }, [
            vue.createElementVNode("view", { class: "part-title" }, "上传图片"),
            vue.createElementVNode("view", { class: "upload-view" }, [
              vue.createVNode(_component_uni_file_picker, {
                class: "file-picker",
                limit: "9",
                "image-styles": $setup.imageStyles,
                modelValue: $setup.fileList,
                "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $setup.fileList = $event),
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
                      class: "ADImage"
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
                onClick: _cache[18] || (_cache[18] = ($event) => $setup.selectCanvasTemplate())
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0$3,
                  class: "ADImageButton"
                })
              ])
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
                vue.createElementVNode("view", { class: "template-type" }, " 空心板、实心板 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_1$2,
                    class: "template-image-card",
                    onClick: _cache[19] || (_cache[19] = ($event) => $setup.onClickTemplate("kxb1"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_2$1,
                    class: "template-image-card",
                    onClick: _cache[20] || (_cache[20] = ($event) => $setup.onClickTemplate("kxb2"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_3$1,
                    class: "template-image-card",
                    onClick: _cache[21] || (_cache[21] = ($event) => $setup.onClickTemplate("kxb3"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_4$1,
                    class: "template-image-card",
                    onClick: _cache[22] || (_cache[22] = ($event) => $setup.onClickTemplate("kxb4"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_5$1,
                    class: "template-image-card",
                    onClick: _cache[23] || (_cache[23] = ($event) => $setup.onClickTemplate("kxb5"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_6,
                    class: "template-image-card",
                    onClick: _cache[24] || (_cache[24] = ($event) => $setup.onClickTemplate("kxb6"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " T梁 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_7,
                    class: "template-image-card",
                    onClick: _cache[25] || (_cache[25] = ($event) => $setup.onClickTemplate("tl1"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " 箱梁 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_8,
                    class: "template-image-card",
                    onClick: _cache[26] || (_cache[26] = ($event) => $setup.onClickTemplate("xl1"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " 变截面箱梁 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_9,
                    class: "template-image-card",
                    onClick: _cache[27] || (_cache[27] = ($event) => $setup.onClickTemplate("blmxl1"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_10,
                    class: "template-image-card",
                    onClick: _cache[28] || (_cache[28] = ($event) => $setup.onClickTemplate("blmxl2"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_11,
                    class: "template-image-card",
                    onClick: _cache[29] || (_cache[29] = ($event) => $setup.onClickTemplate("blmxl3"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_12,
                    class: "template-image-card",
                    onClick: _cache[30] || (_cache[30] = ($event) => $setup.onClickTemplate("blmxl4"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " 桥台、桥墩 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_13,
                    class: "template-image-card",
                    onClick: _cache[31] || (_cache[31] = ($event) => $setup.onClickTemplate("qt1"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_14,
                    class: "template-image-card",
                    onClick: _cache[32] || (_cache[32] = ($event) => $setup.onClickTemplate("qt2"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " 横隔板 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_15,
                    class: "template-image-card",
                    onClick: _cache[33] || (_cache[33] = ($event) => $setup.onClickTemplate("hgb1"))
                  }),
                  vue.createElementVNode("image", {
                    src: _imports_16,
                    class: "template-image-card",
                    onClick: _cache[34] || (_cache[34] = ($event) => $setup.onClickTemplate("hgb2"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " 翼墙、耳墙 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_17,
                    class: "template-image-card",
                    onClick: _cache[35] || (_cache[35] = ($event) => $setup.onClickTemplate("yq1"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " 盖梁 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_18,
                    class: "template-image-card",
                    onClick: _cache[36] || (_cache[36] = ($event) => $setup.onClickTemplate("gl1"))
                  })
                ]),
                vue.createElementVNode("view", { class: "template-type" }, " 圆桩墩 "),
                vue.createElementVNode("view", { class: "template-image" }, [
                  vue.createElementVNode("image", {
                    src: _imports_19,
                    class: "template-image-card",
                    onClick: _cache[37] || (_cache[37] = ($event) => $setup.onClickTemplate("yzd1"))
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
                "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => $setup.selectedPosition = $event),
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
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "referenceSurfacePopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "location-description-position-popup-content" }, [
              vue.createElementVNode("view", { class: "location-description-position-popup-title" }, "参考面选择"),
              vue.createElementVNode("view", { class: "location-description-position-popup-input1" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请填写",
                    class: "location-description-popup-input",
                    "onUpdate:modelValue": _cache[39] || (_cache[39] = ($event) => $setup.referenceSurfaceInput = $event)
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.referenceSurfaceInput]
                ]),
                vue.createElementVNode("button", {
                  class: "location-description-popup-button",
                  onClick: $setup.confirmreferenceSurfaceInput
                }, "确定")
              ]),
              vue.createElementVNode("view", { class: "location-description-position-popup-input3" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.referenceSurfaceOptions, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: "location-description-position-popup-input3-item",
                      onClick: ($event) => $setup.selectReferenceSurfaceItem(item)
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
      )
    ]);
  }
  const PagesAddDiseaseAddDisease = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-79f8b97c"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/add-disease/add-disease.vue"]]);
  function drawKxbTemplate1(ctx, {
    logicalWidth = 8,
    logicalHeight = 8,
    unit = "cm",
    qt: qt2 = 0
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
    const showDirectionArrow = qt2 == 0 ? true : false;
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
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    const y2 = (systemInfo.screenHeight - drawHeight) / 2;
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
    if (qt2 == 2) {
      ctx.beginPath();
      ctx.moveTo(x, y2 + scale / 2);
      ctx.lineTo(x + drawWidth, y2 + scale / 2);
      ctx.stroke();
    }
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
    if (showDirectionArrow) {
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
  function drawKxbTemplate2(ctx, {
    logicalWidth = 8,
    logicalHeight = 8,
    unit = "m"
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
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
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    const y2 = (systemInfo.screenHeight - drawHeight) / 2;
    const tiltOffsetX = 50;
    ctx.setLineWidth(1);
    ctx.setStrokeStyle("#333");
    ctx.setFontSize(12);
    ctx.beginPath();
    ctx.moveTo(x + tiltOffsetX, y2);
    ctx.lineTo(x + drawWidth, y2);
    ctx.lineTo(x + drawWidth - tiltOffsetX, y2 + drawHeight);
    ctx.lineTo(x, y2 + drawHeight);
    ctx.closePath();
    ctx.stroke();
    drawRuler(ctx, x + tiltOffsetX, y2 - 10, x + drawWidth, y2 - 10, "colunm", logicalWidth, 25, unit);
    drawRuler(
      ctx,
      x + drawWidth + 10,
      y2,
      x + drawWidth + 10 - tiltOffsetX,
      y2 + drawHeight,
      "row",
      logicalHeight,
      25,
      unit
    );
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
  function drawBlmxlTemplate1(ctx, {
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
    const systemInfo = uni.getSystemInfoSync();
    const centerX = systemInfo.screenWidth / 2;
    const centerY = systemInfo.screenHeight / 2;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const drawWidth = 800 / (beamCount * 2 + 1) < 80 ? (beamCount * 2 + 1) * 80 : 800;
    const drawHeight = 120;
    const screenWidth = systemInfo.screenHeight;
    const screenHeight = systemInfo.screenWidth;
    const x = (screenWidth - drawHeight) / 2;
    const y2 = (screenHeight - drawWidth) / 2;
    const unitLevel = 25;
    ctx.translate(centerX, centerY);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-centerY, -centerX);
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
    const exponent = 0;
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
    ctx.translate(centerY, centerX);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
  }
  function drawBlmxlTemplate2(ctx, {
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
    const systemInfo = uni.getSystemInfoSync();
    const centerX = systemInfo.screenWidth / 2;
    const centerY = systemInfo.screenHeight / 2;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const drawWidth = 800 / (beamCount * 2 + 1) < 80 ? (beamCount * 2 + 1) * 80 : 800;
    const drawHeight = beamCount * 20 > 200 ? 200 : beamCount * 20;
    const screenWidth = systemInfo.screenHeight;
    const screenHeight = systemInfo.screenWidth;
    const x = (screenWidth - drawHeight) / 2;
    const y2 = (screenHeight - drawWidth) / 2;
    const unitLevel = 25;
    ctx.translate(centerX, centerY);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-centerY, -centerX);
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
    ctx.translate(centerY, centerX);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
  }
  function drawBlmxlTemplate3(ctx, {
    logicalLength = 53,
    // 总逻辑长度（单位）
    leftBeamCount = 7,
    // 左梁数
    unit = "m",
    // 单位显示
    bigBeamNumber = 36,
    //大桩号墩
    smallBeamNumber = 35,
    //小桩号墩
    bridgeFu = "L"
    //桥幅
  }) {
    const systemInfo = uni.getSystemInfoSync();
    const centerX = systemInfo.screenWidth / 2;
    const centerY = systemInfo.screenHeight / 2;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const beamCount = (leftBeamCount - 1) / 2;
    const drawWidth = (beamCount * 2 + 1) * 100;
    const drawHeight = beamCount * 20 > 200 ? 250 : beamCount * 25;
    const screenWidth = systemInfo.screenHeight;
    const screenHeight = systemInfo.screenWidth;
    const x = (screenWidth - drawHeight) / 2;
    const y2 = (screenHeight - drawWidth) / 2;
    const unitLevel = 25;
    ctx.translate(centerX, centerY);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-centerY, -centerX);
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
    const xPoints = [lineList[0].x];
    const total = beamCount * 2 + 1;
    for (let i2 = 1; i2 <= total; i2++) {
      const ratio = Math.log(i2 + 1) / Math.log(total + 1);
      const xi = x + drawHeight / 3 * 2 * ratio;
      xPoints.push(xi);
    }
    for (let i2 = 0; i2 < beamCount * 2 + 1; i2++) {
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
    ctx.beginPath();
    ctx.moveTo(x, lineList[0].y);
    ctx.lineTo(x, lineList[1].y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lineList[lineList.length - 1].x, lineList[lineList.length - 1].y);
    ctx.lineTo(lineList[lineList.length - 2].x, lineList[lineList.length - 2].y);
    ctx.stroke();
    const newLineList = lineList.slice(1, lineList.length - 1);
    ctx.beginPath();
    ctx.moveTo(newLineList[0].x, newLineList[0].y);
    for (let i2 = 1; i2 < newLineList.length - 2; i2++) {
      const xc = (newLineList[i2].x + newLineList[i2 + 1].x) / 2;
      const yc = (newLineList[i2].y + newLineList[i2 + 1].y) / 2;
      ctx.quadraticCurveTo(newLineList[i2].x, newLineList[i2].y, xc, yc);
    }
    ctx.quadraticCurveTo(
      newLineList[newLineList.length - 2].x,
      newLineList[newLineList.length - 2].y,
      newLineList[newLineList.length - 1].x,
      newLineList[newLineList.length - 1].y
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lineList[0].x, lineList[0].y);
    for (let i2 = 1; i2 < lineList.length; i2++) {
      const text = `${bridgeFu}${bigBeamNumber}-${smallBeamNumber}-${i2 - 1}#`;
      const textX = lineList[i2 - 1].x - 20;
      const textY = lineList[i2 - 1].y - 20;
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(90 * Math.PI / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
    ctx.translate(centerY, centerX);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
  }
  function drawBlmxlTemplate4(ctx, {
    logicalLength = 53,
    // 总逻辑长度（单位）
    rightBeamCount = 7,
    // 右梁数
    unit = "m",
    // 单位显示
    bigBeamNumber = 36,
    //大桩号墩
    smallBeamNumber = 35,
    //小桩号墩
    bridgeFu = "L"
    //桥幅
  }) {
    const systemInfo = uni.getSystemInfoSync();
    const centerX = systemInfo.screenWidth / 2;
    const centerY = systemInfo.screenHeight / 2;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const beamCount = (rightBeamCount - 1) / 2;
    const drawWidth = (beamCount * 2 + 1) * 100;
    const drawHeight = beamCount * 20 > 200 ? 250 : beamCount * 25;
    const screenWidth = systemInfo.screenHeight;
    const screenHeight = systemInfo.screenWidth;
    const x = (screenWidth - drawHeight) / 2;
    const y2 = (screenHeight - drawWidth) / 2;
    const unitLevel = 25;
    ctx.translate(centerX, centerY);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-centerY, -centerX);
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
    ctx.moveTo(x + drawHeight, y2 + drawWidth);
    ctx.lineTo(x, y2 + drawWidth);
    ctx.stroke();
    lineList.push({
      x,
      y: y2
    });
    const xPoints = [lineList[0].x];
    const total = beamCount * 2 + 1;
    for (let i2 = 1; i2 < total; i2++) {
      const ratio = Math.log(i2 + 1) / Math.log(total + 1);
      const xi = x + drawHeight / 3 * 2 * ratio;
      xPoints.push(xi);
    }
    xPoints.reverse();
    for (let i2 = 0; i2 < beamCount * 2 + 1; i2++) {
      const py = y2 + (i2 + 1) * drawWidth / (beamCount * 2 + 1);
      const px = xPoints[i2];
      ctx.beginPath();
      ctx.moveTo(px, py - 100);
      lineList.push({
        x: px,
        y: py - 100
      });
      ctx.lineTo(x + drawHeight, py - 100);
      ctx.stroke();
    }
    formatAppLog("log", "at utils/drawTemplate.js:606", "list", lineList);
    ctx.beginPath();
    ctx.moveTo(x, lineList[lineList.length - 1].y);
    ctx.lineTo(x, lineList[lineList.length - 1].y + 100);
    ctx.stroke();
    const text = `${bridgeFu}${bigBeamNumber}-${smallBeamNumber}-${rightBeamCount - 1}#`;
    const textX = x - 20;
    const textY = lineList[lineList.length - 1].y - 20;
    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(90 * Math.PI / 180);
    ctx.fillText(text, 0, 0);
    ctx.restore();
    const newLineList = lineList.slice(1, lineList.length);
    ctx.beginPath();
    ctx.moveTo(newLineList[0].x, newLineList[0].y);
    for (let i2 = 1; i2 < newLineList.length - 2; i2++) {
      const xc = (newLineList[i2].x + newLineList[i2 + 1].x) / 2;
      const yc = (newLineList[i2].y + newLineList[i2 + 1].y) / 2;
      ctx.quadraticCurveTo(newLineList[i2].x, newLineList[i2].y, xc, yc);
    }
    ctx.quadraticCurveTo(
      newLineList[newLineList.length - 2].x,
      newLineList[newLineList.length - 2].y,
      newLineList[newLineList.length - 1].x,
      newLineList[newLineList.length - 1].y
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lineList[0].x, lineList[0].y);
    for (let i2 = 2; i2 < lineList.length; i2++) {
      const text2 = `${bridgeFu}${bigBeamNumber}-${smallBeamNumber}-${i2 - 2}#`;
      const textX2 = lineList[i2 - 1].x - 20;
      const textY2 = lineList[i2 - 1].y - 20;
      ctx.save();
      ctx.translate(textX2, textY2);
      ctx.rotate(90 * Math.PI / 180);
      ctx.fillText(text2, 0, 0);
      ctx.restore();
    }
    ctx.translate(centerY, centerX);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
  }
  function drawRuler(ctx, x, y2, endx, endy, direction, logicalLength, unitLevel, unit, isRotated = false) {
    const intLogicalLength = Math.floor(logicalLength);
    const unitCount = logicalLength % unitLevel === 0 ? logicalLength / unitLevel : Math.floor(logicalLength / unitLevel) + 1;
    const dis = isRotated ? 8 : -8;
    const rowdis = isRotated ? -8 : 8;
    const textXdis = isRotated ? -30 : 10;
    const textYdis = isRotated ? 5 : -30;
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
        ctx.lineTo(px, y2 + dis + oversetY * i2);
        ctx.stroke();
        text = `${i2 * unitCount}${unit}`;
        textX = px - 10;
        textY = y2 - 15 + oversetY * i2;
      } else {
        const longth = endy - y2;
        const oversetX = (endx - x) / (intLogicalLength / unitCount);
        const py = y2 + i2 * (longth / (intLogicalLength / unitCount));
        ctx.beginPath();
        ctx.moveTo(x + oversetX * i2, py);
        ctx.lineTo(x + rowdis + oversetX * i2, py);
        ctx.stroke();
        text = `${i2 * unitCount}${unit}`;
        textX = x + textXdis + oversetX * i2;
        textY = py + textYdis;
      }
      ctx.save();
      ctx.translate(textX, textY);
      if (direction === "row" && !isRotated || direction === "colunm" && isRotated) {
        ctx.translate(5, 26);
        ctx.rotate(90 * Math.PI / 180);
      }
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
        ctx.lineTo(endx, endy + dis);
        ctx.stroke();
        text = `${logicalLength}${unit}`;
        textX = endx - 10;
        textY = endy - 15;
      } else {
        ctx.beginPath();
        ctx.moveTo(endx, endy);
        ctx.lineTo(endx + rowdis, endy);
        ctx.stroke();
        text = `${logicalLength}${unit}`;
        textX = endx + textXdis;
        textY = endy + textYdis;
      }
      ctx.save();
      ctx.translate(textX, textY);
      if (direction === "row" && !isRotated || direction === "colunm" && isRotated) {
        ctx.translate(5, 26);
        ctx.rotate(90 * Math.PI / 180);
      }
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
  function drawKxbTemplate3(ctx, {
    logicalWidth = 12,
    bigBeamNumber = 1,
    beamCount = 8,
    bridgeFu = "L",
    unit = "m"
  }) {
    const systemInfo = uni.getSystemInfoSync();
    const centerX = systemInfo.screenWidth / 2;
    const centerY = systemInfo.screenHeight / 2;
    const screenWidth = systemInfo.screenWidth;
    const screenHeight = systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const miniRectHeight = 50;
    const drawWidth = 550;
    const drawHeight = miniRectHeight * beamCount;
    const overSetY = 0;
    const x = (screenHeight - drawWidth) / 2 - 20;
    const y2 = (screenWidth - drawHeight) / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-centerY, -centerX);
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
      unit,
      true
    );
    ctx.translate(centerY, centerX);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
  }
  function drawKxbTemplate4(ctx, {
    logicalWidth = 12,
    bigBeamNumber = 1,
    beamCount = 8,
    bridgeFu = "L",
    unit = "m"
  }) {
    const systemInfo = uni.getSystemInfoSync();
    const centerX = systemInfo.screenWidth / 2;
    const centerY = systemInfo.screenHeight / 2;
    const screenWidth = systemInfo.screenWidth;
    const screenHeight = systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const miniRectHeight = 50;
    const drawWidth = 550;
    const drawHeight = miniRectHeight * beamCount;
    const overSetY = 50;
    const x = (screenHeight - drawWidth) / 2 - 20;
    const y2 = (screenWidth - drawHeight) / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.translate(-centerY, -centerX);
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
      unit,
      true
    );
    ctx.translate(centerY, centerX);
    ctx.rotate(90 * Math.PI / 180);
    ctx.translate(-centerX, -centerY);
  }
  function drawKxbTemplate5(ctx, {
    logicalLength = 8,
    bottomPlate = 1.2,
    abdomenPlate = 1.2,
    flangePlate = 1.2,
    unit = "m"
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const baseHeight = 60;
    const drawWidth = 550;
    const drawHeight = (bottomPlate + abdomenPlate + flangePlate) * baseHeight;
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    let y2 = (systemInfo.screenHeight - drawHeight) / 2;
    drawRuler(ctx, x, y2 - 10, x + drawWidth, y2 - 10, "colunm", logicalLength, 20, unit);
    ctx.strokeRect(x, y2, drawWidth, flangePlate * baseHeight);
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + flangePlate * baseHeight, flangePlate, unit);
    ctx.save();
    ctx.translate(x - 50, (y2 + y2 + flangePlate * baseHeight) / 2);
    ctx.fillText(`翼缘板`, 0, 0);
    ctx.restore();
    y2 += flangePlate * baseHeight;
    ctx.strokeRect(x, y2, drawWidth, abdomenPlate * baseHeight);
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + abdomenPlate * baseHeight, abdomenPlate, unit);
    ctx.save();
    ctx.translate(x - 50, (y2 + y2 + abdomenPlate * baseHeight) / 2);
    ctx.fillText(`腹板`, 0, 0);
    ctx.restore();
    y2 += abdomenPlate * baseHeight;
    ctx.strokeRect(x, y2, drawWidth, bottomPlate * baseHeight);
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + bottomPlate * baseHeight, bottomPlate, unit);
    ctx.save();
    ctx.translate(x - 50, (y2 + y2 + bottomPlate * baseHeight) / 2);
    ctx.fillText(`底板`, 0, 0);
    ctx.restore();
  }
  function drawKxbTemplate6(ctx, {
    logicalLength = 8,
    bottomPlate = 1.2,
    abdomenPlate = 1.2,
    flangePlate = 1.2,
    unit = "m"
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const baseHeight = 60;
    const drawWidth = 550;
    const drawHeight = (bottomPlate + abdomenPlate + flangePlate) * baseHeight;
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    let y2 = (systemInfo.screenHeight - drawHeight) / 2;
    const offsetX = 20;
    drawRuler(ctx, x, y2 - 10, x + drawWidth, y2 - 10, "colunm", logicalLength, 20, unit);
    ctx.beginPath();
    ctx.moveTo(x, y2);
    ctx.lineTo(x + drawWidth, y2);
    ctx.lineTo(x + drawWidth - offsetX, y2 + flangePlate * baseHeight);
    ctx.lineTo(x - offsetX, y2 + flangePlate * baseHeight);
    ctx.closePath();
    ctx.stroke();
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + flangePlate * baseHeight, flangePlate, unit);
    ctx.save();
    ctx.translate(x - 50, (y2 + y2 + flangePlate * baseHeight) / 2);
    ctx.fillText(`翼缘板`, 0, 0);
    ctx.restore();
    y2 += flangePlate * baseHeight;
    ctx.beginPath();
    ctx.moveTo(x - offsetX, y2);
    ctx.lineTo(x + drawWidth - offsetX, y2);
    ctx.lineTo(x + drawWidth - offsetX * 2, y2 + abdomenPlate * baseHeight);
    ctx.lineTo(x - offsetX * 2, y2 + abdomenPlate * baseHeight);
    ctx.closePath();
    ctx.stroke();
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + abdomenPlate * baseHeight, abdomenPlate, unit);
    ctx.save();
    ctx.translate(x - 50 - offsetX, (y2 + y2 + abdomenPlate * baseHeight) / 2);
    ctx.fillText(`腹板`, 0, 0);
    ctx.restore();
    y2 += abdomenPlate * baseHeight;
    ctx.beginPath();
    ctx.moveTo(x - offsetX * 2, y2);
    ctx.lineTo(x + drawWidth - offsetX * 2, y2);
    ctx.lineTo(x + drawWidth - offsetX * 3, y2 + bottomPlate * baseHeight);
    ctx.lineTo(x - offsetX * 3, y2 + bottomPlate * baseHeight);
    ctx.closePath();
    ctx.stroke();
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + bottomPlate * baseHeight, bottomPlate, unit);
    ctx.save();
    ctx.translate(x - 50 - offsetX * 2, (y2 + y2 + bottomPlate * baseHeight) / 2);
    ctx.fillText(`底板`, 0, 0);
    ctx.restore();
  }
  function drawTlTemplate1(ctx, {
    logicalLength = 8,
    bottomPlate = 1.2,
    abdomenPlate = 1.2,
    flangePlate = 1.2,
    unit = "m",
    xl = false
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const baseHeight = 60;
    const drawWidth = 550;
    const totalHeight = (flangePlate * 2 + abdomenPlate * 2 + bottomPlate) * baseHeight;
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    let y2 = (systemInfo.screenHeight - totalHeight) / 2;
    drawRuler(ctx, x, y2 - 10, x + drawWidth, y2 - 10, "colunm", logicalLength, 20, unit);
    ctx.strokeRect(x, y2, drawWidth, flangePlate * baseHeight);
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + flangePlate * baseHeight, flangePlate, unit);
    ctx.save();
    ctx.translate(x - 50, y2 + flangePlate * baseHeight / 2);
    ctx.fillText("翼缘板", 0, 0);
    ctx.restore();
    y2 += flangePlate * baseHeight;
    const abdomenHeight = abdomenPlate * baseHeight;
    if (xl) {
      ctx.strokeRect(x, y2, drawWidth, abdomenPlate * baseHeight);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y2);
      ctx.lineTo(x, y2 + abdomenHeight);
      ctx.moveTo(x + drawWidth, y2);
      ctx.lineTo(x + drawWidth, y2 + abdomenHeight);
      ctx.stroke();
    }
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + abdomenPlate * baseHeight, abdomenPlate, unit);
    ctx.save();
    ctx.translate(x - 50, y2 + abdomenPlate * baseHeight / 2);
    ctx.fillText("腹板", 0, 0);
    ctx.restore();
    y2 += abdomenPlate * baseHeight;
    const bottomHeight = bottomPlate * baseHeight;
    if (xl) {
      ctx.strokeRect(x, y2, drawWidth, bottomPlate * baseHeight);
    } else {
      const cpOffset = -30;
      ctx.beginPath();
      ctx.moveTo(x, y2);
      ctx.quadraticCurveTo(x + drawWidth / 2, y2 - cpOffset, x + drawWidth, y2);
      ctx.lineTo(x + drawWidth, y2 + bottomHeight);
      ctx.quadraticCurveTo(x + drawWidth / 2, y2 + bottomHeight + cpOffset, x, y2 + bottomHeight);
      ctx.closePath();
      ctx.stroke();
    }
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + bottomHeight, bottomPlate, unit);
    ctx.save();
    ctx.translate(x - 50, y2 + bottomHeight / 2);
    ctx.fillText("底板", 0, 0);
    ctx.restore();
    y2 += bottomHeight;
    if (xl) {
      ctx.strokeRect(x, y2, drawWidth, abdomenPlate * baseHeight);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y2);
      ctx.lineTo(x, y2 + abdomenHeight);
      ctx.moveTo(x + drawWidth, y2);
      ctx.lineTo(x + drawWidth, y2 + abdomenHeight);
      ctx.stroke();
    }
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + abdomenPlate * baseHeight, abdomenPlate, unit);
    ctx.save();
    ctx.translate(x - 50, y2 + abdomenPlate * baseHeight / 2);
    ctx.fillText("腹板", 0, 0);
    ctx.restore();
    y2 += abdomenPlate * baseHeight;
    ctx.strokeRect(x, y2, drawWidth, flangePlate * baseHeight);
    drawScaleSingle(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + flangePlate * baseHeight, flangePlate, unit);
    ctx.save();
    ctx.translate(x - 50, y2 + flangePlate * baseHeight / 2);
    ctx.fillText("翼缘板", 0, 0);
    ctx.restore();
  }
  function drawHgbTemplate1(ctx, {
    logicalWidth = 6,
    logicalHeight = 4,
    unit = "m",
    gl = false
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const drawWidth = logicalWidth * 70;
    const drawHeight = logicalHeight * 70;
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    const y2 = (systemInfo.screenHeight - drawHeight) / 2;
    const cutSize = 50;
    ctx.beginPath();
    if (!gl) {
      ctx.moveTo(x + cutSize, y2);
      ctx.lineTo(x + drawWidth - cutSize, y2);
      ctx.lineTo(x + drawWidth, y2 + cutSize);
      ctx.lineTo(x + drawWidth, y2 + drawHeight);
      ctx.lineTo(x, y2 + drawHeight);
      ctx.lineTo(x, y2 + cutSize);
    } else {
      ctx.moveTo(x, y2);
      ctx.lineTo(x + drawWidth, y2);
      ctx.lineTo(x + drawWidth, y2 + drawHeight - cutSize);
      ctx.lineTo(x + drawWidth - cutSize, y2 + drawHeight);
      ctx.lineTo(x + cutSize, y2 + drawHeight);
      ctx.lineTo(x, y2 + drawHeight - cutSize);
    }
    ctx.closePath();
    ctx.stroke();
    drawRuler(ctx, x, y2 - 10, x + drawWidth, y2 - 10, "colunm", logicalWidth, 20, unit);
    drawRuler(ctx, x + drawWidth + 10, y2, x + drawWidth + 10, y2 + drawHeight, "row", logicalHeight, 20, unit);
  }
  function drawYqTemplate1(ctx, {
    logicalWidth = 8,
    logicalHeight = 4,
    unit = "m"
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const cutHeight = 40;
    const drawWidth = logicalWidth * 70;
    const drawHeight = logicalHeight * 70;
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    const y2 = (systemInfo.screenHeight - drawHeight) / 2;
    const A2 = {
      x,
      y: y2
    };
    const B2 = {
      x,
      y: y2 + drawHeight
    };
    const C2 = {
      x: x + drawWidth,
      y: y2
    };
    const D2 = {
      x: x + drawWidth,
      y: y2 + cutHeight
    };
    ctx.beginPath();
    ctx.moveTo(A2.x, A2.y);
    ctx.lineTo(B2.x, B2.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(A2.x, A2.y);
    ctx.lineTo(C2.x, C2.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(D2.x, D2.y);
    ctx.lineTo(B2.x, B2.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(D2.x, D2.y);
    ctx.lineTo(C2.x, C2.y);
    ctx.stroke();
    drawRuler(ctx, A2.x, A2.y - 10, A2.x + drawWidth, A2.y - 10, "colunm", logicalWidth, 20, unit);
    drawRuler(ctx, A2.x - 10, A2.y, A2.x - 10, A2.y + drawHeight, "row", logicalHeight, 20, unit, true);
  }
  function drawYzdTemplate1(ctx, {
    logicalHeight = 8,
    unit = "m"
  }) {
    const systemInfo = uni.getSystemInfoSync();
    systemInfo.screenWidth / 2;
    systemInfo.screenHeight / 2;
    systemInfo.screenWidth;
    systemInfo.screenHeight;
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    const drawWidth = 400;
    const drawHeight = logicalHeight * 50;
    const x = (systemInfo.screenWidth - drawWidth) / 2;
    const y2 = (systemInfo.screenHeight - drawHeight) / 2;
    const jiaodu = [0, 90, 180, 270, 0];
    const rectX = x + drawWidth / 2;
    const rectY = y2;
    const rectWidth = 200;
    ctx.strokeRect(rectX, rectY, rectWidth, drawHeight);
    ctx.beginPath();
    ctx.moveTo(rectX, rectY - 10);
    ctx.lineTo(rectX + rectWidth, rectY - 10);
    ctx.stroke();
    const dx = 50;
    for (let i2 = 0; i2 <= 4; i2++) {
      const tx = rectX + i2 * dx;
      ctx.beginPath();
      ctx.moveTo(tx, y2 - 10);
      ctx.lineTo(tx, y2 - 17);
      ctx.stroke();
      ctx.fillText(`${jiaodu[i2]}${"'"}`, tx - 10, y2 - 25);
    }
    drawRuler(
      ctx,
      rectX + rectWidth + 10,
      rectY,
      rectX + rectWidth + 10,
      rectY + drawHeight,
      "row",
      logicalHeight,
      20,
      unit
    );
    const cx = x + 100;
    const cy = y2 + drawHeight / 2;
    const radius = 50;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("0'", cx, cy - radius - 15);
    ctx.fillText("180'", cx, cy + radius + 15);
    ctx.fillText("90'", cx + radius + 15, cy);
    ctx.fillText("270'", cx - radius - 20, cy);
    const arrowX = cx - radius - 60;
    const arrowY = cy - radius;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX, arrowY + 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(arrowX - 5, arrowY + 90);
    ctx.lineTo(arrowX, arrowY + 100);
    ctx.lineTo(arrowX + 5, arrowY + 90);
    ctx.stroke();
    ctx.save();
    ctx.translate(cx - radius - 80, cy);
    ctx.rotate(90 * Math.PI / 180);
    ctx.fillText(`桩号增大方向`, 0, 0);
    ctx.restore();
  }
  const drawScaleSingle = (ctx, x, y2, endX, endY, text, unit) => {
    ctx.beginPath();
    ctx.moveTo(x, y2);
    ctx.lineTo(x + 8, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y2);
    ctx.lineTo(x, endY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, endY);
    ctx.lineTo(x + 8, endY);
    ctx.stroke();
    ctx.save();
    ctx.setFontSize(12);
    ctx.setFillStyle("#333");
    ctx.translate(x + 10, (y2 + endY) / 2);
    ctx.fillText(`${text}${unit}`, 0, 0);
    ctx.restore();
  };
  const _imports_0$2 = "/static/image/hand.svg";
  const _imports_1$1 = "/static/image/line.svg";
  const _imports_2 = "/static/image/curve.svg";
  const _imports_3 = "/static/image/rect.svg";
  const _imports_4 = "/static/image/circle.svg";
  const _imports_5 = "/static/image/text.svg";
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
      const transparentCurvePoints = vue.ref([]);
      const status = vue.ref("start");
      const drawColor = vue.ref("#333333");
      const isLandscape = vue.ref(false);
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
      const kxbTemplateParam1 = vue.ref({
        logicalWidth: 8,
        logicalHeight: 8,
        unit: "cm"
      });
      const kxbTemplateParam2 = vue.ref({
        logicalWidth: 8,
        logicalHeight: 8,
        unit: "m"
      });
      const kxbTemplateParam3 = vue.ref({
        logicalWidth: 12,
        bigBeamNumber: 1,
        beamCount: 8,
        bridgeFu: "L",
        unit: "m"
      });
      const kxbTemplateParam4 = vue.ref({
        logicalWidth: 12,
        bigBeamNumber: 1,
        beamCount: 8,
        bridgeFu: "L",
        unit: "m"
      });
      const kxbTemplateParam5 = vue.ref({
        logicalLength: 8,
        bottomPlate: 1.2,
        abdomenPlate: 1.2,
        flangePlate: 1.2,
        unit: "m"
      });
      const kxbTemplateParam6 = vue.ref({
        logicalLength: 8,
        bottomPlate: 1.2,
        abdomenPlate: 1.2,
        flangePlate: 1.2,
        unit: "m"
      });
      const tlTemplateParam1 = vue.ref({
        logicalLength: 8,
        bottomPlate: 1.2,
        abdomenPlate: 1.2,
        flangePlate: 1.2,
        unit: "m"
      });
      const hgbTemplateParam1 = vue.ref({
        logicalWidth: 6,
        logicalHeight: 4,
        unit: "m"
      });
      const yqTemplateParam1 = vue.ref({
        logicalWidth: 8,
        logicalHeight: 4,
        unit: "m"
      });
      const blmxlTemplateParam1 = vue.ref({
        logicalLength: 12.1,
        beamCount: 3,
        bigBeamNumber: 36,
        smallBeamNumber: 35,
        bridgeFu: "L",
        unit: "cm"
      });
      const blmxlTemplateParam2 = vue.ref({
        logicalLength: 12.1,
        beamCount: 3,
        bigBeamNumber: 36,
        smallBeamNumber: 35,
        bridgeFu: "L",
        unit: "cm"
      });
      const blmxlTemplateParam3 = vue.ref({
        logicalLength: 12.1,
        leftBeamCount: 7,
        bigBeamNumber: 36,
        smallBeamNumber: 35,
        bridgeFu: "L",
        unit: "cm"
      });
      const blmxlTemplateParam4 = vue.ref({
        logicalLength: 12.1,
        rightBeamCount: 7,
        bigBeamNumber: 36,
        smallBeamNumber: 35,
        bridgeFu: "L",
        unit: "cm"
      });
      const yzdTemplateParam1 = vue.ref({
        logicalHeight: 8,
        unit: "m"
      });
      const tempParams = vue.ref({});
      const fieldList = vue.reactive([
        {
          key: "logicalWidth",
          label: "宽度（单位数）",
          type: "number"
        },
        {
          key: "logicalHeight",
          label: "高度（单位数）",
          type: "number"
        },
        {
          key: "logicalLength",
          label: "长度",
          type: "number"
        },
        {
          key: "flangePlate",
          label: "翼缘板",
          type: "number"
        },
        {
          key: "abdomenPlate",
          label: "腹板",
          type: "number"
        },
        {
          key: "bottomPlate",
          label: "底板",
          type: "number"
        },
        {
          key: "beamCount",
          label: "梁数",
          type: "number"
        },
        {
          key: "leftBeamCount",
          label: "梁数",
          type: "number"
        },
        {
          key: "rightBeamCount",
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
          key: "bridgeFu",
          label: "桥幅(L / R)",
          type: "text"
        },
        {
          key: "unit",
          label: "单位(cm / m)",
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
        isLandscape.value = screenWidth.value > screenHeight.value;
        uni.onWindowResize((res) => {
          isLandscape.value = res.size.windowWidth > res.size.windowHeight;
          redrawCanvas();
        });
        ctx.value = uni.createCanvasContext(canvasId);
        transparentCtx.value = uni.createCanvasContext(transparentCanvasId);
        ctx.value.setFontSize(textFontSize.value);
        redrawCanvas();
      });
      onLoad((options) => {
        switch (options.template) {
          case "kxb1":
            template.value = "kxb1";
            break;
          case "kxb2":
            template.value = "kxb2";
            break;
          case "kxb3":
            template.value = "kxb3";
            break;
          case "kxb4":
            template.value = "kxb4";
            break;
          case "kxb5":
            template.value = "kxb5";
            break;
          case "kxb6":
            template.value = "kxb6";
            break;
          case "tl1":
            template.value = "tl1";
            break;
          case "xl1":
            template.value = "xl1";
            break;
          case "qt1":
            template.value = "qt1";
            break;
          case "qt2":
            template.value = "qt2";
            kxbTemplateParam1.value.logicalHeight = 10;
            kxbTemplateParam1.value.logicalWidth = 10;
            break;
          case "hgb1":
            template.value = "hgb1";
            break;
          case "hgb2":
            template.value = "qt1";
            break;
          case "yq1":
            template.value = "yq1";
            break;
          case "gl1":
            template.value = "gl1";
            break;
          case "blmxl1":
            template.value = "blmxl1";
            break;
          case "blmxl2":
            template.value = "blmxl2";
            break;
          case "blmxl3":
            template.value = "blmxl3";
            break;
          case "blmxl4":
            template.value = "blmxl4";
            break;
          case "yzd1":
            template.value = "yzd1";
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
      const back = () => {
        uni.navigateBack();
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
        const logicX = (x - offsetX.value - screenWidth.value / 2) / scale.value + screenWidth.value / 2;
        const logicY = (y2 - offsetY.value - screenHeight.value / 2) / scale.value + screenHeight.value / 2;
        offsetStartX.value = logicX;
        offsetStartY.value = logicY;
        drawing.value = true;
        if (mode.value === "curve") {
          curvePoints.value = [{
            x: logicX,
            y: logicY
          }];
          transparentCurvePoints.value = [{
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
        const logicX = (x - offsetX.value - screenWidth.value / 2) / scale.value + screenWidth.value / 2;
        const logicY = (y2 - offsetY.value - screenHeight.value / 2) / scale.value + screenHeight.value / 2;
        currentX.value = x;
        currentY.value = y2;
        offsetCurrentX.value = logicX;
        offsetCurrentY.value = logicY;
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
            x: logicX,
            y: logicY
          });
          transparentCurvePoints.value.push({
            x,
            y: y2
          });
          transparentCtx.value.moveTo(transparentCurvePoints.value[0].x, transparentCurvePoints.value[0].y);
          transparentCurvePoints.value.forEach((point) => {
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
                changeObjectPosition(history.value[index]);
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
        const logical = screenToLogical(x, y2);
        if (mode.value !== "select" && mode.value !== "text" && status.value !== "start") {
          save();
        }
        if (mode.value === "text") {
          const clickIndex = clickOnText(x, y2);
          if (showTextInput.value) {
            clickWithInputShowing();
          } else {
            if (clickIndex === -1) {
              textInputX.value = logical.x;
              textInputY.value = logical.y;
              textValue.value = "";
              textSelecting.value = true;
              logicalToScreen(logical.x, logical.y);
              showTextInput.value = true;
              textBox.value = {
                x: logical.x,
                y: logical.y - 20,
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
      function screenToLogical(x, y2) {
        return {
          x: (x - offsetX.value - screenWidth.value / 2) / scale.value + screenWidth.value / 2,
          y: (y2 - offsetY.value - screenHeight.value / 2) / scale.value + screenHeight.value / 2
        };
      }
      function logicalToScreen(x, y2) {
        return {
          x: (x - screenWidth.value / 2) * scale.value + offsetX.value + screenWidth.value / 2,
          y: (y2 - screenHeight.value / 2) * scale.value + offsetY.value + screenHeight.value / 2
        };
      }
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
            updatedHistory[chosen.index].color = "#0F4687";
            selectedObject.value = updatedHistory[chosen.index];
          } else if (selectedObject.value !== null && selectedObject.value.id === chosen.action.id)
            ;
          else if (selectedObject.value !== null && selectedObject.value.id !== chosen.action.id) {
            const index = updatedHistory.findIndex((item) => item.id == selectedObject.value.id);
            if (index !== -1) {
              updatedHistory[index].color = selectedObjectOriginColor.value;
            }
            selectedObjectOriginColor.value = JSON.parse(JSON.stringify(history.value[chosen.index].color));
            updatedHistory[chosen.index].color = "#0F4687";
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
        return;
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
            formatAppLog("error", "at pages/canvas/canvas.vue:1289", "保存画布失败", err);
          }
        });
      };
      const changeTemplateParam = () => {
        showParamPopup.value = true;
        if (template.value === "kxb1") {
          tempParams.value = JSON.parse(JSON.stringify(kxbTemplateParam1.value));
        } else if (template.value === "kxb2") {
          tempParams.value = JSON.parse(JSON.stringify(kxbTemplateParam2.value));
        } else if (template.value === "kxb3") {
          tempParams.value = JSON.parse(JSON.stringify(kxbTemplateParam3.value));
        } else if (template.value === "kxb4") {
          tempParams.value = JSON.parse(JSON.stringify(kxbTemplateParam4.value));
        } else if (template.value === "kxb5") {
          tempParams.value = JSON.parse(JSON.stringify(kxbTemplateParam5.value));
        } else if (template.value === "kxb6") {
          tempParams.value = JSON.parse(JSON.stringify(kxbTemplateParam6.value));
        } else if (template.value === "tl1") {
          tempParams.value = JSON.parse(JSON.stringify(tlTemplateParam1.value));
        } else if (template.value === "hgb1") {
          tempParams.value = JSON.parse(JSON.stringify(hgbTemplateParam1.value));
        } else if (template.value === "yq1") {
          tempParams.value = JSON.parse(JSON.stringify(yqTemplateParam1.value));
        } else if (template.value === "blmxl1") {
          tempParams.value = JSON.parse(JSON.stringify(blmxlTemplateParam1.value));
        } else if (template.value === "blmxl2") {
          tempParams.value = JSON.parse(JSON.stringify(blmxlTemplateParam2.value));
        } else if (template.value === "blmxl3") {
          tempParams.value = JSON.parse(JSON.stringify(blmxlTemplateParam3.value));
        } else if (template.value === "blmxl4") {
          tempParams.value = JSON.parse(JSON.stringify(blmxlTemplateParam4.value));
        } else if (template.value === "yzd1") {
          tempParams.value = JSON.parse(JSON.stringify(yzdTemplateParam1.value));
        }
      };
      const applyTemplateChange = () => {
        showParamPopup.value = false;
        if (template.value === "kxb1") {
          kxbTemplateParam1.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "kxb2") {
          kxbTemplateParam2.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "kxb3") {
          kxbTemplateParam3.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "kxb4") {
          kxbTemplateParam4.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "kxb5") {
          kxbTemplateParam5.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "kxb6") {
          kxbTemplateParam6.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "tl1") {
          tlTemplateParam1.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "hgb1") {
          hgbTemplateParam1.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "yq1") {
          yqTemplateParam1.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "blmxl1") {
          blmxlTemplateParam1.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "blmxl2") {
          blmxlTemplateParam2.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "blmxl3") {
          blmxlTemplateParam3.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "blmxl4") {
          blmxlTemplateParam4.value = JSON.parse(JSON.stringify(tempParams.value));
        } else if (template.value === "yzd1") {
          yzdTemplateParam1.value = JSON.parse(JSON.stringify(tempParams.value));
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
            action = {
              mode: "curve",
              curvePoints: curvePoints.value.map((point) => ({
                x: point.x,
                y: point.y
              })),
              color: drawColor.value,
              id: Math.random().toString(36).substr(2, 8)
            };
          }
        }
        if (mode.value === "text") {
          action = {
            mode: "text",
            textValue: textValue.value,
            textInputX: textInputX.value,
            // 逻辑坐标
            textInputY: textInputY.value,
            color: drawColor.value,
            id: Math.random().toString(36).substr(2, 8),
            scale: scale.value
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
        formatAppLog("log", "at pages/canvas/canvas.vue:1448", "渲染模板", template.value);
        if (template.value === "kxb1") {
          drawKxbTemplate1(ctx.value, {
            logicalWidth: Number(kxbTemplateParam1.value.logicalWidth),
            logicalHeight: Number(kxbTemplateParam1.value.logicalHeight),
            unit: kxbTemplateParam1.value.unit,
            // 单位参数
            qt: 0
          });
        } else if (template.value === "kxb2") {
          drawKxbTemplate2(ctx.value, {
            logicalWidth: Number(kxbTemplateParam2.value.logicalWidth),
            logicalHeight: Number(kxbTemplateParam2.value.logicalHeight),
            unit: kxbTemplateParam2.value.unit
            // 单位参数
          });
        } else if (template.value === "kxb3") {
          drawKxbTemplate3(ctx.value, {
            logicalWidth: kxbTemplateParam3.value.logicalWidth,
            bigBeamNumber: kxbTemplateParam3.value.bigBeamNumber,
            beamCount: kxbTemplateParam3.value.beamCount,
            bridgeFu: kxbTemplateParam3.value.bridgeFu,
            unit: kxbTemplateParam3.value.unit
          });
        } else if (template.value === "kxb4") {
          drawKxbTemplate4(ctx.value, {
            logicalWidth: kxbTemplateParam4.value.logicalWidth,
            bigBeamNumber: kxbTemplateParam4.value.bigBeamNumber,
            beamCount: kxbTemplateParam4.value.beamCount,
            bridgeFu: kxbTemplateParam4.value.bridgeFu,
            unit: kxbTemplateParam4.value.unit
          });
        } else if (template.value === "kxb5") {
          drawKxbTemplate5(ctx.value, {
            logicalLength: kxbTemplateParam5.value.logicalLength,
            bottomPlate: Number(kxbTemplateParam5.value.bottomPlate),
            abdomenPlate: Number(kxbTemplateParam5.value.abdomenPlate),
            flangePlate: Number(kxbTemplateParam5.value.flangePlate),
            unit: kxbTemplateParam5.value.unit
          });
        } else if (template.value === "kxb6") {
          drawKxbTemplate6(ctx.value, {
            logicalLength: kxbTemplateParam6.value.logicalLength,
            bottomPlate: Number(kxbTemplateParam6.value.bottomPlate),
            abdomenPlate: Number(kxbTemplateParam6.value.abdomenPlate),
            flangePlate: Number(kxbTemplateParam6.value.flangePlate),
            unit: kxbTemplateParam6.value.unit
          });
        } else if (template.value === "tl1") {
          drawTlTemplate1(ctx.value, {
            logicalWidth: tlTemplateParam1.value.logicalLength,
            bottomPlate: Number(tlTemplateParam1.value.bottomPlate),
            abdomenPlate: Number(tlTemplateParam1.value.abdomenPlate),
            flangePlate: Number(tlTemplateParam1.value.flangePlate),
            unit: tlTemplateParam1.value.unit
          });
        } else if (template.value === "xl1") {
          drawTlTemplate1(ctx.value, {
            logicalWidth: tlTemplateParam1.value.logicalLength,
            bottomPlate: Number(tlTemplateParam1.value.bottomPlate),
            abdomenPlate: Number(tlTemplateParam1.value.abdomenPlate),
            flangePlate: Number(tlTemplateParam1.value.flangePlate),
            unit: tlTemplateParam1.value.unit,
            xl: true
          });
        } else if (template.value === "qt1") {
          drawKxbTemplate1(ctx.value, {
            logicalWidth: Number(kxbTemplateParam1.value.logicalWidth),
            logicalHeight: Number(kxbTemplateParam1.value.logicalHeight),
            unit: kxbTemplateParam1.value.unit,
            // 单位参数
            qt: 1
          });
        } else if (template.value === "qt2") {
          drawKxbTemplate1(ctx.value, {
            logicalWidth: Number(kxbTemplateParam1.value.logicalWidth),
            logicalHeight: Number(kxbTemplateParam1.value.logicalHeight),
            unit: kxbTemplateParam1.value.unit,
            // 单位参数
            qt: 2
          });
        } else if (template.value === "hgb1") {
          drawHgbTemplate1(ctx.value, {
            logicalWidth: Number(hgbTemplateParam1.value.logicalWidth),
            logicalHeight: Number(hgbTemplateParam1.value.logicalHeight),
            unit: hgbTemplateParam1.value.unit,
            // 单位参数
            gl: false
          });
        } else if (template.value === "yq1") {
          drawYqTemplate1(ctx.value, {
            logicalWidth: Number(yqTemplateParam1.value.logicalWidth),
            logicalHeight: Number(yqTemplateParam1.value.logicalHeight),
            unit: yqTemplateParam1.value.unit
            // 单位参数
          });
        } else if (template.value === "gl1") {
          drawHgbTemplate1(ctx.value, {
            logicalWidth: Number(hgbTemplateParam1.value.logicalWidth),
            logicalHeight: Number(hgbTemplateParam1.value.logicalHeight),
            unit: hgbTemplateParam1.value.unit,
            // 单位参数
            gl: true
          });
        } else if (template.value === "blmxl1") {
          drawBlmxlTemplate1(ctx.value, {
            logicalLength: Number(blmxlTemplateParam1.value.logicalLength),
            beamCount: Number(blmxlTemplateParam1.value.beamCount),
            unit: blmxlTemplateParam1.value.unit,
            bigBeamNumber: Number(blmxlTemplateParam1.value.bigBeamNumber),
            smallBeamNumber: Number(blmxlTemplateParam1.value.smallBeamNumber),
            bridgeFu: blmxlTemplateParam1.value.bridgeFu
          });
        } else if (template.value === "blmxl2") {
          drawBlmxlTemplate2(ctx.value, {
            logicalLength: Number(blmxlTemplateParam2.value.logicalLength),
            beamCount: Number(blmxlTemplateParam2.value.beamCount),
            unit: blmxlTemplateParam2.value.unit,
            bigBeamNumber: Number(blmxlTemplateParam2.value.bigBeamNumber),
            smallBeamNumber: Number(blmxlTemplateParam2.value.smallBeamNumber),
            bridgeFu: blmxlTemplateParam2.value.bridgeFu
          });
        } else if (template.value === "blmxl3") {
          drawBlmxlTemplate3(ctx.value, {
            logicalLength: Number(blmxlTemplateParam3.value.logicalLength),
            leftBeamCount: Number(blmxlTemplateParam3.value.leftBeamCount),
            unit: blmxlTemplateParam3.value.unit,
            bigBeamNumber: Number(blmxlTemplateParam3.value.bigBeamNumber),
            smallBeamNumber: Number(blmxlTemplateParam3.value.smallBeamNumber),
            bridgeFu: blmxlTemplateParam3.value.bridgeFu
          });
        } else if (template.value === "blmxl4") {
          drawBlmxlTemplate4(ctx.value, {
            logicalLength: Number(blmxlTemplateParam4.value.logicalLength),
            rightBeamCount: Number(blmxlTemplateParam4.value.rightBeamCount),
            unit: blmxlTemplateParam4.value.unit,
            bigBeamNumber: Number(blmxlTemplateParam4.value.bigBeamNumber),
            smallBeamNumber: Number(blmxlTemplateParam4.value.smallBeamNumber),
            bridgeFu: blmxlTemplateParam4.value.bridgeFu
          });
        } else if (template.value === "yzd1") {
          drawYzdTemplate1(ctx.value, {
            // logicalWidth: Number(yzdTemplateParam1.value.logicalWidth),
            logicalHeight: Number(yzdTemplateParam1.value.logicalHeight),
            unit: yzdTemplateParam1.value.unit
            // 单位参数
          });
        }
      };
      const redrawCanvas = () => {
        const now2 = Date.now();
        if (now2 - lastRedrawTime < 16)
          return;
        lastRedrawTime = now2;
        ctx.value.save();
        ctx.value.clearRect(0, 0, screenWidth.value, screenHeight.value);
        ctx.value.translate(offsetX.value, offsetY.value);
        ctx.value.translate(screenWidth.value / 2, screenHeight.value / 2);
        ctx.value.scale(scale.value, scale.value);
        ctx.value.translate(-screenWidth.value / 2, -screenHeight.value / 2);
        drawTemplate();
        history.value.forEach((action) => {
          ctx.value.save();
          ctx.value.setStrokeStyle(action.color);
          ctx.value.setLineWidth(1 / scale.value);
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
            for (let i2 = 1; i2 < action.curvePoints.length; i2++) {
              ctx.value.lineTo(action.curvePoints[i2].x, action.curvePoints[i2].y);
            }
          } else if (action.mode === "text") {
            ctx.value.save();
            ctx.value.translate(action.textInputX + 10, action.textInputY + 5);
            ctx.value.rotate(Math.PI / 2);
            ctx.value.setFontSize(20);
            ctx.value.setFillStyle(action.color || "#000");
            ctx.value.fillText(action.textValue, 0, 0);
            ctx.value.restore();
          }
          ctx.value.stroke();
          ctx.value.restore();
        });
        if (textSelecting.value) {
          ctx.value.setStrokeStyle("#000000");
          ctx.value.setLineWidth(0.5);
          ctx.value.strokeRect(
            textBox.value.x + 5,
            textBox.value.y + 20,
            textBox.value.height + 8,
            textBox.value.width + 10
          );
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
      const __returned__ = { canvasId, transparentCanvasId, ctx, transparentCtx, screenWidth, screenHeight, canvasStyle, offsetX, offsetY, scale, lastDistance, isScaling, mode, startX, startY, currentX, currentY, offsetStartX, offsetStartY, offsetCurrentX, offsetCurrentY, drawing, template, history, curvePoints, transparentCurvePoints, status, drawColor, isLandscape, textValue, showTextInput, textInputX, textInputY, changingTextIndex, beforeChangeText, canvasImagePath, textFontSize, textSelecting, textBox, selectedObject, selectedObjectOriginColor, touchMoveMode, events, markSavedEvent, inputAndChanged, clickCandidates, clickCycleIndex, showParamPopup, kxbTemplateParam1, kxbTemplateParam2, kxbTemplateParam3, kxbTemplateParam4, kxbTemplateParam5, kxbTemplateParam6, tlTemplateParam1, hgbTemplateParam1, yqTemplateParam1, blmxlTemplateParam1, blmxlTemplateParam2, blmxlTemplateParam3, blmxlTemplateParam4, yzdTemplateParam1, tempParams, fieldList, lastClick, get lastRedrawTime() {
        return lastRedrawTime;
      }, set lastRedrawTime(v2) {
        lastRedrawTime = v2;
      }, eventChannel, changeColor, chooseTemplate, inputting, cancelText, confirmText, resetState, setMode, clearCanvas, zoomIn, zoomOut, back, undo, backToOldPosition, deleteSelected, getDistance, updateInputSize, touchStart, touchMove, touchEnd, screenToLogical, logicalToScreen, clickWithInputShowing, changeText, clickOnText, clickOnObject, isPointInText, isPointInShape, changeObjectPosition, saveCanvasToImage, changeTemplateParam, applyTemplateChange, cancleTemplateChange, save, drawTemplate, redrawCanvas, pointToSegmentDistance, drawEllipse, drawSmoothEllipse, ref: vue.ref, onMounted: vue.onMounted, reactive: vue.reactive, h: vue.h, nextTick: vue.nextTick, getCurrentInstance: vue.getCurrentInstance, get drawKxbTemplate1() {
        return drawKxbTemplate1;
      }, get drawKxbTemplate2() {
        return drawKxbTemplate2;
      }, get drawKxbTemplate3() {
        return drawKxbTemplate3;
      }, get drawKxbTemplate4() {
        return drawKxbTemplate4;
      }, get drawKxbTemplate5() {
        return drawKxbTemplate5;
      }, get drawKxbTemplate6() {
        return drawKxbTemplate6;
      }, get drawTlTemplate1() {
        return drawTlTemplate1;
      }, get drawHgbTemplate1() {
        return drawHgbTemplate1;
      }, get drawYqTemplate1() {
        return drawYqTemplate1;
      }, get drawBlmxlTemplate1() {
        return drawBlmxlTemplate1;
      }, get drawBlmxlTemplate2() {
        return drawBlmxlTemplate2;
      }, get drawBlmxlTemplate3() {
        return drawBlmxlTemplate3;
      }, get drawBlmxlTemplate4() {
        return drawBlmxlTemplate4;
      }, get drawYzdTemplate1() {
        return drawYzdTemplate1;
      }, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["header", { headerSP: !$setup.isLandscape }])
          },
          "绘制简图",
          2
          /* CLASS */
        ),
        vue.createElementVNode("view", { class: "container" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["toolbar", { toolbarSP: !$setup.isLandscape }])
            },
            [
              vue.createElementVNode(
                "button",
                {
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.setMode("select")),
                  class: vue.normalizeClass(["iconButton", { active: $setup.mode === "select" }, { iconButtonSP: !$setup.isLandscape }])
                },
                [
                  vue.createElementVNode("image", {
                    src: _imports_0$2,
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
                  class: vue.normalizeClass(["iconButton", { active: $setup.mode === "line" }, { iconButtonSP: !$setup.isLandscape }])
                },
                [
                  vue.createElementVNode("image", {
                    src: _imports_1$1,
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
                  class: vue.normalizeClass(["iconButton", { active: $setup.mode === "curve" }, { iconButtonSP: !$setup.isLandscape }])
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
                  class: vue.normalizeClass(["iconButton", { active: $setup.mode === "rect" }, { iconButtonSP: !$setup.isLandscape }])
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
                  class: vue.normalizeClass(["iconButton", { active: $setup.mode === "circle" }, { iconButtonSP: !$setup.isLandscape }])
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
                  class: vue.normalizeClass(["iconButton", { active: $setup.mode === "text" }, { iconButtonSP: !$setup.isLandscape }])
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
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["separateLine", { separateLineSP: !$setup.isLandscape }])
                },
                null,
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  onClick: $setup.undo,
                  class: vue.normalizeClass(["functionButton", { functionButtonSP: !$setup.isLandscape }])
                },
                [
                  vue.createCommentVNode(` <image src='/static/image/back.svg' class="icon"></image> `),
                  vue.createTextVNode(" 撤销 ")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  onClick: $setup.clearCanvas,
                  class: vue.normalizeClass(["functionButton", { functionButtonSP: !$setup.isLandscape }])
                },
                "清空",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  onClick: $setup.zoomIn,
                  class: vue.normalizeClass(["functionButton", { functionButtonSP: !$setup.isLandscape }])
                },
                "放大",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  onClick: $setup.zoomOut,
                  class: vue.normalizeClass(["functionButton", { functionButtonSP: !$setup.isLandscape }])
                },
                "缩小",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["separateLine", { separateLineSP: !$setup.isLandscape }])
                },
                null,
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  onClick: $setup.back,
                  class: vue.normalizeClass(["functionButton", { functionButtonSP: !$setup.isLandscape }])
                },
                "取消",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  onClick: $setup.saveCanvasToImage,
                  class: vue.normalizeClass(["functionButton", { functionButtonSP: !$setup.isLandscape }])
                },
                [
                  vue.createCommentVNode(` <image src='/static/image/save.svg' class="icon"></image> `),
                  vue.createTextVNode(" 保存 ")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["separateLine", { separateLineSP: !$setup.isLandscape }])
                },
                null,
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "button",
                {
                  onClick: $setup.changeTemplateParam,
                  class: vue.normalizeClass(["functionButton", { functionButtonSP: !$setup.isLandscape }])
                },
                [
                  vue.createCommentVNode(` <image src='/static/image/save.svg' class="icon"></image> `),
                  vue.createTextVNode(" 模板参数 ")
                ],
                2
                /* CLASS */
              ),
              vue.createCommentVNode(` <button @click="deleteSelected" :class="['functionButton', {functionButtonSP: !isLandscape}]">删除</button> `)
            ],
            2
            /* CLASS */
          ),
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
              vue.createElementVNode("view", { class: "popup-actions" }, [
                vue.createElementVNode("button", {
                  onClick: $setup.applyTemplateChange,
                  type: "primary"
                }, "确认"),
                vue.createElementVNode("button", { onClick: $setup.cancleTemplateChange }, "取消")
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(` <view class="functionBar">\r
			<button @click="deleteSelected" :class="['functionButton', {functionButtonSP: !isLandscape}]">删除</button>\r
			<button @click="clearCanvas" :class="['functionButton', {functionButtonSP: !isLandscape}]">清空</button>\r
			<button @click="zoomIn" :class="['functionButton', {functionButtonSP: !isLandscape}]">放大</button>\r
			<button @click="zoomOut" :class="['functionButton', {functionButtonSP: !isLandscape}]">缩小</button>\r
		</view> `),
          $setup.showTextInput ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 1,
              class: "text-input",
              style: vue.normalizeStyle({ top: $setup.logicalToScreen($setup.textInputX, $setup.textInputY).y + "px", left: $setup.logicalToScreen($setup.textInputX, $setup.textInputY).x + "px" })
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
          vue.createElementVNode("view", { class: "colorToolbar" }, [
            vue.createElementVNode("image", {
              src: $setup.drawColor === "#333333" ? "/static/image/CheckedCircleFill.png" : "/static/image/CheckCircleFill.png",
              class: vue.normalizeClass(["colorImg", { colorImgSP: !$setup.isLandscape }]),
              onClick: _cache[7] || (_cache[7] = ($event) => $setup.changeColor("#333333"))
            }, null, 10, ["src"]),
            vue.createElementVNode("image", {
              src: $setup.drawColor === "#FF3141" ? "/static/image/CheckedCircleFill-1.png" : "/static/image/CheckCircleFill-1.png",
              class: vue.normalizeClass(["colorImg", { colorImgSP: !$setup.isLandscape }]),
              onClick: _cache[8] || (_cache[8] = ($event) => $setup.changeColor("#FF3141"))
            }, null, 10, ["src"]),
            vue.createElementVNode("image", {
              src: $setup.drawColor === "#00B578" ? "/static/image/CheckedCircleFill-2.png" : "/static/image/CheckCircleFill-2.png",
              class: vue.normalizeClass(["colorImg", { colorImgSP: !$setup.isLandscape }]),
              onClick: _cache[9] || (_cache[9] = ($event) => $setup.changeColor("#00B578"))
            }, null, 10, ["src"]),
            vue.createElementVNode("image", {
              src: $setup.drawColor === "#1677FF" ? "/static/image/CheckedCircleFill-3.png" : "/static/image/CheckCircleFill-3.png",
              class: vue.normalizeClass(["colorImg", { colorImgSP: !$setup.isLandscape }]),
              onClick: _cache[10] || (_cache[10] = ($event) => $setup.changeColor("#1677FF"))
            }, null, 10, ["src"]),
            vue.createElementVNode("image", {
              src: $setup.drawColor === "#FFD24A" ? "/static/image/CheckedCircleFill-4.png" : "/static/image/CheckCircleFill-4.png",
              class: vue.normalizeClass(["colorImg", { colorImgSP: !$setup.isLandscape }]),
              onClick: _cache[11] || (_cache[11] = ($event) => $setup.changeColor("#FFD24A"))
            }, null, 10, ["src"]),
            vue.createCommentVNode(` <button @click="changeColor('#FF3141')" class="colorButton"\r
				style="background-color: #FF3141">{{drawColor=="#FF3141"? '√':''}}</button>\r
			<button @click="changeColor('#00B578')" class="colorButton"\r
				style="background-color: #00B578">{{drawColor=="#00B578"? '√':''}}</button>\r
			<button @click="changeColor('#1677FF')" class="colorButton"\r
				style="background-color: #1677FF">{{drawColor=="#1677FF"? '√':''}}</button>\r
			<button @click="changeColor('#FFD24A')" class="colorButton"\r
				style="background-color: #FFD24A">{{drawColor=="#FFD24A"? '√':''}}</button>\r
			<button @click="changeColor('#333333')" class="colorButton"\r
				style="background-color: #333333">{{drawColor=="#333333"? '√':''}}</button> `)
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
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const PagesCanvasCanvas = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-3fb2435b"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/canvas/canvas.vue"]]);
  function callCheckVersion() {
    return new Promise((resolve, reject) => {
      const systemInfo = uni.getSystemInfoSync();
      const appId = systemInfo.appId;
      const appVersion = systemInfo.appVersion;
      if (typeof appId === "string" && typeof appVersion === "string" && appId.length > 0 && appVersion.length > 0) {
        plus.runtime.getProperty(appId, function(widgetInfo) {
          if (widgetInfo.version || true) {
            let data = {
              action: "checkVersion",
              appid: appId,
              appVersion: "1.0.250615",
              wgtVersion: "1.0.250615"
              // appVersion: appVersion,
              // wgtVersion: widgetInfo.version
            };
            nr.callFunction({
              name: "uni-upgrade-center",
              data,
              success: (e2) => {
                resolve(e2.result);
              },
              fail: (error) => {
                reject(error);
              }
            });
          } else {
            reject("widgetInfo.version is EMPTY");
          }
        });
      } else {
        reject("plus.runtime.appid is EMPTY");
      }
    });
  }
  const platform_iOS = "iOS";
  const platform_Android = "Android";
  const platform_Harmony = "Harmony";
  function compare(v_1 = "0", v_2 = "0") {
    const v1 = String(v_1).split(".");
    const v2 = String(v_2).split(".");
    const minVersionLens = Math.min(v1.length, v2.length);
    let result = 0;
    for (let i2 = 0; i2 < minVersionLens; i2++) {
      const curV1 = Number(v1[i2]);
      const curV2 = Number(v2[i2]);
      if (curV1 > curV2) {
        result = 1;
        break;
      } else if (curV1 < curV2) {
        result = -1;
        break;
      }
    }
    if (result === 0 && v1.length !== v2.length) {
      const v1BiggerThenv2 = v1.length > v2.length;
      const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
      for (let i2 = minVersionLens; i2 < maxLensVersion.length; i2++) {
        const curVersion = Number(maxLensVersion[i2]);
        if (curVersion > 0) {
          v1BiggerThenv2 ? result = 1 : result = -1;
          break;
        }
      }
    }
    return result;
  }
  const PACKAGE_INFO_KEY = "__package_info__";
  function checkUpdate() {
    return new Promise((resolve, reject) => {
      callCheckVersion().then(async (uniUpgradeCenterResult) => {
        const code = uniUpgradeCenterResult.code;
        const message = uniUpgradeCenterResult.message;
        const url = uniUpgradeCenterResult.url;
        if (code > 0) {
          if (/^cloud:\/\//.test(url)) {
            const tcbRes = await nr.getTempFileURL({ fileList: [url] });
            if (typeof tcbRes.fileList[0].tempFileURL !== "undefined")
              uniUpgradeCenterResult.url = tcbRes.fileList[0].tempFileURL;
          }
          if (uniUpgradeCenterResult.is_silently) {
            uni.downloadFile({
              url,
              success: (res) => {
                if (res.statusCode == 200) {
                  plus.runtime.install(res.tempFilePath, {
                    force: false
                  });
                }
              }
            });
            return;
          }
          uni.setStorageSync(PACKAGE_INFO_KEY, uniUpgradeCenterResult);
          uni.navigateTo({
            url: `/uni_modules/uni-upgrade-center-app/pages/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
            fail: (err) => {
              formatAppLog("error", "at uni_modules/uni-upgrade-center-app/utils/check-update.ts:63", "更新弹框跳转失败", err);
              uni.removeStorageSync(PACKAGE_INFO_KEY);
            }
          });
          return resolve(uniUpgradeCenterResult);
        } else if (code < 0) {
          formatAppLog("error", "at uni_modules/uni-upgrade-center-app/utils/check-update.ts:93", message);
          return reject(uniUpgradeCenterResult);
        }
        return resolve(uniUpgradeCenterResult);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  const _imports_0$1 = "/static/image/user1.png";
  const _sfc_main$2 = {
    __name: "SystemSetting",
    setup(__props, { expose: __expose }) {
      __expose();
      const userInfo = userStore();
      const passwordPopup = vue.ref(null);
      const oldPassword = vue.ref("");
      const newPassword = vue.ref("");
      const confirmPassword = vue.ref("");
      const name2 = vue.ref("未知用户");
      const userAccount = vue.ref("unknownAccount");
      const versionNumber = vue.ref("v1");
      const openPasswordModal = () => {
        oldPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
        passwordPopup.value.open();
      };
      const closePasswordModal = () => {
        passwordPopup.value.close();
      };
      const handleLogout = async () => {
        var _a;
        try {
          uni.showLoading({
            title: "退出中..."
          });
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          if (!responseLogin.data || !responseLogin.data.token) {
            uni.hideLoading();
            uni.reLaunch({
              url: "/pages/LoginPage/LoginPage"
            });
            return;
          }
          const token = responseLogin.data.token;
          const response = await uni.request({
            url: "http://60.205.13.156:8090/api/user/logOut",
            method: "POST",
            header: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            }
          });
          uni.hideLoading();
          formatAppLog("log", "at pages/SystemSetting/SystemSetting.vue:159", "退出登录响应:", response.data);
          if (response.data && response.data.code === 0) {
            uni.showToast({
              title: "已退出登录",
              icon: "success",
              duration: 1500,
              success: () => {
                setTimeout(() => {
                  uni.reLaunch({
                    url: "/pages/LoginPage/LoginPage"
                  });
                }, 1500);
              }
            });
          } else {
            uni.showToast({
              title: ((_a = response.data) == null ? void 0 : _a.msg) || "退出登录失败",
              icon: "none",
              duration: 1500
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/SystemSetting/SystemSetting.vue:188", "退出登录出错:", error);
          uni.showToast({
            title: "退出登录中出现错误",
            icon: "none",
            duration: 1500,
            success: () => {
              setTimeout(() => {
                uni.reLaunch({
                  url: "/pages/LoginPage/LoginPage"
                });
              }, 1500);
            }
          });
        }
      };
      const changePassword = async () => {
        var _a;
        if (!oldPassword.value) {
          uni.showToast({
            title: "请输入旧密码",
            icon: "none"
          });
          return;
        }
        if (!newPassword.value) {
          uni.showToast({
            title: "请输入新密码",
            icon: "none"
          });
          return;
        }
        if (newPassword.value !== confirmPassword.value) {
          uni.showToast({
            title: "两次输入的新密码不一致",
            icon: "none"
          });
          return;
        }
        uni.showLoading({
          title: "修改中..."
        });
        try {
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${oldPassword.value}`,
            method: "POST"
          });
          formatAppLog("log", "at pages/SystemSetting/SystemSetting.vue:243", "登录响应:", responseLogin.data);
          if (!responseLogin.data || !responseLogin.data.token) {
            uni.hideLoading();
            uni.showToast({
              title: "旧密码验证失败",
              icon: "none"
            });
            return;
          }
          const token = responseLogin.data.token;
          const response = await uni.request({
            url: `http://60.205.13.156:8090/api/user/resetPassword?oldPassword=${oldPassword.value}&newPassword=${newPassword.value}`,
            method: "POST",
            header: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            }
          });
          uni.hideLoading();
          formatAppLog("log", "at pages/SystemSetting/SystemSetting.vue:270", "修改密码响应:", response.data);
          if (response.data && response.data.code === 0) {
            passwordPopup.value.close();
            uni.showToast({
              title: "密码修改成功，请重新登录",
              icon: "success",
              duration: 2e3,
              success: () => {
                setTimeout(() => {
                  uni.reLaunch({
                    url: "/pages/LoginPage/LoginPage"
                  });
                }, 2e3);
              }
            });
          } else {
            uni.showToast({
              title: ((_a = response.data) == null ? void 0 : _a.msg) || "修改密码失败",
              icon: "none"
            });
          }
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/SystemSetting/SystemSetting.vue:302", "修改密码出错:", error);
          uni.showToast({
            title: "网络错误，请稍后重试",
            icon: "none"
          });
        }
      };
      const onClickUpdate = () => {
        checkUpdate();
      };
      const compareVersion = (v1, v2) => {
        v1 = v1.replace(/^v/, "");
        v2 = v2.replace(/^v/, "");
        const fullV1 = "20" + v1;
        const fullV2 = "20" + v2;
        if (fullV1 > fullV2)
          return 1;
        if (fullV1 < fullV2)
          return -1;
        return 0;
      };
      const downloadAndInstall = (url) => {
        uni.showLoading({
          title: "下载中...",
          mask: true
        });
        const dtask = plus.downloader.createDownload(url, {
          filename: "_doc/update/"
        }, (d2, status) => {
          uni.hideLoading();
          if (status == 200) {
            formatAppLog("log", "at pages/SystemSetting/SystemSetting.vue:372", "下载成功：" + d2.filename);
            plus.runtime.install(d2.filename, {}, () => {
              formatAppLog("log", "at pages/SystemSetting/SystemSetting.vue:374", "安装成功");
              plus.runtime.restart();
            }, (e2) => {
              formatAppLog("error", "at pages/SystemSetting/SystemSetting.vue:377", "安装失败：" + e2.message);
              uni.showToast({
                title: "安装失败",
                icon: "none"
              });
            });
          } else {
            formatAppLog("error", "at pages/SystemSetting/SystemSetting.vue:384", "下载失败：" + status);
            uni.showToast({
              title: "下载失败",
              icon: "none"
            });
          }
        });
        dtask.start();
      };
      vue.onMounted(() => {
        userAccount.value = userInfo.username;
        if (typeof plus !== "undefined") {
          plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
            versionNumber.value = wgtinfo.version;
          });
        } else {
          versionNumber.value = "开发模式";
        }
      });
      vue.onMounted(async () => {
        try {
          const responseLogin = await uni.request({
            url: `http://60.205.13.156:8090/jwt/login?username=${userInfo.username}&password=${userInfo.password}`,
            method: "POST"
          });
          name2.value = responseLogin.data.userName;
        } catch (error) {
          formatAppLog("error", "at pages/SystemSetting/SystemSetting.vue:414", "用户数据请求失败");
        }
      });
      const __returned__ = { userInfo, passwordPopup, oldPassword, newPassword, confirmPassword, name: name2, userAccount, versionNumber, openPasswordModal, closePasswordModal, handleLogout, changePassword, onClickUpdate, compareVersion, downloadAndInstall, onMounted: vue.onMounted, ref: vue.ref, get userStore() {
        return userStore;
      }, get onLoad() {
        return onLoad;
      }, get async() {
        return async;
      }, get checkUpdate() {
        return checkUpdate;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "System" }, [
      vue.createElementVNode("view", { class: "main" }, [
        vue.createElementVNode("view", { class: "titleBar" }, [
          vue.createElementVNode("image", {
            src: _imports_0$1,
            class: "avatar"
          }),
          vue.createElementVNode("view", { class: "textContainer" }, [
            vue.createElementVNode(
              "view",
              { class: "code" },
              vue.toDisplayString($setup.userAccount),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              { class: "name" },
              vue.toDisplayString($setup.name),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "button" }, [
            vue.createElementVNode("button", {
              size: "default",
              type: "default",
              "hover-class": "is-hover",
              onClick: $setup.openPasswordModal
            }, "修改密码"),
            vue.createElementVNode("button", {
              size: "default",
              type: "default",
              "hover-class": "is-hover",
              onClick: $setup.handleLogout
            }, "退出登录")
          ])
        ])
      ]),
      vue.createCommentVNode(' <view class="model">\r\n			<view class="modelTitle">运行模式</view>\r\n			<view class="switchContainer">\r\n				<view class="title">离线</view>\r\n				<view>\r\n					<switch name="switch" />\r\n				</view>\r\n				<view class="title">在线</view>\r\n			</view>\r\n		</view> '),
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
          class: "functionButton",
          "hover-class": "is-hover",
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args))
        }, "数据导入")
      ]),
      vue.createElementVNode("view", { class: "divider" }),
      vue.createElementVNode("view", { class: "outData" }, [
        vue.createElementVNode("view", { class: "outDataTitle" }, "本地数据导出"),
        vue.createElementVNode("button", {
          size: "default",
          type: "default",
          class: "functionButton",
          "hover-class": "is-hover",
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleLogin && _ctx.handleLogin(...args))
        }, "数据导出")
      ]),
      vue.createElementVNode("view", { class: "divider" }),
      vue.createElementVNode("view", { class: "versionApp" }, [
        vue.createElementVNode("view", { class: "appTitle" }, "当前应用版本"),
        vue.createElementVNode(
          "view",
          null,
          vue.toDisplayString($setup.versionNumber),
          1
          /* TEXT */
        ),
        vue.createElementVNode("button", {
          size: "default",
          type: "default",
          class: "functionButton",
          "hover-class": "is-hover",
          onClick: $setup.onClickUpdate
        }, "版本更新")
      ]),
      vue.createCommentVNode(" 添加修改密码弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "passwordPopup",
          type: "center"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "password-popup-content" }, [
              vue.createElementVNode("view", { class: "popup-title" }, "修改密码"),
              vue.createElementVNode("view", { class: "password-form" }, [
                vue.createElementVNode("view", { class: "password-row" }, [
                  vue.createElementVNode("text", { class: "password-label" }, "旧密码"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "password",
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.oldPassword = $event),
                      placeholder: "请输入旧密码",
                      class: "password-input"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.oldPassword]
                  ])
                ]),
                vue.createElementVNode("view", { class: "password-row" }, [
                  vue.createElementVNode("text", { class: "password-label" }, "新密码"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "password",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.newPassword = $event),
                      placeholder: "请输入新密码",
                      class: "password-input"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.newPassword]
                  ])
                ]),
                vue.createElementVNode("view", { class: "password-row" }, [
                  vue.createElementVNode("text", { class: "password-label" }, "确认新密码"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "password",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.confirmPassword = $event),
                      placeholder: "请再次输入新密码",
                      class: "password-input"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.confirmPassword]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "popup-buttons" }, [
                vue.createElementVNode("button", {
                  class: "popup-btn cancel-btn",
                  onClick: $setup.closePasswordModal
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "popup-btn confirm-btn",
                  onClick: $setup.changePassword
                }, "确定")
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
  const PagesSystemSettingSystemSetting = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-524e171a"], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/pages/SystemSetting/SystemSetting.vue"]]);
  const { registerUTSInterface, initUTSProxyClass, initUTSProxyFunction, initUTSPackageName, initUTSIndexClassName, initUTSClassName } = uni;
  const name = "utsProgressNotification";
  const moduleName = "uts-progressNotification";
  const moduleType = "";
  const errMsg = ``;
  const is_uni_modules = true;
  const pkg = /* @__PURE__ */ initUTSPackageName(name, is_uni_modules);
  const cls = /* @__PURE__ */ initUTSIndexClassName(name, is_uni_modules);
  const createNotificationProgress = /* @__PURE__ */ initUTSProxyFunction(false, { moduleName, moduleType, errMsg, main: true, package: pkg, class: cls, name: "createNotificationProgressByJs", keepAlive: false, params: [{ "name": "options", "type": "UTSSDKModulesUtsProgressNotificationCreateNotificationProgressOptionsJSONObject" }], return: "" });
  const cancelNotificationProgress = /* @__PURE__ */ initUTSProxyFunction(false, { moduleName, moduleType, errMsg, main: true, package: pkg, class: cls, name: "cancelNotificationProgressByJs", keepAlive: false, params: [], return: "" });
  const finishNotificationProgress = /* @__PURE__ */ initUTSProxyFunction(false, { moduleName, moduleType, errMsg, main: true, package: pkg, class: cls, name: "finishNotificationProgressByJs", keepAlive: false, params: [{ "name": "options", "type": "UTSSDKModulesUtsProgressNotificationFinishNotificationProgressOptionsJSONObject" }], return: "" });
  const _imports_0 = "/uni_modules/uni-upgrade-center-app/static/app/bg_top.png";
  const _imports_1 = "/uni_modules/uni-upgrade-center-app/static/app/app_update_close.png";
  const localFilePathKey = "UNI_ADMIN_UPGRADE_CENTER_LOCAL_FILE_PATH";
  let downloadTask = null;
  let openSchemePromise;
  const _sfc_main$1 = {
    emits: ["close", "show"],
    data() {
      return {
        // 从之前下载安装
        installForBeforeFilePath: "",
        // 安装
        installed: false,
        installing: false,
        // 下载
        downloadSuccess: false,
        downloading: false,
        downLoadPercent: 0,
        downloadedSize: 0,
        packageFileSize: 0,
        tempFilePath: "",
        // 要安装的本地包地址
        // 默认安装包信息
        title: "更新日志",
        contents: "",
        version: "",
        is_mandatory: false,
        url: "",
        platform: [],
        store_list: null,
        // 可自定义属性
        subTitle: "发现新版本",
        downLoadBtnTextiOS: "立即跳转更新",
        downLoadBtnText: "立即下载更新",
        downLoadingText: "安装包下载中，请稍后",
        shown: true
      };
    },
    onLoad({ local_storage_key }) {
      if (!local_storage_key) {
        formatAppLog("error", "at uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue:130", "local_storage_key为空，请检查后重试");
        uni.navigateBack();
        return;
      }
      const localPackageInfo = uni.getStorageSync(local_storage_key);
      if (!localPackageInfo) {
        formatAppLog("error", "at uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue:137", "安装包信息为空，请检查后重试");
        uni.navigateBack();
        return;
      }
      this.setLocalPackageInfo(localPackageInfo);
    },
    onBackPress() {
      if (this.is_mandatory)
        return true;
      if (!this.needNotificationProgress)
        downloadTask && downloadTask.abort();
    },
    onHide() {
      openSchemePromise = null;
    },
    computed: {
      isWGT() {
        return this.type === "wgt";
      },
      isNativeApp() {
        return this.type === "native_app";
      },
      isiOS() {
        return this.platform.indexOf(platform_iOS) !== -1;
      },
      isAndroid() {
        return this.platform.indexOf(platform_Android) !== -1;
      },
      isHarmony() {
        return this.platform.indexOf(platform_Harmony) !== -1;
      },
      isApplicationStore() {
        return !this.isWGT && this.isNativeApp && (this.isiOS || this.isHarmony);
      },
      needNotificationProgress() {
        return this.platform.indexOf(platform_iOS) === -1 && !this.is_mandatory && !this.isHarmony;
      }
    },
    methods: {
      show(shown, localPackageInfo) {
      },
      setLocalPackageInfo(localPackageInfo) {
        const requiredKey = ["version", "url", "type"];
        for (let key in localPackageInfo) {
          if (requiredKey.indexOf(key) !== -1 && !localPackageInfo[key]) {
            formatAppLog("error", "at uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue:195", `参数 ${key} 必填，请检查后重试`);
            uni.navigateBack();
            return;
          }
        }
        Object.assign(this, localPackageInfo);
        this.checkLocalStoragePackage();
      },
      checkLocalStoragePackage() {
        const localFilePathRecord = uni.getStorageSync(localFilePathKey);
        if (localFilePathRecord) {
          const { version, savedFilePath, installed } = localFilePathRecord;
          if (!installed && compare(version, this.version) === 0) {
            this.downloadSuccess = true;
            this.installForBeforeFilePath = savedFilePath;
            this.tempFilePath = savedFilePath;
          } else {
            this.deleteSavedFile(savedFilePath);
          }
        }
      },
      askAbortDownload() {
        uni.showModal({
          title: "是否取消下载？",
          cancelText: "否",
          confirmText: "是",
          success: (res) => {
            if (res.confirm) {
              downloadTask && downloadTask.abort();
              if (this.needNotificationProgress) {
                cancelNotificationProgress();
              }
              uni.navigateBack();
            }
          }
        });
      },
      async closeUpdate() {
        if (this.downloading) {
          if (this.is_mandatory) {
            return uni.showToast({
              title: "下载中，请稍后……",
              icon: "none",
              duration: 500
            });
          }
          if (!this.needNotificationProgress) {
            this.askAbortDownload();
            return;
          }
        }
        if (!this.needNotificationProgress && this.downloadSuccess && this.tempFilePath) {
          await this.saveFile(this.tempFilePath, this.version);
        }
        uni.navigateBack();
      },
      updateApp() {
        this.checkStoreScheme().catch(() => {
          this.downloadPackage();
        }).finally(() => {
          openSchemePromise = null;
        });
      },
      // 跳转应用商店
      checkStoreScheme() {
        const storeList = (this.store_list || []).filter((item) => item.enable);
        if (storeList && storeList.length) {
          storeList.sort((cur, next) => next.priority - cur.priority).map((item) => item.scheme).reduce((promise, cur, curIndex) => {
            openSchemePromise = (promise || (promise = Promise.reject())).catch(() => {
              return new Promise((resolve, reject) => {
                plus.runtime.openURL(cur, (err) => {
                  reject(err);
                });
              });
            });
            return openSchemePromise;
          }, openSchemePromise);
          return openSchemePromise;
        }
        return Promise.reject();
      },
      downloadPackage() {
        this.downloading = true;
        downloadTask = uni.downloadFile({
          url: this.url,
          success: (res) => {
            if (res.statusCode == 200) {
              if (this.isWGT && res.tempFilePath.split(".").slice(-1)[0] !== "wgt") {
                const failCallback = (e2) => {
                  formatAppLog("log", "at uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue:311", "[FILE RENAME FAIL]：", JSON.stringify(e2));
                };
                plus.io.resolveLocalFileSystemURL(
                  res.tempFilePath,
                  (entry) => {
                    entry.getParent((parent) => {
                      const newName = `new_wgt_${Date.now()}.wgt`;
                      entry.copyTo(
                        parent,
                        newName,
                        (res2) => {
                          this.tempFilePath = res2.fullPath;
                          this.downLoadComplete();
                        },
                        failCallback
                      );
                    }, failCallback);
                  },
                  failCallback
                );
              } else {
                this.tempFilePath = res.tempFilePath;
                this.downLoadComplete();
              }
            } else {
              formatAppLog("log", "at uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue:341", "下载错误：" + JSON.stringify(res));
              this.downloadFail();
            }
          },
          fail: (err) => {
            formatAppLog("log", "at uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue:346", "下载错误：" + JSON.stringify(err));
            this.downloadFail();
          }
        });
        downloadTask.onProgressUpdate((res) => {
          this.downLoadPercent = res.progress;
          this.downloadedSize = (res.totalBytesWritten / Math.pow(1024, 2)).toFixed(2);
          this.packageFileSize = (res.totalBytesExpectedToWrite / Math.pow(1024, 2)).toFixed(2);
          if (this.needNotificationProgress && !this.downloadSuccess) {
            createNotificationProgress({
              title: "升级中心正在下载安装包……",
              content: `${this.downLoadPercent}%`,
              progress: this.downLoadPercent,
              onClick: () => {
                this.askAbortDownload();
              }
            });
          }
        });
        if (this.needNotificationProgress) {
          uni.navigateBack();
        }
      },
      downloadFail() {
        const errMsg2 = "下载失败，请点击重试";
        this.downloadSuccess = false;
        this.downloading = false;
        this.downLoadPercent = 0;
        this.downloadedSize = 0;
        this.packageFileSize = 0;
        this.downLoadBtnText = errMsg2;
        downloadTask = null;
        if (this.needNotificationProgress) {
          finishNotificationProgress({
            title: "升级包下载失败",
            content: "请重新检查更新"
          });
        }
      },
      downLoadComplete() {
        this.downloadSuccess = true;
        this.downloading = false;
        this.downLoadPercent = 0;
        this.downloadedSize = 0;
        this.packageFileSize = 0;
        downloadTask = null;
        if (this.needNotificationProgress) {
          finishNotificationProgress({
            title: "安装升级包",
            content: "下载完成"
          });
          this.installPackage();
          return;
        }
        if (this.is_mandatory) {
          this.installPackage();
        }
      },
      installPackage() {
        if (this.isWGT) {
          this.installing = true;
        }
        plus.runtime.install(
          this.tempFilePath,
          {
            force: false
          },
          async (res) => {
            this.installing = false;
            this.installed = true;
            if (this.isWGT) {
              if (this.is_mandatory) {
                uni.showLoading({
                  icon: "none",
                  title: "安装成功，正在重启……"
                });
                setTimeout(() => {
                  uni.hideLoading();
                  this.restart();
                }, 1e3);
              }
            } else {
              const localFilePathRecord = uni.getStorageSync(localFilePathKey);
              uni.setStorageSync(localFilePathKey, {
                ...localFilePathRecord,
                installed: true
              });
            }
          },
          async (err) => {
            if (this.installForBeforeFilePath) {
              await this.deleteSavedFile(this.installForBeforeFilePath);
              this.installForBeforeFilePath = "";
            }
            this.installing = false;
            this.installed = false;
            uni.showModal({
              title: "更新失败，请重新下载",
              content: err.message,
              showCancel: false
            });
          }
        );
        if (!this.isWGT && !this.is_mandatory) {
          uni.navigateBack();
        }
      },
      restart() {
        this.installed = false;
        plus.runtime.restart();
      },
      saveFile(tempFilePath, version) {
        return new Promise((resolve, reject) => {
          uni.saveFile({
            tempFilePath,
            success({ savedFilePath }) {
              uni.setStorageSync(localFilePathKey, {
                version,
                savedFilePath
              });
            },
            complete() {
              resolve();
            }
          });
        });
      },
      deleteSavedFile(filePath) {
        uni.removeStorageSync(localFilePathKey);
        return uni.removeSavedFile({
          filePath
        });
      },
      jumpToApplicationStore() {
        plus.runtime.openURL(this.url);
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.shown ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "mask flex-center"
    }, [
      vue.createElementVNode("view", { class: "content botton-radius" }, [
        vue.createElementVNode("view", { class: "content-top" }, [
          vue.createElementVNode(
            "text",
            { class: "content-top-text" },
            vue.toDisplayString($data.title),
            1
            /* TEXT */
          ),
          vue.createElementVNode("image", {
            class: "content-top",
            style: { "top": "0" },
            width: "100%",
            height: "100%",
            src: _imports_0
          })
        ]),
        vue.createElementVNode("view", { class: "content-header" }),
        vue.createElementVNode("view", { class: "content-body" }, [
          vue.createElementVNode("view", { class: "title" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($data.subTitle),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "content-body-version" },
              vue.toDisplayString($data.version),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "body" }, [
            vue.createElementVNode("scroll-view", {
              class: "box-des-scroll",
              "scroll-y": "true"
            }, [
              vue.createElementVNode(
                "text",
                { class: "box-des" },
                vue.toDisplayString($data.contents),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "footer flex-center" }, [
            $options.isApplicationStore ? (vue.openBlock(), vue.createElementBlock(
              "button",
              {
                key: 0,
                class: "content-button",
                style: { "border": "none", "color": "#fff" },
                plain: "",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.jumpToApplicationStore && $options.jumpToApplicationStore(...args))
              },
              vue.toDisplayString($data.downLoadBtnTextiOS),
              1
              /* TEXT */
            )) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              [
                !$data.downloadSuccess ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 0 },
                  [
                    $data.downloading ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "progress-box flex-column"
                    }, [
                      vue.createElementVNode("progress", {
                        class: "progress",
                        percent: $data.downLoadPercent,
                        activeColor: "#3DA7FF",
                        "show-info": "",
                        "stroke-width": "10"
                      }, null, 8, ["percent"]),
                      vue.createElementVNode("view", { style: { "width": "100%", "font-size": "28rpx", "display": "flex", "justify-content": "space-around" } }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString($data.downLoadingText),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          null,
                          "(" + vue.toDisplayString($data.downloadedSize) + "/" + vue.toDisplayString($data.packageFileSize) + "M)",
                          1
                          /* TEXT */
                        )
                      ])
                    ])) : (vue.openBlock(), vue.createElementBlock(
                      "button",
                      {
                        key: 1,
                        class: "content-button",
                        style: { "border": "none", "color": "#fff" },
                        plain: "",
                        onClick: _cache[1] || (_cache[1] = (...args) => $options.updateApp && $options.updateApp(...args))
                      },
                      vue.toDisplayString($data.downLoadBtnText),
                      1
                      /* TEXT */
                    ))
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : $data.downloadSuccess && !$data.installed ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 1,
                  class: "content-button",
                  style: { "border": "none", "color": "#fff" },
                  plain: "",
                  loading: $data.installing,
                  disabled: $data.installing,
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.installPackage && $options.installPackage(...args))
                }, vue.toDisplayString($data.installing ? "正在安装……" : "下载完成，立即安装"), 9, ["loading", "disabled"])) : $data.installed && !$options.isWGT ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 2,
                  class: "content-button",
                  style: { "border": "none", "color": "#fff" },
                  plain: "",
                  loading: $data.installing,
                  disabled: $data.installing,
                  onClick: _cache[3] || (_cache[3] = (...args) => $options.installPackage && $options.installPackage(...args))
                }, " 安装未完成，点击安装 ", 8, ["loading", "disabled"])) : $data.installed && $options.isWGT ? (vue.openBlock(), vue.createElementBlock("button", {
                  key: 3,
                  class: "content-button",
                  style: { "border": "none", "color": "#fff" },
                  plain: "",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.restart && $options.restart(...args))
                }, "安装完毕，点击重启")) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        !$data.is_mandatory ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "close-img",
          src: _imports_1,
          onClick: _cache[5] || (_cache[5] = vue.withModifiers((...args) => $options.closeUpdate && $options.closeUpdate(...args), ["stop"]))
        })) : vue.createCommentVNode("v-if", true)
      ])
    ])) : vue.createCommentVNode("v-if", true);
  }
  const UniModulesUniUpgradeCenterAppPagesUpgradePopup = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/uni_modules/uni-upgrade-center-app/pages/upgrade-popup.vue"]]);
  __definePage("pages/LoginPage/LoginPage", PagesLoginPageLoginPage);
  __definePage("pages/home/home", PagesHomeHome);
  __definePage("pages/bridge/bridge", PagesBridgeBridge);
  __definePage("pages/List/List", PagesListList);
  __definePage("pages/bridge-disease/bridge-disease", PagesBridgeDiseaseBridgeDisease);
  __definePage("pages/add-disease/add-disease", PagesAddDiseaseAddDisease);
  __definePage("pages/canvas/canvas", PagesCanvasCanvas);
  __definePage("pages/SystemSetting/SystemSetting", PagesSystemSettingSystemSetting);
  __definePage("uni_modules/uni-upgrade-center-app/pages/upgrade-popup", UniModulesUniUpgradeCenterAppPagesUpgradePopup);
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/code/HbuilderX/BuildingInspectorFrontend/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    const pinia = createPinia();
    app.use(pinia);
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
