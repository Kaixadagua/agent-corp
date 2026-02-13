/**
 * ProductParamsV3 Types
 * Comprehensive TypeScript definitions
 * @module types/ProductParamsV3
 * @version 2.0.0
 */

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Main ProductParamsV3 interface
 */
export interface ProductParamsV3 {
  /** Unique identifier */
  id: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
  
  /** Version for optimistic locking */
  version: number;
}

/**
 * ProductParamsV3 input data (for creation)
 */
export interface ProductParamsV3Input {
  /** Optional ID (auto-generated if not provided) */
  id?: string;
  
  /** Creation timestamp (defaults to now) */
  createdAt?: Date;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * ProductParamsV3 update data (partial)
 */
export type ProductParamsV3Update = Partial<Omit<ProductParamsV3, 'id' | 'createdAt'>>;

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface ProductParamsV3Response<T = ProductParamsV3> {
  /** Success flag */
  success: boolean;
  
  /** Response data */
  data?: T;
  
  /** Error information */
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  
  /** Response metadata */
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

/**
 * Query parameters for listing
 */
export interface ProductParamsV3QueryParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: keyof ProductParamsV3;
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  
  /** Filter criteria */
  filter?: Record<string, any>;
  
  /** Search query */
  search?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * ProductParamsV3 configuration options
 */
export interface ProductParamsV3Config {
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Enable validation */
  enableValidation?: boolean;
  
  /** Custom validators */
  validators?: Array<(data: ProductParamsV3) => boolean>;
  
  /** Event hooks */
  hooks?: {
    onCreate?: (data: ProductParamsV3) => void | Promise<void>;
    onUpdate?: (data: ProductParamsV3) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * ProductParamsV3 state for React/Vue stores
 */
export interface ProductParamsV3State {
  /** Current items */
  items: ProductParamsV3[];
  
  /** Currently selected item */
  selectedItem: ProductParamsV3 | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Pagination info */
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * ProductParamsV3 action types
 */
export type ProductParamsV3Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ProductParamsV3[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: ProductParamsV3 | null }
  | { type: 'CREATE_ITEM'; payload: ProductParamsV3 }
  | { type: 'UPDATE_ITEM'; payload: ProductParamsV3 }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_PAGE'; payload: number };

// ============================================================================
// Utility Types
// ============================================================================

/** Nullable type helper */
export type Nullable<T> = T | null;

/** Optional type helper */
export type Optional<T> = T | undefined;

/** API Status */
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

/** Validation result */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// Constants
// ============================================================================

/** Default configuration values */
export const DEFAULT_PRODUCTPARAMSV3_CONFIG: ProductParamsV3Config = {
  enableCache: true,
  cacheTTL: 300000, // 5 minutes
  enableValidation: true
};

/** API endpoints */
export const PRODUCTPARAMSV3_ENDPOINTS = {
  LIST: '/api/productparamsv3',
  CREATE: '/api/productparamsv3',
  GET: (id: string) => `/api/productparamsv3/${id}`,
  UPDATE: (id: string) => `/api/productparamsv3/${id}`,
  DELETE: (id: string) => `/api/productparamsv3/${id}`
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for ProductParamsV3
 */
export function isProductParamsV3(obj: any): obj is ProductParamsV3 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.createdAt instanceof Date
  );
}

/**
 * Type guard for ProductParamsV3Response
 */
export function isProductParamsV3Response<T>(obj: any): obj is ProductParamsV3Response<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean'
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default ProductParamsV3;
