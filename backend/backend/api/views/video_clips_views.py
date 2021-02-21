from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import VideoClips
from api.serializers import VideoClipsSerializer

# get all video clips for a video
@api_view(['GET'])
def videoClips(request, videoID):
    video_clip_list = VideoClips.objects.filter(video_id_exact=videoID)
    serializer = VideoClipsSerializer(video_clip_list, many=True)
    return Response(serializer.data)

# add one video clip
@api_view(['POST'])
def addVideoClip(request):
    serializer = VideoClipsSerializer(data=request.data)

    if serializer.is_valid():
        # should create a thumbnail before save
        ##
        serializer.save()

    return Response(serializer.data)

# delete a video clip
@api_view(['DELETE'])
def deleteVideoClip(request, pk):
    video_clip = VideoClips.objects.get(id=pk)
    video_clip.delete()

    return Response('Video clip was deleted')

# delete all video clips
@api_view(['DELETE'])
def deleteVideoClips(request):
    VideoClips.objects.all().delete()

    return Response('All Video clips were deleted')