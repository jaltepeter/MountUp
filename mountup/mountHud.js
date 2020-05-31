import { MountManager } from "./mountManager.js";
import { Settings } from "./settings.js";

/**
 * Functinality class for managing the token HUD
 */
export class MountHud {

    /**
     * Called when a token is right clicked on to display the HUD.
     * Adds a button with a horse icon, and adds a slash on top of it if it is already a mount.
     * @param {Object} app - the application data
     * @param {Object} html - the html data
     * @param {Object} data - The HUD Data
     */
    static async renderMountHud(app, html, data) {

        let mount = canvas.tokens.controlled.find(t => t.id == data._id);

        if (canvas.tokens.controlled.length == 1 && MountManager.isaMount(mount.id)) {
            this.addButton(html, data, true);
        } else if (canvas.tokens.controlled.length >= 2) {
            this.addMountButton(html, data);
            // let rider = canvas.tokens.controlled.find(t => t.id != mount.id);

            // if (MountManager.isRidersMount(rider.id, mount.id)) {
            //     this.addButton(html, data, true);
            // }
            // else {
            //     // if (!MountManager.isaMount(mount.id)) {
            //     if (!MountManager.isAncestor(mount.id, rider.id)) {
            //         this.addButton(html, data);
            //     }
            //     // }
            // }
        }
    }

    static addMountButton(html, hudToken) {
        let button = $(`<div class="control-icon mount-up"><i class="fas ${Settings.getIconClass()}"></i></div>`);
        let col = html.find(Settings.getHudColumnClass());
        if (Settings.getHudTopBottomClass() == 'top') {
            col.prepend(button);
        } else {
            col.append(button);
        }

        button.find('i').click(async (ev) => {
            MountManager.mountUp(hudToken);
        });
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

        button.find('i').click(async (ev) => {
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

