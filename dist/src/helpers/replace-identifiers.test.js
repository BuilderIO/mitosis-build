"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var replace_identifiers_1 = require("./replace-identifiers");
var TEST_SPECS = [
    {
        from: 'props',
        to: '$slots',
        code: 'props.slotName',
    },
];
describe('replaceIdentifiers', function () {
    TEST_SPECS.forEach(function (args, index) {
        test("Check #".concat(index), function () {
            var output = (0, replace_identifiers_1.replaceIdentifiers)(args);
            expect(output).toMatchSnapshot();
        });
    });
});
