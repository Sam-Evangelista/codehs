from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Note, Question


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "username", "role", "bio"]


class NoteSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_role = serializers.CharField(source="author.profile.role", read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "course",
            "author",
            "author_username",
            "author_role",
            "created_at",
        ]


class QuestionSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_role = serializers.CharField(source="author.profile.role", read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "title",
            "content",
            "course",
            "author",
            "author_username",
            "author_role",
            "created_at",
        ]


class UserProfileDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only=True)
    role = serializers.CharField(source="profile.role", read_only=True)
    bio = serializers.CharField(source="profile.bio", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "role", "bio"]