from django.core.management.base import BaseCommand
import pandas as pd
from app.models import Internship

class Command(BaseCommand):
    help = 'Seed the database with internship data from Excel'

    def handle(self, *args, **kwargs):
        df = pd.read_excel(r'D:\Django_Python_Practice\SIH_Hackathon\Backend\Project\Sample_Internship_Listings_Updated.xlsx')
        print("Excel columns:", list(df.columns))
        for _, row in df.iterrows():
            Internship.objects.create(
                role=row['Internship Role'],
                # industry='',  # No 'Industry' column in Excel
                company=row['Hiring Company'],
                location=row['Location'],
                skills=row['Required Skills'],
                qualifications=row['Qualifications'],
                stipend=row['Stipend'],
                duration=row['Duration'],
                description=row['Description']
            )
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))