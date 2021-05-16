export const PER_PAGE_OPTIONS = [
  {
    label: '10',
    value: 10,
  },
  {
    label: '20',
    value: 20,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
  {
    label: '200',
    value: 200,
  },
];

export const DEFAULT_PER_PAGE = 10;

export const PLACEHOLDER_PASSWORD = `        `;

export const PUBLIC_ROUTES = ['/login'];

const BaseStatus = [
  {
    label: 'Active',
    value: 'A',
  },
  {
    label: 'Hidden',
    value: 'H',
  },
  {
    label: 'Disabled',
    value: 'D',
  },
];

export const CATEGORY_STATUSES = [...BaseStatus];
export const ATTRIBUTE_STATUSES = [...BaseStatus];
export const PROMOTION_STATUSES = [...BaseStatus];
export const ATTRIBUTE_DISPLAY = [
  {
    label: 'All',
    value: 'all',
  },
];

export enum USER_STATUS {
  Active = 'active',
  Disabled = 'disabled',
}

// Define page id
export enum PAGES {
  BO = 'bo',
  BO_ADMIN = 'bo_admin',
  BO_DOC = 'bo_doc',
  CATEGORIES = 'categories',
  LOGISTIC_FEE = 'logistic_fee',
  ORDERS = 'orders',
  OUTLETS = 'outlets',
  PRODUCTS = 'products',
  TAXES = 'taxes',
  USERS = 'users',
  ATTRIBUTES = 'attributes',
  ABANDONED_BASKET = 'abandoned_basket',
  UPSELLS = 'upsells',
  PROMOTIONS = 'promotions',
}

export const OrderStatus = [
  {
    label: 'Payment Processed',
    value: 'processed',
  },
  {
    label: 'Payment Pending',
    value: 'pending',
  },
  {
    label: 'Payment Succeeded',
    value: 'succeeded',
  },
];

// These statuses are fixed values, defined in backend
export enum StatusValue {
  ACTIVE = 0,
  HIDDEN = 2,
  DELETED = 1,
  DISABLED = 3,
  REGISTERED = 5,
  PENDING = 6,
  CLOSED = 6,
}

export enum BulKDeleteActions {
  USERS = 'deleteUsers',
  PRODUCTS = 'deleteProducts',
  CATEGORIES = 'deleteCategories',
  BRAND_OWNERS = 'deleteBrandOwners',
  DOCUMENTS = 'deleteSupportDocuments',
  TAX_CODES = 'deleteTaxCodes',
  LOGISTICS_FEE = 'deleteLogisticFees',
  STARSTOCK_ADMINS = 'deleteStarstockAdmins',
  PRODUCT_FEATURES = 'deleteProductFeatures',
}

export const OutletStatuses = [
  {
    label: 'Active',
    value: StatusValue.ACTIVE,
  },
  {
    label: 'Disabled',
    value: StatusValue.DISABLED,
  },
  {
    label: 'Closed',
    value: StatusValue.CLOSED,
  },
];

export const OutletStyles = [
  {
    label: 'Late Night',
    value: 'Late Night',
  },
  {
    label: 'Wed Led',
    value: 'Wed Led',
  },
  {
    label: 'Sports Club',
    value: 'Sports Club',
  },
  {
    label: 'Off Premise Retailer',
    value: 'Off Premise Retailerr',
  },
  {
    label: 'Food Led',
    value: 'Food Led',
  },
];

export const LegalStatus = [
  {
    label: 'Ltd Company',
    value: 'Ltd Company',
  },
  {
    label: 'Sole Trader',
    value: 'Sole Trader',
  },
  {
    label: 'Partnership',
    value: 'Partnership',
  },
  {
    label: 'LLP',
    value: 'LLP',
  },
  {
    label: 'Charity',
    value: 'Charity',
  },
];

export const PROMOTION_TYPES = [
  {
    value: 'freeStock',
    label: 'Free Stock',
  },
  {
    value: 'moneyOff',
    label: 'Money Off',
  },
];

export enum PromotionEffectType {
  FREE_STOCK = 'freeStock',
  BASKET_DISCOUNT = 'cartDiscountFixed',
}

export enum PromotionLimitType {
  PER_PROMOTION = 'redemptionCount',
  PER_CUSTOMER = 'perCustomer',
  MAX_PER_ORDER = 'max',
}

export const QUALIFYING_CONTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Any',
    value: 'any',
  },
];

export const PROMOTION_CONTDITION_TYPE = [
  {
    label: 'Product',
    value: 'product',
  },
];
