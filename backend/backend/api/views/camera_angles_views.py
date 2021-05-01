from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import generics

from api.models import CameraAngles
from api.serializers import CameraAngleSerializer


# get all camera angles
@api_view(['GET'])
def cameraAngles(request):
    camera_angle_list = CameraAngles.objects.all().order_by('name')
    serializer = CameraAngleSerializer(camera_angle_list, many=True)
    return Response(serializer.data)

# filter values
class CameraAnglesListAPIView(generics.ListAPIView):
    queryset = CameraAngles.objects.all().order_by('-id')
    serializer_class = CameraAngleSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

# get spesific camera angle
@api_view(['GET'])
def cameraAngle(request, pk):
    camera_angle = CameraAngles.objects.get(id=pk)
    serializer = CameraAngleSerializer(camera_angle, many=False)
    return Response(serializer.data)

# add a camera angle
@api_view(['POST'])
def addCameraAngle(request):
    serializer = CameraAngleSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

# delete a camera angle
@api_view(['DELETE'])
def deleteCameraAngle(request, pk):
    camera_angle = CameraAngles.objects.get(id=pk)
    camera_angle.delete()

    return Response('camera angle was deleted')

# delete all camera angles
@api_view(['DELETE'])
def deleteCameraAngles(request):
    CameraAngles().objects.all().delete()

    return Response('all camera angles were deleted')