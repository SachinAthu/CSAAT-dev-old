from django.urls import path

from .views import *

urlpatterns = [
    path('', welcome, name='welcome'),

    path('t-children/', tChildren, name='t-children'),
    path('t-f-children/', TypicalChildrenListAPIView.as_view(), name='t-f-children'),
    path('t-child/<str:pk>/', tChild, name='t-child'),
    path('add-t-child/', addTChild, name='add-t-child'),
    path('update-t-child/<str:pk>/', updateTChild, name='update-t-child'),
    path('delete-t-child/<str:pk>/', deleteTChild, name='delete-t-child'),
    path('delete-t-children/', deleteTChildren, name='delete-t-children'),

    path('at-children/', atChildren, name='t-children'),
    path('at-f-children/', AntypicalChildrenListAPIView.as_view(), name='at-f-children'),
    path('at-child/<str:pk>/', atChild, name='at-child'),
    path('add-at-child/', addATChild, name='add-at-child'),
    path('update-at-child/<str:pk>/', updateATChild, name='update-at-child'),
    path('delete-at-child/<str:pk>/', deleteATChild, name='delete-at-child'),
    path('delete-at-children/', deleteATChildren, name='delete-at-children'),

    path('sessions/', allSessions, name='all-sessions'),
    path('session/<str:pk>/', session, name='session'),
    path('t-sessions/<str:pk>/', tSessions, name='t-sessions'),
    path('at-sessions/<str:pk>/', atSessions, name='at-sessions'),
    path('add-t-session/', addTSession, name='add-t-session'),
    path('add-at-session/', addATSession, name='add-at-session'),
    path('update-session/<str:pk>/', updateSession, name='update-session'),
    path('delete-session/<str:pk>/', deleteSession, name='delete-session'),

    path('videos/', allVideos, name='videos'),
    path('videos/<str:pk>/', sessionVideos, name='session-videos'),
    path('add-t-video/', addTVideo, name='add-t-video'),
    path('add-at-video/', addATVideo, name='add-at-video'),
    path('update-t-video/<str:pk>/', updateTVideo, name='update-t-video'),
    path('update-at-video/<str:pk>/', updateATVideo, name='update-at-video'),
    path('delete-video/<str:pk>/', deleteVideo, name='delete-video'),
    path('delete-videos/', deleteVideos, name='delete-videos'),

    path('audios/', allAudios, name='audios'),
    path('audio/<str:pk>/', sessionAudio, name='session-audio'),
    path('add-t-audio/', addTAudio, name='add-t-audio'),
    path('add-at-audio/', addATAudio, name='add-at-audio'),
    # path('update-t-audio/<str:pk>/', updateTAudio, name='update-t-audio'),
    # path('update-at-audio/<str:pk>/', updateATAudio, name='update-at-audio'),
    path('delete-audio/<str:pk>/', deleteAudio, name='delete-audio'),
    path('delete-audios/', deleteAudios, name='delete-audios'),

    path('video-clips/<str:pk>/', videoClips, name='profiles'),
    path('add-video-clip/', addVideoClip, name='add-video-clip'),
    path('delete-video-clip/<str:pk>/', deleteVideoClip, name='delete-video-clip'),
    path('delete-video-clips/', deleteVideoClips, name='delete-video-clips'),

    path('cameras/', cameras, name='cameras'),
    path('camera/<str:pk>/', camera, name='camera'),
    path('add-camera/', addCamera, name='add-camera'),
    path('update-camera/<str:pk>/', updateCamera, name='update-camera'),
    path('delete-camera/<str:pk>/', deleteCamera, name='delete-camera'),
    path('delete-cameras/', deleteCameras, name='delete-cameras'),

    path('camera-angles/', cameraAngles, name='camera-angles'),
    path('camera-angle/<str:pk>', cameraAngle, name='camera-angle'),
]