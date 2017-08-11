// modified from https://github.com/georapbox/angular-PubSub/blob/master/src/angular-pubsub.js

module Shared {
    export interface IPubSubServiceBase {
        subscribe(callbackId: string, callback: any, once?: boolean): number;
        subscribeOnce(callbackId: string, callback: any): number;
        publish(callbackId: string, params: any): void;
        unsubscribe(token): void;
    }

    export interface IPubSubTopic {
        token: number;
        callback: any;
        once: boolean;
    }

    export class PubSubServiceBase implements IPubSubServiceBase {

        private topics: { [index: string]: IPubSubTopic[] } = {};
        private subUid: number = -1;

        constructor(private $timeout: ng.ITimeoutService) {
        }

        public subscribe(callbackId: string, callback: any, once?: boolean): number {
            var token = this.subUid += 1;

            if (!this.topics[callbackId]) {
                this.topics[callbackId] = [];
            }

            var obj: IPubSubTopic = {
                token: token,
                callback: callback,
                once: !!once
            }

            this.topics[callbackId].push(obj);

            return token;
        }

        public subscribeOnce(callbackId: string, callback: any): number {
            return this.subscribe(callbackId, callback, true);
        }

        public publish(callbackId: string, params: any): void {
            if (!this.topics[callbackId])
                return;

            this.$timeout(() => {
                var subscribers: IPubSubTopic[] = this.topics[callbackId];
                var len = subscribers ? subscribers.length : 0;

                while (len) {
                    len -= 1;
                    subscribers[len].callback(callbackId, params);

                    if (subscribers[len].once) {
                        this.unsubscribe(subscribers[len].token);
                    }
                }
            });
        }

        public unsubscribe(token): void {
            for (var prop in this.topics) {
                if (this.topics.hasOwnProperty(prop) && this.topics[prop]) {
                    var len = this.topics[prop].length;

                    while (len) {
                        len -= 1;
                        this.topics[prop].splice(len, 1);
                    }
                }
            }
        }

        protected hasTopic(callbackId: string): boolean {
            return !!this.topics[callbackId];
        }
    }
}