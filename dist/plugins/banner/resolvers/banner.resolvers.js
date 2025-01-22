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
exports.BannerResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const service_1 = require("../services/service");
let BannerResolver = class BannerResolver {
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async createBanner(ctx, input) {
        return this.bannerService.createBanner(ctx, input);
    }
    async updateBanner(ctx, input) {
        return this.bannerService.updateBanner(ctx, input);
    }
    async deleteBanner(ctx, id) {
        return this.bannerService.deleteBanner(ctx, id);
    }
};
exports.BannerResolver = BannerResolver;
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "createBanner", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "updateBanner", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, String]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "deleteBanner", null);
exports.BannerResolver = BannerResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [service_1.BannerService])
], BannerResolver);
