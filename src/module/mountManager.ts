import { error, warn } from "../foundryvtt-mountup.js";
import { Chatter } from "./chatter.js";
import { Settings } from "./settings.js";
import { dismountDropTarget, mountUp } from "./tokenAttacherHelper.js";
import { findTokenById, Flags, FlagScope, riderLock, riderX, riderY, socketAction, socketName } from "./utils.js";

/**
 * Provides all of the functionality for interacting with the game (tokens, canvas, etc.)
 */
export class MountManager {

    /**
     * Called when the mount up button was clicked on a token's HUD
     * Determines if conditions are appropriate for mounting, and executes the mount if so
     * @param {Object} hudToken - The token from which the button was clicked on the hud
     */
    static async mountUp(hudToken) {
        const mountToken = canvas.tokens.controlled.find(t => t.id == hudToken._id);

        for (const riderToken of canvas.tokens.controlled) {
            if (riderToken.id != mountToken.id) {
                // check that the new rider isn't already a rider of a different mount
                if (this.isaRider(riderToken.id) && !this.isRidersMount(riderToken.id, hudToken._id)) {
                    warn(`Couldn't mount '${riderToken.name}' on to '${hudToken.name}' because \
                        it is already mounted to '${findTokenById(riderToken.getFlag(FlagScope, Flags.Mount)).name}'.`);
                    continue;
                }
                if (this.isAncestor(mountToken.id, riderToken.id)) {
                    continue;
                }
                let riders = mountToken.getFlag(FlagScope, Flags.Riders);
                if (riders == undefined){
                  riders = [];
                }
                if (!riders.includes(riderToken.id)) {
                  riders.push(riderToken.id);
                }
                await mountToken.unsetFlag(FlagScope, Flags.Riders);
                await mountToken.setFlag(FlagScope, Flags.Riders, riders);
                await riderToken.setFlag(FlagScope, Flags.Mount, mountToken.id);
                await riderToken.setFlag(FlagScope, Flags.OrigSize, { w: riderToken.w, h: riderToken.h });

                // CALL TOKEN ATTACHER
                mountUp(riderToken,mountToken);

                Chatter.mountMessage(riderToken.id, mountToken.id);

                // shrink the rider if needed
                if (riderToken.w >= mountToken.w || riderToken.h >= mountToken.h) {
                    let grid = canvas.scene.data.grid;
                    let newWidth = (mountToken.w / 2) / grid;
                    let newHeight = (mountToken.h / 2) / grid;
                    await riderToken.update({
                        width: newWidth,
                        height: newHeight,
                    });
                    riderToken.zIndex = mountToken.zIndex + 10;
                }

                let loc = this.getRiderInitialLocation(riderToken, mountToken);
                await riderToken.setFlag(FlagScope, Flags.MountMove, true);
                await riderToken.update({
                    x: loc.x,
                    y: loc.y
                });
                riderToken.zIndex = mountToken.zIndex + 10;
            }
        }

        mountToken.parent.sortChildren();
    }

    static async dismount(hudToken) {
        const riderToken = findTokenById(hudToken._id);
        const mountToken = findTokenById(riderToken.getFlag(FlagScope, Flags.Mount));
        this.doRemoveMount(riderToken, mountToken);
    }

    static async removeAllRiders(hudToken) {
        const mountToken = findTokenById(hudToken._id);

        for (const riderId of mountToken.getFlag(FlagScope, Flags.Riders)) {
            const riderToken = findTokenById(riderId);
            this.doRemoveMount(riderToken, mountToken);
        }
    }

    /**
     * Creates a link between the rider and mount and moves the rider onto the mount
     * @param {object} riderToken - The rider token
     * @param {object} mountToken - The mount token
     */
    static async doCreateMount(riderToken, mountToken) {
        let riders = mountToken.getFlag(FlagScope, Flags.Riders);
        if (riders == undefined) riders = [];
        if (!riders.includes(riderToken.id)) { riders.push(riderToken.id); }
        // await mountToken.setFlag(FlagScope, Flags.Riders, riders);
        console.log(riders);
        await mountToken.update({ flags: { mountup: { riders: riders } } });
        await riderToken.setFlag(FlagScope, Flags.Mount, mountToken.id);
        await riderToken.setFlag(FlagScope, Flags.OrigSize, { w: riderToken.w, h: riderToken.h });

        // NO NEED ANYMORE TOKEN ATTACHER DO THE WORK
        // this.moveRiderToMount(riderToken, { x: mountToken.x, y: mountToken.y }, null, null, null);

        // CALL TOKEN ATTACHER
        mountUp(riderToken,mountToken);

        Chatter.mountMessage(riderToken.id, mountToken.id);
        return true;
    }

    /**
     * Removes a link between the rider and mount and restores the rider's size if necessary
     * @param {object} riderToken - The rider token
     * @param {object} mountToken - The mount token
     */
    static async doRemoveMount(riderToken, mountToken) {
        await riderToken.setFlag(FlagScope, Flags.MountMove, true);
        this.restoreRiderSize(riderToken);

        // CALL TOKEN ATTACHER
        dismountDropTarget(mountToken,riderToken);

        Chatter.dismountMessage(riderToken.id, mountToken.id);
        const riders = mountToken.getFlag(FlagScope, Flags.Riders);
        await mountToken.unsetFlag(FlagScope, Flags.Riders);
        riders.splice(riders.indexOf(riderToken.id));
        await mountToken.setFlag(FlagScope, Flags.Riders, riders);
        await riderToken.unsetFlag(FlagScope, Flags.Mount);
        await riderToken.unsetFlag(FlagScope, Flags.OrigSize);
        return true;
    }

    /**
     * Restores the size of a mount's rider token to original size
     * @param {String} riderToken - The rider token who's size needs to be restored
     */
    static async restoreRiderSize(riderToken) {
        // let mount = findTokenById(riderToken);
        // let rider = findTokenById(mount.getFlag(FlagScope, Flags.Riders));
        let origsize = riderToken.getFlag(FlagScope, Flags.OrigSize);

        if (riderToken.w < origsize.w || riderToken.h < origsize.h) {
            let grid = canvas.scene.data.grid;
            let newWidth = riderToken.w < origsize.w ? origsize.w : riderToken.w;
            let newHeight = riderToken.h < origsize.h ? origsize.h : riderToken.H;

            await riderToken.update({
                width: newWidth / grid,
                height: newHeight / grid
            });
        }

        riderToken.parent.sortChildren();
    }

    /**
     * Called when a token is deleted, checks if the token is part of any ride link, and breaks said link
     * @param {Object} token - The token being deleted
     */
    static async handleTokenDelete(tokenId) {
        if(tokenId){
            let token = findTokenById(tokenId);

            if (!token) {
                return true;
            }

            if (this.isaRider(token.id)) {
                let mount = findTokenById(token.getFlag(FlagScope, Flags.Mount));
                await mount.unsetFlag(FlagScope, Flags.Riders);
            }

            if (this.isaMount(token.id)) {
                let rider = findTokenById(token.getFlag(FlagScope, Flags.Riders));
                await rider.unsetFlag(FlagScope, Flags.Mount);
                await rider.unsetFlag(FlagScope, Flags.OrigSize);
            }

            return true;
        }else{
            return false;
        }
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
    static async popRider(mountId, callcount = 0) {

        if (callcount > 100) {
            error('Pop riders called too many times. Breaking all rides for safety.');
            canvas.tokens.placeables.forEach(t => { t.unsetFlag('mountup', 'riders'); t.unsetFlag('mountup', 'mount'); });
            return true;
        }
        let mountToken = findTokenById(mountId);

        for (const riderId of mountToken.getFlag(FlagScope, Flags.Riders)) {
            const riderToken = findTokenById(riderId);
            if (riderToken) {
                riderToken.zIndex = mountToken.zIndex + 10;
            }

            if (this.isaMount(riderToken.id)) {
                //this.popRider(riderToken.id, callcount += 1);
                callcount += 1;
                // CALL TOKEN ATTACHER            
                dismountDropTarget(mountToken, riderToken);
            }

            if (riderToken.owner) {
                await riderToken.unsetFlag(FlagScope, Flags.MountMove);
            }
        }

        mountToken.parent.sortChildren();

        return true;
    }

    // /**
    //  * Recursively pops a mount's riders on the z-index
    //  * @param {string} mountId - The ID of the mount token
    //  */
    // static async popRider(mountId, callcount = 0) {

    //     if (callcount > 100) {
    //         error('Pop riders called too many times. Breaking all rides for safety.');
    //         canvas.tokens.placeables.forEach(t => { t.unsetFlag('mountup', 'riders'); t.unsetFlag('mountup', 'mount'); });
    //         return true;
    //     }
    //     let mountToken = findTokenById(mountId);

    //     for (const riderId of mountToken.getFlag(FlagScope, Flags.Riders)) {
    //         const riderToken = findTokenById(riderId);
    //         if (riderToken) {
    //             riderToken.zIndex = mountToken.zIndex + 10;
    //         }

    //         if (this.isaMount(riderToken.id)) {
    //             this.popRider(riderToken.id, callcount += 1);
    //         }

    //         if (riderToken.owner) {
    //             await riderToken.unsetFlag(FlagScope, Flags.MountMove);
    //         }
    //     }

    //     mountToken.parent.sortChildren();

    //     return true;
    // }

    // /**
    //  * Called when a token is moved in the game.
    //  * Determines if the token being moved is a mount - if it is, moves the rider to match
    //  * @param {String} tokenId - The ID of the token being moved
    //  * @param {Object} updateData - Update data being sent by the game
    //  */
    // static async doTokenUpdate(tokenId, updateData) {
    //     if (this.isaRider(tokenId)) {
    //         const riderToken = findTokenById(tokenId);
    //         const mountToken = findTokenById(riderToken.getFlag(FlagScope, Flags.Mount));
    //         const newLocation = {
    //             x: updateData.x !== undefined ? updateData.x : riderToken.x,
    //             y: updateData.y !== undefined ? updateData.y : riderToken.y
    //         };

    //         if (!riderToken.getFlag(FlagScope, Flags.MountMove)) {
    //             if (!canvas.tokens.controlled.map(t => t.id).includes(riderToken.getFlag(FlagScope, Flags.Mount))) {
    //                 switch (Settings.getRiderLock()) {
    //                     case riderLock.NoLock:
    //                         break;
    //                     case riderLock.LockLocation:
    //                         delete updateData.x;
    //                         delete updateData.y;
    //                         warn(`${riderToken.name} is currently locked to a mount`);
    //                         break;
    //                     case riderLock.LockBounds:
    //                         if (!this.isInsideTokenBounds(newLocation, mountToken)) {
    //                             delete updateData.x;
    //                             delete updateData.y;
    //                             warn(`${riderToken.name} is currently locked inside a mount`);
    //                         }
    //                         break;
    //                     case riderLock.Dismount:
    //                         if (!this.isInsideTokenBounds(newLocation, mountToken)) {
    //                             this.doRemoveMount(riderToken, mountToken);
    //                         }
    //                 }
    //             }
    //         }
    //     }

    //     if (this.isaMount(tokenId)) {
    //         const mountToken = findTokenById(tokenId);

    //         updateData.x = updateData.x !== undefined ? updateData.x : mountToken.x;
    //         updateData.y = updateData.y !== undefined ? updateData.y : mountToken.y;
    //         updateData.rotation = updateData.rotation !== undefined ? updateData.rotation : mountToken.data.rotation;

    //         const mountLocation = { x: mountToken.x, y: mountToken.y };

    //         for (const riderId of mountToken.getFlag(FlagScope, Flags.Riders)) {
    //             const riderToken = findTokenById(riderId);
    //             if (riderToken.owner) {
    //                 await this.moveRiderToMount(riderToken, mountLocation, updateData.x, updateData.y, updateData.rotation == undefined ? mountToken.data.rotation : updateData.rotation);
    //             } else {
    //                 const offset = { x: mountLocation.x - riderToken.x, y: mountLocation.y - riderToken.y };
    //                 const rotation = Settings.getRiderRotate() ? updateData.rotation : riderToken.data.rotation;
    //                 game.socket['emit'](socketName, {
    //                     mode: socketAction.UpdateToken,
    //                     riderId: riderToken.id,
    //                     // updateData: updateData
    //                     // mountId: mountToken.id,
    //                     x: updateData.x - offset.x,
    //                     y: updateData.y - offset.y,
    //                     rotation: rotation
    //                 });
    //             }
    //         }


    //     }
    // }

    /**
     * Called when a token is moved in the game.
     * Determines if the token being moved is a mount - if it is, moves the rider to match
     * @param {String} tokenId - The ID of the token being moved
     * @param {Object} updateData - Update data being sent by the game
     */
    static async doTokenUpdateOnlyCheckBoundHandler(tokenId, updateData) {
        if (this.isaRider(tokenId)) {
            const riderToken = findTokenById(tokenId);
            const mountToken = findTokenById(riderToken.getFlag(FlagScope, Flags.Mount));
            const newLocation = {
                x: updateData.x !== undefined ? updateData.x : riderToken.x,
                y: updateData.y !== undefined ? updateData.y : riderToken.y
            };

            if (!riderToken.getFlag(FlagScope, Flags.MountMove)) {
                if (!canvas.tokens.controlled.map(t => t.id).includes(riderToken.getFlag(FlagScope, Flags.Mount))) {
                    switch (Settings.getRiderLock()) {
                        case riderLock.NoLock:
                            break;
                        case riderLock.LockLocation:
                            delete updateData.x;
                            delete updateData.y;
                            warn(`${riderToken.name} is currently locked to a mount`);
                            break;
                        case riderLock.LockBounds:
                            if (!this.isInsideTokenBounds(newLocation, mountToken)) {
                                delete updateData.x;
                                delete updateData.y;
                                warn(`${riderToken.name} is currently locked inside a mount`);
                            }
                            break;
                        case riderLock.Dismount:
                            if (!this.isInsideTokenBounds(newLocation, mountToken)) {
                                this.doRemoveMount(riderToken, mountToken);
                            }
                    }
                }
            }
        }

        if (this.isaMount(tokenId)) {
            const mountToken = findTokenById(tokenId);

            updateData.x = updateData.x !== undefined ? updateData.x : mountToken.x;
            updateData.y = updateData.y !== undefined ? updateData.y : mountToken.y;
            updateData.rotation = updateData.rotation !== undefined ? updateData.rotation : mountToken.data.rotation;

            // NO NEED ANYMORE TOKEN ATTACHER DO THE WORK

            const mountLocation = { x: mountToken.x, y: mountToken.y };
            for (const riderId of mountToken.getFlag(FlagScope, Flags.Riders)) {
                const riderToken = findTokenById(riderId);
                if (riderToken.owner) {
                    await this.moveRiderToMount(riderToken, mountLocation, updateData.x, updateData.y, updateData.rotation == undefined ? mountToken.data.rotation : updateData.rotation);
                } else {
                    const offset = { x: mountLocation.x - riderToken.x, y: mountLocation.y - riderToken.y };
                    const rotation = Settings.getRiderRotate() ? updateData.rotation : riderToken.data.rotation;
                    game.socket['emit'](socketName, {
                        mode: socketAction.UpdateToken,
                        riderId: riderToken.id,
                        // updateData: updateData
                        // mountId: mountToken.id,
                        x: updateData.x - offset.x,
                        y: updateData.y - offset.y,
                        rotation: rotation
                    });
                }
            }


        }
    }

    static isInsideTokenBounds(location, token) {
        const x = token.x + token.w;
        const y = token.y + token.h;

        return location.x >= token.x &&
            location.x < (token.x + token.w) &&
            location.y >= token.y &&
            location.y < (token.y + token.h);
    }

    /**
     * Returns true if the token is currently serving as a mount in any existing ride link
     * @param {String} tokenId - The ID of the token to evaluate
     */
    static isaMount(tokenId) {
        let token = findTokenById(tokenId);
        if (token) {
            return token.getFlag(FlagScope, Flags.Riders) != undefined && token.getFlag(FlagScope, Flags.Riders).length > 0;
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
        return (rider.getFlag(FlagScope, Flags.Mount) == mount.id);
    }

    /**
     * Moves the Rider token to Mount token.
     * If both tokens are being moved together, newX and newY must be provided, or rider
     *  will end up at the Mount's starting location
     * @param {Object} riderToken - The rider
     * @param {Object} mountLocation - The mount
     * @param {Number} newX - (optional) The new X-coordinate for the move
     * @param {Number} newY - (optional) The new Y-coordinate for the move
     */
    static async moveRiderToMount(riderToken, mountLocation, newX, newY, newRot) {

        riderToken = findTokenById(riderToken.id);

        await riderToken.setFlag(FlagScope, Flags.MountMove, true);

        const offset = { x: mountLocation.x - riderToken.x, y: mountLocation.y - riderToken.y };

        if (Settings.getRiderRotate()) {
            newRot = newRot !== undefined ? newRot : riderToken.rotation;
        } else {
            newRot = riderToken.rotation;
        }

        await riderToken.update({
            x: newX === undefined ? mountLocation.x - offset.x : newX - offset.x,
            y: newY === undefined ? mountLocation.y - offset.y : newY - offset.y,
            rotation: newRot
        });
    }

    /**
     * Gets the correct rider placement coordinates based on the mount's position and movement
     * @param {token} riderToken - The rider token
     * @param {token} mountToken - The mount token
     */
    static getRiderInitialLocation(riderToken, mountToken) {
        let loc = { x: mountToken.x, y: mountToken.y };

        switch (Settings.getRiderX()) {
            case riderX.Center:
                let mountCenter = mountToken.getCenter(mountToken.x, mountToken.y);
                loc.x = mountCenter.x - (riderToken.w / 2);
                break;
            case riderX.Right:
                loc.x = mountToken.x + mountToken.w - riderToken.w;
                break;
        }

        switch (Settings.getRiderY()) {
            case riderY.Center:
                let mountCenter = mountToken.getCenter(mountToken.x, mountToken.y);
                loc.y = mountCenter.y - (riderToken.h / 2);
                break;
            case riderY.Bottom:
                loc.y = mountToken.y + mountToken.h - riderToken.h;
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
            let parent = findTokenById(child.getFlag(FlagScope, Flags.Mount));
            if (parent.id == ancestorId) return true;
            return this.isAncestor(parent.id, ancestorId);
        }
        return false;
    }
}

