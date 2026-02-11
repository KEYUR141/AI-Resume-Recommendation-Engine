from django.shortcuts import render
from .models import Internship, UserProfile
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

class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for user registration and login with error handling.
    """
    @action(detail=False, methods=['get'])
    @permission_classes([IsAuthenticated])
    def get_user(self, request):
        try:
            user = request.user
            if user.is_authenticated:
                user_profile = UserProfile.objects.all()
                serializer = UserProfileSerializer(user_profile, many=True)
                return Response({
                    "Status": True,
                    "Method":"Get",
                    "Data": serializer.data
                })
            return Response({
                "Status": False,
                "Method":"Get",
                "Data": "User not authenticated"
            })
        except Exception as e:
            return Response({
                "Status": False,
                "Method":"Get",
                "Data": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def register(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()

                # Generate JWT token for newly registered user
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "User registered successfully",
                    "user": UserSerializer(user).data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": "Registration failed",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")

            if not username or not password:
                return Response({"error": "Username and password are required"},
                                status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "user": UserSerializer(user).data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_200_OK)

            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
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
    def get(self, request):
        try:
            internships = self.queryset
            serializer = self.serializer_class(internships, many=True)
            return Response({
                'status': True,
                'Method': request.method,
                'data': serializer.data
            })
        except Exception as e:
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
            except Exception as e:
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