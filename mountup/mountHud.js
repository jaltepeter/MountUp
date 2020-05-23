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


        // the mount is the token who was right clicked
        let mount = canvas.tokens.controlled.find(t => t.id == data._id);


        // if exactly 1 selected and hud is from any mount then show the dismount button
        if (canvas.tokens.controlled.length == 1 && MountManager.isaMount(mount.id)) {
            this.addMountButton(html, data, true);
        }
        // if exactly 2 is selected (rider and mount)
        else if (canvas.tokens.controlled.length == 2) {
            // if only two are selected, the rider is the token who isnt the mount
            let rider = canvas.tokens.controlled.find(t => t.id != mount.id);


            // if the pair is linked - show the dismount button
            if (MountManager.isRidersMount(rider.id, mount.id)) {
                this.addMountButton(html, data, true);
            }
            // if the pair is not linked AND the mount is not already a mount - show the mount button
            else {
                if (!MountManager.isaMount(mount.id)) {
                    this.addMountButton(html, data);
                }
            }

            // if (isaMount(mount.id)) {
            //     this.addMountButton(html, data, true);
            // } else {
            //     this.
            // }




            // if (target.id == data._id) {
            //     // AND it is a mount
            //     if (MountManager.isaMount(target.id)) {
            //         this.addMountButton(html, data, true);
            //     }
            // }
            // // if hud is from its mount show the dismount button
            // else if (MountManager.isRidersMount(target.id, data._id)) {
            //     this.addMountButton(html, data, true);
            // }
            // // if the hud is NOT a mount 
            // else if (!MountManager.isaMount(data._id)) {
            //     // AND the selected is NOT a rider - show the mount button
            //     if (!MountManager.isaRider(target.id) && !MountManager.isAncestor(data._id, target.id)) {
            //         this.addMountButton(html, data);
            //     }
            // }
        }
    }

    static async addMountButton(html, data, hasSlash = false) {
        let button = $(`<div class="control-icon mount-up"><i class="fas ${Settings.getIcon()}"></i></div>`);

        if (hasSlash) {
            this.addSlash(button);
        }

        let col = html.find(Settings.getHudColumn());
        if (Settings.getHudTopBottom() == 'top') {
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

