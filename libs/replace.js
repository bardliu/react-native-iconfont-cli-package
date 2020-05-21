"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSize = function (content, size) {
    return content.replace(/#size#/g, String(size));
};
exports.replaceCases = function (content, cases) {
    return content.replace(/#cases#/g, cases);
};
exports.replaceSvgComponents = function (content, components) {
    var used = Array.from(components);
    return content.replace(/#svgComponents#/g, used.length
        ? "import { " + used.join(', ') + " } from 'react-native-svg';"
        : '');
};
exports.replaceNames = function (content, names) {
    return content.replace(/#names#/g, names.join("' | '"));
};
exports.replaceNamesArray = function (content, names) {
    return content.replace(/#namesArray#/g, JSON.stringify(names)
        .replace(/"/g, '\'')
        .replace(/','/g, '\', \''));
};
exports.replaceComponentName = function (content, name) {
    return content.replace(/#componentName#/g, name);
};
exports.replaceSingleIconContent = function (content, render) {
    return content.replace(/#iconContent#/g, render);
};
exports.replaceImports = function (content, imports) {
    return content.replace(/#imports#/g, imports.map(function (item) { return "import " + item + " from './" + item + "';"; }).join('\n'));
};
exports.replaceHelper = function (content) {
    return content.replace(/#helper#/g, 'import { getIconColor, getIconSize } from \'./helper\';');
};
exports.replaceNoColor = function (content) {
    return content.replace(/#colorFunc#/g, '');
};
exports.replaceSummaryIcon = function (content, iconName) {
    return content.replace(/#SummaryIcon#/g, iconName);
};
