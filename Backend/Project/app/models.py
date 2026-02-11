from django.db import models
import uuid
from django.contrib.auth.models import User



class BaseModel(models.Model):
    uuid = models.UUIDField(primary_key=True,editable=False,default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        abstract = True

class UserProfile(BaseModel):
    role_choices = (
        ('admin', 'Admin'),
        ('student', 'Student'),
        ('HR', 'HR'),
    )
    
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    role = models.CharField(max_length=20,choices=role_choices,default='admin')
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)  # <-- added field

    def __str__(self):
        return f"{self.uuid} - {self.user.username} - {self.role}"
    
class Internship(BaseModel):
    position = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    industry = models.CharField(max_length=50)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    skills = models.TextField()
    qualifications = models.CharField(max_length=100)
    stipend = models.CharField(max_length=20)
    duration = models.CharField(max_length=20)
    description = models.TextField()

    def __str__(self):
        return f"{self.uuid} - {self.role} at {self.company}"
