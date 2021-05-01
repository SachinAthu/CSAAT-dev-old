from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
from django.conf import settings
import shutil

from api.models import Sessions, Videos, TypicalChild, AntypicalChild
from api.serializers import SessionsSerializer

# get all sessions
@api_view(['GET'])
def allSessions(request):
    session_list = Sessions.objects.all().order_by('-date')
    serializer = SessionsSerializer(session_list, many=True)
    return Response(serializer.data)

# get all sessions for a typical child
@api_view(['GET'])
def tSessions(request, pk):
    session_list = Sessions.objects.filter(tChild=pk).order_by('-date')
    serializer = SessionsSerializer(session_list, many=True)
    return Response(serializer.data)

# get all sessions for a antypical child
@api_view(['GET'])
def atSessions(request, pk):
    session_list = Sessions.objects.filter(atChild=pk).order_by('-date')
    serializer = SessionsSerializer(session_list, many=True)
    return Response(serializer.data)

# get a specific session
@api_view(['GET'])
def session(request, pk):
    print(pk)
    session = Sessions.objects.get(id=pk)
    serializer = SessionsSerializer(session, many=False)
    return Response(serializer.data)

# add a session for typical child
@api_view(['POST'])
def addTSession(request):
    print(request.data)
    serializer = SessionsSerializer(data=request.data)
    child = TypicalChild.objects.get(pk=request.data['child'])

    if serializer.is_valid():
        serializer.save(tChild=child)
    else:
        print(serializer.errors)

    return Response(serializer.data)

# add a session for antypical child
@api_view(['POST'])
def addATSession(request):
    print(request.data)
    serializer = SessionsSerializer(data=request.data)
    child = AntypicalChild.objects.get(pk=request.data['child'])

    if serializer.is_valid():
        serializer.save(atChild=child)
    else:
        print(serializer.errors)

    return Response(serializer.data)

# edit a session
@api_view(['PUT'])
def updateSession(request, pk):
    session = Sessions.objects.get(id=pk)
    serializer = SessionsSerializer(data=request.data, instance=session)
    
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)

    return Response(serializer.data)

# delete a session 
@api_view(['DELETE'])
def deleteSession(request, pk):
    session = Sessions.objects.get(id=pk)
    # session.delete()

    res = ''
    
    try:
        path = ''
        if session.tChild:
            child = TypicalChild.objects.get(id=session.tChild.id)
            path = f'typical/t_{child.sequence_no}_{child.unique_no}/sessions/{session.id}_{session.date}'
        else:
            child = AntypicalChild.objects.get(id=session.atChild.id)
            path = f'antypical/at_{child.clinic_no}/sessions/{session.id}_{session.date}'

        shutil.rmtree(os.path.join(settings.MEDIA_ROOT, path), ignore_errors=True)
        res += 'all videos were deleted(records, files)'

        session.delete()
        res += 'session was deleted'
    
    except:
        res = 'error, something went wrong!'

    return Response(res)
