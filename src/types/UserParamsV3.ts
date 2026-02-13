/**
 * UserParamsV3 Types
 * Comprehensive TypeScript definitions
 * @module types/UserParamsV3
 * @version 2.0.0
 */

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Main UserParamsV3 interface
 */
export interface UserParamsV3 {
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
 * UserParamsV3 input data (for creation)
 */
export interface UserParamsV3Input {
  /** Optional ID (auto-generated if not provided) */
  id?: string;
  
  /** Creation timestamp (defaults to now) */
  createdAt?: Date;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * UserParamsV3 update data (partial)
 */
export type UserParamsV3Update = Partial<Omit<UserParamsV3, 'id' | 'createdAt'>>;

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface UserParamsV3Response<T = UserParamsV3> {
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
export interface UserParamsV3QueryParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: keyof UserParamsV3;
  
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
 * UserParamsV3 configuration options
 */
export interface UserParamsV3Config {
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Enable validation */
  enableValidation?: boolean;
  
  /** Custom validators */
  validators?: Array<(data: UserParamsV3) => boolean>;
  
  /** Event hooks */
  hooks?: {
    onCreate?: (data: UserParamsV3) => void | Promise<void>;
    onUpdate?: (data: UserParamsV3) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * UserParamsV3 state for React/Vue stores
 */
export interface UserParamsV3State {
  /** Current items */
  items: UserParamsV3[];
  
  /** Currently selected item */
  selectedItem: UserParamsV3 | null;
  
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
 * UserParamsV3 action types
 */
export type UserParamsV3Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: UserParamsV3[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: UserParamsV3 | null }
  | { type: 'CREATE_ITEM'; payload: UserParamsV3 }
  | { type: 'UPDATE_ITEM'; payload: UserParamsV3 }
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
export const DEFAULT_USERPARAMSV3_CONFIG: UserParamsV3Config = {
  enableCache: true,
  cacheTTL: 300000, // 5 minutes
  enableValidation: true
};

/** API endpoints */
export const USERPARAMSV3_ENDPOINTS = {
  LIST: '/api/userparamsv3',
  CREATE: '/api/userparamsv3',
  GET: (id: string) => `/api/userparamsv3/${id}`,
  UPDATE: (id: string) => `/api/userparamsv3/${id}`,
  DELETE: (id: string) => `/api/userparamsv3/${id}`
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for UserParamsV3
 */
export function isUserParamsV3(obj: any): obj is UserParamsV3 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.createdAt instanceof Date
  );
}

/**
 * Type guard for UserParamsV3Response
 */
export function isUserParamsV3Response<T>(obj: any): obj is UserParamsV3Response<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean'
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default UserParamsV3;
