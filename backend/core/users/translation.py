from modeltranslation.translator import register, TranslationOptions
from django.contrib.auth import get_user_model

User = get_user_model()


@register(User)
class CategoryTranslationOptions(TranslationOptions):
    fields = ("first_name", "last_name")
