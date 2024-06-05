import { registerApplication, start } from "./single-spa";
import { ApplicationType } from "./single-spa/application/app";

function createElement(id: string) {
    if (!document.getElementById(id)) {
        const app = document.createElement("div");
        app.id = id;
        
        document.body.appendChild(app);
    }
}

function updateElement(id: string, html: string) {
    const app = document.getElementById(id);
    if (app) {
        app.innerHTML = html;
    }
}

const app0: ApplicationType = {
    bootstrap: async ({ _name }) => createElement(_name),
    mount: async ({ _name }) => updateElement(_name, `<div>
        <a onclick="window.history.pushState({}, null, '/')">app1</a> |
        <a onclick="window.history.pushState({}, null, '/app2')">app2</a> |
        <a href="#/app3">+app3</a> |
        <a href="#/app4">+app14</a>
    </div>`),
    unmount: async ({ _name }) => updateElement(_name, "")
};

const app1: ApplicationType = {
    bootstrap: [
        async (props) => console.log("app1 bootstrap1", props),
        async ({ _name }) => {
            console.log("app1 bootstrap2");
            createElement(_name);
        },
    ],
    // mount 也可以挂载数组，通常为一个异步函数
    // 在 single-spa 中是通过 `System.import<LifeCycles>("")` 返回一个 `promise`
    mount: [
        async (props) => {
            // new Vue().$mount()...
            console.log("app1 mount1", props);
        },
        async (props) => updateElement(props._name, `<h1>APP1-props: ${props.a}</h1>`),
    ],
    async unmount({ _name }) {
        console.log("app1 unmount");
        updateElement(_name, "");
    }
};

const app2: ApplicationType = {
    bootstrap: async (props) => {
        console.log("app2 bootstrap1", props);
        createElement(props._name);
    },
    async mount(props) {
        console.log("app2 mount1");
        updateElement(props._name, `<h1>APP2-props: ${props.a}</h1>`);
    },
    async unmount({ _name }) {
        console.log("app2 unmount");
        updateElement(_name, "");
    }
};

const app3: ApplicationType = {
    bootstrap: async (props) => {
        console.log("app3 bootstrap1", props);
        createElement(props._name);
    },
    async mount(props) {
        console.log("app3 mount1");
        updateElement(props._name, `<h1>APP3-props: ${props.a}</h1>`);
    },
    async unmount({ _name }) {
        console.log("app3 unmount");
        updateElement(_name, "");
    }
};

const app4: ApplicationType = {
    bootstrap: async (props) => {
        console.log("app4 bootstrap1", props);
        createElement(props._name);
    },
    async mount(props) {
        console.log("app4 mount1");
        updateElement(props._name, `<h1>APP4-props: ${props.a}</h1>`);
    },
    async unmount({ _name }) {
        console.log("app4 unmount");
        updateElement(_name, "");
    }
};

// 当路径是 #/app1 的时候加载应用 app1 
// 所有注册的应用，就是看一下路径是否匹配，如果匹配则加载对应的应用
registerApplication("app0", async () => app0, location => location.pathname.startsWith("/"), { a: 1 });
registerApplication("app1", async () => app1, location => location.pathname === "/", { a: 1 });
registerApplication("app2", async () => app2, location => location.pathname.startsWith("/app2"), { a: 2 });
registerApplication("app3", async () => app3, location => location.hash.startsWith("#/app3"), { a: 3 });
registerApplication("app4", async () => app4, location => location.hash.startsWith("#/app4"), { a: 4 });

// 开启路径的监控，路径切换的时候可以调用对应的：mount、unmount
start();