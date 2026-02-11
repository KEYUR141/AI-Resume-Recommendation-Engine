from django.contrib import admin
from django.urls import path
from .views import InternshipViewSet, AuthViewSet
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'internships', InternshipViewSet, basename='internship')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = router.urls