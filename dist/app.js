"use strict";
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
let mainWindow;
let addQuestionWindow;
let getQuestionWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });
    mainWindow.loadFile(__dirname + "/pages/index.html");
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on("closed", () => {
        app.quit();
    });
};
const createAddQuestion = () => {
    addQuestionWindow = new BrowserWindow({
        width: 500,
        height: 270,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });
    addQuestionWindow.loadFile(__dirname + "/pages/addQuestion.html");
    const questionMenu = Menu.buildFromTemplate(questionMenuTemplate);
    Menu.setApplicationMenu(questionMenu);
    addQuestionWindow.on("close", () => (addQuestionWindow = null));
};
const createGetQuestion = () => {
    getQuestionWindow = new BrowserWindow({
        width: 500,
        height: 270,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });
    getQuestionWindow.loadFile(__dirname + "/pages/getQuestion.html");
    const questionMenu = Menu.buildFromTemplate(questionMenuTemplate);
    Menu.setApplicationMenu(questionMenu);
    getQuestionWindow.on("close", () => (getQuestionWindow = null));
};
ipcMain.on("question:add", (e, question) => {
    mainWindow.webContents.send("question:add", question);
    addQuestionWindow.close();
});
ipcMain.on("question:get", (e, question) => {
    if (getQuestionWindow === null || getQuestionWindow === undefined)
        createGetQuestion();
    if (getQuestionWindow) {
        getQuestionWindow.reload();
        getQuestionWindow.webContents.once("dom-ready", () => getQuestionWindow === null || getQuestionWindow === void 0 ? void 0 : getQuestionWindow.webContents.send("question:get", question));
        getQuestionWindow.focus();
    }
});
const mainMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Add Question",
                click() {
                    createAddQuestion();
                },
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                },
            },
        ],
    },
];
const questionMenuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                },
            },
        ],
    },
];
if (process.env.platform === "darwin")
    mainMenuTemplate.unshift({ label: "", submenu: [] });
questionMenuTemplate.unshift({ label: "", submenu: [] });
if (process.env.NODE_ENV !== "production") {
    const devToolsTemplate = {
        label: "Dev Tools",
        submenu: [
            {
                label: "Toggle DevTools",
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                },
            },
            {
                role: "reload",
            },
        ],
    };
    mainMenuTemplate.push(devToolsTemplate);
    questionMenuTemplate.push(devToolsTemplate);
}
app.on("ready", createWindow);
