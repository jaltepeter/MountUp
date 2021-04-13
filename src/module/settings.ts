import { SettingsForm } from './settingsForm.js';

import { debug, log, setDebugLevel, warn, i18n } from '../foundryvtt-mountup';

export const MODULE_NAME = 'foundryvtt-mountup';
//export const modName = 'Mount Up';
// const mod = 'foundryvtt-mountup';

/**
 * Because typescript doesn’t know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it’s typed as declare let canvas: Canvas | {ready: false}.
 * That’s why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because a „no canvas“ mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
 export function getCanvas(): Canvas {
    if (!(canvas instanceof Canvas) || !canvas.ready) {
        throw new Error("Canvas Is Not Initialized");
    }
    return canvas;
}

export const registerSettings = function () {

  // game.settings.register(MODULE_NAME, "coloredEffectsEnabled", {
	// 	name: i18n(MODULE_NAME+".coloredEffectsEnabled.name"),
  //   hint: i18n(MODULE_NAME+".coloredEffectsEnabled.hint"),
	// 	default: true,
	// 	type: Boolean,
	// 	scope: "world",
	// 	config: true
	// });

  game.settings.registerMenu(MODULE_NAME, 'settingsMenu', {
      name: i18n(MODULE_NAME+".settings.button.name"),
      label: i18n(MODULE_NAME+".settings.button.label"),
      icon: 'fas fa-horse',
      type: SettingsForm,
      restricted: true
  });

  /** Which Icon should be used */
  game.settings.register(MODULE_NAME, 'icon', {
      scope: 'world',
      config: false,
      type: Number,
      default: 0,
      choices: iconOptions
  });

  /** Which column should the button be placed on */
  game.settings.register(MODULE_NAME, 'column', {
      scope: 'world',
      config: false,
      type: Number,
      default: 0,
      choices: hudColumns
  });

  /** Whether the button should be placed on the top or bottom of the column */
  game.settings.register(MODULE_NAME, 'topbottom', {
      scope: 'world',
      config: false,
      type: Number,
      default: 0,
      choices: hudTopBottom
  });

  /** Whether or not riders should be locked to mounts */
  game.settings.register(MODULE_NAME, 'lock-riders', {
      scope: 'world',
      config: false,
      type: Number,
      default: 3,
      choices: riderLockOptions
  });

  game.settings.register(MODULE_NAME, 'rider-rotate', {
      scope: 'world',
      config: false,
      type: Boolean,
      default: false
  });

  /** Where to place the rider horizontally on the mount */
  game.settings.register(MODULE_NAME, 'rider-x', {
      scope: 'world',
      config: false,
      type: Number,
      default: 1,
      choices: riderXOptions
  });

  /** Where to place the rider vertically on the mount */
  game.settings.register(MODULE_NAME, 'rider-y', {
      scope: 'world',
      config: false,
      type: Number,
      default: 0,
      choices: riderYOptions
  });

  /** Whether or not chat messages should be sent */
  game.settings.register(MODULE_NAME, 'should-chat', {
      scope: 'world',
      config: false,
      type: Boolean,
      default: true
  });

  /** The mounting message */
  game.settings.register(MODULE_NAME, 'mount-message', {
      scope: 'world',
      config: false,
      type: String,
      default: '{rider} has mounted {mount}.'
  });

  /** The dismounting message */
  game.settings.register(MODULE_NAME, 'dismount-message', {
      scope: 'world',
      config: false,
      type: String,
      default: '{rider} has dismounted from {mount}.'
  });



}

// function setup(templateSettings) {
// 	templateSettings.settings().forEach(setting => {
// 		let options = {
// 			name: i18n(templateSettings.name()+"."+setting.name+'.Name'),
// 			hint: i18n(`${templateSettings.name()}.${setting.name}.Hint`),
// 			scope: setting.scope,
// 			config: true,
// 			default: setting.default,
// 			type: setting.type,
// 			choices: {}
// 		};
// 		if (setting.choices) options.choices = setting.choices;
// 		game.settings.register(templateSettings.name(), setting.name, options);
// 	});
// }


export const iconOptions:Record<string, string> = {
    'Horse':'Horse',
    'People Carrying':'People Carrying',
    'Hands':'Hands',
    'Open Hand':'Open Hand',
    'Fist':'Fist',
    'Handshake':'Handshake'
};
export const hudColumns:Record<string, string> = {
    'Left':'Left', 
    'Right':'Right'
};
export const hudTopBottom:Record<string, string> = {
    'Top':'Top', 
    'Bottom':'Bottom'
};
export const riderXOptions:Record<string, string> = {
    'Left':'Left', 
    'Center':'Center', 
    'Right':'Right'
};
export const riderYOptions:Record<string, string> = {
    'Top':'Top', 
    'Center':'Center', 
    'Bottom':'Bottom'
};
export const riderLockOptions:Record<string, string> = {
    "No Lock":MODULE_NAME+".settings.riderLock.noLock",
    'Lock to location':'Lock to location',
    'Lock to mount bounds':'Lock to mount bounds',
    'Dismount when outside mount bounds':'Dismount when outside mount bounds'
};

/**
 * Provides functionality for interaction with module settings
 */
export class Settings {

    //#region getters and setters
    static getIcon() {
        return game.settings.get(MODULE_NAME, 'icon');
    }

    static setIcon(val) {
        game.settings.set(MODULE_NAME, 'icon', val);
    }

    static getHudColumn() {
        return game.settings.get(MODULE_NAME, 'column');
    }
    static setHudColumn(val) {
        game.settings.set(MODULE_NAME, 'column', val);
    }

    static getHudTopBottom() {
        return game.settings.get(MODULE_NAME, 'topbottom');
    }

    static setHudTopBottom(val) {
        game.settings.set(MODULE_NAME, 'topbottom', val);
    }

    /**
     * Returns the user specified rider horizontal location
     */
    static getRiderX() {
        return game.settings.get(MODULE_NAME, 'rider-x');
    }


    static setRiderX(val) {
        game.settings.set(MODULE_NAME, 'rider-x', val);
    }

    /**
     * Returns the user specified rider vertical location
     */
    static getRiderY() {
        return game.settings.get(MODULE_NAME, 'rider-y');
    }

    static setRiderY(val) {
        game.settings.set(MODULE_NAME, 'rider-y', val);
    }

    /**
    * Returns true if chat messages should be sent
    */
    static getShouldChat() {
        return game.settings.get(MODULE_NAME, 'should-chat');
    }

    static setShouldChat(val) {
        game.settings.set(MODULE_NAME, 'should-chat', val);
    }

    /**
     * Returns true if the setting to lock riders is enabled
     */
    static getRiderLock() {
        return game.settings.get(MODULE_NAME, 'lock-riders');
    }

    static setRiderLock(val) {
        game.settings.set(MODULE_NAME, 'lock-riders', val);
    }

    static getRiderRotate() {
        return game.settings.get(MODULE_NAME, 'rider-rotate');
    }

    static setRiderRotate(val) {
        game.settings.set(MODULE_NAME, 'rider-rotate', val);
    }



    /**
     * Returns the user specified mounting message
     */
    static getMountMessage() {
        return game.settings.get(MODULE_NAME, 'mount-message');
    }

    static setMountMessage(val) {
        game.settings.set(MODULE_NAME, 'mount-message', val);
    }

    /**
     * Returns the user specified dismounting message
     */
    static getDismountMessage() {
        return game.settings.get(MODULE_NAME, 'dismount-message');
    }

    static setDismountMessage(val) {
        game.settings.set(MODULE_NAME, 'dismount-message', val);
    }
    //#endregion

    //#region CSS Getters
    /**
    * Returns the css class for the left or right HUD column based on the game setting
    */
    static getHudColumnClass() {
        return game.settings.get(MODULE_NAME, 'column') == 0 ? '.col.left' : '.col.right';
    }

    /**
     * Returns whether the button should be placed on the top or bottom of the HUD column
     */
    static getHudTopBottomClass() {
        return game.settings.get(MODULE_NAME, 'topbottom') == 0 ? 'top' : 'bottom';
    }

    /**
     * Gets the icon that should be used on the HUD
     */
    static getIconClass() {
        switch (game.settings.get(MODULE_NAME, 'icon')) {
            case 0: return 'fa-horse';
            case 1: return 'fa-people-carry';
            case 2: return 'fa-hands';
            case 3: return 'fa-hand-holding';
            case 4: return 'fa-fist-raised';
            case 5: return 'fa-handshake';
        }
    }
    //#endregion CSS Getters

    // /**
    //  * Registers all of the necessary game settings for the module
    //  */
    // static registerSettings() {


    // }
}
