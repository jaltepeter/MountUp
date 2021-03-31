import { warn } from "../foundryvtt-mountup.js";
import { MountManager } from "./mountManager.js";
import { MODULE_NAME, Settings } from "./settings.js";
import { findTokenById, Flags, FlagScope } from "./utils.js";

/**
 * Functinality class for managing the token HUD
 */
export class MountHud {

    /**
     * Called when a token is right clicked on to display the HUD.
     * Adds a button with a horse icon, and adds a slash on top of it if it is already a mount.
     * @param {Object} app - the application data
     * @param {Object} html - the html data
     * @param {Object} hudToken - The HUD Data
     */
    static async renderMountHud(app, html, hudToken) {

        let mount = canvas.tokens.controlled.find(t => t.id == hudToken._id);

        // if only one token is selected
        if (canvas.tokens.controlled.length == 1) {
            // if the selected token is a mount
            if (MountManager.isaMount(canvas.tokens.controlled[0].id)) {
                this.addRemoveRidersButton(html, hudToken);
            }
            if (MountManager.isaRider(canvas.tokens.controlled[0].id)) {
                this.addDismountButton(html, hudToken);
            }
        } else {
            //ui.notifications.warn(`${MODULE_NAME}! : You must be sure to select only the token mount`);
            this.addMountButton(html, hudToken);
        }

        // if (canvas.tokens.controlled.length == 1 && MountManager.isaMount(mount.id)) {
        //     this.addButton(html, hudToken, true);
        // } else if (canvas.tokens.controlled.length >= 2) {
        //     this.addMountButton(html, hudToken);
        //     // let rider = canvas.tokens.controlled.find(t => t.id != mount.id);

        //     // if (MountManager.isRidersMount(rider.id, mount.id)) {
        //     //     this.addButton(html, data, true);
        //     // }
        //     // else {
        //     //     // if (!MountManager.isaMount(mount.id)) {
        //     //     if (!MountManager.isAncestor(mount.id, rider.id)) {
        //     //         this.addButton(html, data);
        //     //     }
        //     //     // }
        //     // }
        // }
    }

    static addMountButton(html, hudToken) {

        let tokenNames = canvas.tokens.controlled.filter(token => token.id != hudToken._id).map(token => { return `'${token.name}'`; });

        const button = this.buildButton(html, `Mount ${tokenNames.join(', ').replace(/, ([^,]*)$/, ' and $1')} on to ${hudToken.name}`);

        button.find('i').on("click", async (ev) => {
            MountManager.mountUp(hudToken);
        });
    }

    static addDismountButton(html, hudToken) {
        const rider = findTokenById(hudToken._id);
        let button = this.buildButton(html, `Dismount ${hudToken.name} from ${findTokenById(rider.getFlag(FlagScope, Flags.Mount)).name}`);
        button = this.addSlash(button);

        button.find('i').on("click", async (ev) => {
            MountManager.dismount(hudToken);
        });
    }

    static addRemoveRidersButton(html, hudToken) {
        let button = this.buildButton(html, `Remove all riders from ${hudToken.name}`);
        button = this.addSlash(button);

        button.find('i').on("click", async (ev) => {
            MountManager.removeAllRiders(hudToken);
        });
    }

    static buildButton(html, tooltip) {
        let button = $(`<div class="control-icon mount-up" title="${tooltip}"><i class="fas ${Settings.getIconClass()}"></i></div>`);
        let col = html.find(Settings.getHudColumnClass());
        if (Settings.getHudTopBottomClass() == 'top') {
            col.prepend(button);
        } else {
            col.append(button);
        }
        return button;
    }

    /**
     * Adds the mount button to the HUD HTML
     * @param {object} html - The HTML
     * @param {object} data - The data
     * @param {boolean} hasSlash - If true, the slash will be placed over the mount icon
     */
    static async addButton(html, data, hasSlash = false) {
        let button = $(`<div class="control-icon mount-up"><i class="fas ${Settings.getIconClass()}"></i></div>`);

        if (hasSlash) {
            this.addSlash(button);
        }

        let col = html.find(Settings.getHudColumnClass());
        if (Settings.getHudTopBottomClass() == 'top') {
            col.prepend(button);
        } else {
            col.append(button);
        }

        button.find('i').on("click", async (ev) => {
            if (MountManager.mountUp(data)) {
                if (hasSlash) {
                    this.removeSlash(button);
                } else {
                    this.addSlash(button);
                }
            }
        });
    }

    /**
     * Adds a slash icon on top of the horse icon to signify "dismount"
     * @param {Object} button - The HUD button to add a slash on top of
     */
    static addSlash(button) {
        let slash = $(`<i class="fas fa-slash" style="position: absolute; color: tomato"></i>`);
        button.addClass("fa-stack");
        button.find('i').addClass('fa-stack-1x');
        slash.addClass('fa-stack-1x');
        button.append(slash);
        return button;
    }

    /**
     * Removes the slash icon from the button to signify that it is no longer a mount
     * @param {Object} button - The mount up button
     */
    static removeSlash(button) {
        let slash = button.find('i')[1];
        slash.remove();
    }
}

