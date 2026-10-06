from datetime import datetime


def save_custom_user_details(backend, user, response, *args, **kwargs):
    """
    Кастомный шаг для сохранения даты рождения и других специфических данных от соцсетей
    """
    if backend.name == "yandex-oauth2":
        # Яндекс присылает дату рождения в ключе 'birthday' в формате YYYY-MM-DD
        birthday_str = response.get("birthday")
        if birthday_str and not user.birthday:
            try:
                user.birthday = datetime.strptime(birthday_str, "%Y-%m-%d").date()
            except ValueError:
                pass

        # Если Яндекс отдал телефон
        phone_info = response.get("default_phone", {})
        phone_number = phone_info.get("number")
        if phone_number and not user.phone:
            user.phone = phone_number

        user.save()
