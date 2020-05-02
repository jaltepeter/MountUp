import { MountManager } from "./mountManager.js"

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
    static async addMountButton(app, html, data) {
        let button = $(`<div class="control-icon mount-up"><i class="fas fa-horse"></i></div>`);

        if (MountManager.isMount(data._id)) {
            this.addSlash(button);
        }

        html.find('.col.left').prepend(button);
        button.find('i').click(async (ev) => {
            if (MountManager.mountUp(data)) {
                if (MountManager.isMount(data._id)) {
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

