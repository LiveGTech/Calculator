/*
    Calculator

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as common from "./common.js";

var $g = await import(`${common.AUI_URL_PREFIX}/src/adaptui.js`);
var astronaut = await import(`${common.AUI_URL_PREFIX}/astronaut/astronaut.js`);

window.FORMULAIC_AUI_URL_PREFIX = common.AUI_URL_PREFIX;

var maths = await import("./lib/formulaic/src/maths.js");
var richMaths = await import("./lib/formulaic/richeditor/richmaths.js");

export var currentLocale = null;
export var decimalPointIsComma = false;

window.$g = $g;

astronaut.unpack();

import * as pads from "./pads.js";

const HEADER_STYLES = new astronaut.StyleGroup([
    new astronaut.MediaQueryStyleSet("max-height: 350px", {
        "display": "none"
    })
]);

const MAIN_STYLES = new astronaut.StyleGroup([
    new astronaut.MediaQueryStyleSet("max-height: 350px", {
        "top": "0",
        "height": "100%"
    })
]);

const WORKING_AREA_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "background-color": "hsl(165, 70%, 90%)",
        "height": "6rem",
        "padding-top": "1.5rem!important",
        "padding-bottom": "0.5rem!important",
        "padding-left": "1rem!important",
        "padding-right": "1rem!important",
        "direction": "ltr",
        "font-size": "var(--sizeH1)",
        "font-weight": "bold",
        "overflow-x": "auto",
        "white-space": "nowrap",
        "outline": "none",
        "user-select": "text"
    }),
    new astronaut.MediaQueryStyleSet("prefers-color-scheme: dark", {
        "background-color": "hsl(165, 70%, 15%)"
    }),
    new astronaut.MediaQueryStyleSet("min-height: 700px", {
        "flex-grow": "1"
    }),
    new astronaut.MediaQueryStyleSet("max-height: 350px", {
        "height": "4rem",
        "padding-top": "0.5rem!important"
    })
]);

const PAD_AREA_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "display": "flex",
        "flex-direction": "column",
        "flex-grow": "1"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "flex-direction": "row-reverse"
    })
]);

export var editor = richMaths.format.createRichEditor({
    inline: true,
    styles: {
        display: "block"
    },
    attributes: {
        "inputmode": "none"
    }
});

maths.engine.variables = {
    x: new maths.ComplexNumberType(0),
    y: new maths.ComplexNumberType(0)
};

export function evaluate() {
    maths.engine.decimalPointIsComma = decimalPointIsComma;
    maths.engine.separator = decimalPointIsComma ? ";" : ",";

    var expression = maths.engine.Expression.parse(editor.inter.getExpression({separator: maths.engine.separator}));

    expression.evaluate().then(function(result) {
        result = result.toString();

        if (decimalPointIsComma) {
            result = result.replace(/\./g, ",");
        }

        editor.inter.getEditorArea().setText(result);
    });
}

$g.waitForLoad().then(function() {
    $g.sel("head").add($g.create("link")
        .setAttribute("rel", "stylesheet")
        .setAttribute("href", `${common.AUI_URL_PREFIX}/src/adaptui.css`)
        .on("load", function() {
            $g.sel("body").removeAttribute("hidden");
        })
    );

    return $g.l10n.selectLocaleFromResources({
        "en_GB": "locales/en_GB.json"
    });
}).then(function(locale) {
    currentLocale = locale;

    window._ = function() {
        return locale.translate(...arguments);
    };

    window._format = function() {
        return locale.format(...arguments);
    };

    $g.sel("title").setText(_("calculator"));

    if (Number(0.1).toLocaleString($g.l10n.getSystemLocaleCode().replace(/_/g, "-")) == "0,1") {
        decimalPointIsComma = true;
    }

    $g.theme.setProperty("primaryHue", "165");
    $g.theme.setProperty("primarySaturation", "70%");
    $g.theme.setProperty("primaryLightness", "50%");
    $g.theme.setProperty("secondaryHue", "165");
    $g.theme.setProperty("secondarySaturation", "60%");
    $g.theme.setProperty("secondaryLightness", "75%");
    $g.theme.setProperty("dark-primaryHue", "165");
    $g.theme.setProperty("dark-primarySaturation", "70%");
    $g.theme.setProperty("dark-primaryLightness", "30%");
    $g.theme.setProperty("dark-secondaryHue", "165");
    $g.theme.setProperty("dark-secondarySaturation", "60%");
    $g.theme.setProperty("dark-secondaryLightness", "40%");
    $g.theme.setProperty("primaryUIText", "rgb(0, 0, 0)");
    $g.theme.setProperty("secondaryUIText", "rgb(0, 0, 0)");
    $g.theme.setProperty("dark-primaryUIText", "rgb(255, 255, 255)");
    $g.theme.setProperty("dark-secondaryUIText", "rgb(255, 255, 255)");

    editor.on("keydown", function(event) {
        if (event.key == "Enter") {
            event.preventDefault();

            evaluate();
        }
    });
    
    astronaut.render(Screen(true) (
        Header({styleSets: [HEADER_STYLES]}) (
            Text(_("calculator"))
        ),
        Page({
            showing: true,
            styleSets: [MAIN_STYLES],
            styles: {
                display: "flex",
                flexDirection: "column"
            }
        }) (
            Section({
                styleSets: [WORKING_AREA_STYLES],
                styles: {
                    flexShrink: "0"
                }
            }) (
                editor
            ),
            Container ({
                styleSets: [PAD_AREA_STYLES]
            }) (
                pads.AdvancedPad() (),
                pads.BasicPad() ()
            )
        )
    ));
});