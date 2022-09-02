"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForArguments = void 0;
var nullable_1 = require("../nullable");
var getForArguments = function (node, _a) {
    var _b = _a === void 0 ? { excludeCollectionName: false } : _a, excludeCollectionName = _b.excludeCollectionName;
    return [
        node.scope.forName || 'item',
        node.scope.indexName,
        excludeCollectionName ? undefined : node.scope.collectionName,
    ].filter(nullable_1.checkIsDefined);
};
exports.getForArguments = getForArguments;
