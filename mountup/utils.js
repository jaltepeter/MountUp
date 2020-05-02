import {modName} from "./settings.js"

export const socketName = "module.mountup";

export const actionMode = {
    CreateLink: 0,
    BreakLink: 1
};

export function firstGM() {
    for(let user of game.users.entities){
        if (user.data.role >= 4 && user.active){
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
export function logMessage(message, force = false){
    if (game.settings.get("mountup", "debug") || force){
        console.log(`${modName} | ${message}`);
    }
}

/**
 * Pops a "toast" notification in the warn style containing the provided message
 * @param {String} message - The message to be displayed
 */
export function warn(message){
    ui.notifications.warn(message);
}

/**
 * Pops a "toast" notification in the info style containing the provided message
 * @param {String} message - The message to be displayed
 */
export function info(message){
    ui.notifications.info(message);
}

/**
 * Returns a token object from the canvas based on the ID value
 * @param {String} tokenId - The ID of the token to look for
 */
export function findTokenById(tokenId){
    return canvas.tokens.ownedTokens.find(t => t.id === tokenId)
}