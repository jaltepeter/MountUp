export class RideLinks {
    static get() {
        let links = game.settings.get("mount-up", "ride-links");
        return links;
    }

    static set(links) {
        game.settings.set("mount-up", "ride-links", links);
    }

    static createRideLink(rider, mount) {
        let links = RideLinks.get();

        links[mount.id] = {
            riderId: rider.id,
            riderW: rider.w,
            riderH: rider.h
        };

        RideLinks.set(links);
    }

    static breakRideLink(mountId){
        let links = RideLinks.get();
        delete links[mountId];
        RideLinks.set(links);
    }
}