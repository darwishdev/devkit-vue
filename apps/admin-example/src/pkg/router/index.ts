import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from "vue-router";
// import { apiClient } from '../api/apiClient'
import accountsRoutes from "@/app/accounts/routes";
import publicRoutes from "@/app/public/routes";
import AppLayout from "../components/AppLayout.vue";
import DashboardView from "../views/DashboardView.vue";
import LoginView from "../views/LoginView.vue";
import AuthLayout from "../components/AuthLayout.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ForbiddenView from "../views/ForbiddenView.vue";
import ErrorLayout from "../components/ErrorLayout.vue";
import { apiClient } from "../api/apiClient";
const appRoutes = [...accountsRoutes, ...publicRoutes];
const authMiddleWare = async (
  to: RouteLocationNormalized,
  __: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (to.path.startsWith("/auth")) return next();
  console.log("issue is hjeader");
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("access_token_expires_at");
  if (!token || !expiresAt) {
    localStorage.clear();
    console.log("issue is hjeader");
    return next("/auth/login");
  }

  const now = new Date();
  const expiry = new Date(expiresAt as string);
  console.log(now.toDateString(), expiry.toDateString());
  console.log(now >= expiry);
  if (now >= expiry) {
    try {
      const response = await apiClient.authRefreshToken({});
      const loginInfo = response.loginInfo;
      if (!loginInfo?.accessToken) throw new Error("Invalid refresh response");

      // Store new tokens and expiry
      localStorage.setItem("token", loginInfo.accessToken);
      localStorage.setItem(
        "access_token_expires_at",
        loginInfo.accessTokenExpiresAt,
      );
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.clear();
      return next("/auth/login");
    }
  }

  next();
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      redirect: "/dashboard",
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: DashboardView,
        },
        ...appRoutes,
      ],
    },
    {
      path: "/auth/",
      component: AuthLayout,
      redirect: "/auth/login",
      children: [
        {
          path: "login",
          name: "login",
          component: LoginView,
        },
        {
          path: "reset-password-email",
          name: "reset-password-email",
          component: import("../views/ResetPasswordEmailView.vue"),
        },
        {
          path: "reset-password",
          name: "reset-password",
          component: import("../views/ResetPasswordView.vue"),
        },
        {
          path: "provider-login-callback",
          name: "provider-login-callback",
          component: import("../views/ProviderLoginCallbackView.vue"),
        },
      ],
    },
    {
      path: "/error",
      component: ErrorLayout,
      children: [
        {
          path: "403",
          name: "forbidden",
          component: ForbiddenView,
        },
        {
          path: "404",
          name: "not-found",
          component: NotFoundView,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/error/404",
    },
  ],
});
router.beforeEach(authMiddleWare);
export default router;
