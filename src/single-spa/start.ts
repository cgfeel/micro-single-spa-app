import { apps } from "./application/app";
import { reroute } from "./navigation/reroute";

export const mount = { start: false };
export function start() {
    mount.start = true;
    reroute(apps);
}