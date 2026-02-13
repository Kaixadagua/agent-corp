/**
 * EventParamsV3 Types
 * Comprehensive TypeScript definitions
 * @module types/EventParamsV3
 * @version 2.0.0
 */

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Main EventParamsV3 interface
 */
export interface EventParamsV3 {
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
 * EventParamsV3 input data (for creation)
 */
export interface EventParamsV3Input {
  /** Optional ID (auto-generated if not provided) */
  id?: string;
  
  /** Creation timestamp (defaults to now) */
  createdAt?: Date;
  
  /** Additional properties */
  [key: string]: any;
}

/**
 * EventParamsV3 update data (partial)
 */
export type EventParamsV3Update = Partial<Omit<EventParamsV3, 'id' | 'createdAt'>>;

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * API Response wrapper
 */
export interface EventParamsV3Response<T = EventParamsV3> {
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
export interface EventParamsV3QueryParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: keyof EventParamsV3;
  
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
 * EventParamsV3 configuration options
 */
export interface EventParamsV3Config {
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  
  /** Enable validation */
  enableValidation?: boolean;
  
  /** Custom validators */
  validators?: Array<(data: EventParamsV3) => boolean>;
  
  /** Event hooks */
  hooks?: {
    onCreate?: (data: EventParamsV3) => void | Promise<void>;
    onUpdate?: (data: EventParamsV3) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * EventParamsV3 state for React/Vue stores
 */
export interface EventParamsV3State {
  /** Current items */
  items: EventParamsV3[];
  
  /** Currently selected item */
  selectedItem: EventParamsV3 | null;
  
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
 * EventParamsV3 action types
 */
export type EventParamsV3Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: EventParamsV3[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SELECT_ITEM'; payload: EventParamsV3 | null }
  | { type: 'CREATE_ITEM'; payload: EventParamsV3 }
  | { type: 'UPDATE_ITEM'; payload: EventParamsV3 }
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
export const DEFAULT_EVENTPARAMSV3_CONFIG: EventParamsV3Config = {
  enableCache: true,
  cacheTTL: 300000, // 5 minutes
  enableValidation: true
};

/** API endpoints */
export const EVENTPARAMSV3_ENDPOINTS = {
  LIST: '/api/eventparamsv3',
  CREATE: '/api/eventparamsv3',
  GET: (id: string) => `/api/eventparamsv3/${id}`,
  UPDATE: (id: string) => `/api/eventparamsv3/${id}`,
  DELETE: (id: string) => `/api/eventparamsv3/${id}`
} as const;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for EventParamsV3
 */
export function isEventParamsV3(obj: any): obj is EventParamsV3 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    obj.createdAt instanceof Date
  );
}

/**
 * Type guard for EventParamsV3Response
 */
export function isEventParamsV3Response<T>(obj: any): obj is EventParamsV3Response<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean'
  );
}

// ============================================================================
// Default Export
// ============================================================================

export default EventParamsV3;
