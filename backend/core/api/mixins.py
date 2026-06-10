from django.db import models
from deep_translator import GoogleTranslator


class AutoTranslationMixin(models.Model):
    """
    Миксин для автоматического перевода пустых полей
    на основе конфигурации settings.LANGUAGES
    """

    class Meta:
        abstract = (
            True  # Обязательно! Говорит Django, что это не отдельная таблица в БД
        )

    def save(self, *args, **kwargs):
        # 1. Забираем ВСЕ физические поля модели из метаданных Django (_meta.get_fields())
        # Django создает _meta в самую первую очередь, поэтому это сработает на 100%
        all_fields = [field.name for field in self._meta.get_fields()]

        # 2. Ищем среди них поля, заканчивающиеся на '_ru'
        ru_fields = [f for f in all_fields if f.endswith("_ru")]

        # 3. Проходимся по найденным русским полям
        for ru_field in ru_fields:
            # Вычисляем базовое имя поля (например, из 'name_ru' получаем 'name')
            base_field_name = ru_field[:-3]
            en_field = f"{base_field_name}_en"

            # Если для этого поля существует английский аналог в БД
            if en_field in all_fields:
                ru_value = getattr(self, ru_field)
                en_value = getattr(self, en_field)

                # Если русское поле заполнено, а английское пустое — переводим!
                if ru_value and not en_value:
                    try:
                        translated_text = GoogleTranslator(
                            source="ru", target="en"
                        ).translate(str(ru_value))
                        setattr(self, en_field, translated_text.strip())
                    except Exception as e:
                        print(
                            f"Ошибка автоперевода в миксине для поля {base_field_name}: {e}"
                        )

        # 4. Вызываем стандартное сохранение
        super().save(*args, **kwargs)
