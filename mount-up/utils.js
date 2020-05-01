import {modName} from "./settings.js"

/**
 * Logs messages to the console
 * @param {String} message The message to be logged to the console
 * @param {Boolean} force If True, force the message to the console, regardless of debug mode
 */
export function logMessage(message, force = false){
    if (game.settings.get("mount-up", "debug") || force){
        console.log(`${modName} | ${message}`);
    }
}