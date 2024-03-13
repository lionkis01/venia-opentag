Documentation for Magento PWA Studio packages is located at https://developer.adobe.com/commerce/pwa-studio/.

Steps to install venia locally:

1. Clone this repository
2. cd venia-opentag
3. yarn 
4. Rename .env.sample -> .env 
5. Configure .env file 
6. yarn run buildpack create-custom-origin .
7. yarn watch

What do we need at magento side:

composer require magento/pwa
