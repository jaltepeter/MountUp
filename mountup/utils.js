import { modName } from "./settings.js";

export const flagScope = 'mountup';

export const flag = {
    Mount: 'mount',
    Rider: 'rider',
    OrigSize: 'origsize'
};

export function firstGM() {
    for (let user of game.users.entities) {
        if (user.data.role >= 4 && user.active) {
            return user.data._id;
        }
    }
    return undefined;
}

/**
 * Logs messages to the console
 * @param {String} message The message to be logged to the console
 * @param {Boolean} force If True, force the message to the console, regardless of debug mode
 */
export function logMessage(message, force = false) {
    if (game.settings.get("mountup", "debug") || force) {
        console.log(`${modName} | ${message}`);
    }
}

/**
 * Pops a "toast" notification in the warn style containing the provided message
 * @param {String} message - The message to be displayed
 */
export function warn(message) {
    ui.notifications.warn(`Mount Up! : ${message}`);
}

/**
 * Pops a "toast" notification in the error style containing the provided message
 * @param {String} message - The message to be displayed
 */
export function error(message) {
    ui.notifications.error(`Mount Up! : ${message}`);
}

/**
 * Pops a "toast" notification in the info style containing the provided message
 * @param {String} message - The message to be displayed
 */
export function info(message) {
    ui.notifications.info(`Mount Up! : ${message}`);
}

/**
 * Returns the first token object from the canvas based on the ID value
 * @param {String} tokenId - The ID of the token to look for
 */
export function findTokenById(tokenId) {
    return canvas.tokens.placeables.find(t => t.id == tokenId);
}

/**
 * Returns the first token object from the canvas based on the name value (uses a lowercase search)
 * @param {String} tokenName - The name of the token to look for
 */
export function findTokenByName(tokenName) {
    return canvas.tokens.placeables.find(t => t.name.toLowerCase() == tokenName.toLowerCase());
}