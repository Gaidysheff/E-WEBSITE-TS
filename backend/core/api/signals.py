from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from django.core.mail import send_mail

from api.models import ProductRating, Review, Order


@receiver(post_save, sender=Review)
def update_product_rating_on_save(sender, instance, **kwargs):
    product = instance.product
    reviews = product.reviews.all()
    total_reviews = reviews.count()

    review_average = reviews.aggregate(Avg("rating"))["rating__avg"] or 0.0

    product_rating, created = ProductRating.objects.get_or_create(product=product)
    product_rating.average_rating = review_average
    product_rating.total_reviews = total_reviews
    product_rating.save()


@receiver(post_delete, sender=Review)
def update_product_rating_on_delete(sender, instance, **kwargs):
    product = instance.product
    reviews = product.reviews.all()
    total_reviews = reviews.count()

    review_average = reviews.aggregate(Avg("rating"))["rating__avg"] or 0.0

    product_rating, created = ProductRating.objects.get_or_create(product=product)
    product_rating.average_rating = review_average
    product_rating.total_reviews = total_reviews
    product_rating.save()


@receiver(post_save, sender=Order)
def send_order_emails(sender, instance, created, **kwargs):
    if created and instance.status == "Paid":
        # 1. Письмо клиенту
        send_mail(
            f"Заказ #{instance.checkout_id} оплачен",
            f"Спасибо за покупку! Сумма заказа: {instance.amount} {instance.currency}.",
            "noreply@yourshop.ru",  # почта магазина
            [instance.customer_email],  # почта клиента
            fail_silently=True,
        )

        # 2. Письмо админу
        send_mail(
            f"НОВЫЙ ЗАКАЗ #{instance.checkout_id}",
            f"Оплачен новый заказ на сумму {instance.amount}. Проверьте админку.",
            "noreply@yourshop.ru",  # почта магазина
            ["gaidysheff@mail.ru"],  # почта администратора
            fail_silently=True,
        )
