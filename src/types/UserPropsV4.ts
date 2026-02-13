/**
 * UserPropsV4 Types
 * Comprehensive TypeScript definitions
 * @module types/UserPropsV4
 * @version 2.0.0
 */

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Main UserPropsV4 interface
 */
export interface UserPropsV4 {
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
 * UserPropsV4 input data (for creation)
 */
export interface UserPropsV4Input {
  /** Optional ID (auto-generated if not provided) */
  id?: string;
  
  /** Creation timestamp (defaults to now) */
  createdAt?: Date;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * UserPropsV4 update data (partial)
 */
export type UserPropsV4Update = Partial<Omit<UserPropsV4, 'id' | 'createdAt'>>;

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface UserPropsV4Response<T = UserPropsV4> {
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
export interface UserPropsV4QueryParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: keyof UserPropsV4;
  
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
 * UserPropsV4 configuration options
 */
export interface UserPropsV4Config {
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Enable validation */
  enableValidation?: boolean;
  
  /** Custom validators */
  validators?: Array<(data: UserPropsV4) => boolean>;
  
  /** Event hooks */
  hooks?: {
    onCreate?: (data: UserPropsV4) => void | Promise<void>;
    onUpdate?: (data: UserPropsV4) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * UserPropsV4 state for React/Vue stores
 */
export interface UserPropsV4State {
  /** Current items */
  items: UserPropsV4[];
  
  /** Currently selected item */
  selectedItem: UserPropsV4 | null;
  
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
 * UserPropsV4 action types
 */
export type UserPropsV4Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: UserPropsV4[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: UserPropsV4 | null }
  | { type: 'CREATE_ITEM'; payload: UserPropsV4 }
  | { type: 'UPDATE_ITEM'; payload: UserPropsV4 }
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
export const DEFAULT_USERPROPSV4_CONFIG: UserPropsV4Config = {
  enableCache: true,
  cacheTTL: 300000, // 5 minutes
  enableValidation: true
};

/** API endpoints */
export const USERPROPSV4_ENDPOINTS = {
  LIST: '/api/userpropsv4',
  CREATE: '/api/userpropsv4',
  GET: (id: string) => `/api/userpropsv4/${id}`,
  UPDATE: (id: string) => `/api/userpropsv4/${id}`,
  DELETE: (id: string) => `/api/userpropsv4/${id}`
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for UserPropsV4
 */
export function isUserPropsV4(obj: any): obj is UserPropsV4 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.createdAt instanceof Date
  );
}

/**
 * Type guard for UserPropsV4Response
 */
export function isUserPropsV4Response<T>(obj: any): obj is UserPropsV4Response<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean'
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default UserPropsV4;
