import { log, debug, error, debugEnabled } from "../foundryvtt-mountup";
import { MODULE_NAME } from './settings';
let modules = {
              "lib-wrapper": "0.0.0",
            };
export let installedModules = new Map();

export let setupModules = () => {
  for (let name of Object.keys(modules)) {
    const modVer = game.modules.get(name)?.data.version || "0.0.0";
    const neededVer = modules[name];
    const isValidVersion = isNewerVersion(modVer, neededVer) || !isNewerVersion(neededVer, modVer) ;
    installedModules.set(name, game.modules.get(name)?.active && isValidVersion)
    if (!installedModules.get(name)) {
      if (game.modules.get(name)?.active)
        error(`${MODULE_NAME} requires ${name} to be of version ${modules[name]} or later, but it is version ${game.modules.get(name).data.version}`);
      else console.warn(`module ${name} not active - some features disabled`)
    }
  }
  if (debugEnabled > 0)
    for (let module of installedModules.keys()) log(`module ${module} has valid version ${installedModules.get(module)}`)
}
