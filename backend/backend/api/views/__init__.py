from rest_framework.decorators import api_view
from rest_framework.response import Response

from .profiles_views import *
from .sessions_views import *
from .cameras_views import *
from .videos_views import *
from .video_clips_views import *

@api_view(['GET'])
def welcome(request):
    return Response({'msg': 'API working.'})