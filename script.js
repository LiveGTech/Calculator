import * as common from "./common.js";

var $g = await import(`${common.AUI_URL_PREFIX}/src/adaptui.js`);
var astronaut = await import(`${common.AUI_URL_PREFIX}/astronaut/astronaut.js`);

window.$g = $g;

astronaut.unpack();

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
        Page(true) (
            Section (
                Heading() ("Hello, world!"),
                Paragraph() ("This is the calculator app which is currently in-development."),
                Paragraph() (common.IS_SYSTEM_APP ? "Running as a system app" : "Running outside LiveG OS"),
                ButtonRow (
                    Button() ("Hello"),
                    Button("secondary") ("World")
                )
            )
        )
    ));
});