"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
var _fake_1 = require("@fake");
var sdk_1 = require("@builder.io/sdk");
var _fake_2 = require("@fake");
var _fake_3 = require("@fake");
var _fake_4 = require("@fake");
function FormComponent(props) {
    var _a;
    var state = (0, mitosis_1.useState)({
        state: 'unsubmitted',
        // TODO: separate response and error?
        responseData: null,
        formErrorMessage: '',
        get submissionState() {
            return (sdk_1.Builder.isEditing && props.previewState) || state.state;
        },
        onSubmit: function (event) {
            var _this = this;
            var _a;
            var sendWithJs = props.sendWithJs || props.sendSubmissionsTo === 'email';
            if (props.sendSubmissionsTo === 'zapier') {
                event.preventDefault();
            }
            else if (sendWithJs) {
                if (!(props.action || props.sendSubmissionsTo === 'email')) {
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                var el = event.currentTarget;
                var headers = props.customHeaders || {};
                var body = void 0;
                var formData = new FormData(el);
                // TODO: maybe support null
                var formPairs = Array.from(event.currentTarget.querySelectorAll('input,select,textarea'))
                    .filter(function (el) { return !!el.name; })
                    .map(function (el) {
                    var value;
                    var key = el.name;
                    if (el instanceof HTMLInputElement) {
                        if (el.type === 'radio') {
                            if (el.checked) {
                                value = el.name;
                                return { key: key, value: value };
                            }
                        }
                        else if (el.type === 'checkbox') {
                            value = el.checked;
                        }
                        else if (el.type === 'number' || el.type === 'range') {
                            var num = el.valueAsNumber;
                            if (!isNaN(num)) {
                                value = num;
                            }
                        }
                        else if (el.type === 'file') {
                            // TODO: one vs multiple files
                            value = el.files;
                        }
                        else {
                            value = el.value;
                        }
                    }
                    else {
                        value = el.value;
                    }
                    return { key: key, value: value };
                });
                var contentType_1 = props.contentType;
                if (props.sendSubmissionsTo === 'email') {
                    contentType_1 = 'multipart/form-data';
                }
                Array.from(formPairs).forEach(function (_a) {
                    var value = _a.value;
                    if (value instanceof File ||
                        (Array.isArray(value) && value[0] instanceof File) ||
                        value instanceof FileList) {
                        contentType_1 = 'multipart/form-data';
                    }
                });
                // TODO: send as urlEncoded or multipart by default
                // because of ease of use and reliability in browser API
                // for encoding the form?
                if (contentType_1 !== 'application/json') {
                    body = formData;
                }
                else {
                    // Json
                    var json_1 = {};
                    Array.from(formPairs).forEach(function (_a) {
                        var value = _a.value, key = _a.key;
                        (0, _fake_3.set)(json_1, key, value);
                    });
                    body = JSON.stringify(json_1);
                }
                if (contentType_1 && contentType_1 !== 'multipart/form-data') {
                    if (
                    /* Zapier doesn't allow content-type header to be sent from browsers */
                    !(sendWithJs && ((_a = props.action) === null || _a === void 0 ? void 0 : _a.includes('zapier.com')))) {
                        headers['content-type'] = contentType_1;
                    }
                }
                var presubmitEvent = new CustomEvent('presubmit', {
                    detail: {
                        body: body,
                    },
                });
                if (formRef) {
                    formRef.dispatchEvent(presubmitEvent);
                    if (presubmitEvent.defaultPrevented) {
                        return;
                    }
                }
                state.state = 'sending';
                var formUrl = "".concat(sdk_1.builder.env === 'dev' ? 'http://localhost:5000' : 'https://builder.io', "/api/v1/form-submit?apiKey=").concat(sdk_1.builder.apiKey, "&to=").concat(btoa(props.sendSubmissionsToEmail || ''), "&name=").concat(encodeURIComponent(props.name || ''));
                fetch(props.sendSubmissionsTo === 'email'
                    ? formUrl
                    : props.action /* TODO: throw error if no action URL */, {
                    body: body,
                    headers: headers,
                    method: props.method || 'post',
                }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                    var body, contentType, message, submitSuccessEvent, event_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                contentType = res.headers.get('content-type');
                                if (!(contentType && contentType.indexOf('application/json') !== -1)) return [3 /*break*/, 2];
                                return [4 /*yield*/, res.json()];
                            case 1:
                                body = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, res.text()];
                            case 3:
                                body = _a.sent();
                                _a.label = 4;
                            case 4:
                                if (!res.ok && props.errorMessagePath) {
                                    message = (0, _fake_4.get)(body, props.errorMessagePath);
                                    if (message) {
                                        if (typeof message !== 'string') {
                                            /* TODO: ideally convert json to yaml so it woul dbe like
                                             error: - email has been taken */
                                            message = JSON.stringify(message);
                                        }
                                        state.formErrorMessage = message;
                                    }
                                }
                                state.responseData = body;
                                state.state = res.ok ? 'success' : 'error';
                                if (res.ok) {
                                    submitSuccessEvent = new CustomEvent('submit:success', {
                                        detail: {
                                            res: res,
                                            body: body,
                                        },
                                    });
                                    if (formRef) {
                                        formRef.dispatchEvent(submitSuccessEvent);
                                        if (submitSuccessEvent.defaultPrevented) {
                                            return [2 /*return*/];
                                        }
                                        /* TODO: option to turn this on/off? */
                                        if (props.resetFormOnSubmit !== false) {
                                            formRef.reset();
                                        }
                                    }
                                    /* TODO: client side route event first that can be preventDefaulted */
                                    if (props.successUrl) {
                                        if (formRef) {
                                            event_1 = new CustomEvent('route', {
                                                detail: {
                                                    url: props.successUrl,
                                                },
                                            });
                                            formRef.dispatchEvent(event_1);
                                            if (!event_1.defaultPrevented) {
                                                location.href = props.successUrl;
                                            }
                                        }
                                        else {
                                            location.href = props.successUrl;
                                        }
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }, function (err) {
                    var submitErrorEvent = new CustomEvent('submit:error', {
                        detail: {
                            error: err,
                        },
                    });
                    if (formRef) {
                        formRef.dispatchEvent(submitErrorEvent);
                        if (submitErrorEvent.defaultPrevented) {
                            return;
                        }
                    }
                    state.responseData = err;
                    state.state = 'error';
                });
            }
        },
    });
    var formRef = (0, mitosis_1.useRef)(null);
    return (<form validate={props.validate} ref={formRef} action={!props.sendWithJs && props.action} method={props.method} name={props.name} onSubmit={function (event) { return state.onSubmit(event); }} {...props.attributes}>
      <mitosis_1.Show when={props.builderBlock && props.builderBlock.children}>
        <mitosis_1.For each={(_a = props.builderBlock) === null || _a === void 0 ? void 0 : _a.children}>
          {function (block, index) { return (<_fake_1.BuilderBlock key={block.id} block={block} index={index}/>); }}
        </mitosis_1.For>
      </mitosis_1.Show>

      <mitosis_1.Show when={state.submissionState === 'error'}>
        <_fake_2.BuilderBlocks dataPath="errorMessage" blocks={props.errorMessage}/>
      </mitosis_1.Show>

      <mitosis_1.Show when={state.submissionState === 'sending'}>
        <_fake_2.BuilderBlocks dataPath="sendingMessage" blocks={props.sendingMessage}/>
      </mitosis_1.Show>

      <mitosis_1.Show when={state.submissionState === 'error' && state.responseData}>
        <pre class="builder-form-error-text" css={{ padding: '10px', color: 'red', textAlign: 'center' }}>
          {JSON.stringify(state.responseData, null, 2)}
        </pre>
      </mitosis_1.Show>

      <mitosis_1.Show when={state.submissionState === 'success'}>
        <_fake_2.BuilderBlocks dataPath="successMessage" blocks={props.successMessage}/>
      </mitosis_1.Show>
    </form>);
}
exports.default = FormComponent;
