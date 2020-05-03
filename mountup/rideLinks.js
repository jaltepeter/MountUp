/**
 * Provides functionality for interacting with the ride links stored as a game setting
 */
export class RideLinks {

    /**
     * Returns the current ride links
     */
    static get() {
        let links = game.settings.get("mountup", "ride-links");
        return links;
    }

    /**
     * Stores the provided set of ride links to the game settings
     * @param {Object} links - The new set of links to be remembered
     */
    static set(links) {
        game.settings.set("mountup", "ride-links", links);
    }

    /**
     * Creates a new link between a rider and a moutn and saves it to game settings
     * @param {Object} rider - The rider
     * @param {Object} mount - The mount
     */
    static createRideLink(rider, mount) {
        let links = this.get();

        links[mount.id] = {
            riderId: rider.id,
            riderW: rider.w,
            riderH: rider.h
        };

        RideLinks.set(links);
    }

    /**
     * Removes an existing ride link for the supplied mount
     * @param {String} mountId - The id of the mount whose link should be broken
     */
    static breakRideLink(mountId) {
        let links = this.get();
        delete links[mountId];
        this.set(links);
    }

    static breakAllRideLinks() {
        this.set({});
    }

    static getMountId(riderId) {
        let links = RideLinks.get();
        for (const mountId of Object.keys(links)) {
            if (riderId == links[mountId].riderId) {
                return mountId;
            }
        }
        return undefined;
    }

    /**
     * Returns information about the rider assigned to the provided mount
     * @param {String} mountId - The ID of the mount to be queried
     */
    static getRiderData(mountId) {
        return this.get()[mountId];
    }
}