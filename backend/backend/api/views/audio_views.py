from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage

from api.models import Audios, Sessions, TypicalChild, AntypicalChild
from api.serializers import AudiosSerializer

# get all audios
@api_view(['GET'])
def allAudios(request):
    audio_list = Audios.objects.all()
    serializer = AudiosSerializer(audio_list, many=True)
    return Response(serializer.data)


# get all audios for a session
@api_view(['GET'])
def sessionAudio(request, pk):
    session = Sessions.objects.get(id=pk)
    audio_list = Audios.objects.filter(session__exact=session)
    print(audio_list)
    serializer = AudiosSerializer(audio_list, many=True)
    return Response(serializer.data)


# add typical child audio
@api_view(['POST'])
def addTAudio(request):
    serializer = AudiosSerializer(data=request.data)

    if serializer.is_valid():
        # set audio name
        child = TypicalChild.objects.get(id=request.data['tChild'])
        session = Sessions.objects.get(id=request.data['session'])

        name = f'{child.unique_no}_{session.id}'
        
        #set file extension
        file_type = request.data['file_type']
        file_extension = ''
        if not file_type == None: 
            t = file_type.split('/')[1]
            if t == 'mp3':
                file_extension = '.mp3'
            if t == 'mp4':
                file_extension = '.mp4'
            else:
                file_extension = '.mp3'

        serializer.save(name=name, file_extension=file_extension)
    else:
        print(serializer.errors)

    return Response(serializer.data)


# add antypical child audio
@api_view(['POST'])
def addATAudio(request):
    serializer = AudiosSerializer(data=request.data)

    if serializer.is_valid():
        # set audio name
        child = TypicalChild.objects.get(id=request.data['atChild'])
        session = Sessions.objects.get(id=request.data['session'])

        name = f'{child.clinic_no}_{session.id}'
        
        #set file extension
        file_type = request.data['file_type']
        file_extension = ''
        if not file_type == None: 
            t = file_type.split('/')[1]
            if t == 'mp3':
                file_extension = '.mp3'
            if t == 'mp4':
                file_extension = '.mp4'
            else:
                file_extension = '.mp3'

        serializer.save(name=name, file_extension=file_extension)
    else:
        print(serializer.errors)

    return Response(serializer.data)

# delete a audio
@api_view(['DELETE'])
def deleteAudio(request, pk):
    audio = Audios.objects.get(id=pk)
    res = ''

    try:
        audio.delete()
        res += 'audio record was deleted. '
        if audio.audio:
            if default_storage.exists(audio.audio.path):
                default_storage.delete(audio.audio.path)
                res += 'audio file was deleted. '
    except:
        res = 'error, something went wrong!'

    return Response(res)

# delete all audios
@api_view(['DELETE'])
def deleteAudios(request):
    audios = Audios.objects.all()
    res = ''
    
    try:
        for a in audios:
            a.delete()
            if a.audio:
                if default_storage.exists(a.audio.path):
                    default_storage.delete(a.audio.path)
        res = 'all audios were deleted(records, files)'
    except:
        res = 'error, something went wrong!'

    return Response(res)