import { h, qrl, withScopedStylesQrl } from "@builder.io/qwik";
export const MyComponent_styles = `.csw5022{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;align-items:stretch}.csanagh{margin-top:10px;position:relative;display:flex;align-items:stretch;flex-direction:column;padding-bottom:10px}.c4qyc1p{position:relative;display:flex;align-items:stretch;flex-direction:column;margin-top:10px;padding-bottom:10px}.crwdrpw{text-align:left;display:flex;flex-direction:column}.ctcw2m4{padding-top:50px;text-align:left;display:flex;flex-direction:column;padding-bottom:50px}`;
export const MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  withScopedStylesQrl(qrl("./low.js", "MyComponent_styles", []));
  return (
    <div
      builder-id="builder-bb2f62792e464d73b7cb89258027f356"
      gridRowWidth="25%"
      class="csw5022"
      items={[
        {
          title: [
            {
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              layerName: "Accordion item title",
              id: "builder-5fed2723c1cc4fb39e9d22b9c54ef179",
              children: [
                {
                  "@type": "@builder.io/sdk:Element",
                  "@version": 2,
                  id: "builder-2cad86b387ec405d82917895d7af0a12",
                  component: {
                    name: "Text",
                    options: { text: "<p>Item 1</p>" },
                  },
                  responsiveStyles: {
                    large: {
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                    },
                  },
                },
              ],
              responsiveStyles: {
                large: {
                  marginTop: "10px",
                  position: "relative",
                  display: "flex",
                  alignItems: "stretch",
                  flexDirection: "column",
                  paddingBottom: "10px",
                },
              },
            },
          ],
          detail: [
            {
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              layerName: "Accordion item detail",
              id: "builder-18279a99b32240f19aa21d3f4b015cc9",
              children: [
                {
                  "@type": "@builder.io/sdk:Element",
                  "@version": 2,
                  id: "builder-2dbfa56b8988461c8566bbe759580e9b",
                  component: {
                    name: "Text",
                    options: { text: "<p>Item 1 content</p>" },
                  },
                  responsiveStyles: {
                    large: {
                      paddingTop: "50px",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      paddingBottom: "50px",
                    },
                  },
                },
              ],
              responsiveStyles: {
                large: {
                  position: "relative",
                  display: "flex",
                  alignItems: "stretch",
                  flexDirection: "column",
                  marginTop: "10px",
                  paddingBottom: "10px",
                },
              },
            },
          ],
        },
        {
          title: [
            {
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              layerName: "Accordion item title",
              id: "builder-2a93def22a354cf7aa193c20d1ad6def",
              children: [
                {
                  "@type": "@builder.io/sdk:Element",
                  "@version": 2,
                  id: "builder-1365fc457ece45db82ad90dbe9819e7c",
                  component: {
                    name: "Text",
                    options: { text: "<p>Item 2</p>" },
                  },
                  responsiveStyles: {
                    large: {
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                    },
                  },
                },
              ],
              responsiveStyles: {
                large: {
                  marginTop: "10px",
                  position: "relative",
                  display: "flex",
                  alignItems: "stretch",
                  flexDirection: "column",
                  paddingBottom: "10px",
                },
              },
            },
          ],
          detail: [
            {
              "@type": "@builder.io/sdk:Element",
              "@version": 2,
              layerName: "Accordion item detail",
              id: "builder-fd6ef41da6d040328fbd8b0801611fe5",
              children: [
                {
                  "@type": "@builder.io/sdk:Element",
                  "@version": 2,
                  id: "builder-7362f9fd64c647c5a400d9e75c74473f",
                  component: {
                    name: "Text",
                    options: { text: "<p>Item 2 content</p>" },
                  },
                  responsiveStyles: {
                    large: {
                      paddingTop: "50px",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      paddingBottom: "50px",
                    },
                  },
                },
              ],
              responsiveStyles: {
                large: {
                  position: "relative",
                  display: "flex",
                  alignItems: "stretch",
                  flexDirection: "column",
                  marginTop: "10px",
                  paddingBottom: "10px",
                },
              },
            },
          ],
        },
      ]}
      animate={true}
    >
      <div>
        <div builder="accordion">
          <div builder="accordion-title">
            <div
              builder-id="builder-5fed2723c1cc4fb39e9d22b9c54ef179"
              class="csanagh"
            >
              <div class="crwdrpw">
                <div innerHTML="<p>Item 1</p>" class="builder-text"></div>
              </div>
            </div>
          </div>
          <div builder="accordion-detail">
            <div
              builder-id="builder-18279a99b32240f19aa21d3f4b015cc9"
              class="c4qyc1p"
            >
              <div class="ctcw2m4">
                <div
                  innerHTML="<p>Item 1 content</p>"
                  class="builder-text"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div builder="accordion">
          <div builder="accordion-title">
            <div
              builder-id="builder-2a93def22a354cf7aa193c20d1ad6def"
              class="csanagh"
            >
              <div class="crwdrpw">
                <div innerHTML="<p>Item 2</p>" class="builder-text"></div>
              </div>
            </div>
          </div>
          <div builder="accordion-detail">
            <div
              builder-id="builder-fd6ef41da6d040328fbd8b0801611fe5"
              class="c4qyc1p"
            >
              <div class="ctcw2m4">
                <div
                  innerHTML="<p>Item 2 content</p>"
                  class="builder-text"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
