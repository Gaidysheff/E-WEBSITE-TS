from .forms import EmailForm
from .models import Emails
from django.views.generic import ListView, FormView

from django.core.mail import send_mail, EmailMultiAlternatives

from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class BasicEmailView(FormView, ListView):
    template_name = "mailing/home.html"
    context_object_name = "mydata"
    model = Emails
    form_class = EmailForm
    success_url = "/"

    def form_valid(self, form):
        # my_subject = "Email from our Django App"
        # my_message = "This is the message from my app"
        # my_recipient = form.cleaned_data["email"]

        # send_mail(
        #     subject=my_subject,
        #     message=my_message,
        #     recipient_list=[my_recipient],
        #     from_email=None,
        #     fail_silently=False,
        # )
        # obj = Emails(subject=my_subject, message=my_message, email=my_recipient)
        # obj.save()

        my_subject = "Email from our Django App"
        my_recipient = form.cleaned_data["email"]

        if User.objects.filter(email=my_recipient).exists():
            user = User.objects.get(email=my_recipient)
            welcome_message = "Welcome " + user.first_name + " " + user.last_name + "!"
        else:
            welcome_message = "You have been invited to use our app!"

        link_app = os.getenv("BASE_URL_BACKEND")
        # link_app = "http://localhost:8000"

        context = {"welcome_message": welcome_message, "link_app": link_app}

        print(my_recipient)
        html_message = render_to_string("mailing/email.html", context=context)
        plain_message = strip_tags(html_message)

        message = EmailMultiAlternatives(
            subject=my_subject, body=plain_message, from_email=None, to=[my_recipient]
        )

        message.attach_alternative(html_message, "text/html")
        message.send()

        obj = Emails(
            subject=my_subject, message="We have send this email", email=my_recipient
        )
        obj.save()

        return super().form_valid(form)
