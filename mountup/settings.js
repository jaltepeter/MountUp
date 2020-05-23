
export const modName = 'Mount Up';
const mod = 'mountup';
/**
 * Provides functionality for interaction with module settings
 */
export class Settings {

    /**
     * Returns true if chat messages should be sent
     */
    static shouldChat() {
        return game.settings.get(mod, 'should-chat');
    }

    /**
     * Returns the user specified mounting message
     */
    static getMountMessage() {
        return game.settings.get(mod, 'mount-message');
    }

    /**
     * Returns the user specified dismounting message
     */
    static getDismountMessage() {
        return game.settings.get(mod, 'dismount-message');
    }

    static getRiderLock() {
        return game.settings.get(mod, 'lock-riders');
    }

    static getHudColumn() {
        return game.settings.get(mod, 'column') == 0 ? '.col.left' : '.col.right';
    }

    static getHudTopBottom() {
        return game.settings.get(mod, 'topbottom') == 0 ? 'top' : 'bottom';
    }

    static getIcon() {
        switch (game.settings.get(mod, 'icon')) {
            case 0: return 'fa-horse';
            case 1: return 'fa-people-carry';
            case 2: return 'fa-hands';
            case 3: return 'fa-hand-holding';
            case 4: return 'fa-fist-raised';
            case 5: return 'fa-handshake';
        }
    }

    /**
     * Registers all of the necessary game settings for the module
     */
    static registerSettings() {

        game.settings.register(mod, 'icon', {
            name: 'Icon',
            //hint: 'Which icon to use.',
            scope: 'world',
            config: true,
            type: Number,
            default: 0,
            choices: [
                'Horse',
                'People Carrying',
                'Hands',
                'Open Hand',
                'Fist',
                'Handshake'
            ]
        });

        game.settings.register(mod, 'column', {
            name: 'HUD Column',
            scope: 'world',
            config: true,
            type: Number,
            default: 0,
            choices: ['Left', 'Right']
        });

        game.settings.register(mod, 'topbottom', {
            name: 'HUD Top/Bottom',
            scope: 'world',
            config: true,
            type: Number,
            default: 0,
            choices: ['Top', 'Bottom']
        });

        /**
         * Whether or not riders should be locked to mounts
         */
        game.settings.register(mod, 'lock-riders', {
            name: 'Should riders be locked to mounts?',
            hint: 'If enabled, riders will be unable to move seperately from their mount until dismounted.',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true
        });

        /**
         * Whether or not chat messages should be sent
         */
        game.settings.register(mod, 'should-chat', {
            name: 'Send messages to chat',
            hint: 'Should chat messages about mounting/carrying and dismounting/dropping be sent to chat?',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true
        });

        /**
         * The mounting message
         */
        game.settings.register(mod, 'mount-message', {
            name: 'Mount Message Format',
            hint: 'How mounting chat messages should be formatted if enabled. (use {rider} and {mount} for name substitution)',
            scope: 'world',
            config: true,
            type: String,
            default: '{rider} has mounted {mount}.'
        });

        /**
         * The dismounting message
         */
        game.settings.register(mod, 'dismount-message', {
            name: 'Mount Message Format',
            hint: 'How dismounting chat messages should be formatted if enabled. (use {rider} and {mount} for name substitution)',
            scope: 'world',
            config: true,
            type: String,
            default: '{rider} has dismounted from {mount}.'
        });

        /**
         * Debug setting
         */
        game.settings.register(mod, 'debug', {
            name: 'Debug Mode',
            hint: 'Debug Mode',
            scope: 'world',
            config: false,
            type: Boolean,
            default: false
        });
    }

}
