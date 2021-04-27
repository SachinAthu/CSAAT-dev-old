from rest_framework import serializers

from .models import *

class TypicalChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypicalChild
        fields = '__all__'

class AntypicalChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = AntypicalChild
        fields = '__all__'

class SessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sessions
        fields = '__all__'

class CamerasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cameras
        fields = '__all__'

class CameraAngleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CameraAngles
        fields = '__all__'

class VideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Videos
        fields = '__all__'

class AudiosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audios
        fields = '__all__'

class VideoClipsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoClips
        fields = '__all__'