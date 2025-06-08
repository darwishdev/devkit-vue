
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
export type TenantsSchemaTenantView = {
	tenantId: number;
	tenantName: string;
	tenantNameAr: string;
	tenantPhone: string;
	tenantAddress: string;
	tenantAddressAr: string;
	tenantDescription: string;
	tenantDescriptionAr: string;
	tenantEmail: string;
	tenantLogo: string;
	tenantLogoVertical: string;
	tenantLogoDark: string;
	tenantValues: string;
	tenantVision: string;
	tenantMission: string;
	tenantLogoDarkVertical: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
	pages: TenantsSchemaPageView[];
};

export type TenantsSchemaPageView = {
	pageId: number;
	pageName: string;
	pageNameAr: string;
	pageDescription: string;
	pageDescriptionAr: string;
	pageBreadcrumb: string;
	tenantId: number;
	pageRoute: string;
	pageCoverImage: string;
	pageCoverVideo: string;
	pageKeyWords: string;
	pageMetaDescription: string;
	pageIcon: string;
	sections: TenantsSchemaSectionView[];
};

export type TenantsSchemaSectionView = {
	sectionId: number;
	sectionName: string;
	sectionNameAr: string;
	sectionHeader: string;
	sectionHeaderAr: string;
	sectionDescription: string;
	sectionDescriptionAr: string;
	sectionButtonLabel: string;
	sectionButtonLabelAr: string;
	sectionButtonPageId: number;
	sectionImages: string[];
	tenantId: number;
	sectionBackground: string;
	sectionIcon: string;
	partials: TenantsSchemaPartial[];
};

export type TenantsSchemaPartial = {
	partialId: number;
	partialName: string;
	partialNameAr: string;
	partialLink: string;
	address: string;
	partialButtonLink: string;
	partialButtonLabel: string;
	partialButtonLabelAr: string;
	partialButtonIcon: string;
	partialButtonPageId: number;
	partialTypeId: number;
	sectionId: number;
	partialImage: string;
	partialImages: string[];
	partialLinks: { [key: string]: string };
	partialIcons: string[];
	partialVideo: string;
	isFeatured: boolean;
	partialBrief: string;
	partialBriefAr: string;
	partialContent: string;
	partialContentAr: string;
	createdAt?: Timestamp;
	updatedAt?: Timestamp;
	deletedAt?: Timestamp;
};
export type Icon = {
	iconName: string
	iconContent: string
}
export type IconFindRequest = {
	iconName: string;
}
export type IconFindResponse = {
	icon: Icon;
}
export type NavigationBarItem = {
	key: string;
	label: string;
	labelAr: string;
	icon: string;
	route: string;
	items: NavigationBarItem[];
}
