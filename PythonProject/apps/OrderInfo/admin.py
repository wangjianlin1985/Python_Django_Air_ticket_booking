from django.contrib import admin
from apps.OrderInfo.models import OrderInfo

# Register your models here.

admin.site.register(OrderInfo,admin.ModelAdmin)