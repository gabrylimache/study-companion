export const localStorageUtil = {
  save: (key: string, value: any) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('localStorage save error:', e);
    }
  },
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (e) {
      console.error('localStorage load error:', e);
      return defaultValue;
    }
  },
  clear: (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error('localStorage clear error:', e);
    }
  }
};
