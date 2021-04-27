from django.db import models
from django.contrib.auth.models import User

# typical child
class TypicalChild(models.Model):
    def cdoc_path(instance, filename):
        return f'typical/t_{instance.sequence_no}_{instance.unique_no}/documents/{instance.cdoc_name}.pdf'

    def dgform_path(instance, filename):
        return f'typical/t_{instance.sequence_no}_{instance.unique_no}/documents/{instance.dgform_name}.pdf'
    
    def __str__(self):
        return self.name

    unique_no = models.CharField(
        max_length=20, blank=False, null=False, unique=False)
    sequence_no = models.CharField(
            max_length=20, blank=False, null=False, unique=False)
    name = models.CharField(max_length=200, blank=False, null=False)
    dob = models.DateField(
        auto_now=False, auto_now_add=False, blank=False, null=False)
    gender = models.CharField(max_length=20, blank=False, null=False)
    
    # consent document
    cdoc = models.FileField(
        upload_to=cdoc_path, max_length=500, blank=True, null=True)
    cdoc_name = models.CharField(max_length=100, blank=True, null=True)
    
    # data gathering document
    dgform = models.FileField(
        upload_to=dgform_path, max_length=500, blank=True, null=True)
    dgform_name = models.CharField(max_length=100, blank=True, null=True)


# antypical child
class AntypicalChild(models.Model):
    def cdoc_path(instance, filename):
        return f'antypical/at_{instance.clinic_no}/documents/{instance.cdoc_name}.pdf'

    def dgform_path(instance, filename):
        return f'antypical/at_{instance.clinic_no}/documents/{instance.dgform_name}.pdf'
    
    def __str__(self):
        return self.name

    clinic_no = models.CharField(
        max_length=50, blank=False, null=False, unique=False)
    name = models.CharField(max_length=200, blank=False, null=False)
    dob = models.DateField(
        auto_now=False, auto_now_add=False, blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True)
    
    # consent document
    cdoc = models.FileField(
        upload_to=cdoc_path, max_length=500, blank=True, null=True)
    cdoc_name = models.CharField(max_length=100, blank=True, null=True)
    
    # data gathering document
    dgform = models.FileField(
        upload_to=dgform_path, max_length=500, blank=True, null=True)
    dgform_name = models.CharField(max_length=100, blank=True, null=True)


# session
class Sessions(models.Model):
    date = models.DateField(
        auto_now=False, auto_now_add=False, blank=True, null=True)

    # typical child 
    tChild = models.ForeignKey(
        TypicalChild, on_delete=models.CASCADE, null=True, blank=True, related_name='t_sessions')
    
    # antypical child 
    atChild = models.ForeignKey(
        AntypicalChild, on_delete=models.CASCADE, null=True, blank=True, related_name='at_sessions')
    
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='sessions')

    def __str__(self):
        if self.tChild:
            child = TypicalChild.objects.get(id=self.tChild.id)
            return f'{str(self.date)} {str(child.name)}' 
        else:
            child = AntypicalChild.objects.get(id=self.atChild.id)
            return f'{str(self.date)} {str(child.name)}'


# cameras
class Cameras(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    resolution = models.CharField(max_length=100, blank=True, null=True)
    megapixels = models.DecimalField(
        max_digits=10, decimal_places=0, blank=True, null=True)

    def __str__(self):
        return self.name


# camera angles
class CameraAngles(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)

    def __str__(self):
        return self.name


# all uploaded videos
class Videos(models.Model):
    def video_upload_path(instance, filename):
        if instance.tChild:
            child = TypicalChild.objects.get(id=instance.tChild.id)
            session = Sessions.objects.get(id=instance.session.id)
            return f'typical/t_{child.sequence_no}_{child.unique_no}/sessions/session_{session.id}_{session.date}/videos/{instance.name}.{instance.file_extension}'

        else:
            child = AntypicalChild.objects.get(id=instance.atChild.id)
            session = Sessions.objects.get(id=instance.session.id)
            return f'antypical/at_{child.clinic_no}/sessions/session_{session.id}_{session.date}/videos/{instance.name}.{instance.file_extension}'

    def __str__(self):
        return self.name

    tChild = models.ForeignKey(
        TypicalChild, on_delete=models.CASCADE, null=True, blank=True, related_name='videos', default='')
    atChild = models.ForeignKey(
        AntypicalChild, on_delete=models.CASCADE, null=True, blank=True, related_name='videos', default='')
    session = models.ForeignKey(
        Sessions, on_delete=models.CASCADE, null=False, related_name='videos', default='')
    name = models.CharField(max_length=100, blank=True, null=True)
    video = models.FileField(
        upload_to=video_upload_path, max_length=100, blank=True, null=True)
    description = models.CharField(max_length=1000, blank=True, null=True)
    camera = models.ForeignKey(
        Cameras, on_delete=models.CASCADE, null=True, related_name='videos')
    camera_name = models.CharField(max_length=200, blank=True, null=True)
    camera_angle = models.CharField(max_length=200, blank=True, null=True)
    camera_angle_name = models.CharField(max_length=200, blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    file_extension = models.CharField(max_length=50, blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)

# all audio records
class Audios(models.Model):
    def audio_upload_path(instance, filename):
        if instance.tChild:
            child = TypicalChild.objects.get(id=instance.tChild.id)
            session = Sessions.objects.get(id=instance.session.id)
            return f'typical/t_{child.sequence_no}_{child.unique_no}/sessions/session_{session.id}_{session.date}/audio/{instance.name}.{instance.file_extension}'

        else:
            child = AntypicalChild.objects.get(id=instance.atChild.id)
            session = Sessions.objects.get(id=instance.session.id)
            return f'antypical/at_{child.clinic_no}/sessions/session_{session.id}_{session.date}/audio/{instance.name}.{instance.file_extension}'

    def __str__(self):
        return self.name

    tChild = models.ForeignKey(
        TypicalChild, on_delete=models.CASCADE, null=True, blank=True, related_name='audios', default='')
    atChild = models.ForeignKey(
        AntypicalChild, on_delete=models.CASCADE, null=True, blank=True, related_name='audios', default='')
    session = models.ForeignKey(
        Sessions, on_delete=models.CASCADE, null=False, related_name='audio', default='')
    name = models.CharField(max_length=100, blank=True, null=True)
    audio = models.FileField(
        upload_to=audio_upload_path, max_length=100, blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    file_extension = models.CharField(max_length=50, blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)



# edited video clips - not yet finished
class VideoClips(models.Model):
    video_id = models.ForeignKey(
        Videos, on_delete=models.CASCADE, related_name='video_clips')
    name = models.CharField(max_length=200, blank=False, null=False)
    video = models.FileField(upload_to='video_clips',
                             max_length=100, blank=True, null=True)
    duration = models.DurationField(blank=True, null=True)

    def __str__(self):
        return self.name
