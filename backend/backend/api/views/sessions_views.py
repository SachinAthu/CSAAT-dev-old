from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Sessions, Videos
from api.serializers import SessionsSerializer

# get all sessions for a profile
@api_view(['GET'])
def allSessions(request):
    session_list = Sessions.objects.all().order_by('-date')
    serializer = SessionsSerializer(session_list, many=True)
    return Response(serializer.data)

# get all sessions for a profile
@api_view(['GET'])
def sessions(request, pk):
    session_list = Sessions.objects.filter(profile=pk).order_by('-date')
    serializer = SessionsSerializer(session_list, many=True)
    return Response(serializer.data)

# get a specific session
@api_view(['GET'])
def session(request, pk):
    session = Sessions.objects.get(id=pk)
    serializer = SessionsSerializer(session, many=False)
    return Response(serializer.data)

# add a session
@api_view(['POST'])
def addSession(request):
    serializer = SessionsSerializer(data=request.data)

    print('called session')
    print(request.data)

    if serializer.is_valid():
        serializer.save()
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


    # delete all the videos for this session
    videos = Videos.objects.filter(session=pk)

    res = ''
    
    try:
        session.delete()
        res = 'Session was deleted'
        
        for v in videos:
            #v.delete()
            if v.video:
                if default_storage.exists(v.video.path):
                    print(v.video.path)
                    default_storage.delete(v.video.path)

        res += 'All Videos were deleted(records, files)'
    
    except:
        res = 'error, something went wrong!'

    return Response(res)

# delete all sessions
@api_view(['DELETE'])
def deleteSessions(request):
    sessions = Sessions.objects.all()

    res = ''

    try:
        for s in sessions:
            videos = Videos.objects.filter(session=s.id)
            s.delete()
            
            for v in videos:
                #v.delete()
                if v.video:
                    if default_storage.exists(v.video.path):
                        default_storage.delete(v.video.path)
        res += 'All Sessions were deleted(records, videos, video files)'

    except:
        res = 'error, something went wrong!'

    return Response(res)


