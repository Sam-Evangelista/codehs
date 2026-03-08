from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Note(models.Model):
    COURSE_CHOICES = [
        ("CS101", "CS 101"),
        ("MATH241", "MATH 241"),
        ("ENG101", "ENG 101"),
        ("HIST100", "HIST 100"),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    course = models.CharField(max_length=20, choices=COURSE_CHOICES)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Question(models.Model):
    COURSE_CHOICES = [
        ("CS101", "CS 101"),
        ("MATH241", "MATH 241"),
        ("ENG101", "ENG 101"),
        ("HIST100", "HIST 100"),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    course = models.CharField(max_length=20, choices=COURSE_CHOICES)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="questions")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title