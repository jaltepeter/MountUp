import { dismount, dropRider, mount } from './macros.js';
import { MountHud } from "./mountHud.js";
import { MountManager } from "./mountManager.js";
import { Settings } from "./settings.js";
import { findTokenById, socketAction, socketName } from "./utils.js";

Hooks.on('ready', () => {
    Settings.registerSettings();

    game.socket.on(socketName, data => {
        if (game.user.isGM) {
            switch (data.mode) {
                case socketAction.MoveToken:
                    let rider = findTokenById(data.riderId);
                    let mount = findTokenById(data.mountId);
                    MountManager.moveRiderToMount(rider, mount, data.x, data.y);
            }
        }
    });

    window.MountUp = {
        mount: mount,
        dismount: dismount,
        dropRider: dropRider
    };
});

Hooks.on('canvasReady', () => {
    MountManager.popAllRiders();
});

Hooks.on('renderTokenHUD', (app, html, data) => {
    MountHud.renderMountHud(app, html, data);
});

Hooks.on('preUpdateToken', async (scene, token, updateData) => {
    if (updateData.x || updateData.y) {
        await MountManager.handleTokenMovement(token._id, updateData);
    }
});

Hooks.on('updateToken', async (scene, token, updateData) => {
    if (MountManager.isaMount(updateData._id)) {
        await MountManager.popRider(updateData._id);
    }
});

Hooks.on('controlToken', async (token) => {
    if (MountManager.isaMount(token.id)) {
        await MountManager.popRider(token.id);
    }
});

Hooks.on('preDeleteToken', async (scene, token) => {
    await MountManager.handleTokenDelete(token._id);
    return true;
});