from django.contrib.auth.models import User
from rest_framework import generics
from .models import Note, Question, Profile
from .serializers import (
    NoteSerializer,
    QuestionSerializer,
    ProfileSerializer,
    UserProfileDetailSerializer,
)


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer

    def get_queryset(self):
        queryset = Note.objects.all().order_by("-created_at")

        course = self.request.query_params.get("course")
        author = self.request.query_params.get("author")

        if course:
            queryset = queryset.filter(course=course)
        if author:
            queryset = queryset.filter(author_id=author)

        return queryset


class NoteRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer


class QuestionListCreateView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        queryset = Question.objects.all().order_by("-created_at")

        course = self.request.query_params.get("course")
        author = self.request.query_params.get("author")

        if course:
            queryset = queryset.filter(course=course)
        if author:
            queryset = queryset.filter(author_id=author)

        return queryset


class QuestionRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class ProfileListView(generics.ListAPIView):
    queryset = Profile.objects.select_related("user").all()
    serializer_class = ProfileSerializer


class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = User.objects.select_related("profile").all()
    serializer_class = UserProfileDetailSerializer