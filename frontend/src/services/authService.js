const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================
// ADMIN LOGIN
// ============================================

const login = async (email, password) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  // Store JWT
  localStorage.setItem(
    "meghla_token",
    data.token
  );

  // Store user information
  localStorage.setItem(
    "meghla_user",
    JSON.stringify(data.user)
  );

  return data;
};

// ============================================
// LOGOUT
// ============================================

const logout = () => {
  localStorage.removeItem("meghla_token");
  localStorage.removeItem("meghla_user");
};

// ============================================
// GET TOKEN
// ============================================

const getToken = () => {
  return localStorage.getItem(
    "meghla_token"
  );
};

// ============================================
// GET CURRENT USER
// ============================================

const getCurrentUser = () => {
  const user = localStorage.getItem(
    "meghla_user"
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

// ============================================
// CHECK AUTH
// ============================================

const isAuthenticated = () => {
  return Boolean(getToken());
};

export const authService = {
  login,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated,
};