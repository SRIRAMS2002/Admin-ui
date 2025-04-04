import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import {
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  defaultPromotionConditions,
  defaultOrderProcess,
  dummyPaymentHandler,
} from '@vendure/core';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';

import { EmailPlugin, defaultEmailHandlers } from '@vendure/email-plugin';
import 'dotenv/config';
import { orderCanceledNotificationProcess } from './customOrderProcess/order-canceled-notification-process';
import { productDeliveredNotificationProcess } from './customOrderProcess/product-delivered-notification-process';
import { CancelOrderPlugin } from './plugins/cancelOrderPlugin';
import { CheckUniquePhonePlugin } from './plugins/checkUniquePhonePlugin';
import { CustomEventPlugin } from './plugins/customEventPlugin';
import { CustomTokenPlugin } from './plugins/customTokenPlugin';
import { CollectionIsPrivatePlugin } from './plugins/collectionIsPrivate';
import { PromotionPlugin } from './plugins/promotionPlugin';
import { shouldApplyCouponcode } from './customPromotionConditions/shouldApply';
import { ChannelPlugin } from './plugins/channelPlugin';

import * as path from 'path';
import { ManualCustomerChannelPlugin } from './plugins/manualadmincustomerchannel/manualadmincustomerchannel.plugin';
import { BannerPlugin } from './plugins/banner/banner.plugin';

const IS_PROD = path.basename(__dirname) === 'dist';

const IS_DEV = process.env.APP_ENV === 'dev';

export const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    ...(IS_DEV
      ? {
        adminApiPlayground: {
          settings: { 'request.credentials': 'include' } as any,
        },
        adminApiDebug: true,
        shopApiPlayground: {
          settings: { 'request.credentials': 'include' } as any,
        },
        shopApiDebug: true,
      }
      : {}),
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
    requireVerification: false,
  },
  dbConnectionOptions: {
    type: 'mysql',
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
    logging: false,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {},
  promotionOptions: {
    promotionConditions: [...defaultPromotionConditions, shouldApplyCouponcode],
  },
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets',
    }),
    // DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),

    BullMQJobQueuePlugin.init({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,  
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
      },
      setRetries: (queueName, job) => {
        if (queueName === 'send-email') {
          return 10; 
        }
        return job.retries ?? 3;
      },
      setBackoff: () => {
        return {
          type: 'exponential',
          delay: 10000,
        };
      },
      workerOptions: {
        removeOnComplete: {
          age: 60 * 60 * 24 * 7 ,
          count: 5000,
        },
        removeOnFail: {
          age: 60 * 60 * 24 * 7,
          count: 1000,
        },
      },
    }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: 'http://localhost:8080/verify',
        passwordResetUrl: 'http://localhost:8080/password-reset',
        changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change',
      },
    }),
    ChannelPlugin,
    CheckUniquePhonePlugin,
    PromotionPlugin,
    CancelOrderPlugin,
    CustomEventPlugin,
    CustomTokenPlugin,
    CollectionIsPrivatePlugin,
    ManualCustomerChannelPlugin,
    BannerPlugin,

    AdminUiPlugin.init({
      port: 3002,
      app: {
        path: path.join(__dirname, '../admin-ui/dist'),
      },
      route: 'admin'
    }),


  ],
  orderOptions: {
    process: [defaultOrderProcess, productDeliveredNotificationProcess, orderCanceledNotificationProcess],
  },
};
