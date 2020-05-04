import { RideLinks } from "./rideLinks.js";
import { info } from "./utils.js";

export const modName = "Mount Up";

/**
 * Provides functionality for interaction with module settings
 */
export class Settings {

    /**
     * Returns true if chat messages should be sent
     */
    static shouldChat() {
        return game.settings.get("mountup", "should-chat");
    }

    /**
     * Returns the user specified mounting message
     */
    static getMountMessage() {
        return game.settings.get("mountup", "mount-message");
    }

    /**
     * Returns the user specified dismounting message
     */
    static getDismountMessage() {
        return game.settings.get("mountup", "dismount-message");
    }

    static resetLinksIfNeeded() {
        if (game.settings.get("mountup", "reset-links") == true) {
            RideLinks.breakAllRideLinks();
            game.settings.set("mountup", "reset-links", false);
            info(`All "Mount Up" links have been deleted`);
        }
    }

    static getIcon() {
        switch (game.settings.get("mountup", "icon")) {
            case 0: return "fa-horse";
            case 1: return "fa-people-carry";
            case 2: return "fa-hands";
            case 3: return "fa-hand-holding";
            case 4: return "fa-fist-raised";
            case 5: return "fa-handshake";
        }
    }

    /**
     * Registers all of the necessary game settings for the module
     */
    static registerSettings() {

        game.settings.register("mountup", "icon", {
            name: "Icon",
            //hint: "Which icon to use.",
            scope: "world",
            config: true,
            type: Number,
            default: 0,
            choices: [
                "Horse",
                "People Carrying",
                "Hands",
                "Open Hand",
                "Fist",
                "Handshake"
            ]
        });

        /**
         * Whether or not chat messages should be sent
         */
        game.settings.register("mountup", "should-chat", {
            name: "Send messages to chat",
            hint: "Should chat messages about mounting/carrying and dismounting/dropping be sent to chat?",
            scope: "world",
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register("mountup", "reset-links", {
            name: "Reset Links",
            hint: "Clear all currently defined links from the game (use if something has gone wrong, or you have deleted some scenes that may have linked mounts)",
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
            onChange: (value) => { if (value) this.resetLinksIfNeeded(); }
        });

        /**
         * The mounting message
         */
        game.settings.register("mountup", "mount-message", {
            name: "Mount Message Format",
            hint: "How mounting chat messages should be formatted if enabled. (use {mount} and {dismount} for name substitution)",
            scope: "world",
            config: true,
            type: String,
            default: "{rider} has mounted {mount}."
        });

        /**
         * The dismounting message
         */
        game.settings.register("mountup", "dismount-message", {
            name: "Mount Message Format",
            hint: "How dismounting chat messages should be formatted if enabled. (use {mount} and {dismount} for name substitution)",
            scope: "world",
            config: true,
            type: String,
            default: "{rider} has dismounted from {mount}."
        });

        /**
         * Debug setting
         */
        game.settings.register("mountup", "debug", {
            name: "Debug Mode",
            hint: "Debug Mode",
            scope: "world",
            config: false,
            type: Boolean,
            default: false
        });

        /**
         * Ride links
         */
        game.settings.register("mountup", "ride-links", {
            scope: "world",
            config: false,
            type: Object,
            default: {}
        });
    }

}
