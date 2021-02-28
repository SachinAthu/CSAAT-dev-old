from django.db import models
from django.contrib.auth.models import User

# video profile of a child
class Profiles(models.Model):
    # has to be unique true. for development only.
    def consent_doc_path(instance, filename):
        return f'{instance.clinic_no}/consent_doc/{instance.consent_doc_name}.pdf'
    
    def __str__(self):
        return self.name

    clinic_no = models.CharField(
        max_length=50, blank=False, null=False, unique=False)
    name = models.CharField(max_length=200, blank=False, null=False)
    dob = models.DateField(
        auto_now=False, auto_now_add=False, blank=True, null=True)
    sex = models.CharField(max_length=20, blank=True, null=True)
    consent_doc = models.FileField(
        upload_to=consent_doc_path, max_length=100, blank=True, null=True)
    consent_doc_name = models.CharField(max_length=200, blank=True, null=True)


# video session
class Sessions(models.Model):
    date = models.DateField(
        auto_now=False, auto_now_add=False, blank=True, null=True)
    profile = models.ForeignKey(
        Profiles, on_delete=models.CASCADE, null=True, related_name='sessions')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='sessions')

    def __str__(self):
        return str(self.date)


# cameras
class Cameras(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)
    resolution = models.CharField(max_length=200, blank=True, null=True)
    megapixels = models.DecimalField(
        max_digits=10, decimal_places=0, blank=True, null=True)

    def __str__(self):
        return self.name


# camera angles
class CameraAngles(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)

    def __str__(self):
        return self.name


# all uploaded videos
class Videos(models.Model):

    def video_upload_path(instance, filename):
        profile = Profiles.objects.get(id=instance.profile)
        session = Sessions.objects.get(id=instance.session)
        # get the camera name
        camera = Cameras.objects.get(id=instance.camera)

        type = ''
        if 'mp4' in instance.filetype:
            type = 'mp4'
        else:
            type = 'mp4'

        return f'{profile.clinic_no}/sessions/session_{session.date}_{session.id}/{camera.name}.{type}'

    def __str__(self):
        return self.name

    profile = models.ForeignKey(
        Profiles, on_delete=models.CASCADE, null=False, related_name='videos', default='')
    session = models.ForeignKey(
        Sessions, on_delete=models.CASCADE, null=False, related_name='videos', default='')
    camera = models.ForeignKey(
        Cameras, on_delete=models.CASCADE, null=True, related_name='videos')
    name = models.CharField(max_length=200, blank=False, null=False)
    description = models.CharField(max_length=1000, blank=True, null=True)
    video = models.FileField(
        upload_to=video_upload_path, max_length=100, blank=True, null=True)
    filetype = models.CharField(max_length=50, blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)
    camera_angle = models.CharField(max_length=200, blank=True, null=True)


# edited video clips
class VideoClips(models.Model):
    video_id = models.ForeignKey(
        Videos, on_delete=models.CASCADE, related_name='video_clips')
    name = models.CharField(max_length=200, blank=False, null=False)
    video = models.FileField(upload_to='video_clips',
                             max_length=100, blank=True, null=True)
    duration = models.DurationField(blank=True, null=True)

    def __str__(self):
        return self.name
