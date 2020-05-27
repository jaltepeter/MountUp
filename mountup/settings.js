import { SettingsForm } from './settingsForm.js';

export const modName = 'Mount Up';
const mod = 'mountup';

export const iconOptions = [
    'Horse',
    'People Carrying',
    'Hands',
    'Open Hand',
    'Fist',
    'Handshake'
];

export const hudColumns = ['Left', 'Right'];
export const hudTopBottom = ['Top', 'Bottom'];
export const riderX = ['Left', 'Center', 'Right'];
export const riderY = ['Top', 'Center', 'Bottom'];

/**
 * Provides functionality for interaction with module settings
 */
export class Settings {

    //#region getters and setters
    static getIcon() {
        return game.settings.get(mod, 'icon');
    }

    static setIcon(val) {
        game.settings.set(mod, 'icon', val);
    }

    static getHudColumn() {
        return game.settings.get(mod, 'column');
    }
    static setHudColumn(val) {
        game.settings.set(mod, 'column', val);
    }

    static getHudTopBottom() {
        return game.settings.get(mod, 'topbottom');
    }

    static setHudTopBottom(val) {
        game.settings.set(mod, 'topbottom', val);
    }

    /**
     * Returns the user specified rider horizontal location
     */
    static getRiderX() {
        return game.settings.get(mod, 'rider-x');
    }


    static setRiderX(val) {
        game.settings.set(mod, 'rider-x', val);
    }

    /**
     * Returns the user specified rider vertical location
     */
    static getRiderY() {
        return game.settings.get(mod, 'rider-y');
    }

    static setRiderY(val) {
        game.settings.set(mod, 'rider-y', val);
    }

    /**
    * Returns true if chat messages should be sent
    */
    static getShouldChat() {
        return game.settings.get(mod, 'should-chat');
    }

    static setShouldChat(val) {
        game.settings.set(mod, 'should-chat', val);
    }

    /**
     * Returns true if the setting to lock riders is enabled
     */
    static getRiderLock() {
        return game.settings.get(mod, 'lock-riders');
    }

    static setRiderLock(val) {
        game.settings.set(mod, 'lock-riders', val);
    }

    static getRiderRotate() {
        return game.settings.get(mod, 'rider-rotate');
    }

    static setRiderRotate(val) {
        game.settings.set(mod, 'rider-rotate', val);
    }



    /**
     * Returns the user specified mounting message
     */
    static getMountMessage() {
        return game.settings.get(mod, 'mount-message');
    }

    static setMountMessage(val) {
        game.settings.set(mod, 'mount-message', val);
    }

    /**
     * Returns the user specified dismounting message
     */
    static getDismountMessage() {
        return game.settings.get(mod, 'dismount-message');
    }

    static setDismountMessage(val) {
        game.settings.set(mod, 'dismount-message', val);
    }
    //#endregion

    //#region CSS Getters
    /**
    * Returns the css class for the left or right HUD column based on the game setting
    */
    static getHudColumnClass() {
        return game.settings.get(mod, 'column') == 0 ? '.col.left' : '.col.right';
    }

    /**
     * Returns whether the button should be placed on the top or bottom of the HUD column
     */
    static getHudTopBottomClass() {
        return game.settings.get(mod, 'topbottom') == 0 ? 'top' : 'bottom';
    }

    /**
     * Gets the icon that should be used on the HUD
     */
    static getIconClass() {
        switch (game.settings.get(mod, 'icon')) {
            case 0: return 'fa-horse';
            case 1: return 'fa-people-carry';
            case 2: return 'fa-hands';
            case 3: return 'fa-hand-holding';
            case 4: return 'fa-fist-raised';
            case 5: return 'fa-handshake';
        }
    }
    //#endregion CSS Getters

    /**
     * Registers all of the necessary game settings for the module
     */
    static registerSettings() {

        game.settings.registerMenu(mod, 'settingsMenu', {
            name: 'mu.settings.button.name',
            label: 'mu.settings.button.label',
            icon: 'fas fa-horse',
            type: SettingsForm,
            restricted: true
        });

        /** Which Icon should be used */
        game.settings.register(mod, 'icon', {
            scope: 'world',
            config: false,
            type: Number,
            default: 0,
            choices: iconOptions
        });

        /** Which column should the button be placed on */
        game.settings.register(mod, 'column', {
            scope: 'world',
            config: false,
            type: Number,
            default: 0,
            choices: hudColumns
        });

        /** Whether the button should be placed on the top or bottom of the column */
        game.settings.register(mod, 'topbottom', {
            scope: 'world',
            config: false,
            type: Number,
            default: 0,
            choices: hudTopBottom
        });

        /** Whether or not riders should be locked to mounts */
        game.settings.register(mod, 'lock-riders', {
            scope: 'world',
            config: false,
            type: Boolean,
            default: true
        });

        game.settings.register(mod, 'rider-rotate', {
            scope: 'world',
            config: false,
            type: Boolean,
            defualt: false
        });

        /** Where to place the rider horizontally on the mount */
        game.settings.register(mod, 'rider-x', {
            scope: 'world',
            config: false,
            type: Number,
            defualt: 1,
            choices: riderX
        });

        /** Where to place the rider vertically on the mount */
        game.settings.register(mod, 'rider-y', {
            scope: 'world',
            config: false,
            type: Number,
            defualt: 0,
            choices: riderY
        });

        /** Whether or not chat messages should be sent */
        game.settings.register(mod, 'should-chat', {
            scope: 'world',
            config: false,
            type: Boolean,
            default: true
        });

        /** The mounting message */
        game.settings.register(mod, 'mount-message', {
            scope: 'world',
            config: false,
            type: String,
            default: '{rider} has mounted {mount}.'
        });

        /** The dismounting message */
        game.settings.register(mod, 'dismount-message', {
            scope: 'world',
            config: false,
            type: String,
            default: '{rider} has dismounted from {mount}.'
        });
    }
}
