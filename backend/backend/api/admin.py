from django.contrib import admin

from .models import TypicalChild, AntypicalChild, Sessions, Cameras, CameraAngles, Videos, VideoClips

admin.site.register(TypicalChild)
admin.site.register(AntypicalChild)
admin.site.register(Sessions)
admin.site.register(Cameras)
admin.site.register(CameraAngles)
admin.site.register(Videos)
admin.site.register(VideoClips)
