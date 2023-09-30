import * as common from "./common.js";

var $g = await import(`${common.AUI_URL_PREFIX}/src/adaptui.js`);
var astronaut = await import(`${common.AUI_URL_PREFIX}/astronaut/astronaut.js`);

window.FORMULAIC_AUI_URL_PREFIX = common.AUI_URL_PREFIX;

var richMaths = await import("./lib/formulaic/richeditor/richmaths.js");

window.$g = $g;

astronaut.unpack();

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

const BASIC_PAD_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "display": "grid",
        "grid-template-columns": "repeat(5, minmax(0, 1fr))",
        "padding": "0.5rem!important",
        "flex-grow": "1",
        "gap": "0.5rem",
        "direction": "ltr",
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
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
        "grid-template-columns": "unset"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "direction": "ltr"
    }, "[dir='rtl'] *")
]);

const PAD_BUTTON_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "flex-grow": "1",
        "flex-shrink": "1",
        "flex-basis": "0",
        "margin": "0",
        "direction": "initial",
        "font-size": "1.5rem"
    }),
    new astronaut.StyleSet({
        "direction": "rtl"
    }, "[dir='rtl'] *")
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

const PAD_BUTTON_SHRINK_TEXT_STYLES = new astronaut.StyleGroup([
    new astronaut.MediaQueryStyleSet("max-width: 500px", {
        "font-size": "1rem"
    })
]);

var PadButton = astronaut.component("PadButton", function(props, children) {
    props.type ||= "basic";

    if (props.alt) {
        props.attributes ||= {};
        props.attributes["title"] = props.alt;
        props.attributes["aria-label"] = props.alt;
    }

    return Button({
        ...props,
        mode: props.type != "highlight" ? "secondary" : "primary",
        iconType: "dark embedded",
        styleSets: [
            PAD_BUTTON_STYLES,
            ...(props.type == "basic" ? [PAD_BUTTON_TYPE_BASIC_STYLES] : []),
            ...(props.shrinkText || props.type == "advanced" ? [PAD_BUTTON_SHRINK_TEXT_STYLES] : [])
        ]
    }) (...children);
});

var AdvancedPadPage = astronaut.component("AdvancedPadPage", function(props, children) {
    return Container({
        ...props,
        styleSets: [ADVANCED_PAD_GRID_STYLES]
    }) (
        ...children
    )
});

function numericBasic(value) {
    return PadButton() (String(value));
}

function textualBasic(value, props) {
    return PadButton(props) (value);
}

function textualAdvanced(value, props) {
    return PadButton({...props, type: "advanced"}) (value);
}

$g.waitForLoad().then(function() {
    $g.sel("head").add($g.create("link")
        .setAttribute("rel", "stylesheet")
        .setAttribute("href", `${common.AUI_URL_PREFIX}/src/adaptui.css`)
        .on("load", function() {
            $g.sel("body").removeAttribute("hidden");
        })
    );

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
    
    astronaut.render(Screen(true) (
        Header (
            Text("Calculator"),
            HeaderActionButton() (Icon({icon: "star"}) ())
        ),
        Page({
            showing: true,
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
                richMaths.format.createRichEditor({
                    inline: true,
                    styles: {
                        display: "block"
                    },
                    attributes: {
                        "inputmode": "none"
                    }
                })
            ),
            Container ({
                styleSets: [PAD_AREA_STYLES]
            }) (
                Container({
                    styleSets: [ADVANCED_PAD_STYLES]
                }) (
                    ScrollableScreenContainer({
                        mode: "paginated",
                        styles: {
                            flexGrow: "1"
                        }
                    }) (
                        AdvancedPadPage() (
                            textualAdvanced("INV"),
                            textualAdvanced("DRG"),
                            textualAdvanced("π", {alt: "Pi"}),
                            textualAdvanced("log", {alt: "Logarithm (base 10)"}),
                            textualAdvanced("ln", {alt: "Logarithm (base e)"}),
                            textualAdvanced("sin", {alt: "Sine"}),
                            textualAdvanced("cos", {alt: "Cosine"}),
                            textualAdvanced("tan", {alt: "Tangent"}),
                            textualAdvanced("x^3", {alt: "Cube"}),
                            textualAdvanced("root", {alt: "Root"})
                        ),
                        AdvancedPadPage() (
                            textualAdvanced("INV"),
                            textualAdvanced("mod", {alt: "Modulo"}),
                            textualAdvanced("x^-1", {alt: "Reciprocal"}),
                            textualAdvanced("log2", {alt: "Logarithm (base 2)"}),
                            textualAdvanced("logab", {alt: "Logarithm (base n)"}),
                            textualAdvanced("sinh", {alt: "Hyperbolic sine"}),
                            textualAdvanced("cos", {alt: "Hyperbolic cosine"}),
                            textualAdvanced("tan", {alt: "Hyperbolic tangent"}),
                            textualAdvanced("|x|", {alt: "Absolute value"}),
                            textualAdvanced("n!", {alt: "Factorial"})
                        ),
                        ...astronaut.repeat(3, AdvancedPadPage() (
                            ...astronaut.repeat(10, textualAdvanced("sin"))
                        ))
                    )
                ),
                Section({
                    styleSets: [BASIC_PAD_STYLES]
                }) (
                    textualBasic("AC", {alt: "Clear all input"}), textualBasic("( )"), textualBasic(","), textualBasic("x^2", {alt: "Square", shrinkText: true}), textualBasic("x^[]", {alt: "Power", shrinkText: true}),
                    numericBasic(7), numericBasic(8), numericBasic(9), textualBasic("sqrt", {alt: "Square root", shrinkText: true}), textualBasic("frac", {alt: "Fraction", shrinkText: true}),
                    numericBasic(4), numericBasic(5), numericBasic(6), textualBasic("×", {alt: "Multiply"}), textualBasic("÷", {alt: "Divide"}),
                    numericBasic(1), numericBasic(2), numericBasic(3), textualBasic("+", {alt: "Add"}), textualBasic("−", {alt: "Subtract"}),
                    numericBasic(0), textualBasic("."), textualBasic("x10^", {alt: "Exponent", shrinkText: true}), textualBasic("bksp", {alt: "Backspace", shrinkText: true}),
                    PadButton({type: "highlight", alt: "Evaluate"}) ("=")
                )
            )
        )
    ));
});