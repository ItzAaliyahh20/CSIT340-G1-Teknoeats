import SHA256 from 'crypto-js/sha256';

// Secret key for integrity check - in production, use environment variable
const SECRET_KEY = process.env.REACT_APP_STORAGE_SECRET || 'teknoeats-secure-storage-key-2024';

export const secureSet = (key, value) => {
  try {
    const dataString = JSON.stringify(value);
    const hash = SHA256(dataString + SECRET_KEY).toString();
    const secureData = {
      data: dataString,
      hash: hash
    };
    localStorage.setItem(key, JSON.stringify(secureData));
  } catch (error) {
    console.error('Error setting secure storage:', error);
  }
};

export const secureGet = (key) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const secureData = JSON.parse(stored);
    if (!secureData.data || !secureData.hash) {
      // Invalid format, clear it
      localStorage.removeItem(key);
      return null;
    }

    const computedHash = SHA256(secureData.data + SECRET_KEY).toString();
    if (computedHash !== secureData.hash) {
      // Tampered data, clear it
      console.warn(`localStorage key '${key}' has been tampered with. Clearing data.`);
      localStorage.removeItem(key);
      return null;
    }

    return JSON.parse(secureData.data);
  } catch (error) {
    console.error('Error getting secure storage:', error);
    // Clear corrupted data
    localStorage.removeItem(key);
    return null;
  }
};

export const secureRemove = (key) => {
  localStorage.removeItem(key);
};