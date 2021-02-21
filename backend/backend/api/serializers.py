from rest_framework import serializers

from .models import *

class ProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profiles
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

class VideoClipsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoClips
        fields = '__all__'