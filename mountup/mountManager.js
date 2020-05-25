import { Chatter } from "./chatter.js";
import { Settings } from "./settings.js";
import { findTokenById, flag, flagScope, riderX, riderY, socketAction, socketName, warn } from "./utils.js";

/**
 * Provides all of the functionality for interacting with the game (tokens, canvas, etc.)
 */
export class MountManager {

    /**
     * Called when the mount up button was clicked on a token's HUD
     * Determines if conditions are appropriate for mounting, and executes the mount if so
     * @param {Object} data - The token from which the button was clicked on the hud
     */
    static async mountUp(data) {

        if (this.isaMount(data._id)) {
            let mount = findTokenById(data._id);
            let rider = findTokenById(mount.getFlag('mountup', 'rider'));
            return this.doRemoveMount(rider, mount);
        }

        if (canvas.tokens.controlled.length == 2) {
            let mount = canvas.tokens.controlled.find(t => t.id == data._id);
            let rider = canvas.tokens.controlled.find(t => t.id != mount.id);
            return this.doCreateMount(rider, mount);
        }
    }

    /**
     * Creates a link between the rider and mount and moves the rider onto the mount
     * @param {object} rider - The rider token
     * @param {object} mount - The mount token
     */
    static async doCreateMount(rider, mount) {
        await mount.setFlag(flagScope, flag.Rider, rider.id);
        await rider.setFlag(flagScope, flag.Mount, mount.id);
        await rider.setFlag(flagScope, flag.OrigSize, { w: rider.w, h: rider.h });

        this.moveRiderToMount(rider, mount);
        Chatter.mountMessage(rider.id, mount.id);
        return true;
    }

    /**
     * Removes a link between the rider and mount and restores the rider's size if necessary
     * @param {object} rider - The rider token
     * @param {object} mount - The mount token
     */
    static async doRemoveMount(rider, mount) {
        await rider.setFlag(flagScope, flag.MountMove, true);
        this.restoreRiderSize(mount.id);
        Chatter.dismountMessage(rider.id, mount.id);
        await mount.unsetFlag(flagScope, flag.Rider);
        await rider.unsetFlag(flagScope, flag.Mount);
        await rider.unsetFlag(flagScope, flag.OrigSize);
        return true;
    }

    /**
     * Restores the size of a mount's rider token to original size
     * @param {String} mountId - The ID of the mount whose rider needs to be restored
     */
    static async restoreRiderSize(mountId) {
        let mount = findTokenById(mountId);
        let rider = findTokenById(mount.getFlag(flagScope, flag.Rider));
        let origsize = rider.getFlag(flagScope, flag.OrigSize);

        if (rider.w < origsize.w || rider.h < origsize.h) {
            let grid = canvas.scene.data.grid;
            let newWidth = rider.w < origsize.w ? origsize.w : rider.w;
            let newHeight = rider.h < origsize.h ? origsize.h : rider.H;

            await rider.update({
                width: newWidth / grid,
                height: newHeight / grid
            });
        }

        await rider.update({
            x: mount.x,
            y: mount.y,
        });

        rider.parent.sortChildren();
    }

    /**
     * Called when a token is deleted, checks if the token is part of any ride link, and breaks said link
     * @param {Object} token - The token being deleted
     */
    static async handleTokenDelete(tokenId) {
        let token = findTokenById(tokenId);

        if (this.isaRider(token.id)) {
            let mount = findTokenById(token.getFlag(flagScope, flag.Mount));
            await mount.unsetFlag(flagScope, flag.Rider);
        }

        if (this.isaMount(token.id)) {
            let rider = findTokenById(token.getFlag(flagScope, flag.Rider));
            await rider.unsetFlag(flagScope, flag.Mount);
            await rider.unsetFlag(flagScope, flag.OrigSize);
        }

        return true;
    }

    /**
     * Pops all rider tokens on top of their mount tokens (canvas wide)
     */
    static popAllRiders() {
        canvas.tokens.placeables.forEach((token) => {
            if (this.isaMount(token.id) && !this.isaRider(token.id)) {
                this.popRider(token.id);
            }
        });
    }

    /**
     * Recursively pops a mount's riders on the z-index
     * @param {string} mountId - The ID of the mount token
     */
    static async popRider(mountId) {

        let mount = findTokenById(mountId);
        let rider = findTokenById(mount.getFlag('mountup', 'rider'));

        if (rider) {
            rider.zIndex = mount.zIndex + 10;
        }

        if (this.isaMount(rider.id)) {
            this.popRider(rider.id);
        }

        if (rider.owner) {
            rider.unsetFlag(flagScope, flag.MountMove);
        }

        mount.parent.sortChildren();

    }

    /**
     * Called when a token is moved in the game.
     * Determines if the token being moved is a mount - if it is, moves the rider to match
     * @param {String} tokenId - The ID of the token being moved
     * @param {Object} updateData - Update data being sent by the game
     */
    static async handleTokenMovement(tokenId, updateData) {
        if (this.isaRider(tokenId)) {
            if (Settings.getRiderLock()) {
                let rider = findTokenById(tokenId);
                if (!rider.getFlag(flagScope, flag.MountMove)) {
                    delete updateData.x;
                    delete updateData.y;
                    warn(`${rider.name} is currently locked to a mount`);
                }
            }
        }

        if (this.isaMount(tokenId)) {
            let mount = findTokenById(tokenId);
            let rider = findTokenById(mount.getFlag(flagScope, flag.Rider));

            if (rider.owner) {
                await this.moveRiderToMount(rider, mount, updateData.x, updateData.y);
            } else {
                game.socket.emit(socketName, {
                    mode: socketAction.MoveToken,
                    riderId: rider.id,
                    mountId: mount.id,
                    x: updateData.x,
                    y: updateData.y
                });
            }
        }
    }

    /**
     * Returns true if the token is currently serving as a mount in any existing ride link
     * @param {String} tokenId - The ID of the token to evaluate
     */
    static isaMount(tokenId) {
        let token = findTokenById(tokenId);
        if (token) {
            return token.getFlag('mountup', 'rider') != undefined;
        } else return false;
    }

    /**
     * Returns true if the token is currenty serving as a rider in any existing ride link
     * @param {String} tokenId - The ID of the token to evaluate
     */
    static isaRider(tokenId) {
        let token = findTokenById(tokenId);
        if (token) {
            return token.getFlag('mountup', 'mount') != undefined;
        } else return false;
    }

    /**
     * Returns true if the specified mount belongs to the specified rider
     * @param {string} riderId - The rider token's ID
     * @param {string} mountId - The mount token's ID
     */
    static isRidersMount(riderId, mountId) {
        let rider = findTokenById(riderId);
        let mount = findTokenById(mountId);
        return (rider.getFlag(flagScope, flag.Mount) == mount.id);
    }

    /**
     * Moves the Rider token to Mount token.
     * If both tokens are being moved together, newX and newY must be provided, or rider 
     *  will end up at the Mount's starting location
     * @param {Object} rider - The rider
     * @param {Object} mount - The mount
     * @param {Number} newX - (optional) The new X-coordinate for the move
     * @param {Number} newY - (optional) The new Y-coordinate for the move
     */
    static async moveRiderToMount(rider, mount, newX = undefined, newY = undefined) {
        if (rider.w >= mount.w || rider.h >= mount.h) {
            let grid = canvas.scene.data.grid;
            let newWidth = (mount.w / 2) / grid;
            let newHeight = (mount.h / 2) / grid;
            await rider.update({
                width: newWidth,
                height: newHeight,
            });
            rider.zIndex = mount.zIndex + 10;
        }

        let loc = this.getRiderLocation(rider, mount, { x: newX, y: newY });

        await rider.setFlag(flagScope, flag.MountMove, true);

        await rider.update({
            x: loc.x,
            y: loc.y,
        });
        rider.zIndex = mount.zIndex + 10;

        rider.parent.sortChildren();
    }

    /**
     * Gets the correct rider placement coordinates based on the mount's position and movement
     * @param {token} rider - The rider token
     * @param {token} mount - The mount token
     * @param {object} newMountLoc - The location the mount is moving to
     */
    static getRiderLocation(rider, mount, newMountLoc) {
        newMountLoc.x = newMountLoc.x == undefined ? mount.x : newMountLoc.x;
        newMountLoc.y = newMountLoc.y == undefined ? mount.y : newMountLoc.y;
        let loc = { x: newMountLoc.x, y: newMountLoc.y };

        switch (Settings.getRiderX()) {
            case riderX.Center:
                let mountCenter = mount.getCenter(newMountLoc.x, newMountLoc.y);
                loc.x = mountCenter.x - (rider.w / 2);
                break;
            case riderX.Right:
                loc.x = newMountLoc.x + mount.w - rider.w;
                break;
        }

        switch (Settings.getRiderY()) {
            case riderY.Center:
                let mountCenter = mount.getCenter(newMountLoc.x, newMountLoc.y);
                loc.y = mountCenter.y - (rider.h / 2);
                break;
            case riderY.Bottom:
                loc.y = newMountLoc.y + mount.h - rider.h;
                break;
        }
        return loc;
    }

    /**
     * Returns true if the tokens are related via a long mount chain
     * @param {string} childId - The ID of the child
     * @param {string} ancestorId - The ID of the ancestor
     */
    static isAncestor(childId, ancestorId) {
        if (this.isaRider(childId)) {
            let child = findTokenById(childId);
            let parent = findTokenById(child.getFlag(flagScope, flag.Mount));
            if (parent.id == ancestorId) return true;
            return this.isAncestor(parent.id, ancestorId);
        }
        return false;
    }
}

