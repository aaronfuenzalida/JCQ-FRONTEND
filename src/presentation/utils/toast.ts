import toast from "react-hot-toast";

/**
 * Toast utilities for displaying notifications
 */

export const showToast = {
  /**
   * Show success message
   */
  success: (message: string) => {
    toast.success(message);
  },

  /**
   * Show error message
   */
  error: (message: string) => {
    toast.error(message);
  },

  /**
   * Show info message
   */
  info: (message: string) => {
    toast(message, {
      icon: "ℹ️",
      style: {
        border: "1px solid #3b82f6",
      },
    });
  },

  /**
   * Show warning message
   */
  warning: (message: string) => {
    toast(message, {
      icon: "⚠️",
      style: {
        border: "1px solid #f59e0b",
      },
    });
  },

  /**
   * Show loading message and return toast ID to dismiss later
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Show promise-based toast (loading, success, error)
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

// Export individual methods for convenience
export const { success, error, info, warning, loading, dismiss, dismissAll } =
  showToast;

