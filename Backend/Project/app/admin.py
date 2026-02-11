from django.contrib import admin
from .models import Internship, UserProfile
# Register your models here.
admin.site.register({Internship, UserProfile})
