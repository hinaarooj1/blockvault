/**
 * CRM Performance Configuration
 * 
 * Key optimizations to prevent lag and freezing:
 * 1. Reduced page size
 * 2. Disabled auto-refresh
 * 3. Optimized table rendering
 * 4. Debounced search
 */

// Performance settings
export const PERFORMANCE_CONFIG = {
    // Reduce default page size to improve initial load
    DEFAULT_PAGE_SIZE: 50,  // Reduced from 100
    
    // Disable auto-refresh to prevent constant re-renders
    DISABLE_AUTO_REFRESH: true,
    
    // Debounce delay for search (milliseconds)
    SEARCH_DEBOUNCE_DELAY: 500,
    
    // Virtualization threshold (enable virtual scrolling above this)
    VIRTUALIZATION_THRESHOLD: 100,
    
    // Lazy load images and heavy components
    LAZY_LOAD_ENABLED: true,
};

// Table optimization settings
export const TABLE_CONFIG = {
    // Row height for virtual scrolling calculations
    ROW_HEIGHT: 73,
    
    // Container height for visible area
    CONTAINER_HEIGHT: 600,
    
    // Enable row recycling for large datasets
    ENABLE_ROW_RECYCLING: true,
};

export default {
    PERFORMANCE_CONFIG,
    TABLE_CONFIG
};

