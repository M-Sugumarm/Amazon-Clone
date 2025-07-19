import { getStorageUsage } from "@/services/localStorageService";

/**
 * Displays a warning to the admin about localStorage usage and limitations
 * This is important to educate about the limitations of using localStorage instead of Firebase Storage
 */
export const displayLocalStorageWarning = (): void => {
  // Only display in development mode
  if (process.env.NODE_ENV !== 'production') {
    const { used, total, percentage } = getStorageUsage();
    
    // Format bytes to more readable format
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    console.warn(
      `%cLocal Storage Warning\n` +
      `%cYou are using localStorage instead of Firebase Storage to save costs.\n\n` +
      `Current usage: ${formatBytes(used)} / ${formatBytes(total)} (${percentage.toFixed(2)}%)\n\n` +
      `Limitations of localStorage:\n` +
      `- Max space: ~5MB per domain\n` +
      `- Data is stored only in the browser\n` +
      `- Data is lost when user clears browser data\n` +
      `- Not suitable for large files or production use with many users\n\n` +
      `This message only appears in development mode.`,
      'font-weight: bold; font-size: 14px; color: #ff9900;',
      'font-size: 12px; color: #666;'
    );
  }
};

/**
 * Display development-only warnings for admin panel
 */
export const displayAdminWarning = (): void => {
  // Only display warnings in development mode
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      '%cAdmin Panel Information',
      'background: #f8f9fa; color: #0070f3; font-size: 14px; font-weight: bold; padding: 5px;'
    );
    
    console.log(
      'The admin panel is accessible to:\n' +
      '- Users with email \'vikashspidey@gmail.com\'\n' +
      '- Users with emails ending in \'@admin.com\''
    );
    
    console.log(
      '\nTo properly secure your application in production:\n' +
      '- Use custom claims in Firebase Authentication\n' +
      '- Set up proper role-based access control\n' +
      '- Consider implementing server-side session validation\n\n' +
      'This message only appears in development mode.'
    );
  }
};

/**
 * Log message to console when creating mock/test orders
 */
export const logTestOrderCreation = (orderId: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      '%cTest Order Created',
      'background: #10b981; color: white; font-size: 14px; font-weight: bold; padding: 5px;'
    );
    
    console.log(`Created test order with ID: ${orderId}`);
    console.log('This test order is for development purposes only.');
  }
};

export default {
  displayLocalStorageWarning,
  displayAdminWarning,
  logTestOrderCreation
}; 