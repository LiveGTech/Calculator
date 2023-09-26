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

const BASIC_AREA_STYLES = new astronaut.StyleGroup([
    new astronaut.StyleSet({
        "display": "grid",
        "grid-template-columns": "repeat(5, 1fr)",
        "padding": "0.5rem!important",
        "flex-grow": "1",
        "gap": "0.5rem"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "padding-bottom": "2.4rem!important"
    })
]);

const ADVANCED_PAD_AREA_STYLES = new astronaut.StyleGroup([
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
        "gap": "0.5rem"
    }),
    new astronaut.MediaQueryStyleSet("min-aspect-ratio: 1 / 1", {
        "grid-template-columns": "repeat(2, 1fr)"
    })
]);

var PadButton = astronaut.component("PadButton", function(props, children) {
    return Button({
        styles: {
            margin: "0",
            fontSize: "1.5rem"
        }
    }) (...children);
});

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
                    styleSets: [ADVANCED_PAD_AREA_STYLES]
                }) (
                    ScrollableScreenContainer({
                        mode: "paginated",
                        styles: {
                            flexGrow: "1"
                        }
                    }) (
                        ...astronaut.repeat(5, Container({
                            styleSets: [ADVANCED_PAD_GRID_STYLES]
                        }) (
                            ...astronaut.repeat(10, PadButton() ("sin"))
                        ))
                    )
                ),
                Section({
                    styleSets: [BASIC_AREA_STYLES]
                }) (
                    ...astronaut.repeat(25, PadButton() ("="))
                )
            )
        )
    ));
});