from django.urls import path
from .views import (
    NoteListCreateView,
    NoteRetrieveUpdateDeleteView,
    QuestionListCreateView,
    QuestionRetrieveUpdateDeleteView,
    ProfileListView,
    UserProfileDetailView,
)

urlpatterns = [
    path("notes/", NoteListCreateView.as_view(), name="notes-list-create"),
    path("notes/<int:pk>/", NoteRetrieveUpdateDeleteView.as_view(), name="note-detail"),

    path("questions/", QuestionListCreateView.as_view(), name="questions-list-create"),
    path("questions/<int:pk>/", QuestionRetrieveUpdateDeleteView.as_view(), name="question-detail"),

    path("profiles/", ProfileListView.as_view(), name="profiles-list"),
    path("users/<int:pk>/", UserProfileDetailView.as_view(), name="user-profile-detail"),
]