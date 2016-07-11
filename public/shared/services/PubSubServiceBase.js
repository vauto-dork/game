// modified from https://github.com/georapbox/angular-PubSub/blob/master/src/angular-pubsub.js
var Shared;
(function (Shared) {
    var PubSubServiceBase = (function () {
        function PubSubServiceBase($timeout) {
            this.$timeout = $timeout;
            this.topics = {};
            this.subUid = -1;
        }
        PubSubServiceBase.prototype.subscribe = function (callbackId, callback, once) {
            var token = this.subUid += 1;
            if (!this.topics[callbackId]) {
                this.topics[callbackId] = [];
            }
            var obj = {
                token: token,
                callback: callback,
                once: !!once
            };
            this.topics[callbackId].push(obj);
            return token;
        };
        PubSubServiceBase.prototype.subscribeOnce = function (callbackId, callback) {
            return this.subscribe(callbackId, callback, true);
        };
        PubSubServiceBase.prototype.publish = function (callbackId, params) {
            var _this = this;
            if (!this.topics[callbackId])
                return;
            this.$timeout(function () {
                var subscribers = _this.topics[callbackId];
                var len = subscribers ? subscribers.length : 0;
                while (len) {
                    len -= 1;
                    subscribers[len].callback(callbackId, params);
                    if (subscribers[len].once) {
                        _this.unsubscribe(subscribers[len].token);
                    }
                }
            });
        };
        PubSubServiceBase.prototype.unsubscribe = function (token) {
            for (var prop in this.topics) {
                if (this.topics.hasOwnProperty(prop) && this.topics[prop]) {
                    var len = this.topics[prop].length;
                    while (len) {
                        len -= 1;
                        this.topics[prop].splice(len, 1);
                    }
                }
            }
        };
        PubSubServiceBase.prototype.hasTopic = function (callbackId) {
            return !!this.topics[callbackId];
        };
        return PubSubServiceBase;
    }());
    Shared.PubSubServiceBase = PubSubServiceBase;
})(Shared || (Shared = {}));
//# sourceMappingURL=PubSubServiceBase.js.map