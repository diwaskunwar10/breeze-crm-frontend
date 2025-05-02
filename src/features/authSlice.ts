
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/api/auth.service';
import { AuthCredentials, User, LoginResponse } from '@/types/User';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginData: LoginResponse | null;
}

// Get project name from env
const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

// Function to load auth state from localStorage
const loadAuthState = (): AuthState => {
  // Get token with project name prefix or fallback to original
  const token = localStorage.getItem(`${projectName}_token`) || localStorage.getItem('token');

  // Get user data with project name prefix
  let user = null;
  const userJson = localStorage.getItem(`${projectName}_user`);
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  }

  // Get login data with project name prefix
  let loginData = null;
  const loginDataJson = localStorage.getItem(`${projectName}_login_data`);
  if (loginDataJson) {
    try {
      const parsedData = JSON.parse(loginDataJson);
      loginData = new LoginResponse(parsedData);
    } catch (e) {
      console.error('Failed to parse login data:', e);
    }
  }

  // Check if we have all required auth data
  const isAuthenticated = !!token && !!user;

  // If missing any required auth data but have token, clean up auth data
  // BUT NEVER REMOVE THE SLUG
  if (!isAuthenticated && token) {
    // Remove token with project name prefix
    localStorage.removeItem(`${projectName}_token`);
    // Also remove the original token for backward compatibility
    localStorage.removeItem('token');

    // Remove user data with project name prefix
    localStorage.removeItem(`${projectName}_user`);

    // Remove login data with project name prefix
    localStorage.removeItem(`${projectName}_login_data`);

    // DO NOT remove the slug - keep it for future logins
    // const slugKey = `${projectName}_slug`;
    // DO NOT: localStorage.removeItem(slugKey);
    // DO NOT: localStorage.removeItem('tenant_slug');

    console.warn('Incomplete auth data found. Cleaned up auth state but preserved slug.');
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading: false,
    error: null,
    loginData,
  };
};

const initialState: AuthState = loadAuthState();

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: AuthCredentials & { client_id?: string }, { rejectWithValue }) => {
    try {
      const loginResponse = await authService.login(credentials);

      // Get project name from env
      const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

      // Save the complete login response with project name prefix
      localStorage.setItem(`${projectName}_login_data`, JSON.stringify(loginResponse.toJSON()));

      // Save token with project name prefix
      localStorage.setItem(`${projectName}_token`, loginResponse.access_token);
      // Also keep the original token for backward compatibility
      localStorage.setItem('token', loginResponse.access_token);

      // Save slug with project name prefix
      if (loginResponse.tenant_slug) {
        localStorage.setItem(`${projectName}_slug`, loginResponse.tenant_slug);
        // Also keep the original slug for backward compatibility
        localStorage.setItem('tenant_slug', loginResponse.tenant_slug);
      }

      // Save user data with project name prefix
      const user = loginResponse.toUser();
      localStorage.setItem(`${projectName}_user`, JSON.stringify(user));

      // Return an object with the structure expected by the reducer
      return {
        user,
        token: loginResponse.access_token,
        loginData: loginResponse
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);


export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // await authService.logout();

      // Get project name from env
      const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

      // Remove token with project name prefix
      localStorage.removeItem(`${projectName}_token`);
      // Also remove the original token for backward compatibility
      localStorage.removeItem('token');

      // Remove user data with project name prefix
      localStorage.removeItem(`${projectName}_user`);

      // Remove login data with project name prefix
      localStorage.removeItem(`${projectName}_login_data`);

      // DO NOT remove the slug - keep it for future logins
      // const slugKey = `${projectName}_slug`;
      // DO NOT: localStorage.removeItem(slugKey);
      // DO NOT: localStorage.removeItem('tenant_slug');

      window.location.href = '/login';

      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const validateAuthState = createAsyncThunk(
  'auth/validateAuthState',
  async () => {
    // This function will be called when the app starts
    // It will validate the auth state and clean up if necessary
    // But it will NEVER remove the slug

    // Get project name from env
    const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

    // Get token with project name prefix or fallback to original
    const token = localStorage.getItem(`${projectName}_token`) || localStorage.getItem('token');

    // Get user data with project name prefix
    let user = null;
    const userJson = localStorage.getItem(`${projectName}_user`);
    if (userJson) {
      try {
        user = JSON.parse(userJson);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // Get login data with project name prefix
    let loginData = null;
    const loginDataJson = localStorage.getItem(`${projectName}_login_data`);
    if (loginDataJson) {
      try {
        const parsedData = JSON.parse(loginDataJson);
        loginData = new LoginResponse(parsedData);
      } catch (e) {
        console.error('Failed to parse login data:', e);
      }
    }

    // Check if we have all required auth data
    const isAuthenticated = !!token && !!user;

    // If missing any required auth data but have token, clean up auth data
    // BUT NEVER REMOVE THE SLUG
    if (!isAuthenticated && token) {
      // Remove token with project name prefix
      localStorage.removeItem(`${projectName}_token`);
      // Also remove the original token for backward compatibility
      localStorage.removeItem('token');

      // Remove user data with project name prefix
      localStorage.removeItem(`${projectName}_user`);

      // Remove login data with project name prefix
      localStorage.removeItem(`${projectName}_login_data`);

      // DO NOT remove the slug - keep it for future logins
      // const slugKey = `${projectName}_slug`;
      // DO NOT: localStorage.removeItem(slugKey);
      // DO NOT: localStorage.removeItem('tenant_slug');

      console.warn('Incomplete auth data found. Cleaned up auth state but preserved slug.');

      // Return the cleaned state
      return { isAuthenticated: false, user: null, token: null, loginData: null };
    }

    // Return the current state
    return { isAuthenticated, user, token, loginData };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    checkAuthState: (state) => {
      // Get project name from env
      const projectName = import.meta.env.VITE_PROJECT_NAME || 'chat_demo';

      // Get token with project name prefix or fallback to original
      const token = localStorage.getItem(`${projectName}_token`) || localStorage.getItem('token');

      // Get user data with project name prefix
      let user = null;
      const userJson = localStorage.getItem(`${projectName}_user`);
      if (userJson) {
        try {
          user = JSON.parse(userJson);
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }

      // Get login data with project name prefix
      let loginData = null;
      const loginDataJson = localStorage.getItem(`${projectName}_login_data`);
      if (loginDataJson) {
        try {
          const parsedData = JSON.parse(loginDataJson);
          loginData = new LoginResponse(parsedData);
        } catch (e) {
          console.error('Failed to parse login data:', e);
        }
      }

      // Check if we have all required auth data
      const isAuthenticated = !!token && !!user;

      // Update state
      state.token = token;
      state.user = user;
      state.isAuthenticated = isAuthenticated;
      state.loginData = loginData;

      // If not authenticated, clean up but NEVER remove the slug
      if (!isAuthenticated && token) {
        // Remove token with project name prefix
        localStorage.removeItem(`${projectName}_token`);
        // Also remove the original token for backward compatibility
        localStorage.removeItem('token');

        // Remove user data with project name prefix
        localStorage.removeItem(`${projectName}_user`);

        // Remove login data with project name prefix
        localStorage.removeItem(`${projectName}_login_data`);

        // DO NOT remove the slug - keep it for future logins

        console.warn('Incomplete auth data found. Cleaned up auth state but preserved slug.');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loginData = action.payload.loginData;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })


      // Logout reducers
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loginData = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      })

      // ValidateAuthState reducers
      .addCase(validateAuthState.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = action.payload.isAuthenticated;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      });
  },
});

export const { clearAuthError, checkAuthState } = authSlice.actions;

export default authSlice.reducer;
