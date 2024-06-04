import { reroute } from "../navigation/reroute";
import { APPLICATION_STATUS } from "./app.helpers";

const apps: AppItemType[] = [];

export function registerApplication(
    appName: string, loadApp: LoadAppType, activeWhen: ActiveWhenType, customProps?: CustomPropsType) {
        const registeration = {
            name: appName,
            status: APPLICATION_STATUS.NOT_LOADED,
            customProps,
            activeWhen,
            loadApp,
        };
        apps.push(registeration);
        // console.log(apps);

        // 我们需要给每个应用添加对应的状态变化

        // 未加载 - 加载 - 挂载 - 卸载

        // 需要检查哪些应用要被加载，还有哪些应用要被移除，还有哪些应用要被挂载
        reroute(apps);
    }

export interface ApplicationType {
    bootstrap: MountType|MountType[];
    mount: MountType|MountType[];
    unmount: MountType|MountType[];
};

export type AppItemType = Partial<ApplicationType> & {
    name: string;
    status: APPLICATION_STATUS;
    activeWhen: ActiveWhenType;
    loadApp: LoadAppType;
    customProps?: CustomPropsType;
};

type ActiveWhenType = (location: Location) => boolean;
type CustomPropsType = Record<PropertyKey, any>;
type LoadAppType = (props?: CustomPropsType) => Promise<ApplicationType>;
type MountType = (props?: CustomPropsType) => Promise<void>;