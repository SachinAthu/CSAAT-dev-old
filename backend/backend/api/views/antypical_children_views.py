from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
import os
from django.conf import settings
import shutil

from api.models import AntypicalChild
from api.serializers import AntypicalChildSerializer

# get all children
@api_view(['GET'])
def atChildren(request):
    child_list = AntypicalChild.objects.all().order_by('-id')
    serializer = AntypicalChildSerializer(child_list, many=True)
    return Response(serializer.data)

# get specific child
@api_view(['GET'])
def atChild(request, pk):
    child = AntypicalChild.objects.get(id=pk)
    serializer = AntypicalChildSerializer(child, many=False)
    return Response(serializer.data)

# add a child
@api_view(['POST'])
def addATChild(request):
    serializer = AntypicalChildSerializer(data=request.data)

    if serializer.is_valid():
        print(request.data)
        cd = cd_name = dgf = dgf_name = None
        
        if request.data["cdoc"]:
            cd = request.data["cdoc"]
            cd_name = f'cdoc_{request.data["unique_no"]}.pdf'
    
        if request.data["dgform"]:
            dgf = request.data["dgform"]
            dgf_name = f'dgform_{request.data["unique_no"]}.pdf'
    
        serializer.save(cdoc=cd, cdoc_name=cd_name, dgform=dgf, dgform_name=dgf_name)
    else:
        print(serializer.errors)

    return Response(serializer.data)

# update a child
@api_view(['PUT'])
def updateATChild(request, pk):
    print(request.data)
    child = AntypicalChild.objects.get(id=pk)
    serializer = AntypicalChildSerializer(data=request.data, instance=child)
    
    if serializer.is_valid():
        cd = cd_name = dgf = dgf_name = None
        # previous values
        cdoc = child.cdoc
        cdoc_name = child.cdoc_name
        dgform = child.dgform
        dgform_name = child.dgform_name

        if request.data["cdoc"]:
            cd = request.data["cdoc"]
            cd_name = f'cdoc_{request.data["clinic_no"]}.pdf'
        elif not request.data["cdoc"] and default_storage.exists(cdoc.path):
            cd = request.data["cdoc"]
            cd_name = f'cdoc_{request.data["clinic_no"]}.pdf'
            # delete previous file
            try:
                default_storage.delete(dgform.path)
            except:
                print('previous cdoc deletion error')
    
        if request.data["dgform"]:
            dgf = request.data["dgform"]
            dgf_name = f'dgform_{request.data["clinic_no"]}.pdf'
        elif not request.data["dgform"] and default_storage.exists(dgform.path):
            dgf = request.data["dgform"]
            dgf_name = f'dgform_{request.data["clinic_no"]}.pdf'
            # delete previous file
            try:
                default_storage.delete(dgform.path)
            except:
                print('previous dgform deletion error')
    
        serializer.save(cdoc=cd, cdoc_name=cd_name, dgform=dgf, dgform_name=dgf_name)
    else:
        print(serializer.errors)

    return Response(serializer.data)

# delete a child
@api_view(['DELETE'])
def deleteATChild(request, pk):
    child = AntypicalChild.objects.get(id=pk)
    res = ''

    child.delete()
    res += 'antypical child record was deleted. '

    try:
        shutil.rmtree(os.path.join(settings.MEDIA_ROOT, f'antypical/at_{child.clinic_no}'), ignore_errors=True)
        res += 'all referenced files were deleted.'
    except:
        res = 'error, something went wrong!'

    return Response(res)

# delete all children
@api_view(['DELETE'])
def deleteATChildren(request):
    children = AntypicalChild.objects.all()
    res = ''

    try:
        for c in children:
            c.delete()
            shutil.rmtree(os.path.join(settings.MEDIA_ROOT, f'antypical/at_{c.clinic_no}'), ignore_errors=True)
        res = 'all typical children were deleted(records, cdocs)'
    except:
        res = 'error, something went wrong!'

    return Response(res)
