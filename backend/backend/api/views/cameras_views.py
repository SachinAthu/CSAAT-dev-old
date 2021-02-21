from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Cameras, CameraAngles
from api.serializers import CamerasSerializer, CameraAngleSerializer

# get all cameras
@api_view(['GET'])
def cameras(request):
    camera_list = Cameras.objects.all().order_by('name')
    serializer = CamerasSerializer(camera_list, many=True)
    return Response(serializer.data)

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

# edit a camera
@api_view(['PUT'])
def updateCamera(request, pk):
    camera = Cameras.objects.get(id=pk)
    serializer = CamerasSerializer(data=request.data, instance=camera)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

# delete a camera
@api_view(['DELETE'])
def deleteCamera(request, pk):
    camera = Cameras.objects.get(id=pk)
    camera.delete()

    return Response('Camera was deleted')

# delete all Cameras
@api_view(['DELETE'])
def deleteCameras(request):
    Cameras.objects.all().delete()

    return Response('All Cameras were deleted')


# get all camera angles
@api_view(['GET'])
def cameraAngles(request):
    camera_angle_list = CameraAngles.objects.all().order_by('name')
    serializer = CameraAngleSerializer(camera_angle_list, many=True)
    return Response(serializer.data)
