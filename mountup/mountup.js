import { Settings } from "./settings.js";
import { MountHud } from "./mountHud.js";
import { MountManager } from "./mountManager.js";
import { socketName, socketAction, findTokenById } from "./utils.js";
import { RideLinks } from "./rideLinks.js";

Hooks.on('ready', () => {
    Settings.registerSettings();
    MountManager.popAllRiders();

    game.socket.on(socketName, data => {
        if (game.user.isGM) {
            switch (data.mode) {
                case socketAction.CreateLink:
                    let rider = findTokenById(data.riderId);
                    let mount = findTokenById(data.mountId);
                    RideLinks.createRideLink(rider, mount);
                    break;
                case socketAction.BreakLink:
                    RideLinks.breakRideLink(data.mountId);
                    break;
            }
        }
    });
});

Hooks.on('renderTokenHUD', (app, html, data) => {
    MountHud.renderMountHud(app, html, data);
});

Hooks.on('preUpdateToken', (scene, token, updateData) => {
    if (updateData.x || updateData.y) {
        MountManager.handleTokenMovement(token._id, updateData);
    }
});

Hooks.on('updateToken', (scene, token, updateData) => {
    if (MountManager.isaMount(updateData._id)) {
        MountManager.popRider(updateData._id);
    }
});

Hooks.on('controlToken', (token) => {
    if (MountManager.isaMount(token.id)) {
        MountManager.popRider(token.id);
    }
});

Hooks.on('preDeleteToken', (scene, token) => {

    MountManager.deleteToken(token);
});