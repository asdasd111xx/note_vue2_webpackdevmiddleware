/**
 *  Moblie 提供 - APP 內嵌跳轉需求
 */
class AppEvent {
    constructor() {
        this.callbacksCount = 1;
        this.callbacks = {};
    }

    call(message, callback = () => {}) {
        const hasCallback = callback && typeof callback === 'function';
        const callbackId = hasCallback ? (this.callbacksCount + 1) : 0;

        if (hasCallback) {
            this.callbacks[callbackId] = callback;
        }

        let iframe = document.createElement('IFRAME');

        iframe.setAttribute('src', `js-frame: ${encodeURIComponent(JSON.stringify(message))}`);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    }

    resultForCallback(callbackId, resultArray) {
        try {
            const callback = this.callbacks[callbackId];
            if (!callback) {
                return;
            }
            callback(resultArray);
        } catch (e) {
            alert(e);
        }
    }

    iosJsToAppMessage(message) {
        this.call(message);
    }

    static androidJsToAppMessage(message) {
        if (window.MyHandler) {
            window.MyHandler.JsToAppMessage(JSON.stringify(message));
        }
    }

    jsToAppMessage(eventName, data = {}) {
        const device = {
            isiPad: navigator.userAgent.match(/iPad/i) !== null,
            isiPhone: navigator.userAgent.match(/iPhone/i) !== null,
            isandroid: navigator.userAgent.match(/Android/i) !== null
        };

        if (device.isiPad || device.isiPhone) {
            this.iosJsToAppMessage({ event: eventName, data });
        } else if (device.isandroid) {
            AppEvent.androidJsToAppMessage({ event: eventName, data });
        }
    }
}

export default new AppEvent();
