from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
import os
from django.conf import settings
import shutil

from api.models import Profiles
from api.serializers import ProfilesSerializer

# get all profiles
@api_view(['GET'])
def profiles(request):
    profile_list = Profiles.objects.all().order_by('-id')
    serializer = ProfilesSerializer(profile_list, many=True)
    return Response(serializer.data)

# get specific profile
@api_view(['GET'])
def profile(request, pk):
    profile = Profiles.objects.get(id=pk)
    serializer = ProfilesSerializer(profile, many=False)
    return Response(serializer.data)

# add a profile
@api_view(['POST'])
def addProfile(request):
    serializer = ProfilesSerializer(data=request.data)

    if serializer.is_valid():
    #     doc_name = serializer.objects.consent_doc_name
    #     if doc_name:
    #         serializer.objects.consent_doc_name = str(serializer.objects.clinic_no + '_consent_doc') 
        serializer.save()
    else:
        print(serializer.errors)

    return Response(serializer.data)

# edit a profile
@api_view(['PUT'])
def updateProfile(request, pk):
    profile = Profiles.objects.get(id=pk)
    serializer = ProfilesSerializer(data=request.data, instance=profile)
    
    doc = profile.consent_doc
    doc_name = profile.consent_doc_name

    try:
        if doc and request.FILES.get('consent_doc'):
            # delete previous file
            if default_storage.exists(doc.path):
                default_storage.delete(doc.path)
    except:
        print('error, previous consent doc deletion failed!')

    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)

    return Response(serializer.data)

# delete a profile
@api_view(['DELETE'])
def deleteProfile(request, pk):
    profile = Profiles.objects.get(id=pk)
    res = ''

    profile.delete()
    res += 'Profile record was deleted. '
    if profile.consent_doc:
        if default_storage.exists(profile.consent_doc.path):
            shutil.rmtree(os.path.join(settings.MEDIA_ROOT, profile.clinic_no), ignore_errors=True)
            res += 'All referenced files were deleted. '
    # try:

    # except:
    #     res = 'error, something went wrong!'

    return Response(res)

# delete all profiles
@api_view(['DELETE'])
def deleteProfiles(request):
    profiles = Profiles.objects.all()
    res = ''

    try:
        for p in profiles:
            p.delete()
            if p.consent_doc:
                if default_storage.exists(p.consent_doc.path):
                    default_storage.delete(p.consent_doc.path)
        res = 'All Profiles were deleted(records, consent docs)'
    except:
        res = 'error, something went wrong!'

    return Response(res)
