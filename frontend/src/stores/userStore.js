import { create } from 'zustand';
import axiosInstance from '../api/axiosFrontend';

// --- Helper Functions for Token ---
const setTokenHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

const clearTokenHeader = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
};

// --- Zustand Store Definition ---
const useUserStore = create((set, get) => ({
  // --- State ---
  user: null, // 初始 user 狀態為 null
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  // --- Actions ---
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/customer/auth/login', credentials);
      const { token } = response.data;

      localStorage.setItem('token', token);
      setTokenHeader(token);
      set({ token, isAuthenticated: true });

      // 登入成功後，立刻去獲取完整的個人資料
      await get().fetchProfile();

    } catch (error) {
      console.error('Login failed:', error);
      throw error.response?.data?.message || '登入失敗';
    }
  },

  logout: () => {
    clearTokenHeader();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    if (!get().token) return;
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/customer/profile');
      if (response.data) {
        set({ user: response.data, loading: false });
        console.log("成功獲取並儲存使用者資料:", response.data);
      }
    } catch (error) {
      console.error("獲取使用者資料失敗:", error);
      // 如果請求失敗 (例如 token 失效)，就執行登出程序
      get().logout();
    }
  },

  /**
   * 【關鍵函式】檢查並初始化使用者狀態
   * 這個函式會在 App 啟動時被呼叫
   */
  checkAuth: () => {
    const token = get().token;
    if (token) {
      console.log("偵測到 Token，準備自動獲取個人資料...");
      setTokenHeader(token);
      get().fetchProfile();
    } else {
      console.log("沒有偵測到 Token，維持訪客狀態。");
    }
  }
}));

// 【關鍵步驟】在 store 被建立時，就檢查一次 token
// 這確保了只要檔案被引入，驗證邏輯就會準備好
useUserStore.getState().checkAuth();


export default useUserStore;