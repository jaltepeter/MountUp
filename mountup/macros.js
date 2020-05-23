import { findTokenByName, findTokenById, error, flagScope, flag } from "./utils.js";
import { MountManager } from "./mountManager.js";

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

export function dismount(riderNameOrId) {
    let rider = findTokenById(riderNameOrId) || findTokenByName(riderNameOrId);
    if (rider) {
        if (MountManager.isaRider(rider.id)) {
            MountManager.doRemoveMount(rider, findTokenById(rider.getFlag(flagScope, flag.Mount)));
        } else { error(`Token '${rider.name}' is not a rider`); }
    } else { error(`A token could not be found with the name or id : ${riderNameOrId}`); }
}

export function dropRider(mountNameOrId) {
    let mount = findTokenById(mountNameOrId) || findTokenByName(mountNameOrId);
    if (mount) {
        if (MountManager.isaMount(mount.id)) {
            MountManager.doRemoveMount(findTokenById(mount.getFlag(flagScope, flag.Rider)), mount);
        } else { error(`Token '${mount.name}' is not a mount`); }
    } else { error(`A token could not be found with the name or id : ${mountNameOrId}`); }
}