"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerModule = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const banner_assignment_component_1 = require("./ui/components/banner-assignment.component");
const forms_1 = require("@angular/forms");
let BannerModule = class BannerModule {
};
exports.BannerModule = BannerModule;
exports.BannerModule = BannerModule = __decorate([
    (0, core_1.NgModule)({
        declarations: [banner_assignment_component_1.BannerAssignmentComponent],
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule],
        exports: [banner_assignment_component_1.BannerAssignmentComponent],
    })
], BannerModule);
