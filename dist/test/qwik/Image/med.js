import {
  Fragment,
  componentQrl,
  h,
  qrl,
  withScopedStylesQrl,
} from "@builder.io/qwik";
export const MyComponent_styles = `.cvk52jt{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;min-height:20px;min-width:20px;overflow:hidden}.cjrqfb1{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;line-height:normal;height:auto;text-align:center}`;
export const MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    if (!state.hasOwnProperty("myState")) state.myState = "initialValue";
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
    undefined;
  }
  withScopedStylesQrl(qrl("./med.js", "MyComponent_styles", []));
  return h(
    Fragment,
    null,
    h(Image, {
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=1160",
      backgroundSize: "cover",
      backgroundPosition: "center",
      srcset:
        "https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=1160 1160w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=598 598w, https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b?width=958 958w",
      sizes: "(max-width: 638px) 94vw, (max-width: 998px) 96vw, 83vw",
      class: "cvk52jt",
      onClickQrl: qrl("./high.js", "MyComponent_onClick_0", [state]),
      lazy: false,
      fitContent: true,
      aspectRatio: 1,
      height: 1300,
      width: 1300,
    }),
    h(
      "div",
      { class: "cjrqfb1" },
      h("div", {
        class: "builder-text",
        innerHTML: (() => {
          try {
            var _virtual_index = state.myState;
            return _virtual_index;
          } catch (err) {
            console.warn("Builder code error", err);
          }
        })(),
      })
    )
  );
};
export const MyComponent = componentQrl(
  qrl("./med.js", "MyComponent_onMount", [])
);
export const Image = function Image(props) {
  var _a;
  var jsx = props.children || [];
  var image = props.image;
  if (image) {
    var isBuilderIoImage = !!(image || "").match(/\.builder\.io/);
    var isPixel =
      (_a = props.builderBlock) === null || _a === void 0
        ? void 0
        : _a.id.startsWith("builder-pixel-");
    var imgProps = {
      src: props.image,
      style:
        "object-fit:"
          .concat(props.backgroundSize || "cover", ";object-position:")
          .concat(props.backgroundPosition || "center", ";") +
        (props.aspectRatio
          ? "position:absolute;height:100%;width:100%;top:0;left:0"
          : ""),
      sizes: props.sizes,
      alt: props.altText,
      role: !props.altText ? "presentation" : undefined,
      loading: isPixel ? "eager" : "lazy",
      srcset: undefined,
    };
    if (isBuilderIoImage) {
      var webpImage_1 = updateQueryParam(image, "format", "webp");
      var srcset = ["100", "200", "400", "800", "1200", "1600", "2000"]
        .concat(props.srcsetSizes ? String(props.srcsetSizes).split(" ") : [])
        .map(function (size) {
          return (
            updateQueryParam(webpImage_1, "width", size) + " " + size + "w"
          );
        })
        .concat([image])
        .join(",");
      imgProps.srcset = srcset;
      jsx = jsx = [
        h("picture", {}, [
          h("source", { type: "image/webp", srcset: srcset }),
          h("img", imgProps, jsx),
        ]),
      ];
    } else {
      jsx = [h("img", imgProps, jsx)];
    }
    if (
      props.aspectRatio &&
      !(props.fitContent && props.children && props.children.length)
    ) {
      var sizingDiv = h("div", {
        class: "builder-image-sizer",
        style: "width:100%;padding-top:".concat(
          (props.aspectRatio || 1) * 100,
          "%;pointer-events:none;font-size:0"
        ),
      });
      jsx.push(sizingDiv);
    }
  }
  var children = props.children ? [jsx].concat(props.children) : [jsx];
  return h(
    props.href ? "a" : "div",
    __passThroughProps__({ href: props.href, class: props.class }, props),
    children
  );
  function updateQueryParam(uri, key, value) {
    if (uri === void 0) {
      uri = "";
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf("?") !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(
        re,
        "$1" + key + "=" + encodeURIComponent(value) + "$2"
      );
    }
    return uri + separator + key + "=" + encodeURIComponent(value);
  }
};
export const __passThroughProps__ = function __passThroughProps__(
  dstProps,
  srcProps
) {
  for (var key in srcProps) {
    if (
      Object.prototype.hasOwnProperty.call(srcProps, key) &&
      ((key.startsWith("on") && key.endsWith("Qrl")) || key == "style")
    ) {
      dstProps[key] = srcProps[key];
    }
  }
  return dstProps;
};
