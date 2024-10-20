/*
    Calculator

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as common from "./common.js";
import * as calculator from "./script.js";

var astronaut = await import(`${common.AUI_URL_PREFIX}/astronaut/astronaut.js`);

const BASIC_PAD_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "display": "grid",
        "grid-template-columns": "repeat(5, minmax(0, 1fr))",
        "padding": "0.5rem!important",
        "flex-grow": "1",
        "gap": "0.5rem",
        "direction": "ltr"
    }),
    new astronaut.MediaQueryStyleSet(["(min-aspect-ratio: 1 / 1) and ((min-width: 450px) or (min-height: 500px)) and (min-height: 301px)"], {
        "padding-bottom": "2.4rem!important"
    })
]);

const ADVANCED_PAD_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "display": "flex",
        "flex-direction": "column",
        "height": "9rem"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "width": "25%",
        "min-width": "5rem",
        "max-width": "20rem",
        "height": "unset",
        "padding-bottom": "0.5rem"
    }),
    new astronaut.MediaQueryStyleSet(["(max-height: 300px)"], {
        "padding-bottom": "0"
    }),
    new astronaut.MediaQueryStyleSet(["(max-aspect-ratio: 1 / 1) and (max-height: 500px)"], {
        "display": "none"
    }),
    new astronaut.MediaQueryStyleSet(["(max-width: 450px) and (max-height: 500px)"], {
        "display": "none"
    })
]);

const ADVANCED_PAD_GRID_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "display": "grid",
        "grid-template-columns": "repeat(5, 1fr)",
        "padding": "0.5rem",
        "gap": "0.5rem",
        "direction": "ltr"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "direction": "rtl",
        "grid-template-rows": "repeat(5, 1fr)",
        "grid-auto-flow": "column",
        "grid-template-columns": "unset",
        "transform": "scaleY(-1)"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "direction": "ltr"
    }, "[dir='rtl'] *")
]);

const ADVANCED_PAD_PAGINATION_STYLES = new astronaut.StyleGroup([
    new astronaut.MediaQueryStyleSet(["(min-aspect-ratio: 1 / 1) and (max-height: 300px)"], {
        "display": "none"
    }, "*", "aui-pagination")
]);

const PAD_BUTTON_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "flex-grow": "1",
        "flex-shrink": "1",
        "flex-basis": "0",
        "margin": "0",
        "padding": "0",
        "direction": "initial",
        "font-size": "1.5rem"
    }),
    new astronaut.StyleSet({
        "direction": "rtl"
    }, "[dir='rtl'] *"),
    new astronaut.StyleSet({
        "height": "2rem"
    }, "*", "img"),
    new astronaut.MediaQueryStyleSet(["(max-width: 300px), (max-height: 400px)"], {
        "font-size": "1rem"
    }),
    new astronaut.MediaQueryStyleSet(["(max-width: 300px), (max-height: 400px)"], {
        "height": "1.25rem"
    }, "*", "img")
]);

const PAD_BUTTON_TYPE_BASIC_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "background-color": "hsl(165, 70%, 90%)!important",
        "color": "black!important"
    }),
    new astronaut.StyleSet({
        "background-color": "hsl(165, 70%, 85%)!important"
    }, "html[aui-istouch='false'] :hover, :active"),
    new astronaut.MediaQueryStyleSet("prefers-color-scheme: dark", {
        "background-color": "hsl(165, 70%, 15%)!important",
        "color": "white!important"
    }),
    new astronaut.MediaQueryStyleSet("prefers-color-scheme: dark", {
        "background-color": "hsl(165, 70%, 20%)!important"
    }, "html[aui-istouch='false'] :hover, :active")
]);

const PAD_BUTTON_TYPE_ADVANCED_STYLES = new astronaut.StyleGroup([
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "transform": "scaleY(-1)"
    })
]);

const PAD_BUTTON_SHRINK_TEXT_STYLES = new astronaut.StyleGroup([
    new astronaut.MediaQueryStyleSet(["(max-width: 400px), (min-aspect-ratio: 1 / 1) and (max-width: 600px)"], {
        "font-size": "1rem"
    })
]);

const PAD_BUTTON_INCREASE_ICON_SIZE_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "width": "66%",
        "transform": "scale(1.5)"
    }, "*", "img")
]);

export var PadButton = astronaut.component("PadButton", function(props, children) {
    props.type ||= "basic";

    if (props.alt) {
        props.attributes ||= {};

        if (!props.noTitle) {
            props.attributes["title"] = props.alt;
        }

        props.attributes["aria-label"] = props.alt;

        props.alt = null;
    }

    var specificStyles = [];

    if (props.landscapeRow && props.landscapeColumn) {
        specificStyles.push(
            new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
                "grid-row": props.landscapeRow,
                "grid-column": props.landscapeColumn
            })
        );
    }

    var button = (props.icon ? IconButton : Button)({
        ...props,
        mode: props.type != "highlight" ? "secondary" : "primary",
        iconType: props.iconType || "dark embedded",
        styleSets: [
            PAD_BUTTON_STYLES,
            ...(props.type == "basic" ? [PAD_BUTTON_TYPE_BASIC_STYLES] : []),
            ...(props.type == "advanced" ? [PAD_BUTTON_TYPE_ADVANCED_STYLES] : []),
            ...(props.shrinkText || props.type == "advanced" ? [PAD_BUTTON_SHRINK_TEXT_STYLES] : []),
            ...(props.increaseIconSize ? [PAD_BUTTON_INCREASE_ICON_SIZE_STYLES] : []),
            ...specificStyles
        ]
    }) (...children);

    if (props.insertText) {
        button.on("click", function(event) {
            calculator.editor.inter.insertText(props.insertText);

            event.preventDefault();
        });
    }

    return button;
});

function numericBasic(value) {
    return PadButton({insertText: String(value)}) (String(value));
}

function textualBasic(value, props) {
    return PadButton(props) (value);
}

function textualAdvanced(value, props) {
    return PadButton({...props, type: "advanced"}) (value);
}

function iconBasic(icon, props) {
    return PadButton({...props, icon}) ();
}

function iconAdvanced(icon, props) {
    return PadButton({...props, icon, type: "advanced", iconType: "dark"}) ();
}

export var AdvancedPadPage = astronaut.component("AdvancedPadPage", function(props, children) {
    return Container({
        ...props,
        styleSets: [ADVANCED_PAD_GRID_STYLES]
    }) (
        ...children
    )
});

export var AdvancedPad = astronaut.component("AdvancedPad", function(props, children) {
    return Container({
        styleSets: [ADVANCED_PAD_STYLES, ADVANCED_PAD_PAGINATION_STYLES]
    }) (
        ScrollableScreenContainer({
            mode: "paginated",
            styles: {
                flexGrow: "1"
            }
        }) (
            // FIXME: Buttons should go from bottom to top
            AdvancedPadPage() (
                textualAdvanced("INV"),
                textualAdvanced("DRG"),
                iconAdvanced("maths-pi", {alt: "Pi"}),
                textualAdvanced("log", {alt: _("log"), insertText: "log("}),
                textualAdvanced("ln", {alt: _("ln"), insertText: "ln("}),
                textualAdvanced("sin", {alt: _("sin"), insertText: "sin("}),
                textualAdvanced("cos", {alt: _("cos"), insertText: "cos("}),
                textualAdvanced("tan", {alt: _("tan"), insertText: "tan("}),
                iconAdvanced("maths-cube", {alt: _("cube"), insertText: "^3"}),
                iconAdvanced("maths-root", {alt: "root"})
            ),
            AdvancedPadPage() (
                textualAdvanced("INV"),
                textualAdvanced("mod", {alt: _("mod")}),
                iconAdvanced("maths-reciprocal", {alt: _("reciprocal"), insertText: "^-1"}),
                textualAdvanced("log2", {alt: _("log2")}),
                textualAdvanced("logab", {alt: _("logab"), insertText: "logab"}),
                textualAdvanced("sinh", {alt: _("sinh"), insertText: "sinh("}),
                textualAdvanced("cosh", {alt: _("cosh"), insertText: "cosh("}),
                textualAdvanced("tanh", {alt: _("tanh"), insertText: "tanh("}),
                iconAdvanced("maths-abs", {alt: _("abs"), insertText: "abs"}),
                iconAdvanced("maths-factorial", {alt: _("factorial")})
            ),
            AdvancedPadPage() (
                textualAdvanced("SET", {alt: _("set")}),
                textualAdvanced("x?", {alt: _("evaluateX")}),
                textualAdvanced("x<>y", {alt: _("swap")}),
                textualAdvanced("d/dx", {alt: _("derivative")}),
                textualAdvanced("itg", {alt: _("integral")}),
                iconAdvanced("maths-x", {alt: "x", noTitle: true}),
                iconAdvanced("maths-y", {alt: "y", noTitle: true}),
                iconAdvanced("maths-i", {alt: "i", noTitle: true}),
                textualAdvanced("d/dx2", {alt: _("secondDerivative")}),
                textualAdvanced("itg2", {alt: _("doubleIntegral")})
            ),
            AdvancedPadPage() (
                textualAdvanced("BASE", {alt: _("changeBase")}),
                textualAdvanced("BITS", {alt: _("changeBitWidth")}),
                textualAdvanced("x<>y", {alt: _("ascii")}),
                textualAdvanced("and"),
                textualAdvanced("or"),
                textualAdvanced("<<", {alt: _("bitShiftLeft")}),
                textualAdvanced(">>", {alt: _("bitShiftRight")}),
                textualAdvanced("not"),
                textualAdvanced("nand"),
                textualAdvanced("xor")
            ),
            AdvancedPadPage() (
                ...astronaut.repeat(10, textualAdvanced("sin"))
            )
        )
    );
});

export var BasicPad = astronaut.component("BasicPad", function(props, children) {
    var clearAll = textualBasic("AC", {alt: "Clear all input"});
    var brackets = textualBasic("( )");
    var square = iconBasic("maths-square", {alt: _("square"), insertText: "^2", landscapeRow: 2, landscapeColumn: 5});
    var power = iconBasic("maths-power", {alt: _("power"), insertText: "^", landscapeRow: 1, landscapeColumn: 5});
    var squareRoot = iconBasic("maths-sqrt", {alt: _("sqrt"), insertText: "sqrt", landscapeRow: 2, landscapeColumn: 4});
    var fraction = iconBasic("maths-frac", {alt: _("frac"), insertText: "over", increaseIconSize: true, landscapeRow: 1, landscapeColumn: 4});
    var exponent = iconBasic("maths-exp", {alt: _("exp"), increaseIconSize: true});

    var backspace = iconBasic("backspace", {alt: _("backspace")});
    var evaluate = PadButton({type: "highlight", alt: _("evaluate")}) ("=");

    var lastFocusedEditorArea = null;

    clearAll.on("click", function(event) {
        calculator.editor.inter.clear();

        event.preventDefault();

        lastFocusedEditorArea?.focus();
    });

    brackets.on("click", function(event) {
        var selection = document.getSelection();

        if (selection.rangeCount > 0) {
            var range = selection.getRangeAt(0).cloneRange();
            var rangeStartElement = range.startContainer;

            if (rangeStartElement.nodeType == Node.TEXT_NODE) {
                rangeStartElement = rangeStartElement.parentElement;
            }

            if (!rangeStartElement.matches(".formulaic_atomSlot")) {
                rangeStartElement = rangeStartElement.closest(".formulaic_atomSlot");
            }
    
            range.collapse(true);
            range.setStart(rangeStartElement || calculator.editor.get(), 0);
    
            var previousText = range.toString().trim();
            var bracketDepth = 0;

            for (var i = 0; i < previousText.length; i++) {
                if (previousText[i] == "(") {
                    bracketDepth++;
                }

                if (previousText[i] == ")") {
                    bracketDepth--;
                }

                if (bracketDepth < 0) {
                    bracketDepth = 0;
                }
            }

            calculator.editor.inter.insertText(bracketDepth == 0 || previousText.slice(-1) == "(" ? "(" : ")");
        }

        event.preventDefault();

        lastFocusedEditorArea?.focus();
    });

    exponent.on("click", function(event) {
        calculator.editor.inter.insertText("*");
        calculator.editor.inter.insertText("10");
        calculator.editor.inter.insertText("^");

        event.preventDefault();
    });

    backspace.on("click", function(event) {
        calculator.editor.inter.deleteTowardsStart();

        event.preventDefault();

        lastFocusedEditorArea?.focus();
    });

    evaluate.on("click", function() {
        calculator.evaluate();
    });

    setInterval(function() {
        if (calculator.editor.get().contains(document.activeElement)) {
            lastFocusedEditorArea = $g.sel(document.activeElement);
        }
    });

    var separator = calculator.decimalPointIsComma ? ";" : ",";
    var decimalPoint = calculator.decimalPointIsComma ? "," : ".";

    return Section({
        styleSets: [BASIC_PAD_STYLES]
    }) (
        clearAll, brackets, textualBasic(separator, {insertText: separator}), square, power,
        numericBasic(7), numericBasic(8), numericBasic(9), squareRoot, fraction,
        numericBasic(4), numericBasic(5), numericBasic(6), textualBasic("×", {alt: _("multiply"), insertText: "×"}), textualBasic("÷", {alt: _("divide"), insertText: "÷"}),
        numericBasic(1), numericBasic(2), numericBasic(3), textualBasic("+", {alt: _("add"), insertText: "+"}), textualBasic("−", {alt: _("subtract"), insertText: "-"}),
        numericBasic(0), textualBasic(decimalPoint, {insertText: decimalPoint}), exponent, backspace, evaluate
    );
});