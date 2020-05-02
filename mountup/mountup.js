import { Settings } from "./settings.js"
import { MountHud } from "./mountHud.js"
import { MountManager } from "./mountManager.js";
import { socketName, actionMode, findTokenById } from "./utils.js"
import { RideLinks } from "./rideLinks.js";

Hooks.on('ready', () => {
    Settings.registerSettings();

    game.socket.on(socketName, data => {
        if (game.user.isGM) {
            switch (data.mode) {
                case actionMode.CreateLink:
                    let rider = findTokenById(data.riderId);
                    let mount = findTokenById(data.mountId);
                    RideLinks.createRideLink(rider, mount);
                    break;
                case actionMode.BreakLink:
                    RideLinks.breakRideLink(data.mountId);
                    break;
            }
        }
    });
});

Hooks.on('renderTokenHUD', (app, html, data) => {
    MountHud.addMountButton(app, html, data);
});

Hooks.on('updateToken', (scene, token, updateData) => {
    if (updateData.x || updateData.y) {
        MountManager.handleTokenMovement(token._id, updateData);
    }
});

Hooks.on('preDeleteToken', (scene, token) => {

    MountManager.deleteToken(token);
});

Hooks.on('canvasReady', (canvas) => {
    MountManager.popAllRiders();
});