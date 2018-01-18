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
                //platformInstance = new Stripe();
                break;
            default: return null;
        }
        return platformInstance;
    }
}
PlatformFactory.platforms = {};
PlatformFactory.PAYPAL = 'PAYPAL';
PlatformFactory.STRIPE = 'STRIPE';

module.exports = PlatformFactory;
