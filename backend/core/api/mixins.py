from django.db import models

# from deep_translator import GoogleTranslator

# ------------------- Вариант через MyMemoryTranslator -------------------

from deep_translator import MyMemoryTranslator
import time


class MyMemoryAutoTranslateMixin:
    """
    Миксин для автоматического перевода указанных полей с русского на английский.
    Должен использоваться в моделях, где подключен django-modeltranslation.
    """

    # Список полей для перевода (переопределяется в каждой модели)
    translate_fields = []

    def save(self, *args, **kwargs):
        to_translate = []
        fields_to_update = []

        # 1. Сканируем поля модели и собираем те, где нужен перевод
        for field_name in self.translate_fields:
            field_ru = getattr(self, f"{field_name}_ru", None)
            field_en = getattr(self, f"{field_name}_en", None)

            # Если русское поле заполнено, а английское пустое — готовим к переводу
            if field_ru and not field_en:
                to_translate.append(field_ru)
                fields_to_update.append(field_name)

        # 2. Если нашли поля для перевода, делаем ОДИН пакетный запрос
        if to_translate:
            try:
                time.sleep(1)  # Защита от спама по API

                translator = MyMemoryTranslator(
                    source="ru-RU",
                    target="en-US",
                    proxied_clicks=True,
                    email="gaidysheff@gmail.com",
                )

                # Если переводим несколько полей — используем batch, если одно — обычный translate
                if len(to_translate) > 1:
                    translated_results = translator.translate_batch(to_translate)
                else:
                    translated_results = [translator.translate(to_translate[0])]

                # 3. Динамически записываем результаты обратно в английские поля модели
                for index, field_name in enumerate(fields_to_update):
                    setattr(self, f"{field_name}_en", translated_results[index])

                print(
                    f"[AutoTranslate] Успешно переведены поля: {', '.join(fields_to_update)} в модели {self.__class__.__name__}"
                )

            except Exception as e:
                print(
                    f"[AutoTranslate] Ошибка при переводе полей в {self.__class__.__name__}: {e}"
                )

        # 4. Вызываем стандартное сохранение Django
        super().save(*args, **kwargs)


# -------------------- Вариант через GoogleTranslator --------------------

# class AutoTranslationMixin(models.Model):
#     """
#     Миксин для автоматического перевода пустых полей
#     на основе конфигурации settings.LANGUAGES
#     """

#     class Meta:
#         abstract = (
#             True  # Обязательно! Говорит Django, что это не отдельная таблица в БД
#         )

#     def save(self, *args, **kwargs):
#         # 1. Забираем ВСЕ физические поля модели из метаданных Django (_meta.get_fields())
#         # Django создает _meta в самую первую очередь, поэтому это сработает на 100%
#         all_fields = [field.name for field in self._meta.get_fields()]

#         # 2. Ищем среди них поля, заканчивающиеся на '_ru'
#         ru_fields = [f for f in all_fields if f.endswith("_ru")]

#         # 3. Проходимся по найденным русским полям
#         for ru_field in ru_fields:
#             # Вычисляем базовое имя поля (например, из 'name_ru' получаем 'name')
#             base_field_name = ru_field[:-3]
#             en_field = f"{base_field_name}_en"

#             # Если для этого поля существует английский аналог в БД
#             if en_field in all_fields:
#                 ru_value = getattr(self, ru_field)
#                 en_value = getattr(self, en_field)

#                 # Если русское поле заполнено, а английское пустое — переводим!
#                 if ru_value and not en_value:
#                     try:
#                         translated_text = GoogleTranslator(
#                             source="ru", target="en"
#                         ).translate(str(ru_value))
#                         setattr(self, en_field, translated_text.strip())
#                     except Exception as e:
#                         print(
#                             f"Ошибка автоперевода в миксине для поля {base_field_name}: {e}"
#                         )

#         # 4. Вызываем стандартное сохранение
#         super().save(*args, **kwargs)
