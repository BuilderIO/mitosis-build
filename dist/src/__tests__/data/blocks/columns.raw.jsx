"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function Column(props) {
    var state = (0, mitosis_1.useState)({
        getColumns: function () {
            return props.columns || [];
        },
        getGutterSize: function () {
            return typeof props.space === 'number' ? props.space || 0 : 20;
        },
        getWidth: function (index) {
            var columns = this.getColumns();
            return (columns[index] && columns[index].width) || 100 / columns.length;
        },
        getColumnCssWidth: function (index) {
            var columns = this.getColumns();
            var gutterSize = this.getGutterSize();
            var subtractWidth = (gutterSize * (columns.length - 1)) / columns.length;
            return "calc(".concat(this.getWidth(index), "% - ").concat(subtractWidth, "px)");
        },
    });
    return (<div class="builder-columns" css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            lineHeight: 'normal',
            '@media (max-width: 999px)': {
                flexDirection: 'row',
            },
            '@media (max-width: 639px)': {
                flexDirection: 'row-reverse',
            },
        }}>
      <mitosis_1.For each={props.columns}>
        {function (column, index) { return (<div class="builder-column" css={{ flexGrow: '1' }}>
            {column.content} {index}
          </div>); }}
      </mitosis_1.For>
    </div>);
}
exports.default = Column;
