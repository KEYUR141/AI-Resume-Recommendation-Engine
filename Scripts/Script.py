# import random
# import pandas as pd

# # Constants
# NUM_ROWS = 300
# IT_RATIO = 0.4
# NUM_IT = int(NUM_ROWS * IT_RATIO)
# NUM_OTHER = NUM_ROWS - NUM_IT

# # Sample data pools
# roles_it = ["Web Developer Intern", "Data Analyst Intern", "App Tester Intern", "UI/UX Designer Intern", "Cybersecurity Intern"]
# roles_other = ["Agriculture Outreach Intern", "Teaching Assistant", "Healthcare Support Intern", "Finance Intern", "Environmental Survey Intern", "Media Content Intern", "Public Policy Intern"]

# companies = ["TechNova", "AgriReach", "EduBridge", "HealthFirst", "GreenPulse", "FinEdge", "MediaSpark", "PolicyWorks", "CodeCraft", "RuralRise"]
# locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Remote"]
# skills_it = ["Python", "HTML/CSS", "JavaScript", "SQL", "Excel", "Git", "React", "Django"]
# skills_other = ["Communication", "MS Office", "Field Work", "Teaching", "Surveying", "Data Entry", "Social Media", "Basic Accounting"]
# qualifications = ["Class 12", "Diploma", "B.A.", "B.Com", "B.Sc", "B.Tech", "M.Tech", "MBA"]
# stipends = [2000, 3000, 5000, 7000, 10000]
# durations = ["4 weeks", "6 weeks", "2 months", "3 months"]

# # Description templates
# desc_templates = [
#     "Assist with daily tasks and learn on the job.",
#     "Support team operations and gain hands-on experience.",
#     "Work on real projects under expert guidance.",
#     "Help with data collection and reporting.",
#     "Contribute to outreach and awareness activities.",
#     "Learn tools and techniques relevant to the field."
# ]

# # Generator function
# def generate_internship(role_pool, skill_pool):
#     return {
#         "Internship Role": random.choice(role_pool),
#         "Hiring Company": random.choice(companies),
#         "Location": random.choice(locations),
#         "Required Skills": ", ".join(random.sample(skill_pool, k=3)),
#         "Qualifications": random.choice(qualifications),
#         "Stipend": f"₹{random.choice(stipends)}",
#         "Duration": random.choice(durations),
#         "Description": random.choice(desc_templates)
#     }

# # Generate data
# data = []
# for _ in range(NUM_IT):
#     data.append(generate_internship(roles_it, skills_it))
# for _ in range(NUM_OTHER):
#     data.append(generate_internship(roles_other, skills_other))

# # Shuffle and export
# random.shuffle(data)
# df = pd.DataFrame(data)
# df.to_excel("internship_sample_data.xlsx", index=False)

# print("✅ Internship dataset with 300 rows saved as 'internship_sample_data.xlsx'")

import random
import pandas as pd

# Constants
NUM_ROWS = 300
IT_RATIO = 0.6
NUM_IT = int(NUM_ROWS * IT_RATIO)
NUM_OTHER = NUM_ROWS - NUM_IT

# Sample data pools
roles_it = [
    ("Web Developer Intern", "IT"),
    ("Data Analyst Intern", "IT"),
    ("App Tester Intern", "IT"),
    ("UI/UX Designer Intern", "IT"),
    ("Cybersecurity Intern", "IT"),
    ("Machine Learning Intern", "IT"),
    ("Cloud Support Intern", "IT")
]

roles_other = [
    ("Finance Intern", "Finance"),
    ("Teaching Assistant", "Education"),
    ("Healthcare Support Intern", "Healthcare"),
    ("Environmental Survey Intern", "Environment"),
    ("Media Content Intern", "Media"),
    ("Public Policy Intern", "Public Services"),
    ("Agriculture Outreach Intern", "Agriculture"),
    ("Social Work Intern", "Social Work")
]

companies = ["TechNova", "AgriReach", "EduBridge", "HealthFirst", "GreenPulse", "FinEdge", "MediaSpark", "PolicyWorks", "CodeCraft", "RuralRise"]
locations = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Remote"]
skills_it = ["Python", "HTML/CSS", "JavaScript", "SQL", "Excel", "Git", "React", "Django"]
skills_other = ["Communication", "MS Office", "Field Work", "Teaching", "Surveying", "Data Entry", "Social Media", "Basic Accounting"]
qualifications = ["Class 12", "Diploma", "B.A.", "B.Com", "B.Sc", "B.Tech", "M.Tech", "MBA"]
stipends = [2000, 3000, 5000, 7000, 10000]
durations = ["4 weeks", "6 weeks", "2 months", "3 months"]

desc_templates = [
    "Assist with daily tasks and learn on the job.",
    "Support team operations and gain hands-on experience.",
    "Work on real projects under expert guidance.",
    "Help with data collection and reporting.",
    "Contribute to outreach and awareness activities.",
    "Learn tools and techniques relevant to the field."
]

# Generator function
def generate_internship(role_pool, skill_pool):
    role, industry = random.choice(role_pool)
    return {
        "Internship Role": role,
        "Industry": industry,
        "Hiring Company": random.choice(companies),
        "Location": random.choice(locations),
        "Required Skills": ", ".join(random.sample(skill_pool, k=3)),
        "Qualifications": random.choice(qualifications),
        "Stipend": f"₹{random.choice(stipends)}",
        "Duration": random.choice(durations),
        "Description": random.choice(desc_templates)
    }

# Generate data
data = []
for _ in range(NUM_IT):
    data.append(generate_internship(roles_it, skills_it))
for _ in range(NUM_OTHER):
    data.append(generate_internship(roles_other, skills_other))

# Shuffle and export
random.shuffle(data)
df = pd.DataFrame(data)
df.to_excel("internship_sample_data_with_industry.xlsx", index=False)

print("✅ Internship dataset with 300 rows and industry tags saved as 'internship_sample_data_with_industry.xlsx'")