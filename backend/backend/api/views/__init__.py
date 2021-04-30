from rest_framework.decorators import api_view
from rest_framework.response import Response

from .typical_children_views import *
from .antypical_children_views import *
from .sessions_views import *
from .cameras_views import *
from .videos_views import *
from .audio_views import *
from .video_clips_views import *
from .camera_angles_views import *

@api_view(['GET'])
def welcome(request):
    return Response({'msg': 'API working.'})