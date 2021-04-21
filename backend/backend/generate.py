import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

import random
from api.models import TypicalChild, AntypicalChild, Cameras, CameraAngles
from faker import Faker

fakegen = Faker()

genders = ['Male', 'Female']

def add_tChilds(n = 50):
    
    for i in range(n):
        fake_unique_no = random.randint(100, 1000)
        fake_sequence_no = random.randint(0, 1000)
        fake_name = ''
        fake_dob = fakegen.date()
        fake_sex = random.choice(genders)

        if fake_sex == 'Male':
            # generate male
            fake_name = fakegen.name_male()
        else:
            # generate female
            fake_name = fakegen.name_female()

        tChild = TypicalChild.objects.get_or_create(unique_no=fake_unique_no, sequence_no=fake_sequence_no, name=fake_name, dob=fake_dob, gender=fake_sex)[0]
        tChild.save()

def add_atChilds(n = 50):
    
    for i in range(n):
        fake_clinic_no = 'LRH' + str(random.randint(100, 1000))
        fake_name = ''
        fake_dob = fakegen.date()
        fake_sex = random.choice(genders)

        if fake_sex == 'Male':
            # generate male
            fake_name = fakegen.name_male()
        else:
            # generate female
            fake_name = fakegen.name_female()

        atChild = AntypicalChild.objects.get_or_create(clinic_no=fake_clinic_no, name=fake_name, dob=fake_dob, gender=fake_sex)[0]
        atChild.save()

def add_cameras():
    cameras = [
        { 'name': 'GoPro1', 'megapixels': 24, 'resolution': '1080P' },
        { 'name': 'GoPro2', 'megapixels': 24, 'resolution': '1080P' },
        { 'name': 'GoPro3', 'megapixels': 24, 'resolution': '1080P' },
        { 'name': 'GoPro4', 'megapixels': 24, 'resolution': '1080P' }
    ]

    for c in cameras:
        camera = Cameras.objects.get_or_create(name=c['name'], megapixels=c['megapixels'], resolution=c['resolution'])[0]
        camera.save()

def add_camera_angles():
    camera_angles = [
        { 'name': 'Angle1' },
        { 'name': 'Angle2' },
        { 'name': 'Angle3' },
        { 'name': 'Angle4' }
    ]

    for ca in camera_angles:
        camera = CameraAngles.objects.get_or_create(name=ca['name'])[0]
        camera.save()

if __name__ == '__main__':
    print('generating data')
    # add_tChilds(50)
    # add_atChilds(50)
    add_cameras()
    add_camera_angles()
    print('generation complete')
