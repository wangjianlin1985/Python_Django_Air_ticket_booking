from django.contrib import admin
from apps.StationInfo.models import StationInfo

# Register your models here.

admin.site.register(StationInfo,admin.ModelAdmin)