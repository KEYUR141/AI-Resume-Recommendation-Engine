import logging

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile
from django.contrib.auth.models import User

logger = logging.getLogger('app')

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        logger.info("UserProfile created for new user=%s (id=%s)", instance.username, instance.pk)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.userprofile.save()
    except Exception as e:
        logger.error("Failed to save UserProfile for user=%s: %s", instance.username, e, exc_info=True)