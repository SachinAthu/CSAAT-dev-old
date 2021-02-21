from django.contrib import admin

from .models import Profiles, Sessions, Cameras, CameraAngles, Videos, VideoClips

admin.site.register(Profiles)
admin.site.register(Sessions)
admin.site.register(Cameras)
admin.site.register(CameraAngles)
admin.site.register(Videos)
admin.site.register(VideoClips)
