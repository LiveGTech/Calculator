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
        iconType: "dark embedded",
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
    return PadButton({...props, icon, type: "advanced"}) ();
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
                textualAdvanced("log", {alt: "Logarithm (base 10)"}),
                textualAdvanced("ln", {alt: "Logarithm (base e)"}),
                textualAdvanced("sin", {alt: "Sine"}),
                textualAdvanced("cos", {alt: "Cosine"}),
                textualAdvanced("tan", {alt: "Tangent"}),
                iconAdvanced("maths-cube", {alt: "Cube"}),
                iconAdvanced("maths-root", {alt: "Root"})
            ),
            AdvancedPadPage() (
                textualAdvanced("INV"),
                textualAdvanced("mod", {alt: "Modulo"}),
                iconAdvanced("maths-reciprocal", {alt: "Reciprocal"}),
                textualAdvanced("log2", {alt: "Logarithm (base 2)"}),
                textualAdvanced("logab", {alt: "Logarithm (base n)"}),
                textualAdvanced("sinh", {alt: "Hyperbolic sine"}),
                textualAdvanced("cosh", {alt: "Hyperbolic cosine"}),
                textualAdvanced("tanh", {alt: "Hyperbolic tangent"}),
                iconAdvanced("maths-abs", {alt: "Absolute value"}),
                iconAdvanced("maths-factorial", {alt: "Factorial"})
            ),
            AdvancedPadPage() (
                textualAdvanced("SET", {alt: "Assign value to variable"}),
                textualAdvanced("x?", {alt: "Evaluate in terms of x"}),
                textualAdvanced("x<>y", {alt: "Swap x and y values"}),
                textualAdvanced("d/dx", {alt: "Derivative"}),
                textualAdvanced("itg", {alt: "Integral"}),
                iconAdvanced("maths-x", {alt: "x", noTitle: true}),
                iconAdvanced("maths-y", {alt: "y", noTitle: true}),
                iconAdvanced("maths-i", {alt: "i", noTitle: true}),
                textualAdvanced("d/dx2", {alt: "Second derivative"}),
                textualAdvanced("itg2", {alt: "Double integral"})
            ),
            AdvancedPadPage() (
                textualAdvanced("BASE", {alt: "Change numeric base"}),
                textualAdvanced("BITS", {alt: "Change bit width"}),
                textualAdvanced("x<>y", {alt: "Enter ASCII character"}),
                textualAdvanced("and"),
                textualAdvanced("or"),
                textualAdvanced("<<", {alt: "Bit shift left"}),
                textualAdvanced(">>", {alt: "Bit shift right (arithmetic)"}),
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
    var square = iconBasic("maths-square", {alt: "Square", landscapeRow: 2, landscapeColumn: 5});
    var power = iconBasic("maths-power", {alt: "Power", insertText: "^", landscapeRow: 1, landscapeColumn: 5});
    var squareRoot = iconBasic("maths-sqrt", {alt: "Square root", insertText: "sqrt", landscapeRow: 2, landscapeColumn: 4});
    var fraction = iconBasic("maths-frac", {alt: "Fraction", insertText: "over", increaseIconSize: true, landscapeRow: 1, landscapeColumn: 4});

    var backspace = iconBasic("backspace", {alt: "Backspace"});
    var evaluate = PadButton({type: "highlight", alt: "Evaluate"}) ("=");

    var lastFocusedEditorArea = null;

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
    })

    return Section({
        styleSets: [BASIC_PAD_STYLES]
    }) (
        textualBasic("AC", {alt: "Clear all input"}), textualBasic("( )"), textualBasic(","), square, power,
        numericBasic(7), numericBasic(8), numericBasic(9), squareRoot, fraction,
        numericBasic(4), numericBasic(5), numericBasic(6), textualBasic("×", {alt: "Multiply", insertText: "×"}), textualBasic("÷", {alt: "Divide", insertText: "÷"}),
        numericBasic(1), numericBasic(2), numericBasic(3), textualBasic("+", {alt: "Add", insertText: "+"}), textualBasic("−", {alt: "Subtract", insertText: "-"}),
        numericBasic(0), textualBasic(".", {insertText: "."}), iconBasic("maths-exp", {alt: "Exponent", increaseIconSize: true}), backspace, evaluate
    );
})