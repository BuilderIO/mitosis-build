"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function Image(props) {
    var pictureRef = (0, mitosis_1.useRef)();
    var state = (0, mitosis_1.useStore)({
        scrollListener: null,
        imageLoaded: false,
        setLoaded: function () {
            state.imageLoaded = true;
        },
        useLazyLoading: function () {
            // TODO: Add more checks here, like testing for real web browsers
            return !!props.lazy && isBrowser();
        },
    });
    function isBrowser() {
        return typeof window !== 'undefined' && window.navigator.product != 'ReactNative';
    }
    var _a = (0, mitosis_1.useState)(false), load = _a[0], setLoad = _a[1];
    (0, mitosis_1.onMount)(function () {
        if (state.useLazyLoading()) {
            // throttled scroll capture listener
            var listener_1 = function () {
                if (pictureRef) {
                    var rect = pictureRef.getBoundingClientRect();
                    var buffer = window.innerHeight / 2;
                    if (rect.top < window.innerHeight + buffer) {
                        setLoad(true);
                        state.scrollListener = null;
                        window.removeEventListener('scroll', listener_1);
                    }
                }
            };
            state.scrollListener = listener_1;
            window.addEventListener('scroll', listener_1, {
                capture: true,
                passive: true,
            });
            listener_1();
        }
    });
    (0, mitosis_1.onUnMount)(function () {
        if (state.scrollListener) {
            window.removeEventListener('scroll', state.scrollListener);
        }
    });
    return (<>
      <picture ref={pictureRef}>
        <mitosis_1.Show when={!state.useLazyLoading() || load}>
          <img alt={props.altText} aria-role={props.altText ? 'presentation' : undefined} css={{
            opacity: '1',
            transition: 'opacity 0.2s ease-in-out',
            objectFit: 'cover',
            objectPosition: 'center',
        }} class={'builder-image' + (props._class ? ' ' + props._class : '')} src={props.image} onLoad={function () { return state.setLoaded(); }} 
    // TODO: memoize on image on client
    srcset={props.srcset} sizes={props.sizes}/>
        </mitosis_1.Show>
        <source srcset={props.srcset}/>
      </picture>
      {props.children}
    </>);
}
exports.default = Image;
