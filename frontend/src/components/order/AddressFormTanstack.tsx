import { Input } from "../ui/input";
import { addAddressAction } from "@/api/actions.ts";
import { addressSchema } from "./addressSchema";
import { toast } from "react-toastify";
import { useUser } from "@/store/UserContext";
import { type PureAddress } from "@/lib/types.ts";
import { cn } from "@/lib/utils.ts";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { ERRORS, TRANSLATIONS } from "@/lib/translation.ts";

import { useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  address: PureAddress | undefined;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

// ------------ ВАРИАНТ без перевода --------------------------
// export function FieldInfo({ field }: { field: AnyFieldApi }) {
//   return (
//     <>
//       {field.state.meta.isTouched && !field.state.meta.isValid ? (
//         <em
//           className={
//             field.state.meta.errors.length ? "text-destructive text-sm" : ""
//           }
//         >
//           {field.state.meta.errors.map((err) => err.message)[0]}
//           {/* {field.state.meta.errors.map((err) => err.message).join(",")} */}
//         </em>
//       ) : null}
//       {field.state.meta.isValidating ? "Validating..." : null}
//     </>
//   );
// }
// ------------ ВАРИАНТ с переводом ошибок --------------------------
export function FieldInfo({ field, e }: { field: AnyFieldApi; e: any }) {
  // Достаем саму ошибку (обычно это первый элемент массива)
  const error = field.state.meta.errors[0];
  // Вытаскиваем ключ (если это объект Zod, ключ будет в .message)
  const errorKey = typeof error === "string" ? error : error?.message;

  if (!field.state.meta.isTouched || !errorKey) return null;

  // Ищем перевод. Если не нашли — выводим сам ключ (для отладки)
  const errorMessage = e?.[errorKey] || errorKey;
  // const errorMessage = e?.errors?.[errorKey] || errorKey;

  return (
    <div className="h-4">
      {/* Резервируем место, чтобы верстка не прыгала */}
      <em className="text-destructive text-xs italic">{errorMessage}</em>
    </div>
  );
}

const AddressFormTanstack = ({ address, setIsModalOpen }: Props) => {
  // ------------- времено для перевода -----------------
  const lang = "en";

  const t = TRANSLATIONS[lang]; // Помощник для перевода основного
  const e = ERRORS[lang]; // Помощник для перевода ошибок
  // ----------------------------------------------------------

  const { user, setUser } = useUser();
  const [btnLoader, setBtnLoader] = useState(false);
  const email = typeof user === "undefined" ? "" : user.email;

  const form = useForm({
    defaultValues: {
      street: address?.street ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      phone: address?.phone ?? "",
    },
    validators: {
      onChange: addressSchema,
      // onChangeAsync: addressSchema,
      // onChangeAsyncDebounceMs: 500,
      onMount: addressSchema, // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА ПРИ ЗАГРУЗКЕ
    },
    onSubmit: async ({ value }) => {
      setBtnLoader(true);
      try {
        const addressData = {
          email,
          ...value,
        };
        const newAddress = await addAddressAction(addressData);

        // Обновляем контекст пользователя вручную
        // Теперь во всем приложении адрес обновится МГНОВЕННО без перезагрузки

        setUser((prev) => (prev ? { ...prev, address: newAddress } : prev));

        // Закрываем Модальное окно ТОЛЬКО после успешного ответа
        setIsModalOpen(false);

        toast.success(t.addressSaved); // Используем перевод
      } catch (err) {
        toast.error(e.saveError);
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
      <h2 className="text-xl font-bold text-center mb-4">{t.shippingTitle}</h2>

      <form.Field name="street">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={t.streetPlaceholder}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} e={e} />
          </div>
        )}
      </form.Field>

      <form.Field name="city">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={t.cityPlaceholder}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} e={e} />
          </div>
        )}
      </form.Field>
      <form.Field name="state">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={t.statePlaceholder}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} e={e} />
          </div>
        )}
      </form.Field>
      <form.Field name="phone">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Input
              placeholder={t.phonePlaceholder}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} e={e} />
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
              ? "Saving Address..."
              : address?.id
                ? "Update Address"
                : "Save Address"} */}
            {btnLoader
              ? t.savingAddress
              : address?.id
                ? t.updateAddress
                : t.saveAddress}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default AddressFormTanstack;
