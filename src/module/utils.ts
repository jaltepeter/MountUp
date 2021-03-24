import { MODULE_NAME } from "./settings.js";

/**
 * Flag Info
 */
export const FlagScope = MODULE_NAME;//'mountup';
export const Flags = {
    Mount: 'mount',
    Riders: 'riders',
    OrigSize: 'origsize',
    MountMove: 'mountMove'
};

/**
 * Socket Info
 */
export const socketName = 'module.'+MODULE_NAME; //'module.mountup';
export const socketAction = {
    Mount: 0,
    Dismount: 1,
    UpdateToken: 2
};

/**
 * Rider horizontal placement
 */
export const riderX = {
    Left: 0,
    Center: 1,
    Right: 2
};

/**
 * Rider vertical placement
 */
export const riderY = {
    Top: 0,
    Center: 1,
    Bottom: 2
};

export const riderLock = {
    NoLock: 0,
    LockLocation: 1,
    LockBounds: 2,
    Dismount: 3
};

/**
 * Returns the ID of the first GM logged in
 */
export function firstGM() {
    for (let user of game.users.entities) {
        if (user.data['role'] >= 4 && user.active) {
            return user.data._id;
        }
    }
    return undefined;
}

// /**
//  * Logs messages to the console
//  * @param {String} message The message to be logged to the console
//  * @param {Boolean} force If True, force the message to the console, regardless of debug mode
//  */
// export function logMessage(message, force = false) {
//     if (game.settings.get(MODULE_NAME, "debug") || force) {
//         console.log(`${MODULE_NAME} | ${message}`);
//     }
// }

// /**
//  * Pops a "toast" notification in the warn style containing the provided message
//  * @param {String} message - The message to be displayed
//  */
// export function warn(message) {
//     ui.notifications.warn(`${MODULE_NAME}! : ${message}`);
// }

// /**
//  * Pops a "toast" notification in the error style containing the provided message
//  * @param {String} message - The message to be displayed
//  */
// export function error(message) {
//     ui.notifications.error(`${MODULE_NAME}! : ${message}`);
//     console.error(`${MODULE_NAME}! : ${message}`);
// }

// /**
//  * Pops a "toast" notification in the info style containing the provided message
//  * @param {String} message - The message to be displayed
//  */
// export function info(message) {
//     ui.notifications.info(`${MODULE_NAME}! : ${message}`);
// }

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
