from django.contrib import admin
from apps.Recharge.models import Recharge

# Register your models here.

admin.site.register(Recharge,admin.ModelAdmin)