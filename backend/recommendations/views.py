from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Submission
from .serializers import UserSerializer, RecommendationInputSerializer, RecommendationOutputSerializer
from .services.ml_service import RecommendationService


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer


class RecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        input_serializer = RecommendationInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data
        recommendation_result = RecommendationService.predict(validated_data)

        submission = Submission.objects.create(
            user=request.user, **validated_data, **recommendation_result
        )

        output_serializer = RecommendationOutputSerializer(submission)
        return Response(output_serializer.data, status=201)
