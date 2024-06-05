import { AppItemType } from "../application/app";
import { APPLICATION_STATUS } from "../application/app.helpers";

export function toBootstrapPromise(app: AppItemType) {
    return Promise.resolve().then(() => {
        const { customProps, status, bootstrap } = app;
        if (status !== APPLICATION_STATUS.NOT_BOOTSTRAPED || !bootstrap) {
            // 此应用已加载完毕
            return app;
        }
        app.status = APPLICATION_STATUS.BOOTSTRAPING;
        return bootstrap(customProps).then(() => {
            app.status = APPLICATION_STATUS.NOT_MOUNTED;
            return app;
        });
    });
}