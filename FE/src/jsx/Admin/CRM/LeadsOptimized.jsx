/**
 * Performance Optimization Wrapper for Leads Page
 * 
 * This component adds critical performance optimizations to prevent lag/freezing:
 * - Debounced search input
 * - Memoized calculations
 * - Optimized re-renders
 */

import React, { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

// Debounce utility (if lodash not available)
export const createDebounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Memoized table row component to prevent unnecessary re-renders
export const MemoizedTableRow = React.memo(({ children, ...props }) => {
    return <tr {...props}>{children}</tr>;
}, (prevProps, nextProps) => {
    // Only re-render if data actually changed
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

// Optimized status chip renderer
export const useOptimizedStatusChip = () => {
    return useCallback((status) => {
        // Memoized status chip logic
        const statusColors = {
            New: { color: "primary", variant: "outlined" },
            "Call Back": { color: "warning", variant: "outlined" },
            "Not Active": { color: "error", variant: "outlined" },
            "Active": { color: "success", variant: "filled" },
            "Not Interested": { color: "default", variant: "outlined" },
        };
        return statusColors[status] || { color: "default", variant: "outlined" };
    }, []);
};

// Performance hook for large lists
export const useVirtualization = (items, containerHeight = 600, itemHeight = 73) => {
    const [scrollTop, setScrollTop] = useState(0);
    
    const visibleRange = useMemo(() => {
        const start = Math.floor(scrollTop / itemHeight);
        const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + 1, items.length);
        return { start, end };
    }, [scrollTop, items.length, itemHeight, containerHeight]);
    
    const visibleItems = useMemo(() => {
        return items.slice(visibleRange.start, visibleRange.end);
    }, [items, visibleRange]);
    
    return { visibleItems, visibleRange, setScrollTop };
};

export default {
    createDebounce,
    MemoizedTableRow,
    useOptimizedStatusChip,
    useVirtualization
};

