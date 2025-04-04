"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualCustomerChannelPlugin = void 0;
const core_1 = require("@vendure/core");
const path = __importStar(require("path"));
const channel_assignment_resolver_1 = require("./resolvers/channel-assignment.resolver");
const customer_channel_service_1 = require("./services/customer-channel.service");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
let ManualCustomerChannelPlugin = class ManualCustomerChannelPlugin {
};
exports.ManualCustomerChannelPlugin = ManualCustomerChannelPlugin;
ManualCustomerChannelPlugin.ui = {
    id: 'manual-customer-channel-ui',
    extensionPath: path.join(__dirname, 'ui'),
    routes: [{ route: 'manual-customer-channel', filePath: 'routes.ts' }],
    providers: ['providers.ts'],
};
exports.ManualCustomerChannelPlugin = ManualCustomerChannelPlugin = __decorate([
    (0, core_1.VendurePlugin)({
        imports: [core_1.PluginCommonModule],
        compatibility: "3.0.5",
        adminApiExtensions: {
            schema: (0, graphql_tag_1.default) `
            extend type Mutation {
                assignCustomerToChannels(customerId: ID!, channelIds: [ID!]!): String!
            }
        `,
            resolvers: [channel_assignment_resolver_1.ChannelAssignmentResolver],
        },
        providers: [customer_channel_service_1.CustomerChannelService],
    })
], ManualCustomerChannelPlugin);
