import { AppItemType } from "../application/app";
import { reroute } from "./reroute";

// 对用户的路径进行劫持，劫持后重新调用 rerouter 方法重新计算加载应用
export function navigationEvent(apps: AppItemType[]) {
    function urlRoute() {
        reroute(apps);
    }

    window.removeEventListener("hashchange", urlRoute);
    window.removeEventListener("popstate", urlRoute);

    window.addEventListener("hashchange", urlRoute);
    window.addEventListener("popstate", urlRoute);
}