/**
 * UserParamsV4 Types
 * Comprehensive TypeScript definitions
 * @module types/UserParamsV4
 * @version 2.0.0
 */

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Main UserParamsV4 interface
 */
export interface UserParamsV4 {
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
 * UserParamsV4 input data (for creation)
 */
export interface UserParamsV4Input {
  /** Optional ID (auto-generated if not provided) */
  id?: string;
  
  /** Creation timestamp (defaults to now) */
  createdAt?: Date;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * UserParamsV4 update data (partial)
 */
export type UserParamsV4Update = Partial<Omit<UserParamsV4, 'id' | 'createdAt'>>;

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface UserParamsV4Response<T = UserParamsV4> {
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
export interface UserParamsV4QueryParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: keyof UserParamsV4;
  
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
 * UserParamsV4 configuration options
 */
export interface UserParamsV4Config {
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Enable validation */
  enableValidation?: boolean;
  
  /** Custom validators */
  validators?: Array<(data: UserParamsV4) => boolean>;
  
  /** Event hooks */
  hooks?: {
    onCreate?: (data: UserParamsV4) => void | Promise<void>;
    onUpdate?: (data: UserParamsV4) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * UserParamsV4 state for React/Vue stores
 */
export interface UserParamsV4State {
  /** Current items */
  items: UserParamsV4[];
  
  /** Currently selected item */
  selectedItem: UserParamsV4 | null;
  
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
 * UserParamsV4 action types
 */
export type UserParamsV4Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: UserParamsV4[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: UserParamsV4 | null }
  | { type: 'CREATE_ITEM'; payload: UserParamsV4 }
  | { type: 'UPDATE_ITEM'; payload: UserParamsV4 }
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
export const DEFAULT_USERPARAMSV4_CONFIG: UserParamsV4Config = {
  enableCache: true,
  cacheTTL: 300000, // 5 minutes
  enableValidation: true
};

/** API endpoints */
export const USERPARAMSV4_ENDPOINTS = {
  LIST: '/api/userparamsv4',
  CREATE: '/api/userparamsv4',
  GET: (id: string) => `/api/userparamsv4/${id}`,
  UPDATE: (id: string) => `/api/userparamsv4/${id}`,
  DELETE: (id: string) => `/api/userparamsv4/${id}`
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for UserParamsV4
 */
export function isUserParamsV4(obj: any): obj is UserParamsV4 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.createdAt instanceof Date
  );
}

/**
 * Type guard for UserParamsV4Response
 */
export function isUserParamsV4Response<T>(obj: any): obj is UserParamsV4Response<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean'
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default UserParamsV4;
