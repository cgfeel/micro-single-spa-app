import { registerApplication, start } from "./single-spa";
import { ApplicationType } from "./single-spa/application/app";

const app1: ApplicationType = {
    bootstrap: [
        async (props) => console.log("app1 bootstrap1", props),
        async () => console.log("app1 bootstrap2"),
    ],
    // mount 也可以挂载数组，通常为一个异步函数
    // 在 single-spa 中是通过 `System.import<LifeCycles>("")` 返回一个 `promise`
    mount: [
        async () => {
            // new Vue().$mount()...
            console.log("app1 mount1");
        },
        async (props) => {
            // app_1.innerHTML = `<h1>APP1-props: ${props.a}</h1>`;
        }
    ],
    async unmount() {
        console.log("app1 unmount");
        // app_1.innerHTML = "";
    }
};

const app2: ApplicationType = {
    bootstrap: async (props) => console.log("app2 bootstrap1", props),
    async mount(props) {
        console.log("app2 mount1");
        // app_2.innerHTML = `<h1>APP2-props: ${props.a}</h1>`;
    },
    async unmount() {
        console.log("app2 unmount");
        // app_2.innerHTML = "";
    }
};

// 当路径是 #/app1 的时候加载应用 app1 
// 所有注册的应用，就是看一下路径是否匹配，如果匹配则加载对应的应用
registerApplication("app1", async () => app1, location => location.hash.startsWith("#/app1"), { a: 1 });
registerApplication("app2", async () => app2, location => location.hash.startsWith("#/app2"), { a: 2 });

// 开启路径的监控，路径切换的时候可以调用对应的：mount、unmount、