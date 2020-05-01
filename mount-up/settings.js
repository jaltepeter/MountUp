export const modName = "Mount Up";

export const registerSettings = function () {
    game.settings.register("mount-up", "debug", {
        name: "Debug Mode",
        hint: "Debug Mode",
        scope: "world",
        config: false,
        type: Boolean,
        default: false
    });

    game.settings.register("mount-up", "ride-links", {
        scope: "world",
        config: false,
        type: Object,
        default: {}
    });
}

