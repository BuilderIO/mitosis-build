"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function NestedStyles() {
    return (<div css={{
            display: 'flex',
            foo: 'var(--bar)',
            '@media (max-width: env(--mobile))': {
                display: 'block',
            },
            '&:hover': {
                display: 'flex',
            },
            '.nested-selector': {
                display: 'grid',
            },
        }}>
      Hello world
    </div>);
}
exports.default = NestedStyles;
