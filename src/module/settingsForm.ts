import { hudColumns, hudTopBottom, iconOptions, MODULE_NAME, riderLockOptions, riderXOptions, riderYOptions, Settings } from './settings.js';

export class SettingsForm extends FormApplication {

    constructor(object, options = {}) {
        super(object, options);
    }

    /**
    * Default Options for this FormApplication
    */
     static get defaultOptions():any {
        //@ts-ignore
        return mergeObject(super.defaultOptions, {
            id: "mountup-settings-form",
            title: "Mount Up! - Settings",
            template: `./modules/${MODULE_NAME}/templates/settings.html`,
            classes: ["sheet"],
            width: 500,
            closeOnSubmit: true,

            // TODO TO CHECK TYPESCRIPT IS WRONG ?
            /*
            submitOnChange: false,
            submitOnClose: false,
            editable: true,

            baseApplication: null,
            height: null,
            top: null,
            left: null,
            popOut: false,
            minimizable: true,
            resizable: true,
            dragDrop: [],
            tabs: [],
            filters: [],
            scrollY: [],
            */
        });
    }

    getData():any {
        const data = {
            icons: this.getSelectList(iconOptions, Settings.getIcon()),
            hudColumn: this.getSelectList(hudColumns, Settings.getHudColumn()),
            hudTopBottom: this.getSelectList(hudTopBottom, Settings.getHudTopBottom()),
            riderLock: this.getSelectList(riderLockOptions, Settings.getRiderLock()),
            riderRotate: Settings.getRiderRotate(),
            riderX: this.getSelectList(riderXOptions, Settings.getRiderX()),
            riderY: this.getSelectList(riderYOptions, Settings.getRiderY()),
            shouldChat: Settings.getShouldChat(),
            mountMsg: Settings.getMountMessage(),
            dismountMsg: Settings.getDismountMessage()
        };

        return data;
    }

    /**
     * Executes on form submission.
     * @param {Object} e - the form submission event
     * @param {Object} d - the form data
     */
    async _updateObject(e, d) {
        Settings.setIcon(d.icon);
        Settings.setHudColumn(d.hudColumn);
        Settings.setHudTopBottom(d.hudTopBottom);
        Settings.setRiderLock(d.riderLock);
        Settings.setRiderRotate(d.riderRotate);
        Settings.setRiderX(d.riderX);
        Settings.setRiderY(d.riderY);
        Settings.setShouldChat(d.shouldChat);
        Settings.setMountMessage(d.mountMsg);
        Settings.setDismountMessage(d.dismountMsg);
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

    getSelectList(myselectslist, selected) {
        let options = [];
        Object.keys(myselectslist).forEach((x, i) => {
            options.push({ value: x, selected: i == selected });
        });
        return options;
    }
}
