import { Input } from "../ui/input";
import { addUserInfoAction } from "@/api/actions.ts";
import { toast } from "react-toastify";
import { useUser } from "@/store/UserContext";
import { cn } from "@/lib/utils.ts";

import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { userInfoSchema } from "./userInfoSchema.ts";
import { type UserLoggedIn } from "@/lib/types.ts";
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
  const { user, setUser } = useUser();
  const [btnLoader, setBtnLoader] = useState(false);
  // const email = typeof user === "undefined" ? "" : user.email;

  const form = useForm({
    defaultValues: {
      email: user?.email ?? "",
      username: user?.username ?? "",
      birthday: user?.birthday ?? "",
      firstName: user?.first_name ?? "",
      lastName: user?.last_name ?? "",
      phone: user?.phone ?? "",
    } as UserLoggedIn,

    validators: {
      onChange: userInfoSchema,
      // onChangeAsync: userInfoSchema,
      // onChangeAsyncDebounceMs: 500,
      onMount: userInfoSchema, // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА ПРИ ЗАГРУЗКЕ
    },
    onSubmit: async ({ value }) => {
      setBtnLoader(true);
      try {
        // const userData = {
        //   email,
        //   ...value,
        // };
        const newUserData = await addUserInfoAction(value);

        // Обновляем контекст пользователя вручную
        // Теперь во всем приложении адрес обновится МГНОВЕННО без перезагрузки

        setUser((prev) => (prev ? { ...prev, newUserData } : prev));

        // Закрываем Модальное окно ТОЛЬКО после успешного ответа
        setIsModalOpen(false);

        toast.success("LL.address.addressSaved()"); // Используем перевод
      } catch (err) {
        toast.error("LL.address.saveError()");
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
        {/* {LL.address.shippingTitle()} */}
        Title
      </h2>

      <form.Field name="birthday">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              // placeholder={LL.address.streetPlaceholder()}
              placeholder="your birthday"
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

      <form.Field name="first_name">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              // placeholder={LL.address.cityPlaceholder()}
              placeholder="first_name"
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
      <form.Field name="last_name">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              // placeholder={LL.address.cityPlaceholder()}
              placeholder="last_name"
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
      <form.Field name="username">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              // placeholder={LL.address.statePlaceholder()}
              placeholder="username"
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
              // placeholder={LL.address.phonePlaceholder()}
              placeholder="phone"
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
            {btnLoader
              ? "Saving your data..."
              : user?.birthday || user?.first_name || user?.last_name
                ? "Update your data"
                : "Save your data"}
            {/* {btnLoader
              ? LL.address.savingAddress()
              : address?.id
                ? LL.address.updateAddress()
                : LL.address.saveAddress()} */}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default UserInfoForm;
