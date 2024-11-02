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
    new astronaut.StyleSet({
        "display": "none"
    }, ".baseEnabled",  ".baseOff"),
    new astronaut.StyleSet({
        "display": "none"
    }, ":not(.baseEnabled)", ".baseOn"),
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
    new astronaut.StyleSet({
        "display": "none"
    }, ".inverseEnabled",  ".inverseOff"),
    new astronaut.StyleSet({
        "display": "none"
    }, ":not(.inverseEnabled)", ".inverseOn"),
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
        "grid-template-rows": "repeat(2, minmax(0, 1fr))",
        "grid-template-columns": "repeat(5, minmax(0, 1fr))",
        "padding": "0.5rem",
        "gap": "0.5rem",
        "direction": "ltr"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "direction": "rtl",
        "grid-template-rows": "repeat(5, minmax(0, 1fr))",
        "grid-template-columns": "repeat(2, minmax(0, 1fr))",
        "grid-auto-flow": "column",
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

const PAD_BUTTON_FUNCTION_NAME_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "font-size": "1rem"
    })
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
            ...(props.type == "advanced" ? [PAD_BUTTON_SHRINK_TEXT_STYLES] : []),
            ...(props.functionName ? [PAD_BUTTON_FUNCTION_NAME_STYLES] : []),
            ...(props.iconScale ? [new astronaut.StyleGroup([
                new astronaut.StyleSet({
                    "width": "66%",
                    "transform": `scale(${props.iconScale})`
                }, "*", "img")
            ])] : []),
            ...(props.mobileIconScale ? [new astronaut.StyleGroup([
                new astronaut.MediaQueryStyleSet(["(max-width: 400px), (min-aspect-ratio: 1 / 1) and (max-width: 600px)"], {
                    "width": "66%",
                    "transform": `scale(${props.mobileIconScale})`
                }, "*", "img")
            ])] : []),
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

function numericBasic(value, props = {}) {
    return PadButton({insertText: String(value), ...props}) (String(value));
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
    var pad = Container({
        styleSets: [ADVANCED_PAD_STYLES, ADVANCED_PAD_PAGINATION_STYLES]
    }) ();

    function inverse() {
        var button = textualAdvanced("INV", {alt: _("inverse")});

        button.on("click", function() {
            pad.toggleClass("inverseEnabled");
        });

        return button;
    }

    function angleUnits() {
        var button = textualAdvanced("DRG");

        button.on("click", async function() {
            var menu = await astronaut.addEphemeral(Menu (
                ...["deg", "rad", "gon", "turn"].map(function(unit) {
                    var menuButton = MenuButton() (_(`angle_${unit}`));

                    menuButton.on("click", function() {
                        calculator.setAngleUnits(unit);
                    });

                    return menuButton;
                })
            ));

            menu.menuOpen();
        });

        setInterval(function() {
            button.setText(calculator.angleUnits.toUpperCase());
        });

        return button;
    }

    function swapxy() {
        var button = iconAdvanced("maths-swapxy", {alt: _("swap"), iconScale: 1.5});

        button.on("click", function() {
            calculator.swapxy();
        });

        return button;
    }

    function base() {
        var button = textualAdvanced(_("base_key"), {alt: _("base")});

        button.on("click", function() {
            calculator.basicPad.toggleClass("baseEnabled");
        });

        return button;
    }

    pad.add(
        ScrollableScreenContainer({
            mode: "paginated",
            styles: {
                flexGrow: "1"
            }
        }) (
            AdvancedPadPage() (
                inverse(),
                angleUnits(),
                iconAdvanced("maths-pi", {alt: _("pi"), insertText: "π"}),
                textualAdvanced("log", {alt: _("log"), insertText: "log("}),
                textualAdvanced("ln", {alt: _("ln"), insertText: "ln("}),
                textualAdvanced("sin", {alt: _("sin"), insertText: "sin(", classes: ["inverseOff"]}),
                textualAdvanced("cos", {alt: _("cos"), insertText: "cos(", classes: ["inverseOff"]}),
                textualAdvanced("tan", {alt: _("tan"), insertText: "tan(", classes: ["inverseOff"]}),
                textualAdvanced("asin", {alt: _("asin"), insertText: "asin(", classes: ["inverseOn"]}),
                textualAdvanced("acos", {alt: _("acos"), insertText: "acos(", classes: ["inverseOn"]}),
                textualAdvanced("atan", {alt: _("atan"), insertText: "atan(", classes: ["inverseOn"]}),
                iconAdvanced("maths-cube", {alt: _("cube"), insertText: "^3"}),
                iconAdvanced("maths-root", {alt: _("root"), insertText: "root"})
            ),
            AdvancedPadPage() (
                inverse(),
                textualAdvanced("e", {alt: "e", insertText: "e", noTitle: true}),
                iconAdvanced("maths-reciprocal", {alt: _("reciprocal"), insertText: "^-1"}),
                iconAdvanced("maths-log2", {alt: _("log2"), insertText: "log2", iconScale: 2, mobileIconScale: 1.5}),
                iconAdvanced("maths-logab", {alt: _("logab"), insertText: "logab", iconScale: 2, mobileIconScale: 1.5}),
                textualAdvanced("sinh", {alt: _("sinh"), insertText: "sinh(", classes: ["inverseOff"]}),
                textualAdvanced("cosh", {alt: _("cosh"), insertText: "cosh(", classes: ["inverseOff"]}),
                textualAdvanced("tanh", {alt: _("tanh"), insertText: "tanh(", classes: ["inverseOff"]}),
                textualAdvanced("asinh", {alt: _("asinh"), insertText: "asinh(", classes: ["inverseOn"]}),
                textualAdvanced("acosh", {alt: _("acosh"), insertText: "acosh(", classes: ["inverseOn"]}),
                textualAdvanced("atanh", {alt: _("atanh"), insertText: "atanh(", classes: ["inverseOn"]}),
                iconAdvanced("maths-abs", {alt: _("abs"), insertText: "abs"}),
                iconAdvanced("maths-factorial", {alt: _("factorial"), insertText: "!"})
            ),
            AdvancedPadPage() (
                textualAdvanced(_("set_key"), {alt: _("set"), insertText: "="}),
                iconAdvanced("maths-sum", {alt: _("sum"), insertText: "sum", iconScale: 1.5}),
                iconAdvanced("maths-product", {alt: _("product"), insertText: "product", iconScale: 1.5}),
                iconAdvanced("maths-derivative", {alt: _("derivative"), insertText: "deriv", iconScale: 1.5}),
                iconAdvanced("maths-secondderivative", {alt: _("secondDerivative"), insertText: "secderiv", iconScale: 1.5}),
                iconAdvanced("maths-x", {alt: "x", insertText: "x", noTitle: true}),
                iconAdvanced("maths-y", {alt: "y", insertText: "y", noTitle: true}),
                iconAdvanced("maths-i", {alt: "i", insertText: "i", noTitle: true}),
                iconAdvanced("maths-integral", {alt: _("integral"), insertText: "integ", iconScale: 1.5}),
                swapxy()
            ),
            AdvancedPadPage() (
                base(),
                textualAdvanced(_("changeOutputFormat_key"), {alt: _("changeOutputFormat")}),
                textualAdvanced("mod", {alt: _("mod"), insertText: "mod"}),
                textualAdvanced("and", {insertText: "and"}),
                textualAdvanced("or", {insertText: "or"}),
                textualAdvanced("<<", {alt: _("bitShiftLeft"), insertText: "<<"}),
                textualAdvanced(">>", {alt: _("bitShiftRight"), insertText: ">>"}),
                textualAdvanced("not", {insertText: "not"}),
                textualAdvanced("nand", {insertText: "nand"}),
                textualAdvanced("xor", {insertText: "xor"})
            ),
            AdvancedPadPage() (
                textualAdvanced("M", {alt: _("getMemory")}),
                textualAdvanced("M+", {alt: _("incrementMemory")}),
                textualAdvanced("M-", {alt: _("decrementMemory")}),
                textualAdvanced("MS", {alt: _("setMemory")}),
                textualAdvanced("MR", {alt: _("resetMemory")}),
                textualAdvanced("rand#", {alt: _("randomFraction"), insertText: "rand#", functionName: true}),
                textualAdvanced("randint", {alt: _("randomInteger"), insertText: "randint(", functionName: true}),
                textualAdvanced("mean", {alt: _("mean"), insertText: "mean(", functionName: true}),
                textualAdvanced("nPr", {alt: _("npr"), insertText: "npr"}),
                textualAdvanced("nCr", {alt: _("ncr"), insertText: "ncr"})
            )
        )
    );

    return pad;
});

export var BasicPad = astronaut.component("BasicPad", function(props, children) {
    var separatorChar = calculator.decimalPointIsComma ? ";" : ",";
    var decimalPoint = calculator.decimalPointIsComma ? "," : ".";

    var clearAll = textualBasic("AC", {alt: "Clear all input"});
    var brackets = textualBasic("( )");
    var separator = textualBasic(separatorChar, {insertText: separatorChar, classes: ["baseOff"]});
    var square = iconBasic("maths-square", {alt: _("square"), insertText: "^2", landscapeRow: 2, landscapeColumn: 5, classes: ["baseOff"]});
    var power = iconBasic("maths-power", {alt: _("power"), insertText: "^", landscapeRow: 1, landscapeColumn: 5, classes: ["baseOff"]});
    var squareRoot = iconBasic("maths-sqrt", {alt: _("sqrt"), insertText: "sqrt", landscapeRow: 2, landscapeColumn: 4, classes: ["baseOff"]});
    var fraction = iconBasic("maths-frac", {alt: _("frac"), insertText: "over", iconScale: 1.5, landscapeRow: 1, landscapeColumn: 4, classes: ["baseOff"]});
    var exponent = iconBasic("maths-exp", {alt: _("exp"), iconScale: 1.5, classes: ["baseOff"]});

    var multiply = textualBasic("×", {alt: _("multiply"), insertText: "×", classes: ["baseOff"]});
    var divide = textualBasic("÷", {alt: _("divide"), insertText: "÷", classes: ["baseOff"]});
    var add = textualBasic("+", {alt: _("add"), insertText: "+", classes: ["baseOff"]});
    var subtract = textualBasic("−", {alt: _("subtract"), insertText: "-", classes: ["baseOff"]});
    var decimal = textualBasic(decimalPoint, {insertText: decimalPoint, classes: ["baseOff"]});

    var baseAdd = textualBasic("+", {alt: _("add"), insertText: "+", classes: ["baseOn"]});
    var baseSubtract = textualBasic("−", {alt: _("subtract"), insertText: "-", classes: ["baseOn"]});
    var baseBin = textualBasic(_("baseBin_key"), {alt: _("baseBin"), insertText: "0b", classes: ["baseOn"]});
    var baseOct = textualBasic(_("baseOct_key"), {alt: _("baseOct"), insertText: "0o", classes: ["baseOn"]});
    var baseHex = textualBasic(_("baseHex_key"), {alt: _("baseHex"), insertText: "0x", classes: ["baseOn"]});

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

    return Section({
        styleSets: [BASIC_PAD_STYLES]
    }) (
        clearAll, brackets, separator, square, power, baseBin, baseOct, baseHex,
        numericBasic(7), numericBasic(8), numericBasic(9), squareRoot, fraction, numericBasic("E", {classes: ["baseOn"]}), numericBasic("F", {classes: ["baseOn"]}),
        numericBasic(4), numericBasic(5), numericBasic(6), multiply, divide, numericBasic("C", {classes: ["baseOn"]}), numericBasic("D", {classes: ["baseOn"]}),
        numericBasic(1), numericBasic(2), numericBasic(3), add, subtract, numericBasic("A", {classes: ["baseOn"]}), numericBasic("B", {classes: ["baseOn"]}),
        numericBasic(0), decimal, exponent, baseAdd, baseSubtract, backspace, evaluate
    );
});