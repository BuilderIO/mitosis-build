const Component000013 = require("./med.js").Component000013;
const h = require("@builder.io/qwik").h;
const qrl = require("@builder.io/qwik").qrl;
const withScopedStylesQrl = require("@builder.io/qwik").withScopedStylesQrl;
exports.Component000012_styles = `.cv6ku2d{display:flex;flex-direction:row;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;padding-bottom:30px;flex-wrap:wrap;width:calc(100%+3vw);height:100%;min-height:100%;margin-left:-1.5vw;margin-right:-1.5vw}.c3j7e6c{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;width:33.3%}@media (max-width: 991px){.cv6ku2d{width:100%;margin-left:auto;margin-right:auto}}@media (max-width: 640px){.cv6ku2d{display:flex;flex-direction:column;align-items:stretch}}@media (max-width: 640px){.c3j7e6c{width:98%;margin-left:auto;margin-right:auto;margin-top:-10px}}`;
exports.Component000012_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    if (!state.hasOwnProperty("offset")) state.offset = "0";
    if (!state.hasOwnProperty("limit")) state.limit = 3;
    if (!state.hasOwnProperty("blogCategory"))
      state.blogCategory = {
        "@type": "@builder.io/core:Reference",
        id: "",
        model: "",
      };
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  withScopedStylesQrl(qrl("./low.js", "Component000012_styles", []));
  return h(
    "div",
    {
      "builder-id": "builder-d2b6ee30433348ffa51a17334b8b6c73",
      class: "cv6ku2d",
    },
    (state.hits || []).map(
      function (__value__) {
        var state = Object.assign({}, this, {
          hitsItem: __value__ == null ? {} : __value__,
        });
        return h(
          "div",
          {
            "builder-id": "builder-cc43bc95cde743a59b269cb0157b99cd",
            class: "c3j7e6c",
          },
          h(Component000013, {
            "builder-id": "builder-cx8eewmyu3",
            altText: "",
            serverStateId: "woo8b6",
            title: state.hitsItem.name,
            linkUrl: state.hitsItem.url,
            subCategory: state.hitsItem.blogSubcategory,
            imageUrl: state.hitsItem.heroImage,
            publicationDate: state.hitsItem.createdDate,
            heroImageAltText: state.hitsItem.heroImageAltText,
          })
        );
      }.bind(state)
    )
  );
};
