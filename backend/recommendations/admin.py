from django.contrib import admin
from .models import User, Submission


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    Custom admin view for the User model.
    """
    list_display = ('email', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email',)
    list_filter = ('is_staff', 'is_active')
    ordering = ('-date_joined',)


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    """
    Custom admin view for the Submission model.
    These should be read-only as they are records of a recommendation at a point in time.
    """
    list_display = ('user', 'age', 'income', 'risk_tolerance', 'recommended_policy', 'created_at')
    list_filter = ('risk_tolerance', 'recommended_policy')
    search_fields = ('user__email',)
    ordering = ('-created_at',)

    # Make all fields read-only in the admin panel
    readonly_fields = [field.name for field in Submission._meta.get_fields()]

    def has_add_permission(self, request):
        # Prevent manual additions from the admin panel
        return False

    def has_delete_permission(self, request, obj=None):
        # Optionally prevent deletions
        return False
