from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
import os
from django.conf import settings
import shutil
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from rest_framework import generics


from api.models import AntypicalChild
from api.serializers import AntypicalChildSerializer

# get all children
@api_view(['GET'])
def atChildren(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    atChildren_objects = AntypicalChild.objects.all().order_by('-id')
    result_page = paginator.paginate_queryset(atChildren_objects, request)
    serializer = AntypicalChildSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# filter values
class AntypicalChildrenListAPIView(generics.ListAPIView):
    queryset = AntypicalChild.objects.all().order_by('-id')
    serializer_class = AntypicalChildSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['clinic_no', 'name', 'dob', 'gender']

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
            cd_name = f'cdoc_{request.data["clinic_no"]}.pdf'
    
        if request.data["dgform"]:
            dgf = request.data["dgform"]
            dgf_name = f'dgform_{request.data["clinic_no"]}.pdf'
    
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
        print(request.data)
        cd = cd_name = dgf = dgf_name = None
        
        if request.data["cdoc"]:
            cd = request.data["cdoc"]
            cd_name = f'cdoc_{request.data["clinic_no"]}.pdf'
    
        if request.data["dgform"]:
            dgf = request.data["dgform"]
            dgf_name = f'dgform_{request.data["clinic_no"]}.pdf'

         # delete previous cdoc
        if not child.cdoc == None:
            if default_storage.exists(child.cdoc.path):
                default_storage.delete(child.cdoc.path)

        # delete previous dgform
        if not child.dgform == None:
            if default_storage.exists(child.dgform.path):
                default_storage.delete(child.dgform.path)
    
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
