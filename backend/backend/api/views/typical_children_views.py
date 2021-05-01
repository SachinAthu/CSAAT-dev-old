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

from api.models import TypicalChild
from api.serializers import TypicalChildSerializer

# get all children
@api_view(['GET'])
def tChildren(request):
    paginator = PageNumberPagination()
    paginator.page_size = 20

    tChildren_objects = TypicalChild.objects.all().order_by('-id')
    result_page = paginator.paginate_queryset(tChildren_objects, request)
    serializer = TypicalChildSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# filter values
class TypicalChildrenListAPIView(generics.ListAPIView):
    queryset = TypicalChild.objects.all().order_by('-id')
    serializer_class = TypicalChildSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['unique_no', 'sequence_no', 'name', 'dob', 'gender']

# get specific child
@api_view(['GET'])
def tChild(request, pk):
    child = TypicalChild.objects.get(id=pk)
    serializer = TypicalChildSerializer(child, many=False)
    return Response(serializer.data)

# add a child
@api_view(['POST'])
def addTChild(request):
    serializer = TypicalChildSerializer(data=request.data)

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
def updateTChild(request, pk):
    child = TypicalChild.objects.get(id=pk)
    serializer = TypicalChildSerializer(data=request.data, instance=child)

    if serializer.is_valid():
        print(request.data)
    
        cd = cd_name = dgf = dgf_name = None
        
        if request.data["cdoc"]:
            cd = request.data["cdoc"]
            cd_name = f'cdoc_{request.data["unique_no"]}.pdf'
    
        if request.data["dgform"]:
            dgf = request.data["dgform"]
            dgf_name = f'dgform_{request.data["unique_no"]}.pdf'

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
def deleteTChild(request, pk):
    child = TypicalChild.objects.get(id=pk)
    res = ''

    child.delete()
    res += 'typical child record was deleted. '

    try:
        shutil.rmtree(os.path.join(settings.MEDIA_ROOT, f'typical/t_{child.sequence_no}_{child.unique_no}'), ignore_errors=True)
        res += 'all referenced files were deleted.'
    except:
        res = 'error, something went wrong!'

    return Response(res)

# delete all children
@api_view(['DELETE'])
def deleteTChildren(request):
    children = TypicalChild.objects.all()
    res = ''

    try:
        for c in children:
            c.delete()
            shutil.rmtree(os.path.join(settings.MEDIA_ROOT, f'typical/t_{c.sequence_no}_{c.unique_no}'), ignore_errors=True)
        res = 'all typical children were deleted(records, cdocs)'
    except:
        res = 'error, something went wrong!'

    return Response(res)
