/**
 * ConfigParamsV3 Types
 * Comprehensive TypeScript definitions
 * @module types/ConfigParamsV3
 * @version 2.0.0
 */

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Main ConfigParamsV3 interface
 */
export interface ConfigParamsV3 {
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
 * ConfigParamsV3 input data (for creation)
 */
export interface ConfigParamsV3Input {
  /** Optional ID (auto-generated if not provided) */
  id?: string;
  
  /** Creation timestamp (defaults to now) */
  createdAt?: Date;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * ConfigParamsV3 update data (partial)
 */
export type ConfigParamsV3Update = Partial<Omit<ConfigParamsV3, 'id' | 'createdAt'>>;

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface ConfigParamsV3Response<T = ConfigParamsV3> {
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
export interface ConfigParamsV3QueryParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: keyof ConfigParamsV3;
  
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
 * ConfigParamsV3 configuration options
 */
export interface ConfigParamsV3Config {
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Enable validation */
  enableValidation?: boolean;
  
  /** Custom validators */
  validators?: Array<(data: ConfigParamsV3) => boolean>;
  
  /** Event hooks */
  hooks?: {
    onCreate?: (data: ConfigParamsV3) => void | Promise<void>;
    onUpdate?: (data: ConfigParamsV3) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * ConfigParamsV3 state for React/Vue stores
 */
export interface ConfigParamsV3State {
  /** Current items */
  items: ConfigParamsV3[];
  
  /** Currently selected item */
  selectedItem: ConfigParamsV3 | null;
  
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
 * ConfigParamsV3 action types
 */
export type ConfigParamsV3Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ConfigParamsV3[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: ConfigParamsV3 | null }
  | { type: 'CREATE_ITEM'; payload: ConfigParamsV3 }
  | { type: 'UPDATE_ITEM'; payload: ConfigParamsV3 }
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
export const DEFAULT_CONFIGPARAMSV3_CONFIG: ConfigParamsV3Config = {
  enableCache: true,
  cacheTTL: 300000, // 5 minutes
  enableValidation: true
};

/** API endpoints */
export const CONFIGPARAMSV3_ENDPOINTS = {
  LIST: '/api/configparamsv3',
  CREATE: '/api/configparamsv3',
  GET: (id: string) => `/api/configparamsv3/${id}`,
  UPDATE: (id: string) => `/api/configparamsv3/${id}`,
  DELETE: (id: string) => `/api/configparamsv3/${id}`
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for ConfigParamsV3
 */
export function isConfigParamsV3(obj: any): obj is ConfigParamsV3 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.createdAt instanceof Date
  );
}

/**
 * Type guard for ConfigParamsV3Response
 */
export function isConfigParamsV3Response<T>(obj: any): obj is ConfigParamsV3Response<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean'
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default ConfigParamsV3;
