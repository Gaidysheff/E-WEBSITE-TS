from modeltranslation.translator import register, TranslationOptions
from .models import Product, Category, Color, Review, DeliveryOption


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    # Указываем поля модели, которые будут мультиязычными
    fields = ("name", "description")


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(Color)
class ColorTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(Review)
class ReviewTranslationOptions(TranslationOptions):
    fields = ("review",)


@register(DeliveryOption)
class DeliveryTranslationOptions(TranslationOptions):
    fields = ("name", "description")
