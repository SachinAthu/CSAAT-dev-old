from django.urls import path

from .views import *

urlpatterns = [
    path('', welcome, name='welcome'),

    path('profiles/', profiles, name='profiles'),
    path('profile/<str:pk>/', profile, name='profile'),
    path('add-profile/', addProfile, name='add-profile'),
    path('update-profile/<str:pk>/', updateProfile, name='update-profile'),
    path('delete-profile/<str:pk>/', deleteProfile, name='delete-profile'),
    path('delete-profiles/', deleteProfiles, name='delete-profiles'),

    path('sessions/', allSessions, name='all-sessions'),
    path('sessions/<str:pk>/', sessions, name='sessions'),
    path('session/<str:pk>/', session, name='session'),
    path('add-session/', addSession, name='add-session'),
    path('update-session/<str:pk>', updateSession, name='update-session'),
    path('delete-session/<str:pk>/', deleteSession, name='delete-session'),
    path('delete-sessions/', deleteSessions, name='delete-sessions'),

    path('cameras/', cameras, name='cameras'),
    path('camera/<str:pk>/', camera, name='camera'),
    path('add-camera/', addCamera, name='add-camera'),
    path('update-camera/<str:pk>/', updateCamera, name='update-camera'),
    path('delete-camera/<str:pk>/', deleteCamera, name='delete-camera'),
    path('delete-cameras/', deleteCameras, name='delete-cameras'),

    path('videos/', allVideos, name='all-videos'),
    path('videos/<str:pk>/', sessionVideos, name='session-videos'),
    path('add-video/', addVideo, name='add-video'),
    path('update-video/<str:pk>/', updateVideo, name='update-video'),
    path('delete-video/<str:pk>/', deleteVideo, name='delete-video'),
    path('delete-videos/', deleteVideos, name='delete-videos'),

    path('video-clips/<str:pk>/', videoClips, name='profiles'),
    path('add-video-clip/', addVideoClip, name='add-video-clip'),
    path('delete-video-clip/<str:pk>/', deleteVideoClip, name='delete-video-clip'),
    path('delete-video-clips/', deleteVideoClips, name='delete-video-clips'),

    path('camera-angles/', cameraAngles, name='camera-angles'),
]