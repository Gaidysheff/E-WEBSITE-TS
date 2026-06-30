import { addUserInfoAction } from "@/api/actions.ts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils.ts";
import { useUser } from "@/store/UserContext";
import { format, parseISO } from "date-fns";
import { enUS, ru } from "date-fns/locale"; // Импортируем локали из date-fns
import { CalendarIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "../ui/input";

import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { userInfoSchema, type UserInfoFormValues } from "./userInfoSchema.ts";

import { useI18nContext } from "@/i18n/i18n-react";
import { getZodTranslation } from "@/lib/i18nHelper.ts";

import { useState, type Dispatch, type SetStateAction } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Базовые стили флажков

import { FileImageIcon, UploadIcon } from "lucide-react";

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
  const { LL, locale } = useI18nContext();

  // 1. Прямо в компоненте определяем текущий язык
  // const isRussian = /\/(ru)(\/|$)/i.test(window.location.pathname);
  // const currentLocale = isRussian ? ru : enUS;

  const currentLocale = locale === "ru" ? ru : enUS;

  // Стейт для контроля автоматического закрытия поповера
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

        // setUser((prev) => (prev ? { ...prev, ...newUserData } : prev));

        // Альтернативный железобетонный вариант маппинга, если бэкенд и фронт
        // имеют разные ключи:
        setUser((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            username: newUserData.username,
            birthday: newUserData.birthday,
            phone: newUserData.phone,
            image: newUserData.image,
            // Переводим прилетевший snake_case в camelCase вашего контекста:
            firstName: newUserData.first_name,
            lastName: newUserData.last_name,
          };
        });

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
      className="w-full mx-auto p-8 rounded-2xl space-y-4 shadow-sm"
    >
      <h2 className="text-xl font-bold text-center mb-4">
        {LL.profile.personalInfoTitle()}
        {/* Your Personal Info */}
      </h2>
      <form.Field name="username">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {LL.profile.username()}
            </label>
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
        {(field) => {
          // Получаем имя выбранного файла (если это объект File), иначе берем
          // из данных юзера строку-url
          const fileValue = field.state.value;
          const fileName =
            fileValue instanceof File
              ? fileValue.name
              : typeof fileValue === "string" && fileValue
                ? fileValue.split("/").pop() // Вытаскиваем имя картинки из URL для красоты
                : null;

          return (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">
                {LL.profile.fileUpload()}
                {/* {locale === "ru" ? "Аватар профиля" : "Profile Avatar"} */}
              </span>

              <div className="flex items-center gap-3">
                {/* Скрытый реальный инпут */}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only" // Полностью скрывает инпут, сохраняя
                  // доступность для скринридеров
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.handleChange(file);
                    }
                  }}
                />

                {/* Кастомный видимый UI, обернутый в label */}
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {/* Используем компонент Button как обертку для стилей Shadcn */}
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="pointer-events-none"
                  >
                    <span className="flex items-center gap-2">
                      <UploadIcon className="size-4" />
                      {locale === "ru" ? "Загрузить фото" : "Upload Photo"}
                    </span>
                  </Button>
                </label>

                {/* Отображаем имя выбранного файла, если оно есть */}
                {fileName && (
                  <div
                    className="flex items-center gap-1.5 text-sm
                  text-muted-foreground bg-secondary px-2 py-1 rounded-md
                  max-w-[115px] truncate"
                  >
                    <FileImageIcon className="size-4 shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </div>
                )}
              </div>

              <FieldInfo field={field} />
            </div>
          );
        }}
      </form.Field>

      {/* <form.Field name="phone">
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
      </form.Field> */}

      <form.Field name="phone">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {LL.profile.phone()}
              {/* Phone Number */}
            </label>
            <PhoneInput
              country="ru" // Дефолтная страна (ru, us, ua, kz...)
              value={field.state.value}
              // Передаем отформатированную строку с плюсом прямо в форму
              onChange={(phone) => field.handleChange(`+${phone}`)}
              // 🌟 СТИЛИЗУЕМ САМ ИНПУТ ЧЕРЕЗ TAILWIND
              inputClass="!w-full !h-8 !rounded-md !border !border-input
                !bg-background !text-foreground dark:!bg-zinc-950
                focus-visible:!border-ring focus-visible:!ring-3
                focus-visible:!ring-ring/50 dark:!border-zinc-800"
              // 🌟 СТИЛИЗУЕМ КНОПКУ ВЫБОРА ФЛАГА ЧЕРЕЗ TAILWIND
              buttonClass="!bg-background !border !border-input !rounded-l-md
                dark:!bg-zinc-950 dark:!border-zinc-800"
              // 🌟 СТИЛИЗУЕМ ВЫПАДАЮЩИЙ СПИСОК СТРАН
              dropdownClass="dark:!bg-zinc-950 dark:!text-white"
              containerStyle={{
                width: "100%",
              }}
            />
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      {/* <form.Field name="birthday">
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
      </form.Field> */}

      <form.Field name="birthday">
        {(field) => (
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium">
              {LL.profile.birthday()}
              {/* Birthday */}
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "h-8 w-full justify-start text-left font-normal",
                    !field.state.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.state.value ? (
                    format(
                      parseISO(field.state.value),
                      currentLocale == ru ? "d MMMM yyyy 'г.'" : "PPP",
                      {
                        locale: currentLocale, // Применяем локаль к тексту
                      },
                    )
                  ) : (
                    <span>
                      {currentLocale == ru ? "Выберите дату" : "Pick a date"}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  // Превращаем ISO строку назад в объект Date для календаря
                  selected={
                    field.state.value ? parseISO(field.state.value) : undefined
                  }
                  // Главная магия: при выборе даты переводим её в "YYYY-MM-DD"
                  // и отдаем TanStack Form
                  onSelect={(date) => {
                    if (date) {
                      field.handleChange(format(date, "yyyy-MM-dd"));
                      // 2. Закрываем календарь автоматически!
                      setIsCalendarOpen(false);
                    }
                  }}
                  captionLayout="dropdown" // Включает выпадающие списки
                  startMonth={new Date(1956, 0)}
                  endMonth={new Date()}
                  locale={currentLocale} // Передаем локаль, чтобы dropdown месяцев стал русским!
                  disabled={{ after: new Date() }} // Блокирует клики по будущим датам (серые числа)
                />
              </PopoverContent>
            </Popover>
            <FieldInfo field={field} />
          </div>
        )}
      </form.Field>

      <form.Field name="firstName">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {LL.profile.firstName()}
              {/* First Name */}
            </label>
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
            <label className="text-sm font-medium">
              {LL.profile.lastName()}
              {/* Last Name */}
            </label>
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
