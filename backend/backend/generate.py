import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

import random
from api.models import Profiles
from faker import Faker

fakegen = Faker()

genders = ['Male', 'Female', 'Other']

def add_profiles(n = 50):
    
    for i in range(n):
        fake_clinic_no = random.randint(100, 1000)
        fake_name = ''
        fake_dob = fakegen.date()
        fake_sex = random.choice(genders)

        if fake_sex == 'Male':
            # generate male
            fake_name = fakegen.name_male()
        else:
            # generate female
            fake_name = fakegen.name_female()

        profile = Profiles.objects.get_or_create(clinic_no=fake_clinic_no, name=fake_name, dob=fake_dob, sex=fake_sex)[0]
        profile.save()

if __name__ == '__main__':
    print('generating data')
    add_profiles(30)
    print('generation complete')
