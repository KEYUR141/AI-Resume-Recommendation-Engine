import logging
import json
from django.shortcuts import render
from .models import Internship, UserProfile, Resume
from django.http import JsonResponse
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.permissions import IsAuthenticated
from .serializers import InternshipSerializer, UserSerializer, UserProfileSerializer
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser

logger = logging.getLogger('app')

class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for user registration and login with error handling.
    """
    @action(detail=False, methods=['get'])
    @permission_classes([IsAuthenticated])
    def get_user(self, request):
        try:
            user = request.user
            logger.info("get_user called by user=%s", user)
            if user.is_authenticated:
                user_profile = UserProfile.objects.all()
                serializer = UserProfileSerializer(user_profile, many=True)
                logger.debug("Returning %d user profiles", len(serializer.data))
                return Response({
                    "Status": True,
                    "Method":"Get",
                    "Data": serializer.data
                })
            logger.warning("Unauthenticated access attempt to get_user")
            return Response({
                "Status": False,
                "Method":"Get",
                "Data": "User not authenticated"
            })
        except Exception as e:
            logger.error("get_user failed: %s", e, exc_info=True)
            return Response({
                "Status": False,
                "Method":"Get",
                "Data": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def register(self, request):
        try:
            logger.info("Registration attempt for username=%s", request.data.get('username', '?'))
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                logger.info("User registered successfully: %s (id=%s)", user.username, user.pk)

                # Generate JWT token for newly registered user
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "User registered successfully",
                    "user": UserSerializer(user).data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)

            logger.warning("Registration validation failed: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error("Registration failed: %s", e, exc_info=True)
            return Response({
                "error": "Registration failed",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            logger.info("Login attempt for username=%s", username)

            if not username or not password:
                logger.warning("Login attempt with missing credentials")
                return Response({"error": "Username and password are required"},
                                status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)
            if user is not None:
                logger.info("Login successful for user=%s", username)
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "user": UserSerializer(user).data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_200_OK)

            logger.warning("Invalid login credentials for username=%s", username)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            logger.error("Login failed: %s", e, exc_info=True)
            return Response({
                "error": "Login failed",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class InternshipViewSet(viewsets.ModelViewSet):

    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.AllowAny]
   

    @action(detail=False, methods=['get'])
    def get_internships(self, request):
        try:
            logger.info("Fetching all internships")
            internships = self.queryset
            serializer = self.serializer_class(internships, many=True)
            logger.debug("Returning %d internships", len(serializer.data))
            return Response({
                'status': True,
                'Method': request.method,
                'data': serializer.data
            })
        except Exception as e:
            logger.error("get_internships failed: %s", e, exc_info=True)
            return Response({
                'status': False,
                'Method': request.method,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    @action(
        detail=False,
        methods=['POST'],
        url_path='recommend',
        parser_classes=[MultiPartParser, FormParser]
    )
    def recommend(self, request):
        """
        Receives either:
        - a resume file (PDF or DOCX) as 'resume' in form-data
        - or skills/qualifications as text fields
        Returns top internship matches.
        """
        from app.utils.light_model import extract_resume_text, parse_skills, match_internships
        candidate_skills = set()
        candidate_qualifications = set()
        source = None
        resume_file = request.FILES.get('resume')
        if resume_file:
            logger.info("Recommend: processing uploaded resume file=%s", resume_file.name)
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix=resume_file.name[-5:]) as tmp:
                for chunk in resume_file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            try:
                resume_text = extract_resume_text(tmp_path)
                candidate_skills = parse_skills(resume_text)
                candidate_qualifications = parse_skills(resume_text)
                source = 'resume_file'
                logger.info("Extracted %d skills from resume", len(candidate_skills))
            except Exception as e:
                logger.error("Resume extraction failed: %s", e, exc_info=True)
                return Response({'status': False, 'error': f'Resume extraction failed: {str(e)}'}, status=500)
        else:
            skills_text = request.data.get('skills', '')
            qualifications_text = request.data.get('qualifications', '')
            if not skills_text and not qualifications_text:
                return Response({'status': False, 'error': 'No skills or qualifications provided.'}, status=400)
            candidate_skills = parse_skills(skills_text)
            candidate_qualifications = parse_skills(qualifications_text)
            source = 'manual_input'
        internships = self.queryset
        recommendations = match_internships(candidate_skills, candidate_qualifications, internships)
        return Response({
            'status': True,
            'source': source,
            'recommendations': recommendations
        })
    
    @action(detail=False, methods = ['POST'], url_path="recommend_by_llm")
    def recommend_internships_by_llm(self, request):
        try:
            logger.info("LLM-based internship recommendation requested")
            from app.RAG.recommender import recommend_internships_by_llm, recommend_internships_engine
            unique_matched_internships = recommend_internships_engine(request.data.get('resume_text', ''))
            if not unique_matched_internships:
                logger.warning("No matched internships found for LLM recommendation")
                return Response({
                    'status': False,
                    'error': 'No matched internships to provide to LLM for recommendation.'
                }, status=400)
            result = recommend_internships_by_llm(unique_matched_internships)
            format_result = json.loads(result.choices[0].message.content)
            logger.info("LLM recommendation returned successfully")
            return Response({
                'status': True,
                'result': format_result
            })
        except Exception as e:
            logger.error("LLM recommendation failed: %s", e, exc_info=True)
            return Response({
                'status': False,
                'error': f'Error in recommendation engine: {str(e)}'
            }, status=500)

from app.tasks import generate_resume_embedding        
class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    permission_classes = [IsAuthenticated]
    parse_classes = [MultiPartParser, FormParser]


    @action(detail = False, methods =['POST'], url_path = 'upload')
    def upload_resume(self, request):
        try:
            resume_file = request.FILES.get('resume')
            logger.info("Resume upload requested by user=%s", request.user)

            if not resume_file:
                logger.warning("Resume upload: no file provided by user=%s", request.user)
                return Response({
                    'status': False,
                    'error': 'No Resume File Provided',
                }, status=status.HTTP_400_BAD_REQUEST)
            resume = Resume.objects.create(user=request.user, 
                    files=resume_file, 
                    status='pending')
            
            logger.info("Resume created (uuid=%s), dispatching embedding task", resume.uuid)
            generate_resume_embedding.delay(str(resume.uuid))
            return Response({
                'status': True,
                'message': 'Resume uploaded successfully. Processing has started.',
                'resume_id': str(resume.uuid)
            }, status=status.HTTP_201_CREATED)      
        except Exception as e:
            logger.error("Resume upload failed for user=%s: %s", request.user, e, exc_info=True)
            return Response({
                'status': False,
                'error' : f'Error Uploading Resume: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail = False, methods = ['GET'], url_path = 'my_resumes')
    def get_my_resumes(self,request):
        try:
            logger.info("Fetching resumes for user=%s", request.user)
            resumes = self.queryset.filter(user = request.user)
            logger.debug("Found %d resumes for user=%s", resumes.count(), request.user)
            return Response({
                'status': True,
                'resumes': [
                    {
                        'id': resume.uuid,
                        'file': resume.files.url if resume.files else None,
                        'status': resume.status,
                        'created_at': resume.created_at
                    } for resume in resumes
                ]
            })
        except Exception as e:
            logger.error("Fetching resumes failed for user=%s: %s", request.user, e, exc_info=True)
            return Response({
                'status': False,
                'error': f'Error Fetching Resumes: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR )