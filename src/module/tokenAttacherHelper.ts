
//@ts-ignore
// import { tokenAttacher } from '../../token-attacher/scripts/token-attacher.js';

export const mountUp = async function(token, target){
	let targets = [target]; // Array.from(game.user.targets);
	if(targets.length > 0){
		if(targets.length > 1) return ui.notifications.error("Can't mount more then one token!");
		let mount = targets[0];
		let newCoords = {x:token.x, y:token.y};
		if(mount.x+mount.w-token.w < token.x) newCoords.x = mount.x+mount.w-token.w;
		else if(mount.x > token.x) newCoords.x = mount.x;

		if(mount.y+mount.h-token.h < token.y) newCoords.y = mount.y+mount.h-token.h;
		else if(mount.y > token.y) newCoords.y = mount.y;
		await token.update({x: newCoords.x, y: newCoords.y});
		ui['chat'].processMessage(`I mount this ${targets[0].name}`);
		// await tokenAttacher.attachElementToToken(token, targets[0], true);
		// await tokenAttacher.setElementsLockStatus(token, false, true);
		await window['tokenAttacher'].attachElementToToken(token, targets[0], true);
		await window['tokenAttacher'].setElementsLockStatus(token, false, true);	
	}
}

export const dismountDropAll = async function(token){
	// tokenAttacher.detachAllElementsFromToken(token, true);
	await window['tokenAttacher'].detachAllElementsFromToken(token, true);
	ui['chat'].processMessage(`Everyone and everything get off!`);			
}

export const dismountDropTarget = async function(token, target){
	let targets = [target]; // Array.from(game.user.targets);
	if(targets.length > 0){
		if(targets.length > 1) return ui.notifications.error("Can't follow more then one token!");
		//await tokenAttacher.detachElementsFromToken(targets, token, true);
		await window['tokenAttacher'].detachElementsFromToken(targets, token, true);
		//dismountDropAll(token);
		for (let i = 0; i < targets.length; i++) {
			const targ = targets[i];
			ui['chat'].processMessage(`Get off ${targ.name}!`);
        }
	}				
}