import type { FormGeneratorType } from "@/components/common/form-generator";
import type { SignInFormType } from "@/components/forms/auth/schema";

export const SIGN_IN_FORM: FormGeneratorType<SignInFormType>[] = [
  {
    id: "apiKey",
    name: "apiKey",
    inputType: "input",
    type: "password" as HTMLInputElement["type"],
    placeholder: "auth.form.input_api_key",
    label: "",
    autoComplete: "new-password",
  },
  {
    id: "remember",
    name: "remember",
    inputType: "checkbox",
    label: "auth.form.remember_key",
    placeholder: "auth.form.remember_key",
  },
];

type FormConstantsProps = {
  signInForm: FormGeneratorType<SignInFormType>[];
};

export const FORM_CONSTANTS: FormConstantsProps = {
  signInForm: SIGN_IN_FORM,
};