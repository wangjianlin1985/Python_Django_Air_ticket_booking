from django.contrib import admin
from apps.SeatType.models import SeatType

# Register your models here.

admin.site.register(SeatType,admin.ModelAdmin)