"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomBannerService = void 0;
const common_1 = require("@nestjs/common");
const generated_types_1 = require("@vendure/common/lib/generated-types");
const core_1 = require("@vendure/core");
const constants_1 = require("../constants");
const custom_banner_entity_1 = require("../entities/custom-banner.entity");
let CustomBannerService = class CustomBannerService {
    constructor(connection, assetService, listQueryBuilder, customFieldRelationService, options) {
        this.connection = connection;
        this.assetService = assetService;
        this.listQueryBuilder = listQueryBuilder;
        this.customFieldRelationService = customFieldRelationService;
        this.options = options;
    }
    findByChannel(ctx, channelId) {
        return this.connection.rawConnection.getRepository(custom_banner_entity_1.CustomBanner).find({
            relations: ['channels'],
            where: {
                channels: { id: channelId } // Filters banners by channelId dynamically
            }
        });
    }
    findAll(ctx, options, relations) {
        const whereCondition = (options === null || options === void 0 ? void 0 : options.channelId)
            ? { channels: { id: options.channelId } } // Query banners for a specific channel
            : { channels: { id: ctx.channelId } }; // Default to current channel
        return this.listQueryBuilder
            .build(custom_banner_entity_1.CustomBanner, options, {
            relations: [...(relations || []), 'channels'],
            ctx,
            where: whereCondition,
        })
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }
    findOne(ctx, id, relations) {
        return this.connection.getRepository(ctx, custom_banner_entity_1.CustomBanner).findOne({
            where: { id },
            relations: [...(relations || []), 'channels'],
        });
    }
    async create(ctx, input) {
        const newBanner = new custom_banner_entity_1.CustomBanner();
        if (input.assetIds && input.assetIds.length > 0) {
            const assetList = await this.assetService.findAll(ctx, {
                filter: { id: { in: input.assetIds.map(String) } }
            });
            newBanner.assets = assetList.items;
        }
        newBanner.channels = [ctx.channel];
        const savedBanner = await this.connection.getRepository(ctx, custom_banner_entity_1.CustomBanner).save(newBanner);
        return (0, core_1.assertFound)(this.findOne(ctx, savedBanner.id));
    }
    async update(ctx, input) {
        const banner = await this.connection.getEntityOrThrow(ctx, custom_banner_entity_1.CustomBanner, input.id, { relations: ['channels'] });
        if (!banner) {
            throw new core_1.UserInputError(`CustomBanner with id ${input.id} not found`);
        }
        if (!banner.channels) {
            throw new core_1.InternalServerError(`Channels are not loaded for the CustomBanner with id ${input.id}`);
        }
        if (!banner.channels.some(channel => channel.id === ctx.channelId)) {
            throw new core_1.ForbiddenError();
        }
        if (input.assetIds && input.assetIds.length > 0) {
            const assetList = await this.assetService.findAll(ctx, {
                filter: { id: { in: input.assetIds.map(String) } }
            });
            banner.assets = assetList.items;
        }
        await this.connection.getRepository(ctx, custom_banner_entity_1.CustomBanner).save(banner);
        return (0, core_1.assertFound)(this.findOne(ctx, banner.id));
    }
    async delete(ctx, id) {
        const banner = await this.connection.getRepository(ctx, custom_banner_entity_1.CustomBanner).findOne({
            where: { id },
            relations: ['channels'],
        });
        if (!banner) {
            throw new core_1.UserInputError(`CustomBanner with id ${id} not found`);
        }
        if (!banner.channels) {
            throw new core_1.InternalServerError(`Channels are not loaded for the CustomBanner with id ${id}`);
        }
        if (!banner.channels.some(channel => channel.id === ctx.channelId)) {
            throw new core_1.ForbiddenError();
        }
        try {
            await this.connection.getRepository(ctx, custom_banner_entity_1.CustomBanner).remove(banner);
            return { result: generated_types_1.DeletionResult.DELETED };
        }
        catch (e) {
            return { result: generated_types_1.DeletionResult.NOT_DELETED, message: e.toString() };
        }
    }
};
exports.CustomBannerService = CustomBannerService;
exports.CustomBannerService = CustomBannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)(constants_1.BANNER_PLUGIN_OPTIONS)),
    __metadata("design:paramtypes", [core_1.TransactionalConnection,
        core_1.AssetService,
        core_1.ListQueryBuilder,
        core_1.CustomFieldRelationService, Object])
], CustomBannerService);
