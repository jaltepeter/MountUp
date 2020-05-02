import { RideLinks } from "./rideLinks.js"
import { Chatter } from "./chatter.js"
import { findTokenById, warn } from "./utils.js"

/**
 * Provides all of the functionality for interacting with the game (tokens, canvas, etc.)
 */
export class MountManager {

    /**
     * Called when the mount up button was clicked on a token's HUD
     * Determines if conditions are appropriate for mounting, and executes the mount if so
     * @param {Object} token - The token from which the button was clicked on the hud
     */
    static mountUp(token) {
        if (this.isMount(token._id)) {
            this.restoreRiderSize(token._id);
            let rider = findTokenById(RideLinks.getRiderData(token._id).riderId);
            Chatter.dismountMessage(token._id, rider.data._id);
            RideLinks.breakRideLink(token._id);
            return true;
        }

        let targets = canvas.tokens.controlled;

        if (targets.length === 0) {
            warn("Please select the token to be the rider first.");
            return false;
        } else if (targets.length > 1) {
            warn("Only one rider per mount please. (for now)");
            return false;
        } else if (targets[0].id == token._id) {
            warn("You can't mount yourself.");
            return false;
        } else {
            let target = targets[0];
            let rider = findTokenById(target.id);
            let mount = findTokenById(token._id);

            RideLinks.createRideLink(rider, mount);
            this.moveRiderToMount(rider, mount);
            Chatter.mountMessage(target.id, token._id)
            return true;
        }
    }

    /**
     * Restores the size of a mount's rider token to original size
     * @param {String} mountId - The ID of the mount whose rider needs to be restored
     */
    static async restoreRiderSize(mountId) {
        let riderData = RideLinks.getRiderData(mountId);
        let rider = findTokenById(riderData.riderId);
        let mount = findTokenById(mountId);

        if (rider.w < riderData.riderW || rider.h < riderData.riderH) {
            let grid = canvas.scene.data.grid;
            let newWidth = rider.w < riderData.riderW ? riderData.riderW : rider.w;
            let newHeight = rider.h < riderData.riderH ? riderData.riderH : rider.H;

            await rider.update({
                width: newWidth / grid,
                height: newHeight / grid
            })
        }

        await rider.update({
            x: mount.x,
            y: mount.y,
        });
    }

    /**
     * Called when a token is deleted, checks if the token is part of any ride link, and breaks said link
     * @param {Object} token - The token being deleted
     */
    static deleteToken(token) {
        let links = RideLinks.get();
        for (const mountId of Object.keys(RideLinks.get())) {

            if (token._id == mountId || token._id == links[mountId].riderId) {
                RideLinks.breakRideLink(mountId);
            }
        }

    }

    static popAllRiders() {
        // TODO
    }

    /**
     * Called when a token is moved in the game.
     * Determines if the token being moved is a mount - if it is, moves the rider to match
     * @param {String} tokenId - The ID of the token being moved
     * @param {Object} updateData - Update data being sent by the game
     */
    static handleTokenMovement(tokenId, updateData) {
        let links = RideLinks.get();

        if (this.isMount(tokenId)) {
            let ride = links[tokenId];

            // A mount moved, make the rider follow
            let rider = findTokenById(ride.riderId);
            let mount = findTokenById(tokenId);
            this.moveRiderToMount(rider, mount, updateData.x, updateData.y);
        }
    }

    /**
     * Returns true if the token is currently serving as a mount in any existing ride link
     * @param {String} tokenId - The ID of the token to evaluate
     */
    static isMount(tokenId) {
        for (const mountId of Object.keys(RideLinks.get())) {
            if (tokenId == mountId) return true;
        }
        return false;
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
                height: newHeight
            })
        }

        let mountCenter = mount.getCenter(newX == undefined ? mount.x : newX, newY == undefined ? mount.y : newY);

        await rider.update({
            x: mountCenter.x - (rider.w / 2),
            y: mountCenter.y - (rider.h / 2)
        });

        rider.displayToFront();
    }
}

