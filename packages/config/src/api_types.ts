
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
export type StringUnknownRecord = Record<string , unknown>
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
export type FileListRequest = {
	bucketId: string;
	queryPath: string;
	limit: number;
	offest: number;
}

export interface FileMetadata {
	eTag: string;
	size: bigint;
	mimetype: string;
	cacheControl: string;
	lastModified?: Timestamp;
	contentLength: bigint;
	httpStatusCode: number;
}

export type StorageBucket = {
	id: string;
	name: string;
	public: boolean;
	createdAt: string;
	updatedAt: string;
	owner: string;
	fileSizeLimit: bigint;
	allowedMimeTypes: string[];
}
export type FileObject = {
	name: string;
	bucketId: string;
	owner: string;
	id: string;
	updatedAt?: string;
	createdAt?: string;
	lastAccessedAt?: string;
	metadata?: FileMetadata; // Assuming FileMetadata is another defined type
	buckets?: StorageBucket; // Assuming StorageBucket is another defined type
}
export type FileListResponse<T extends string = 'records'> = {
	[K in T]: FileObject[]
} & {
	options?: StringUnknownRecord
}
export type FileCreateRequest = {
	path: string;
	bucketName: string;
	reader: Uint8Array;
	fileType: string;
}
export type FileCreateResponse = {
	path: string;
}
export type FileCreateBulkRequest = {
	files: FileCreateRequest[];
}
export type FileCreateBulkResponse = {
	path: string[];
}

export type BucketListRequest = {
}

export type BucketListResponse = {
	buckets: StorageBucket[]
}

export type FileUploadUrlFindRequest = {
}

export type FileUploadUrlFindResponse = {
	uploadUrl: string
  token: string
  refreshToken?: string
}
export type BucketCreateUpdateRequest = {
	bucketName: string;
	isPulic: boolean;
	fileSizeLimit: string;
	allowedFileTypes: string[];
	isUpdate: boolean;
}
export type BucketCreateUpdateResponse = {
	bucket: StorageBucket
}
export type DeleteRequest<TProp extends string = 'records', TRecord extends string | number = number, TVariant extends 'single' | 'bulk' = 'bulk'> = {
	[K in TProp]: TVariant extends 'single' ? TRecord : TRecord[]
}
export type GalleryListFilters = {
	bucketId: string;
	fileName?: string;
	path?: string;
	mimeType?: string;
	queryPath?: string;
	minSize?: number;
	maxSize?: number;
	createdAtBetween?: number[];
}

export type GalleryListRequest = {
	filters: GalleryListFilters;
	paginationParams?: StringUnknownRecord;
}

export type GalleryListResponse = {
	records: FileObject[];
	options: StringUnknownRecord;
}

// Auth Login
export type AccountsSchemaUser = {
	userId: number;
	userName: string;              // User's name, should be unique
	tenantId: number;
	userSecurityLevel: number;     // Security level of the user
	userTypeId: number;            // Foreign key for user type
	userPhone: string;             // Optional phone number
	userEmail: string;             // User's email, unique in DB
	userPassword: string;          // Password
	createdAt: string;             // Creation timestamp (from google.protobuf.Timestamp)
	updatedAt: string;             // Update timestamp
	deletedAt: string;             // Deletion timestamp
};
export type NavigationBarItem = {
	navigationBarItemId: number;
	parentId: number;
	key: string;
	label: string;
	labelAr: string;
	icon: string;
	route: string;
	level: number;
	items: NavigationBarItem[];
};
export type AuthLoginRequest = {
	loginCode: string;        // minLength: 3, maxLength: 200
	userPassword: string;     // minLength: 6, maxLength: 200
};

export type LoginInfo = {
	accessToken: string;
	accessTokenExpiresAt: string;
};

export type AuthLoginResponse = {
	user: AccountsSchemaUser;
	loginInfo: LoginInfo;
	navigationBar: NavigationBarItem[];
};

// Login via Provider
export type AuthLoginProviderCallbackRequest = {
	accessToken: string;
};

export type AuthLoginProviderRequest = {
	redirectUrl: string;
	provider: string; // minLength: 3, maxLength: 20
};

export type AuthLoginProviderResponse = {
	url: string;
};

// Reset Password (Request Email)
export type AuthResetPasswordEmailRequest = {
	email: string; // valid email, maxLength: 200
};

export type AuthResetPasswordEmailResponse = {
	message: string;
};

// Reset Password (Actual Reset)
export type AuthResetPasswordRequest = {
	email: string;                     // valid email, maxLength: 200
	newPassword: string;              // minLength: 6
	newPasswordConfirmation: string;  // minLength: 6
	resetToken: string;               // minLength: 6
	redirectUrl: string;
};

export type AuthResetPasswordResponse = {
	user: AccountsSchemaUser;
	loginInfo: LoginInfo;
	navigationBar: NavigationBarItem[];
};

