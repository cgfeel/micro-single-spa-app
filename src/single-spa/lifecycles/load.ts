import { AppItemType } from "../application/app";
import { APPLICATION_STATUS } from "../application/app.helpers";

export function toLoadPromise(app: AppItemType) {
    return Promise.resolve().then(() => {
        const { customProps, status, loadApp } = app;
        if (status !== APPLICATION_STATUS.NOT_LOADED) {
            // 此应用已加载完毕了
            return app;
        }

        // 正在加载应用
        app.status = APPLICATION_STATUS.LOADING_SOURCE_CODE;
        return loadApp(customProps).then(({ bootstrap, mount, unmount }) => {
            // 将加载的信息更新到 app 并返回
            app.status = APPLICATION_STATUS.NOT_BOOTSTRAPED;
            app.bootstrap = bootstrap;
            app.mount = mount;
            app.unmount = unmount;

            return app;
        });
    });
}