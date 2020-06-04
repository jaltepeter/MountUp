import { MountManager } from "./mountManager.js";
import { error, findTokenById, findTokenByName, Flags, FlagScope } from "./utils.js";

/**
 * Macro function to mount a rider token onto a mount token
 * @param {string} riderNameOrId - The name or the ID of the rider token
 * @param {string} mountNameOrId - The name or the ID of the mount token
 */
export function mount(riderNameOrId, mountNameOrId) {
    let rider = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    let mount = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);

    if (rider) {
        if (mount) {
            if (rider.id != mount.id) {
                MountManager.doCreateMount(rider, mount);
            } else { error('You cannot mount a token to itself'); }
        } else { error(`A token could not be found with the name or id : ${mountName}`); }
    } else { error(`A token could not be found with the name or id : ${riderName}`); }
}

/**
 * Macro function to dismount a rider token from its mount
 * @param {string} riderNameOrId - The name or the ID of the rider token
 */
export function dismount(riderNameOrId) {
    let rider = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    if (rider) {
        if (MountManager.isaRider(rider.id)) {
            MountManager.doRemoveMount(rider, findTokenById(rider.getFlag(FlagScope, Flags.Mount)));
        } else { error(`Token '${rider.name}' is not a rider`); }
    } else { error(`A token could not be found with the name or id : ${riderNameOrId}`); }
}

/**
 * Macro function to have a mount drop its rider
 * @param {string} mountNameOrId - The name or the ID of the mount token
 */
export function dropRider(mountNameOrId) {
    let mount = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);
    if (mount) {
        if (MountManager.isaMount(mount.id)) {
            MountManager.doRemoveMount(findTokenById(mount.getFlag(FlagScope, Flags.Rider)), mount);
        } else { error(`Token '${mount.name}' is not a mount`); }
    } else { error(`A token could not be found with the name or id : ${mountNameOrId}`); }
}