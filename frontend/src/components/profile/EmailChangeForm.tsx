import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils.ts";
import { getZodTranslation } from "@/lib/i18nHelper.ts";

import { useI18nContext } from "@/i18n/i18n-react";

import { z } from "zod";
import { requestEmailChange } from "@/api/endpoints_auth";
// import { useUser } from "@/store/UserContext";
import { toast } from "react-toastify";

interface Props {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  // setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const emailSchema = z.object({
  email: z
    .string() // — базовый тип.
    .min(1, { message: "auth.mustField" })
    // .min(1, { message: "Поле обязательно" })
    // — чтобы поймать пустую строку до сложной проверки форма
    .pipe(
      z
        // .email({ message: "auth.emailInvalid" })
        .email("auth.emailInvalid")
        // .email("Некорректный email")
        // .min(5, "Слишком короткий email") не работает,
        // так как поглащается самой валидацией .email
        .max(254, {
          message: "auth.tooLong",
          // message: "Email слишком длинный (RFC допускает до 254 символов)",
        })
        .transform((val) => val.toLowerCase()),
    ),
  // приводим к нижнему регистру,
  password: z.string().min(8, "auth.passwordMin"),
});

type EmailType = z.infer<typeof emailSchema>; // string

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

const EmailChangeForm = ({ setIsModalOpen }: Props) => {
  const [btnLoader, setBtnLoader] = useState(false);

  const { LL } = useI18nContext();

  // const { user } = useUser();

  const form = useForm({
    defaultValues: {
      // email: user?.email || "",
      email: "",
      password: "",
    } as EmailType,

    validators: {
      onChange: emailSchema,
      onMount: emailSchema, // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА ПРИ ЗАГРУЗКЕ
    },

    onSubmit: async ({ value }) => {
      setBtnLoader(true);
      try {
        await requestEmailChange(emailSchema.parse(value));

        // Закрываем Модальное окно ТОЛЬКО после успешного ответа
        setIsModalOpen(false);

        toast.success(LL.profile.emailChange.success());
        // toast.success("На новый адрес отправлено письмо для верификации");
      } catch (err) {
        toast.error(LL.profile.emailChange.error());
        // toast.error("Ошибка при сохранении данных");
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
      className="w-full mx-auto p-8 rounded-2xl space-y-4 shadow-sm"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        {LL.profile.emailChange.title()}
        {/* Смена эл. почты / логина */}
      </h2>
      <p className="">
        <span className="font-bold">{LL.profile.emailChange.attention()} </span>
        {/* <span className="font-bold">Внимание!</span>  */}
        {LL.profile.emailChange.infoBefore()}
        {/* Меняя адрес электронной почты, Вы меняете логин для авторизации
в личный кабинет. */}
      </p>
      <form.Field name="email">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {LL.profile.emailChange.email()}
              {/* Email */}
            </label>
            <Input
              id="email"
              placeholder={LL.profile.emailChange.emailPlaceholder()}
              // placeholder="email"
              // value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              required
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>
      <form.Field
        name="password"
        children={(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {LL.profile.emailChange.password()}
              {/* Password */}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={LL.profile.emailChange.passwordPlaceholder()}
              // placeholder="password"
              onBlur={field.handleBlur}
              // value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
              className={cn(
                field.state.meta.errors.length &&
                  "focus-visible:border-red-500 focus-visible:ring-red-500 ring-red-500 border-red-500 bg-red-100",
              )}
            />
            <FieldInfo field={field} />
          </div>
        )}
      />
      <p className="">
        {LL.profile.emailChange.infoAfterA()}
        {/* После нажатия кнопки "Подтвердить" Вам будет выслано электронное письмо
        на указанный адрес. В этом письме вы должны */}{" "}
        <span className="font-bold">
          {LL.profile.emailChange.infoAfterB()}
          {/* перейти по ссылке */}
        </span>{" "}
        {LL.profile.emailChange.infoAfterC()}
        {/* для верификации вашего нового адреса. */}
      </p>
      <p>
        {LL.profile.emailChange.infoAfterII()}
        {/* После верификации вход в личный кабинет будет возможен уже только по
новому электронному адресу. */}
      </p>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit]) => (
          <button
            type="submit"
            disabled={!canSubmit || btnLoader}
            className="w-full h-12 bg-myMainColor text-white rounded-md disabled:opacity-50"
          >
            {
              btnLoader
                ? LL.profile.emailChange.loading()
                : // "Высылаем Вам письмо ..."
                  LL.profile.emailChange.btn()
              // "Подтвердить"
            }
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};

export default EmailChangeForm;
