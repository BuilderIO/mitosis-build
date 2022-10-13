"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProps = void 0;
var traverse_1 = __importDefault(require("traverse"));
var propsRegex = /props\s*\.\s*([a-zA-Z0-9_\$]+)/;
var allPropsMatchesRegex = new RegExp(propsRegex, 'g');
// copied from https://github.com/vuejs/core/blob/fa6556a0d56eeff1fec4f948460351ccf8f99f35/packages/compiler-core/src/validateExpression.ts
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' +
    ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
        'super,throw,while,yield,delete,export,import,return,switch,default,' +
        'extends,finally,continue,debugger,function,arguments,typeof,void,' +
        // both below conditions added based on https://github.com/vuejs/vue/blob/e80cd09fff570df57d608f8f5aaccee6d7f31917/src/core/instance/state.ts#L89-L96
        // below line added from https://github.com/vuejs/vue/blob/8880b55d52f8d873f79ef67436217c8752cddef5/src/shared/util.ts#L130
        'key,ref,slot,slot-scope,is,' +
        // below line added from https://github.com/vuejs/vue/blob/72aed6a149b94b5b929fb47370a7a6d4cb7491c5/src/platforms/web/util/attrs.ts#L5
        'style')
        .split(',')
        .join('\\b|\\b') +
    '\\b');
/**
 * Get props used in the components by reference
 */
var getProps = function (json) {
    var props = new Set();
    (0, traverse_1.default)(json).forEach(function (item) {
        if (typeof item === 'string') {
            // TODO: proper babel ref matching
            var matches = item.match(allPropsMatchesRegex);
            if (matches) {
                for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                    var match = matches_1[_i];
                    var prop = match.match(propsRegex)[1];
                    if (prop.match(prohibitedKeywordRE)) {
                        throw new Error("avoid using JavaScript keyword as property name: \"".concat(prop, "\""));
                    }
                    props.add(prop);
                }
            }
        }
    });
    return props;
};
exports.getProps = getProps;
