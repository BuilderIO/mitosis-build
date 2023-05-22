"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var directives_1 = require("../generators/qwik/directives");
describe('qwik directives', function () {
    beforeEach(function () {
        global.h = mockH;
    });
    afterEach(function () { return (global.h = undefined); });
    describe('Image', function () {
        test('altText', function () {
            expect((0, directives_1.Image)({ altText: 'foo', image: 'http://some.url' }).children[0][0]).toMatchSnapshot();
            expect((0, directives_1.Image)({ image: 'http://some.url' }).children[0][0]).toMatchSnapshot();
        });
        test('builder-pixel is eager', function () {
            expect((0, directives_1.Image)({
                builderBlock: { id: 'builder-pixel-foo' },
                image: 'http://some.url',
            }).children[0][0]).toMatchSnapshot();
        });
        test('images are lazy loaded', function () {
            expect((0, directives_1.Image)({
                image: 'http://some.url',
            }).children[0][0]).toMatchSnapshot();
        });
        test('builder.io URLs are served using webp', function () {
            expect(find('source', (0, directives_1.Image)({
                image: 'http://foo.builder.io/foo',
            }))).toMatchSnapshot();
        });
        test('maxWidth is added to the srcs', function () {
            expect(find('source', (0, directives_1.Image)({
                image: 'http://foo.builder.io/foo',
                srcsetSizes: '1234 456',
            }))).toMatchSnapshot();
        });
        test('anchor should wrap in <a>', function () {
            expect(find('a', (0, directives_1.Image)({
                image: 'http://some.url',
                href: 'my-url',
            }))).toMatchSnapshot();
        });
    });
});
function find(tag, jsx) {
    if (tag == jsx.tag)
        return jsx;
    return findInChildren(tag, jsx.children);
    function findInChildren(tag, jsxs) {
        var value = undefined;
        for (var i = 0; i < jsxs.length; i++) {
            var jsx_1 = jsxs[i];
            if (Array.isArray(jsx_1)) {
                value = findInChildren(tag, jsx_1);
            }
            else {
                value = find(tag, jsx_1);
            }
            if (value)
                return value;
        }
        return undefined;
    }
}
var mockH = function (tag, props, children) { return ({
    tag: tag,
    props: props,
    children: children,
}); };
function srcSet(url, additionalSizes) {
    if (additionalSizes === void 0) { additionalSizes = ''; }
    return ['100', '200', '400', '800', '1200', '1600', '2000']
        .concat(additionalSizes ? additionalSizes.split(' ') : [])
        .map(function (size) {
        var parsedUrl = new URL(url);
        parsedUrl.searchParams.set('width', size);
        return "".concat(parsedUrl, " ").concat(size, "w");
    })
        .concat([url.replace('?format=webp', '')])
        .join(', ');
}
