"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function ImgStateComponent() {
    var state = (0, mitosis_1.useState)({
        canShow: true,
        images: ['http://example.com/qwik.png'],
    });
    return (<div>
      <mitosis_1.For each={state.images}>
        {function (item, itemIndex) { return (<>
            <img class={'custom-class'} src={item} key={itemIndex}/>
          </>); }}
      </mitosis_1.For>
    </div>);
}
exports.default = ImgStateComponent;
