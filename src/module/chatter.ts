import { Settings } from "./settings.js";
import { findTokenById } from "./utils.js";

/**
 * Provides functionality for sending chat messages
 */
export class Chatter {

    /**
     * Attempts to display a chat message notifying about a mount action
     * @param {String} riderId - The ID of the rider
     * @param {String} mountId - The ID of the mount
     */
    static mountMessage(riderId, mountId) {
        if (Settings.getShouldChat()) {
            let icon = `<span class="fa-stack"><i class="fas ${Settings.getIconClass()} fa-stack-1x"></i></span>&nbsp;`;
            this.sendChatMessage(icon + Settings.getMountMessage(), riderId, mountId);
        }
    }

    /**
     * Attempts to display a chat message notifying about a dismount action
     * @param {String} riderId - The ID of the rider
     * @param {String} mountId - The ID of the mount
     */
    static dismountMessage(riderId, mountId) {
        if (Settings.getShouldChat()) {
            let icon = `<span class="fa-stack" >
                            <i class="fas ${Settings.getIconClass()} fa-stack-1x"></i>
                            <i class="fas fa-slash fa-stack-1x" style="color: tomato"></i>
                        </span>&nbsp;`;
            this.sendChatMessage(icon + Settings.getDismountMessage(), riderId, mountId);
        }
    }

    /**
     * Sends a preformatted message to the chat log
     * @param {string} message - The message to be sent
     * @param {string} riderId - The ID of the rider token
     * @param {string} mountId - The ID of the mount token
     */
    static sendChatMessage(message, riderId, mountId) {
        let rider = findTokenById(riderId);
        let mount = findTokenById(mountId);

        message = message.replace("{mount}", mount.data.name).replace("{rider}", rider.data.name);

        ChatMessage.create({
            content: message
        });
    }
}