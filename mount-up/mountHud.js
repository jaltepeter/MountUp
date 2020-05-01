import { MountManager } from "./mountManager.js"

export class MountHud {
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

    static addSlash(button) {
        let slash = $(`<i class="fas fa-slash" style="position: absolute; color: tomato"></i>`);
        button.addClass("fa-stack");
        button.find('i').addClass('fa-stack-1x');
        slash.addClass('fa-stack-1x');
        button.append(slash);
    }

    static removeSlash(button) {
        let slash = button.find('i')[1];
        slash.remove();
    }
}

