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
        return game.settings.get("mount-up", "should-chat");
    }

    /**
     * Returns the user specified mounting message
     */
    static getMountMessage() {
        return game.settings.get("mount-up", "mount-message");
    }

    /**
     * Returns the user specified dismounting message
     */
    static getDismountMessage() {
        return game.settings.get("mount-up", "dismount-message");
    }

    static resetLinksIfNeeded(){
        if (game.settings.get("mount-up", "reset-links") == true) {
            RideLinks.breakAllRideLinks();
            game.settings.set("mount-up", "reset-links", false);
            info(`All "Mount Up" links have been deleted`);
        }
    }

    /**
     * Registers all of the necessary game settings for the module
     */
    static registerSettings = function () {

        /**
         * Whether or not chat messages should be sent
         */
        game.settings.register("mount-up", "should-chat", {
            name: "Send messages to chat",
            hint: "Should chat messages about mounting/carrying and dismounting/dropping be sent to chat?",
            scope: "world",
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register("mount-up", "reset-links", {
            name: "Reset Links ** WILL FORCE RELOAD**",
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
        game.settings.register("mount-up", "mount-message", {
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
        game.settings.register("mount-up", "dismount-message", {
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
        game.settings.register("mount-up", "debug", {
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
        game.settings.register("mount-up", "ride-links", {
            scope: "world",
            config: false,
            type: Object,
            default: {}
        });
    }

}
