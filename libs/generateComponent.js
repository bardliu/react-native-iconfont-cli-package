"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var mkdirp_1 = tslib_1.__importDefault(require("mkdirp"));
var glob_1 = tslib_1.__importDefault(require("glob"));
var colors_1 = tslib_1.__importDefault(require("colors"));
var lodash_1 = require("lodash");
var getTemplate_1 = require("./getTemplate");
var replace_1 = require("./replace");
var whitespace_1 = require("./whitespace");
var copyTemplate_1 = require("./copyTemplate");
var SVG_MAP = {
    path: 'Path',
};
var ATTRIBUTE_FILL_MAP = ['path'];
exports.generateComponent = function (data, config) {
    var svgComponents = new Set();
    var names = [];
    var imports = [];
    var saveDir = path_1.default.resolve(config.save_dir);
    var jsxExtension = config.use_typescript ? '.tsx' : '.js';
    var jsExtension = config.use_typescript ? '.ts' : '.js';
    var cases = '';
    mkdirp_1.default.sync(saveDir);
    glob_1.default.sync(path_1.default.join(saveDir, '*')).forEach(function (file) { return fs_1.default.unlinkSync(file); });
    if (config.use_typescript) {
        svgComponents.add('GProps');
    }
    copyTemplate_1.copyTemplate("helper" + jsExtension, path_1.default.join(saveDir, "helper" + jsExtension));
    if (!config.use_typescript) {
        copyTemplate_1.copyTemplate('helper.d.ts', path_1.default.join(saveDir, 'helper.d.ts'));
    }
    data.svg.symbol.forEach(function (item) {
        var e_1, _b;
        var singleFile;
        var currentSvgComponents = new Set(['Svg']);
        var iconId = item.$.id;
        var iconIdAfterTrim = config.trim_icon_prefix
            ? iconId.replace(new RegExp("^" + config.trim_icon_prefix + "(.+?)$"), function (_, value) { return value.replace(/^[-_.=+#@!~*]+(.+?)$/, '$1'); })
            : iconId;
        var componentName = lodash_1.upperFirst(lodash_1.camelCase(iconId));
        names.push(iconIdAfterTrim);
        if (config.use_typescript) {
            currentSvgComponents.add('GProps');
        }
        try {
            for (var _c = tslib_1.__values(Object.keys(item)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var domName = _d.value;
                switch (domName) {
                    case 'path':
                        currentSvgComponents.add('Path');
                        break;
                    default:
                    // no default
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        cases += whitespace_1.whitespace(4) + "case '" + iconIdAfterTrim + "':\n";
        imports.push(componentName);
        cases += whitespace_1.whitespace(6) + "return <" + componentName + " {...rest} />;\n";
        singleFile = getTemplate_1.getTemplate('SingleIcon' + jsxExtension);
        singleFile = replace_1.replaceSize(singleFile, config.default_icon_size);
        singleFile = replace_1.replaceSvgComponents(singleFile, currentSvgComponents);
        singleFile = replace_1.replaceComponentName(singleFile, componentName);
        singleFile = replace_1.replaceSingleIconContent(singleFile, generateCase(item, 4));
        singleFile = replace_1.replaceHelper(singleFile);
        fs_1.default.writeFileSync(path_1.default.join(saveDir, componentName + jsxExtension), singleFile);
        if (!config.use_typescript) {
            var typeDefinitionFile = getTemplate_1.getTemplate('SingleIcon.d.ts');
            typeDefinitionFile = replace_1.replaceComponentName(typeDefinitionFile, componentName);
            fs_1.default.writeFileSync(path_1.default.join(saveDir, componentName + '.d.ts'), typeDefinitionFile);
        }
        console.log(colors_1.default.green('√') + " Generated icon \"" + colors_1.default.yellow(iconId) + "\"");
    });
    var iconFile = getTemplate_1.getTemplate('Icon' + jsxExtension);
    iconFile = replace_1.replaceSize(iconFile, config.default_icon_size);
    iconFile = replace_1.replaceCases(iconFile, cases);
    iconFile = replace_1.replaceSvgComponents(iconFile, svgComponents);
    iconFile = replace_1.replaceImports(iconFile, imports);
    if (config.use_typescript) {
        iconFile = replace_1.replaceNames(iconFile, names);
    }
    else {
        iconFile = replace_1.replaceNamesArray(iconFile, names);
        var typeDefinitionFile = getTemplate_1.getTemplate('Icon.d.ts');
        typeDefinitionFile = replace_1.replaceNames(typeDefinitionFile, names);
        fs_1.default.writeFileSync(path_1.default.join(saveDir, 'index.d.ts'), typeDefinitionFile);
    }
    fs_1.default.writeFileSync(path_1.default.join(saveDir, 'index' + jsxExtension), iconFile);
    console.log("\n" + colors_1.default.green('√') + " All icons have putted into dir: " + colors_1.default.green(config.save_dir) + "\n");
};
var generateCase = function (data, baseIdent) {
    var e_2, _b;
    var template = "\n" + whitespace_1.whitespace(baseIdent) + "<Svg viewBox=\"" + data.$.viewBox + "\" width={getIconSize(size, 0)} height={getIconSize(size, 1)} {...rest}>\n";
    var _loop_1 = function (domName) {
        var realDomName = SVG_MAP[domName];
        if (domName === '$') {
            return "continue";
        }
        if (!realDomName) {
            console.error(colors_1.default.red("Unable to transform dom \"" + domName + "\""));
            process.exit(1);
        }
        var counter = {
            colorIndex: 0,
            baseIdent: baseIdent,
        };
        if (data[domName].$) {
            template += whitespace_1.whitespace(baseIdent + 2) + "<" + realDomName + addAttribute(domName, data[domName], counter) + "\n" + whitespace_1.whitespace(baseIdent + 2) + "/>\n";
        }
        else if (Array.isArray(data[domName])) {
            data[domName].forEach(function (sub) {
                template += whitespace_1.whitespace(baseIdent + 2) + "<" + realDomName + addAttribute(domName, sub, counter) + "\n" + whitespace_1.whitespace(baseIdent + 2) + "/>\n";
            });
        }
    };
    try {
        for (var _c = tslib_1.__values(Object.keys(data)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var domName = _d.value;
            _loop_1(domName);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        }
        finally { if (e_2) throw e_2.error; }
    }
    template += whitespace_1.whitespace(baseIdent) + "</Svg>\n";
    return template;
};
var addAttribute = function (domName, sub, counter) {
    var e_3, _b;
    var template = '';
    if (sub && sub.$) {
        if (ATTRIBUTE_FILL_MAP.includes(domName)) {
            // Set default color same as in iconfont.cn
            // And create placeholder to inject color by user's behavior
            sub.$.fill = sub.$.fill || '#333333';
        }
        try {
            for (var _c = tslib_1.__values(Object.keys(sub.$)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var attributeName = _d.value;
                if (attributeName === 'fill') {
                    template += "\n" + whitespace_1.whitespace(counter.baseIdent + 4) + attributeName + "={getIconColor(color, " + counter.colorIndex + ", '" + sub.$[attributeName] + "')}";
                    counter.colorIndex += 1;
                }
                else {
                    // convert attribute name to camel case, e.g fill-opacity to fillOpacity
                    var reg = /-(\w)/g;
                    var camelAttributeName = attributeName.replace(reg, function (_a, b) { return b.toUpperCase(); });
                    template += "\n" + whitespace_1.whitespace(counter.baseIdent + 4) + camelAttributeName + "=\"" + sub.$[attributeName] + "\"";
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
    return template;
};
