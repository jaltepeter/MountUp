import { error } from "../foundryvtt-mountup.js";
import { MountManager } from "./mountManager.js";
import { findTokenById, findTokenByName, Flags, FlagScope } from "./utils.js";

/**
 * Macro function to mount a rider token onto a mount token
 * @param {string} riderNameOrId - The name or the ID of the rider token
 * @param {string} mountNameOrId - The name or the ID of the mount token
 */
export function mount(riderNameOrId, mountNameOrId) {
    let rider = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    let mount = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);

    let mountName = mount.name;
    let riderName = rider.name;

    if (rider) {
        if (mount) {
            if (rider.id != mount.id) {
                MountManager.doCreateMount(rider, mount);
            } else { error('You cannot mount a token to itself'); }
        } else {
          error(`A token could not be found with the name or id : ${mountName}`);
        }
    } else {
      error(`A token could not be found with the name or id : ${riderName}`);
    }
}

/**
 * Macro function to dismount a rider token from its mount
 * @param {string} riderNameOrId - The name or the ID of the rider token
 */
export function dismount(riderNameOrId) {

    let rider = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    let riderName = rider.name;

    if (rider) {
        if (MountManager.isaRider(rider.id)) {
            let mountToken = findTokenById(rider.getFlag(FlagScope, Flags.Mount));
            MountManager.doRemoveMount(rider, mountToken);
        } else {
          error(`Token '${riderName}' is not a rider`);
        }
    } else {
      error(`A token could not be found with the name or id : ${riderName}`);
    }
}

/**
 * Macro function to have a mount drop its rider
 * @param {string} mountNameOrId - The name or the ID of the mount token
 */
export function dropRider(mountNameOrId) {
    let mount = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);
    let mountName = mount.name;

    if (mount) {
        if (MountManager.isaMount(mount.id)) {
            let riderToken = findTokenById(mount.getFlag(FlagScope, Flags.Riders));
            MountManager.doRemoveMount(riderToken, mount); // TODO Flag.Rider ???
        } else {
          error(`Token '${mountName}' is not a mount`);
        }
    } else {
      error(`A token could not be found with the name or id : ${mountName}`);
    }
}
