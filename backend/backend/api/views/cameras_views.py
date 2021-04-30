from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import generics

from api.models import Cameras
from api.serializers import CamerasSerializer


# get all cameras
@api_view(['GET'])
def cameras(request):
    camera_list = Cameras.objects.all().order_by('name')
    serializer = CamerasSerializer(camera_list, many=True)
    return Response(serializer.data)

# filter values
class CamerasListAPIView(generics.ListAPIView):
    queryset = Cameras.objects.all().order_by('-id')
    serializer_class = CamerasSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'resolution', 'megapixels']

# get specific camera
@api_view(['GET'])
def camera(request, pk):
    camera = Cameras.objects.get(id=pk)
    serializer = CamerasSerializer(camera, many=False)
    return Response(serializer.data)

# add a camera
@api_view(['POST'])
def addCamera(request):
    serializer = CamerasSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

# delete a camera
@api_view(['DELETE'])
def deleteCamera(request, pk):
    camera = Cameras.objects.get(id=pk)
    camera.delete()

    return Response('camera was deleted')

# delete all Cameras
@api_view(['DELETE'])
def deleteCameras(request):
    Cameras.objects.all().delete()

    return Response('all Cameras were deleted')
