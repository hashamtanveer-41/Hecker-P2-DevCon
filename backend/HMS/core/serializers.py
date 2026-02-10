from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        try:
            role = user.baseuserprofile.role  # link to your BaseUserProfile
        except AttributeError:
            role = "unknown"
        token["role"] = role
        return token
