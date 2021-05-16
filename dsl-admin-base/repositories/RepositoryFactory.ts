import ABRepository from './ABRepository';
import AttributesRepository from './AttributesRepository';
import BODocRepository from './BODocRepository';
import BORepository from './BORepository';
import BrandOwnerRepository from './BrandOwnerRepository';
import CategoriesRepository from './CategoriesRepository';
import CompanyRepository from './CompanyRepository';
import DashboardRepository from './DashboardRepository';
import LogisticsFeeRepository from './LogisticsFeeRepository';
import OrderRepository from './OrderRepository';
import OutletRepository from './OutletRepository';
import ProductFeaturesRepository from './ProductFeatureRepository';
import ProductRepository from './ProductRepository';
import PromotionRepository from './PromotionRepository';
import ReportsRepository from './ReportsRepository';
import TaxCodeRepository from './TaxCodeRepository';
import UpsellsRepository from './UpsellsRepository';
import UserRepository from './UserRepository';

const repositories = {
  product: ProductRepository,
  category: CategoriesRepository,
  user: UserRepository,
  order: OrderRepository,
  brandOwner: BrandOwnerRepository,
  bo: BORepository,
  boDoc: BODocRepository,
  outlet: OutletRepository,
  attribute: AttributesRepository,
  taxCode: TaxCodeRepository,
  company: CompanyRepository,
  ab: ABRepository,
  upsells: UpsellsRepository,
  logisticFee: LogisticsFeeRepository,
  promotion: PromotionRepository,
  productFeatures: ProductFeaturesRepository,
  reports: ReportsRepository,
  dashboard: DashboardRepository,
};

export const RepositoryFactory = {
  get<K extends keyof typeof repositories>(name: K) {
    return repositories[name];
  },
};
