import { BASE_URL } from "@/api/api.ts";
import { Spinner } from "@/components/ui/spinner";
import { MapPinHouse } from "lucide-react";
import { cn } from "@/lib/utils";
import { type UserLoggedIn } from "@/lib/types.ts";
import Modal from "@/components/uiComponents/Modal.tsx";
import { useI18nContext } from "@/i18n/i18n-react";
import EmailChangeForm from "./EmailChangeForm";
import { type Dispatch, type SetStateAction } from "react";

interface Props {
  user: UserLoggedIn | undefined;
  isLoading: boolean;
  forCheckoutPage?: boolean;
  activeModal: string | null;
  setActiveModal: Dispatch<SetStateAction<string | null>>;
  // setActiveModal: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserInfo = ({
  user,
  isLoading,
  forCheckoutPage,
  activeModal,
  setActiveModal,
}: Props) => {
  const { LL } = useI18nContext();

  // const email = typeof user === "undefined" ? "" : user.email;
  // const email = user?.email ?? "";

  // const address = user?.address;

  const imgURL = `${BASE_URL}${user?.image}`;

  const savedLang = localStorage.getItem("app_lang") || "ru";

  // ---------------------- Format-Mask for birthday ----------------------

  // Сначала создаем переменную, которая может быть Date или null
  const birthdayDate = user?.birthday ? new Date(user.birthday) : null;

  // Функция форматирования, использующая Intl.DateTimeFormat для локализации
  const formatBirthday = (date: Date | null, lang: string) => {
    if (!date || isNaN(date.getTime())) return LL.profile.absentBirthday();

    // if (!date || isNaN(date.getTime())) return "Информация отсутствует";

    // Используем Intl.DateTimeFormat для автоматического выбора формата
    // (DD.MM.YYYY для ru)
    return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Применение в компоненте
  const displayDate = formatBirthday(birthdayDate, savedLang);

  // ---------------------- Format-Mask for phone ----------------------

  const formatPhone = (phone: string | undefined): string => {
    if (!phone) return LL.profile.absentPhone();

    // if (!phone) return "Номер не указан";

    // Очищаем строку от всего, кроме цифр
    const cleaned = phone.replace(/\D/g, "");

    // Применяем маску для формата +7 123 456-78-90
    // Группируем цифры: 1 (страна), 3 (код), 3, 2, 2
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
      // match[0] — это вся строка (нам не нужна)
      // match[1]...match[5] — это наши группы цифр
      return `+${match[1]} ${match[2]} ${match[3]}-${match[4]}-${match[5]}`;
    }

    return phone; // Возвращаем как есть, если формат не совпал
  };

  // Применение в компоненте
  const displayPhone = formatPhone(user?.phone);

  return (
    <div
      className="sm:grid sm:grid-cols-3 gap-4 mt-5
      items-center justify-center"
    >
      <div className={cn("", forCheckoutPage && "hidden")}>
        {user?.image && (
          <img src={imgURL} className="w-50 mx-auto" alt="User's image" />
        )}
      </div>

      <div className="col-span-2 flex flex-col">
        <div className="text-2xl font-semibold my-3">
          {LL.profile.personalInfoTitle()}
          {/* Your Personal Info */}
        </div>
        {isLoading ? (
          <Spinner className="size-20 text-myMainColor mx-auto" />
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-2 my-2">
              <div className="">
                {LL.profile.email()}
                {/* Email */}
              </div>

              <div className="col-span-2">{user?.email}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 my-2">
              <span></span>
              <div className="col-span-2">
                <Modal
                  emailChange
                  isModalOpen={activeModal === "new_email"}
                  // Откроется, только если стейт равен "new_emai"
                  setIsModalOpen={(open) =>
                    setActiveModal(open ? "new_email" : null)
                  }
                >
                  <EmailChangeForm
                    setIsModalOpen={() => setActiveModal(null)}
                  />
                </Modal>
              </div>
            </div>
            {!user?.birthday &&
            !user?.firstName &&
            !user?.lastName &&
            !user?.phone ? (
              <div className="w-full p-6 text-center bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-full shadow">
                    <MapPinHouse className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-700">
                    {LL.profile.personalInfoNoYet()}
                    {/* No Personal Info Yet. */}
                  </div>
                  <p className="text-gray-500 max-w-md">
                    {LL.profile.personalInfoEmptyText()}
                    {/* You haven't placed your personal information yet. When you
                    do, it'll appear here and you'll be able to edit it. */}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.username()}
                    {/* username */}
                  </div>
                  <div className="col-span-2">{user?.username}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.phone()}
                    {/* Phone */}
                  </div>
                  <div className="col-span-2">{displayPhone}</div>
                  {/* <div className="col-span-2">{user?.phone}</div> */}
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.firstName()}
                    {/* first name */}
                  </div>
                  <div className="col-span-2">{user?.firstName}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.lastName()}
                    {/* last name */}
                  </div>
                  <div className="col-span-2">{user?.lastName}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="">
                    {LL.profile.birthday()}
                    {/* birthday */}
                  </div>
                  <div className="col-span-2">{displayDate}</div>
                  {/* <div className="col-span-2">{user?.birthday}</div> */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
