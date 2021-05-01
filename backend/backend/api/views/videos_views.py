from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import shutil
import os
from django.conf import settings
from django.core.files.storage import default_storage

from api.models import Videos, Sessions, Cameras, CameraAngles, TypicalChild, AntypicalChild
from api.serializers import VideosSerializer


# get all videos
@api_view(['GET'])
def allVideos(request):
    video_list = Videos.objects.all()
    serializer = VideosSerializer(video_list, many=True)
    return Response(serializer.data)

# get all videos for a session
@api_view(['GET'])
def sessionVideos(request, pk):
    session = Sessions.objects.get(id=pk)
    video_list = Videos.objects.filter(session__exact=session)
    serializer = VideosSerializer(video_list, many=True)
    return Response(serializer.data)

# add typical child video
@api_view(['POST'])
def addTVideo(request):
    serializer = VideosSerializer(data=request.data)

    if serializer.is_valid():
        # set video name
        camera = Cameras.objects.get(id=request.data['camera'])
        camera_angle = CameraAngles.objects.get(id=request.data['camera_angle'])
        child = TypicalChild.objects.get(id=request.data['tChild'])
        session = Sessions.objects.get(id=request.data['session'])

        name = f'{child.unique_no}_{session.id}_{camera.name}'
        
        #set file extension
        file_type = request.data['file_type']
        file_extension = ''
        if not file_type == None: 
            t = file_type.split('/')[1]
            if t == 'mp4':
                file_extension = '.mp4'
            elif t == 'x-matroska':
                file_extension = '.mkv'
            else:
                file_extension = '.mp4'

        serializer.save(name=name, camera_name=camera.name, camera_angle_name=camera_angle.name, file_extension=file_extension)
    else:
        print(serializer.errors)

    return Response(serializer.data)

# add antypical child video
@api_view(['POST'])
def addATVideo(request):
    serializer = VideosSerializer(data=request.data)

    if serializer.is_valid():
        # set video name
        camera = Cameras.objects.get(id=request.data['camera'])
        camera_angle = CameraAngles.objects.get(id=request.data['camera_angle'])
        child = TypicalChild.objects.get(id=request.data['atChild'])
        session = Sessions.objects.get(id=request.data['session'])

        name = f'{child.clinic_no}_{session.id}_{camera.name}'
        
        #set file extension
        file_type = request.data['file_type']
        file_extension = ''
        if not file_type == None: 
            t = file_type.split('/')[1]
            if t == 'mp4':
                file_extension = '.mp4'
            elif t == 'x-matroska':
                file_extension = '.mkv'
            else:
                file_extension = '.mp4'

        serializer.save(name=name, camera_name=camera.name, camera_angle_name=camera_angle.name, file_extension=file_extension)
    else:
        print(serializer.errors)

    return Response(serializer.data)

# delete a video
@api_view(['DELETE'])
def deleteVideo(request, pk):
    video = Videos.objects.get(id=pk)
    res = ''

    try:
        video.delete()
        res += 'video record was deleted. '
        if video.video:
            if default_storage.exists(video.video.path):
                default_storage.delete(video.video.path)
                res += 'video file was deleted. '
    except:
        res = 'error, something went wrong!'

    return Response(res)

# delete all videos
@api_view(['DELETE'])
def deleteVideos(request):
    videos = Videos.objects.all()
    res = ''
    
    try:
        for v in videos:
            v.delete()
            if v.video:
                if default_storage.exists(v.video.path):
                    default_storage.delete(v.video.path)
        res = 'all Videos were deleted(records, files)'
    except:
        res = 'error, something went wrong!'

    return Response(res)