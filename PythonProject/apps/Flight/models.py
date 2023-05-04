from django.db import models
from apps.SeatType.models import SeatType
from apps.StationInfo.models import StationInfo
from tinymce.models import HTMLField


class Flight(models.Model):
    flightId = models.AutoField(primary_key=True, verbose_name='记录编号')
    flightNumber = models.CharField(max_length=20, default='', verbose_name='航班号')
    flightPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='航班图片')
    startStation = models.ForeignKey(StationInfo,  db_column='startStation',related_name="startStation", on_delete=models.PROTECT, verbose_name='始发机场')
    endStation = models.ForeignKey(StationInfo,  db_column='endStation', related_name="endStation", on_delete=models.PROTECT, verbose_name='终到机场')
    startTime = models.CharField(max_length=20, default='', verbose_name='起飞时间')
    endTime = models.CharField(max_length=20, default='', verbose_name='终到时间')
    totalTime = models.CharField(max_length=20, default='', verbose_name='历时')
    seatType = models.ForeignKey(SeatType,  db_column='seatType', on_delete=models.PROTECT, verbose_name='席别')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='票价')
    seatNumber = models.IntegerField(default=0,verbose_name='总票数')
    leftSeatNumber = models.IntegerField(default=0,verbose_name='剩余票数')
    flightDesc = HTMLField(max_length=8000, verbose_name='航班描述')

    class Meta:
        db_table = 't_Flight'
        verbose_name = '航班信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        flight = {
            'flightId': self.flightId,
            'flightNumber': self.flightNumber,
            'flightPhoto': self.flightPhoto.url,
            'startStation': self.startStation.stationName,
            'startStationPri': self.startStation.stationId,
            'endStation': self.endStation.stationName,
            'endStationPri': self.endStation.stationId,
            'startTime': self.startTime,
            'endTime': self.endTime,
            'totalTime': self.totalTime,
            'seatType': self.seatType.seatTypeName,
            'seatTypePri': self.seatType.seatTypeId,
            'price': self.price,
            'seatNumber': self.seatNumber,
            'leftSeatNumber': self.leftSeatNumber,
            'flightDesc': self.flightDesc,
        }
        return flight

