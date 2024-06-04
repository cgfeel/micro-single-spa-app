import { AppItemType } from "../application/app";
import { getAppChanges } from "../application/app.helpers";
import { toLoadPromise } from "../lifecycles/load";

// 后续路径变化也将在这里重新计算，哪些应用被加载、哪些挂载、哪些卸载
export function reroute(apps: AppItemType[]) {
    // 获取 app 对应的状态进行分类
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges(apps);

    // 加载完毕后，需要去挂载应用
    return () => {
        return Promise.all(appsToLoad.map(app => toLoadPromise(app)));
    };
}