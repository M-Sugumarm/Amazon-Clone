/**
 * LocalStorageService - A utility to handle image storage locally
 * This is used as an alternative to Firebase Storage to avoid storage costs
 */

// Store image as base64 data URL
export const saveImageToLocalStorage = (
  image: File,
  path: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!image) {
      reject(new Error('No image provided'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read image'));
        return;
      }

      try {
        // Create a unique key for the image
        const key = `amazon_clone_img_${path}_${Date.now()}`;
        
        // Store the base64 string in localStorage
        localStorage.setItem(key, event.target.result as string);
        
        // Return a reference that can be used to retrieve the image
        resolve(key);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Read the image as a data URL (base64)
    reader.readAsDataURL(image);
  });
};

// Retrieve an image from localStorage
export const getImageFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

// Delete an image from localStorage
export const deleteImageFromLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

// Save any data to localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Retrieve data from localStorage
export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
};

// Get all items from localStorage with a specific prefix
export const getItemsByPrefix = (prefix: string): Record<string, string> => {
  const items: Record<string, string> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      const value = localStorage.getItem(key);
      if (value) {
        items[key] = value;
      }
    }
  }
  
  return items;
};

// Calculate storage usage
export const getStorageUsage = (): { used: number, total: number, percentage: number } => {
  let totalSize = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        // Calculate size in bytes
        totalSize += (key.length + value.length) * 2; // Each character is 2 bytes
      }
    }
  }
  
  // 5MB is typically the localStorage limit in most browsers
  const maxSize = 5 * 1024 * 1024;
  const percentage = (totalSize / maxSize) * 100;
  
  return {
    used: totalSize,
    total: maxSize,
    percentage
  };
};

export default {
  saveImageToLocalStorage,
  getImageFromLocalStorage,
  deleteImageFromLocalStorage,
  saveToLocalStorage,
  getFromLocalStorage,
  getItemsByPrefix,
  getStorageUsage
}; 