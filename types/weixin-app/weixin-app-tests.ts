getCurrentPages();

interface MyOwnEvent
    extends wx.CustomEvent<
        "my-own",
        {
            hello: string;
        }
    > {}

const parentBehavior = Behavior({
    behaviors: ["wx://form-field"],
    properties: {
        myParentBehaviorProperty: {
            type: String
        }
    },
    data: {
        myParentBehaviorData: ""
    },
    methods: {
        myParentBehaviorMethod(input: number) {
            const s: string = this.data.myParentBehaviorData;
        }
    }
});

function createBehaviorWithUnionTypes(n: number) {
    const properties =
        n % 2 < 1
            ? {
                    unionPropA: {
                        type: String
                    }
              }
            : {
                    unionPropB: {
                        type: Number
                    }
              };

    const data =
        n % 4 < 2
            ? {
                    unionDataA: "a"
              }
            : {
                    unionDataB: 1
              };

    const methods =
        n % 8 < 4
            ? {
                    unionMethodA(a: number) {
                        return n + 1;
                    }
              }
            : {
                    unionMethodB(a: string) {
                        return { value: a };
                    }
              };

    return Behavior({
        properties,
        data,
        methods
    });
}

const behavior = Behavior({
    behaviors: [
        createBehaviorWithUnionTypes(1),
        parentBehavior,
        "wx://form-field"
    ],
    properties: {
        myBehaviorProperty: {
            type: String
        }
    },
    data: {
        myBehaviorData: ""
    },
    attached() {},
    methods: {
        myBehaviorMethod(input: number) {
            const s: string = this.data.myBehaviorData;
        }
    }
});

Component({
    behaviors: [behavior, "wx://form-field"],

    options: {
        multipleSlots: false,
        addGlobalClass: false
    },

    properties: {
        myProperty: {
            // ?????????
            type: String, // ???????????????????????????????????????????????????String, Number, Boolean, Object, Array, null????????????????????????
            value: "", // ???????????????????????????????????????????????????????????????????????????
            observer(newVal: string, oldVal: string, changedPath: string) {
                const anotherKey = newVal + changedPath;
                this.setData({
                    anotherKey
                });
            } // ??????????????????????????????????????????????????????????????????methods?????????????????????????????????, ??????'_propertyChange'
        },
        myProperty2: String // ?????????????????????
    },
    data: {
        key: "value",
        anotherKey: "value"
    }, // ????????????????????????????????????

    lifetimes: {
        attached() {
            wx.setEnableDebug({
                enableDebug: true,
                success(res) {}
            });

            wx.reportMonitor("123", 123);

            wx.getLogManager().info("123");
            wx.getLogManager().log("123");
            wx.getLogManager().warn("123");
            wx.getLogManager().debug("123");

            this.createIntersectionObserver({}).observe("123", res => {
                res.id;
            });
        },

        detached() {
            this.setData(
                {
                    key: null
                },
                () => {}
            );
        }
    },

    pageLifetimes: {
        show() {},
        hide() {}
    },

    // ???????????????????????????????????????????????????methods????????????????????????
    attached() {
        this.setData(
            {
                key: "123"
            },
            () => {}
        );
    },

    moved() {},

    detached() {},

    methods: {
        testBehaviors() {
            console.log(this.data.myBehaviorData);
            console.log(this.data.myBehaviorProperty);
            this.myBehaviorMethod(123);
            console.log(this.data.myParentBehaviorData);
            console.log(this.data.myParentBehaviorProperty);
            this.myParentBehaviorMethod(456);
            if (this.unionMethodA) {
                console.log(this.unionMethodA(5));
            }
            if (this.unionMethodB) {
                console.log(this.unionMethodB("test").value);
            }
            console.log(this.data.unionDataA);
            console.log(this.data.unionDataB);
            console.log(this.data.unionPropA);
            console.log(this.data.unionPropB);
            console.log(this.properties.unionDataA);
            console.log(this.properties.unionDataB);
            console.log(this.properties.unionPropA);
            console.log(this.properties.unionPropB);
        },
        readMyDataAndMyProps() {
            const stringValue1: string = this.data.myProperty;
            const stringValue2: string = this.data.myProperty2;
            const stringValue3: string = this.data.key;
            this.data.anotherKey;
            this.properties.myProperty;
            this.properties.myProperty2;
            this.properties.key;
            this.properties.anotherKey;
            this.setData({
                key: stringValue1 + stringValue2 + stringValue3
            });
        },
        onMyButtonTap() {
            // ??????????????????????????????????????????????????????????????????
            this.setData({
                key: 123 // note this is edge case where it cannot detect wrong types...
            });
        },
        _myPrivateMethod() {
            // ????????????????????????????????????
            // this.replaceDataOnPath(['A', 0, 'B'], 'myPrivateData'); // ????????? data.A[0].B ?????? 'myPrivateData'
            // this.applyDataUpdates();
            this.setData({
                anotherKey: 123
            });
        },
        _propertyChange(newVal: string, oldVal: string) {
            //
        }
    },
    relations: {
        "./custom-ul": {
            type: "parent", // ????????????????????????????????????
            linked(target: wx.Component<{ key: string }, {}>) {
                // ??????????????????custom-ul????????????target???custom-ul??????????????????????????????attached??????????????????
                target.data.key;
            },
            linkChanged(target: wx.Component<{ key: string }, {}>) {
                // ???????????????????????????target???custom-ul??????????????????????????????moved??????????????????
                target.data.key;
            },
            unlinked(target: wx.Component<{ key: string }, {}>) {
                // ???????????????????????????target???custom-ul??????????????????????????????detached??????????????????
                target.data.key;
            }
        }
    }
});

// index.js
Page({
    data: {
        text: "This is page data."
    },
    onLoad() {
        // Do some initialize when page load.
        this.setData({}, () => {
            // callback
        });
    },
    onReady: () => {
        // Do something when page ready.
    },
    onShow: () => {
        // Do something when page show.
    },
    onHide: () => {
        // Do something when page hide.
    },
    onUnload: () => {
        // Do something when page close.
    },
    onPullDownRefresh: () => {
        // Do something when pull down.
    },
    onReachBottom: () => {
        // Do something when page reach bottom.
    },
    onShareAppMessage: res => {
        if (res && res.from === "menu") {
            //
        }
        // return custom share data when user share.
        return {
            success(res) {
                console.log(res.shareTickets.length);
            }
        };
    },
    onPageScroll() {
        wx.createIntersectionObserver(this, {})
            .relativeToViewport()
            .observe("div", res => {
                console.log(res.id);
                console.log(res.dataset);
                console.log(res.intersectionRatio);
                console.log(res.intersectionRect.left);
                console.log(res.intersectionRect.top);
                console.log(res.intersectionRect.width);
                console.log(res.intersectionRect.height);
            })
            .disconnect();
    },
    onTabItemTap(item: any) {
        this.setData({
            1: null,
            _2: "undefined"
        });
        console.log(item.index);
        console.log(item.pagePath);
        console.log(item.text);
    },
    // Event handler.
    viewTap() {
        this.setData(
            {
                text: "Set some data for updating view."
            },
            () => {
                // this is setData callback
            }
        );
    },
    customData: {
        hi: "MINA"
    },
    onMyOwnEvent(e: MyOwnEvent) {
        e.detail.hello;
    },
    onTouchStart(e: wx.TouchStartEvent) {
        e.touches;
        e.detail.x;
        e.detail.y;
    },
    onTouchEnd(e: wx.TouchEndEvent) {
        e.touches;
        e.detail.x;
        e.detail.y;
    },
    onTouchCancel(e: wx.TouchCancelEvent) {
        e.touches;
        e.detail.x;
        e.detail.y;
    },
    onTouchMove(e: wx.TouchMoveEvent) {
        e.touches;
        e.detail.x;
        e.detail.y;
    }
});

Page({
    getScrollOffset: () => {
        wx.createSelectorQuery()
            .selectViewport()
            .scrollOffset(res => {
                res.id; // ?????????ID
                res.dataset; // ?????????dataset
                res.scrollLeft; // ???????????????????????????
                res.scrollTop; // ???????????????????????????
            })
            .exec();
    }
});

Page({
    getFields: () => {
        wx.createSelectorQuery()
            .select("#the-id")
            .fields(
                {
                    id: true,
                    dataset: true,
                    size: true,
                    scrollOffset: true,
                    properties: ["scrollX", "scrollY"]
                },
                res => {
                    // res.
                    res.dataset; // ?????????dataset
                    res.width; // ???????????????
                    res.height; // ???????????????
                    res.scrollLeft; // ???????????????????????????
                    res.scrollTop; // ???????????????????????????
                    res.scrollX; // ?????? scroll-x ??????????????????
                    res.scrollY; // ?????? scroll-x ??????????????????
                }
            )
            .exec();
    }
});

Page({
    getRect: () => {
        wx.createSelectorQuery()
            .select("#the-id")
            .boundingClientRect((rect: wx.NodesRefRect) => {
                rect.id; // ?????????ID
                rect.dataset; // ?????????dataset
                rect.left; // ????????????????????????
                rect.right; // ????????????????????????
                rect.top; // ????????????????????????
                rect.bottom; // ????????????????????????
                rect.width; // ???????????????
                rect.height; // ???????????????
            })
            .exec();
    },
    getAllRects: () => {
        wx.createSelectorQuery()
            .selectAll(".a-class")
            .boundingClientRect((rects: wx.NodesRefRect[]) => {
                rects.forEach(rect => {
                    rect.id; // ?????????ID
                    rect.dataset; // ?????????dataset
                    rect.left; // ????????????????????????
                    rect.right; // ????????????????????????
                    rect.top; // ????????????????????????
                    rect.bottom; // ????????????????????????
                    rect.width; // ???????????????
                    rect.height; // ???????????????
                });
            })
            .exec();
    }
});

const recorderManager = wx.getRecorderManager();

recorderManager.onStart(() => {
    console.log("recorder start");
});
recorderManager.onResume(() => {
    console.log("recorder resume");
});
recorderManager.onPause(() => {
    console.log("recorder pause");
});
recorderManager.onStop(res => {
    console.log("recorder stop", res);
    const { tempFilePath } = res;
});
recorderManager.onFrameRecorded(res => {
    const { frameBuffer } = res;
    console.log("frameBuffer.byteLength", frameBuffer.byteLength);
});

const options = {
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 192000,
    format: "aac",
    frameSize: 50
};

recorderManager.start(options);

wx.onGetWifiList(res => {
    if (res.wifiList.length) {
        wx.setWifiList({
            wifiList: [
                {
                    SSID: res.wifiList[0].SSID,
                    BSSID: res.wifiList[0].BSSID,
                    password: "123456"
                }
            ]
        });
    } else {
        wx.setWifiList({
            wifiList: []
        });
    }
});
wx.getWifiList();

wx.onWifiConnected(wifi => {
    // wifi.BSSID
});

wx.getConnectedWifi({
    success(result) {
        result.signalStrength;
    }
});

wx.getWeRunData({
    success(res) {
        const encryptedData = res.encryptedData;
    }
});

const uploadTask = wx.uploadFile({
    url: "http://example.weixin.qq.com/upload", // ???????????????????????????????????????
    filePath: "/local/folder/file.ext",
    name: "file",
    formData: {
        user: "test"
    },
    success: res => {
        const data = res.data;
        // do something
    }
});

uploadTask.onProgressUpdate(res => {
    console.log("????????????", res.progress);
    console.log("???????????????????????????", res.totalBytesSent);
    console.log("????????????????????????????????????", res.totalBytesExpectedToSend);
});

uploadTask.abort(); // ??????????????????

const downloadTask = wx.downloadFile({
    url: "http://example.com/audio/123", // ????????????????????????????????????
    success: res => {
        wx.playVoice({
            filePath: res.tempFilePath
        });
    }
});

downloadTask.onProgressUpdate(res => {
    console.log("????????????", res.progress);
    console.log("???????????????????????????", res.totalBytesWritten);
    console.log("????????????????????????????????????", res.totalBytesExpectedToWrite);
});

downloadTask.abort(); // ??????????????????

wx.request({
    url: "https://www.baidu.com",
    method: "GET",
    success(res) {
        if (res.statusCode < 300) {
            console.log(res.data);
        } else {
            console.warn(res.statusCode, res.header);
        }
    },
    fail(e) {
        console.error(e);
    }
}).abort();

wx.getSystemInfo({
    success(res) {
        const {
            brand,
            pixelRatio,
            platform,
            windowHeight,
            windowWidth,
            screenHeight,
            screenWidth,
            statusBarHeight,
            SDKVersion,
            language,
            model,
            version,
            fontSizeSetting,
            system
        } = res;
    }
});

function testAccountInfo(): string {
    const accountInfo: wx.AccountInfo = wx.getAccountInfoSync();
    return accountInfo.miniProgram.appId;
}

wx.reportAnalytics("test-event", { a: 1, b: "2" });

App({
    onLaunch() {
        const manager: wx.UpdateManager = wx.getUpdateManager();
        manager.onCheckForUpdate(({ hasUpdate }) => {
            console.info({ hasUpdate });
        });
        manager.onUpdateReady(() => {
            manager.applyUpdate();
        });
        manager.onUpdateFailed(({ errMsg }) => {
            console.warn("update failed", errMsg);
        });
    }
});

Component({
    observers: {
        "name, age": function nameAgeObserver(name: string, age: number) {
            this.setData({
                nameStr: `Dear ${name}`,
                ageStr: `${age}`
            });
        }
    },
    properties: {
        name: {
            type: String
        },
        age: {
            type: Number
        }
    },
    data: {
        nameStr: "",
        ageStr: ""
    }
});

wx.loadFontFace({
    family: "Bitstream Vera Serif Bold",
    source: 'url("https://sungd.github.io/Pacifico.ttf")',
    success(res) {
        console.log(res.status);
    },
    fail(res) {
        console.log(res.status);
    },
    complete(res) {
        console.log(res.status);
    }
});
