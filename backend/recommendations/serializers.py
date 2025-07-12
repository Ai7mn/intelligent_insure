from rest_framework import serializers
from .models import User, Submission

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class RecommendationInputSerializer(serializers.Serializer):
    age = serializers.IntegerField(min_value=18, max_value=100)
    income = serializers.IntegerField(min_value=10000)
    dependents = serializers.IntegerField(min_value=0, max_value=20)
    risk_tolerance = serializers.ChoiceField(choices=['Low', 'Medium', 'High'])

class RecommendationOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        exclude = ['user']