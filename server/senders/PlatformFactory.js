const PaypalPlatform = require('./Paypal');
const secrets = require('../../secrets');
class PlatformFactory {
    static getPlatform(platform) {
        if (!this.platforms[platform]) {
            this.platforms[platform] = this.initPlatform(platform);
        }
        return this.platforms[platform];
    }

    static initPlatform (platform) {
        let platformInstance;
        switch(platform) {
            case this.PAYPAL:
                platformInstance = new PaypalPlatform(secrets.paypal);
                break;
            case this.STRIPE:
                platformInstance = new Stripe();
                break;
            default: throw new Error('Platform does not exist');
        }
        return platformInstance;
    }
}
PlatformFactory.platforms = {};
PlatformFactory.PAYPAL = 'PAYPAL';
PlatformFactory.STRIPE = 'STRIPE';
