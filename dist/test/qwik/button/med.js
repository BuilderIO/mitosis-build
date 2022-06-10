import { componentQrl, h, qrl } from "@builder.io/qwik";
export const MyComponent = componentQrl(
  qrl("./low.js", "MyComponent_onMount", [])
);
export const CoreButton = function CoreButton(props) {
  var hasLink = !!props.link;
  var hProps = {
    innerHTML: props.text || "",
    href: props.link,
    target: props.openInNewTab ? "_blank" : "_self",
    class: props.class,
  };
  return h(
    hasLink ? "a" : props.tagName$ || "span",
    __passThroughProps__(hProps, props)
  );
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
