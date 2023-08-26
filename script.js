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

    astronaut.render(Screen(true) (
        Header (
            Text("Calculator")
        ),
        Page(true) (
            Section (
                Heading() ("Hello, world!"),
                Paragraph() ("This is the calculator app which is currently in-development."),
                Paragraph() (common.IS_SYSTEM_APP ? "Running as a system app" : "Running outside LiveG OS")
            )
        )
    ));
});