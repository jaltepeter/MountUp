import { RideLinks } from "./rideLinks.js"

export class MountManager {

    static mountUp(data) {
        if (this.isMount(data._id)) {
            RideLinks.breakRideLink(data._id);
            return true;
        }

        let targets = canvas.tokens.controlled;

        if (targets.length === 0) {
            ui.notifications.warn("Please select the token to be the rider first.");
            return false;
        } else if (targets.length > 1) {
            ui.notifications.warn("Only one rider per mount please. (for now)");
            return false;
        } else if (targets[0].id == data._id) {
            ui.notifications.warn("You can't mount yourself.");
            return false;
        } else {
            let target = targets[0];

            let rider = canvas.tokens.ownedTokens.find(t => t.id === target.id);
            let mount = canvas.tokens.ownedTokens.find(t => t.id === data._id);

            RideLinks.createRideLink(rider, mount);
            this.moveRiderToMount(rider, mount);
            return true;
        }
    }

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

    static handleTokenMovement(tokenId, updateData) {
        let links = RideLinks.get();

        if (this.isMount(tokenId)) {
            let ride = links[tokenId];

            // A mount moved, make the rider follow
            let rider = canvas.tokens.ownedTokens.find(t => t.id === ride.riderId);
            let mount = canvas.tokens.ownedTokens.find(t => t.id === tokenId);
            this.moveRiderToMount(rider, mount, updateData.x, updateData.y);
        }
    }

    static isMount(tokenId) {
        for (const mountId of Object.keys(RideLinks.get())) {

            if (tokenId == mountId) return true;
        }
        return false;
    }

    static async moveRiderToMount(rider, mount, newX, newY) {
        let grid = canvas.scene.data.grid;

        let mountCenter = mount.getCenter(newX == undefined ? mount.x : newX, newY == undefined ? mount.y : newY);

        if (rider.w >= mount.w || rider.h >= mount.h) {
            newWidth = (mount.w / 2) / grid;
            newHeight = (mount.h / 2) / grid;
            await rider.update({
                width: newWidth,
                height: newHeight
            })
        }

        await rider.update({
            x: mountCenter.x - (rider.w / 2),
            y: mountCenter.y - (rider.h / 2)
        });

        rider.displayToFront();
    }
}

