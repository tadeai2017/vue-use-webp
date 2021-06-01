/**
 * @file  vue-webp 指令 方便使用webp格式
 * @author dingdandan
 * @date 2021年 6月1日 星期二
 * @use
 * 1. src方式使用远程图片
 * <img v-webp="https://h5.u51.com/99fenqi/vue//static/home_top_bg.png"/>
 * 2. src方式使用本地图片
 * <img v-webp="static/home_top_bg.png"/>
 * 3. background-image方式使用
 * <img v-webp:bg="static/home_top_bg.png"/>
 * @TIPS
 *  1. base64格式的图片资源自动忽略webp
 * 参考 vue-webp-plugin
 */
/* eslint-disable */
(function() {
  var canUseWebp = (function() {
    var elem = document.createElement("canvas");
    if (!!(elem.getContext && elem.getContext("2d"))) {
      // 两种方式判断是否支持webp，canvas转base64或者iOS safari 14.0及以上
      // iOS系统14以上的safari版本也是14以上
      var str = window.navigator.userAgent.toLowerCase();
      var ver = str.match(/cpu iphone os (.*?) like mac os/);
      var verData = ver && ver[1] && ver[1].split('_')[0] >= 14;
      var canvasData = elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
      return canvasData || verData;
    } else {
      return false;
    }
  })();

  // 核心逻辑
  function update(el, binding) {
    // 支持 src 和 background
    var attr = binding.arg || "src",
      // 图片的地址 格式 base64格式 or 连接
      value = binding.value;
    // base64
    if (value.indexOf("data:image") > -1) {
      setImg(el, attr, value);
    } else {
      setImg(el, attr, value, true);
    }
  }

  /**
   *
   * @param {DOM} el 修改的dom元素
   * @param {Stirng} attr 通过何种方式显示 支持 src 和 background-image
   * @param {String} originUrl 图片的地址  支持base64 和 图片地址
   * @param {Boolean} replace 是否尝试使用webp格式
   */
  function setImg(el, attr, originUrl, replace) {
    let webpUrl = originUrl;
    if (replace && canUseWebp) {
      var extReg = /\.\w{3,}$/ig;
      webpUrl = originUrl.replace(extReg,  ".webp");
      onErrorLoadWebp(el, attr, webpUrl, originUrl);
    }
    if (attr === "bg") {
      el.style.backgroundImage = "url(" + webpUrl + ")";
    } else {
      el.setAttribute(attr, webpUrl);
    }
  }

  // 加载webp格式图片出错 使用原格式再次尝试
  function onErrorLoadWebp(el, attr, webpUrl, originUrl) {
    let img = new Image();
    img.src = webpUrl;
    img.onerror = function() {
      setImg(el, attr, originUrl);
      img = null;
    };
  }

  // 指令
  var vueWebp = {
    install: function(Vue) {
      Vue.directive("webp", {
        // 被绑定元素插入到父元素中（但是不定被插入到文档中）
        inserted: function(el, binding) {
          update(el, binding);
        },
        // 指令所在组件和其子Vnode全部更新之后
        componentUpdated: function(el, binding) {
          if (binding.value !== binding.oldValue) {
            update(el, binding);
          }
        }
      });
    }
  };
  if (typeof exports == "object") {
    module.exports = vueWebp;
  } else if (typeof define == "function" && define.amd) {
    define([], function() {
      return vueWebp;
    });
  } else if (window.Vue) {
    window.VueWebp = vueWebp;
    Vue.use(vueWebp);
  }
})();
