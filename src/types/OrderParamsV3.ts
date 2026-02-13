/**
 * OrderParamsV3 Types
 * Comprehensive TypeScript definitions
 * @module types/OrderParamsV3
 * @version 2.0.0
 */

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Main OrderParamsV3 interface
 */
export interface OrderParamsV3 {
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
 * OrderParamsV3 input data (for creation)
 */
export interface OrderParamsV3Input {
  /** Optional ID (auto-generated if not provided) */
  id?: string;
  
  /** Creation timestamp (defaults to now) */
  createdAt?: Date;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * OrderParamsV3 update data (partial)
 */
export type OrderParamsV3Update = Partial<Omit<OrderParamsV3, 'id' | 'createdAt'>>;

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface OrderParamsV3Response<T = OrderParamsV3> {
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
export interface OrderParamsV3QueryParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: keyof OrderParamsV3;
  
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
 * OrderParamsV3 configuration options
 */
export interface OrderParamsV3Config {
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Enable validation */
  enableValidation?: boolean;
  
  /** Custom validators */
  validators?: Array<(data: OrderParamsV3) => boolean>;
  
  /** Event hooks */
  hooks?: {
    onCreate?: (data: OrderParamsV3) => void | Promise<void>;
    onUpdate?: (data: OrderParamsV3) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * OrderParamsV3 state for React/Vue stores
 */
export interface OrderParamsV3State {
  /** Current items */
  items: OrderParamsV3[];
  
  /** Currently selected item */
  selectedItem: OrderParamsV3 | null;
  
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
 * OrderParamsV3 action types
 */
export type OrderParamsV3Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: OrderParamsV3[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: OrderParamsV3 | null }
  | { type: 'CREATE_ITEM'; payload: OrderParamsV3 }
  | { type: 'UPDATE_ITEM'; payload: OrderParamsV3 }
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
export const DEFAULT_ORDERPARAMSV3_CONFIG: OrderParamsV3Config = {
  enableCache: true,
  cacheTTL: 300000, // 5 minutes
  enableValidation: true
};

/** API endpoints */
export const ORDERPARAMSV3_ENDPOINTS = {
  LIST: '/api/orderparamsv3',
  CREATE: '/api/orderparamsv3',
  GET: (id: string) => `/api/orderparamsv3/${id}`,
  UPDATE: (id: string) => `/api/orderparamsv3/${id}`,
  DELETE: (id: string) => `/api/orderparamsv3/${id}`
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for OrderParamsV3
 */
export function isOrderParamsV3(obj: any): obj is OrderParamsV3 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.createdAt instanceof Date
  );
}

/**
 * Type guard for OrderParamsV3Response
 */
export function isOrderParamsV3Response<T>(obj: any): obj is OrderParamsV3Response<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean'
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default OrderParamsV3;
