from django.contrib import admin
from apps.Flight.models import Flight

# Register your models here.

admin.site.register(Flight,admin.ModelAdmin)