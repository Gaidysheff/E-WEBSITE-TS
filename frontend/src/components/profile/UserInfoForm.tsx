import { Input } from "../ui/input";
import { addUserInfoAction } from "@/api/actions.ts";
import { toast } from "react-toastify";
import { useUser } from "@/store/UserContext";
import { cn } from "@/lib/utils.ts";


import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { userInfoSchema, type UserInfoFormValues } from "./userInfoSchema.ts";
// import { type UserLoggedIn, type UserData } from "@/lib/types.ts";
import { getZodTranslation } from "@/lib/i18nHelper.ts";
import { useI18nContext } from "@/i18n/i18n-react";

import { useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { LL } = useI18nContext();

  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em
          className={
            field.state.meta.errors.length
              ? "text-destructive text-sm not-italic"
              : ""
          }
        >
          {
            field.state.meta.errors.map((err) => {
              // Если ошибка прилетела от Zod (строка содержит точку), переводим её
              const errMsg = err?.message || String(err);
              return errMsg.includes(".")
                ? getZodTranslation(errMsg, LL)
                : errMsg;
            })[0]
            // .join(", ")
          }
        </em>
      ) : null}

      {/* Мгновенный перевод статуса проверки */}
      {field.state.meta.isValidating ? (
        <span className="text-gray-400 text-sm">{LL.auth.validating()}</span>
      ) : null}
    </>
  );
}

const UserInfoForm = ({ setIsModalOpen }: Props) => {
  const { LL } = useI18nContext();
  const { user, setUser } = useUser();
  const [btnLoader, setBtnLoader] = useState(false);
  // const email = typeof user === "undefined" ? "" : user.email;

  const form = useForm({
    defaultValues: {
      username: user?.username ?? "",
      birthday: user?.birthday ?? "",
      image: user?.image ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: user?.phone ?? "",
    } as UserInfoFormValues,

    validators: {
      onChange: userInfoSchema,
      onMount: userInfoSchema, // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА ПРИ ЗАГРУЗКЕ
    },
    onSubmit: async ({ value }) => {
      setBtnLoader(true);
      try {
        const userData = {
          email: user?.email ?? "",
          ...value,
        };
        const newUserData = await addUserInfoAction(userData);

        // Обновляем контекст пользователя вручную
        // Теперь во всем приложении адрес обновится МГНОВЕННО без перезагрузки
        // Разворачиваем новые данные в стейт через спред ...newUserData

        setUser((prev) => (prev ? { ...prev, newUserData } : prev));

        // Закрываем Модальное окно ТОЛЬКО после успешного ответа
        setIsModalOpen(false);

        // toast.success("LL.address.addressSaved()"); // Используем перевод
        toast.success("Данные успешно сохранены!");
      } catch (err) {
        // toast.error("LL.address.saveError()");
        toast.error("Ошибка при сохранении данных");
      } finally {
        setBtnLoader(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="w-full mx-auto bg-white p-8 rounded-2xl space-y-4 shadow-sm"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        {LL.profile.personalInfoTitle()}
        {/* Your Personal Info */}
      </h2>
      <form.Field name="username">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={LL.profile.username()}
              // placeholder="username"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>
      <form.Field name="image">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={LL.profile.image()}
              // placeholder="image"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>
      <form.Field name="phone">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={LL.profile.phone()}
              // placeholder="phone"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      <form.Field name="birthday">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={LL.profile.birthday()}
              // placeholder="your birthday"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      <form.Field name="firstName">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={LL.profile.firstName()}
              // placeholder="first_name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>
      <form.Field name="lastName">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={LL.profile.lastName()}
              // placeholder="last_name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit]) => (
          <button
            type="submit"
            disabled={!canSubmit || btnLoader}
            className="w-full h-12 bg-myMainColor text-white rounded-md disabled:opacity-50"
          >
            {/* {btnLoader
              ? "Saving your data..."
              : user?.birthday ||
                  user?.firstName ||
                  user?.lastName ||
                  user?.phone
                ? "Update your data"
                : "Save your data"} */}
            {btnLoader
              ? LL.profile.saving()
              : user?.birthday ||
                  user?.firstName ||
                  user?.lastName ||
                  user?.phone
                ? LL.profile.updateData()
                : LL.profile.saveData()}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default UserInfoForm;
