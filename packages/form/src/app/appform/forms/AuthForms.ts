import { AuthLoginResponse } from "@devkitvue/config";
import { FormKitSchemaNode } from "@formkit/core";

export const emailInput: FormKitSchemaNode & { name: "email" } = {
  $formkit: "text",
  validation: "required",
  name: "email",
  placeholder: "email",
  label: "email",
};

export const loginCodeInput: FormKitSchemaNode & { name: "loginCode" } = {
  $formkit: "text",
  placeholder: "email",
  name: "loginCode",
  validation: "email_or_phone",
  label: "email",
};
export const passwordInput: FormKitSchemaNode & { name: "userPassword" } = {
  $formkit: "password",
  name: "userPassword",
  validation: "required",
  placeholder: "password",
  label: "password",
};
export const newPasswordInput: FormKitSchemaNode & { name: "newPassword" } = {
  ...passwordInput,
  name: "newPassword",
  placeholder: "new_password",
  label: "new_password",
};
export const newPasswordConfirmationInput: FormKitSchemaNode & {
  name: "newPasswordConfirmation";
} = {
  ...passwordInput,
  name: "newPasswordConfirmation",
  validation: "required|confirm:newPassword",
  placeholder: "password_confirm",
  label: "password_confirm",
};
export const loginSectionInputs = [loginCodeInput, passwordInput];
export const resetPasswordEmailSectionInputs = [emailInput];

export const resetPasswordSectionInputs = [
  newPasswordInput,
  newPasswordConfirmationInput,
];
export const loginCallback = (response: AuthLoginResponse) => {
  if (response.navigationBar)
    localStorage.setItem("sidebar", JSON.stringify(response.navigationBar));
  // 2. Cache the access token
  if (response.loginInfo) {
    localStorage.setItem("token", response.loginInfo.accessToken);
    localStorage.setItem(
      "access_token_expires_at",
      response.loginInfo.accessTokenExpiresAt,
    );
  }
  // 3. Cache the user info
  if (response.user) {
    localStorage.setItem("user_info", JSON.stringify(response.user));
  }
};
export const loginRoute = "/auth/login";
export const resetPasswordEmailRoute = "/auth/reset-password-email";
export const loginSuccessMessge = "logged in";
export const resetPasswordEmailSuccessMessge = "email sent";
export const resetPasswordSuccessMessge = "password has been reset";
