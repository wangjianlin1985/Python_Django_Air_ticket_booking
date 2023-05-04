from django.db import models
from apps.Flight.models import Flight
from apps.SeatType.models import SeatType
from apps.StationInfo.models import StationInfo
from apps.UserInfo.models import UserInfo


class OrderInfo(models.Model):
    orderId = models.AutoField(primary_key=True, verbose_name='记录编号')
    userObj = models.ForeignKey(UserInfo,  db_column='userObj', on_delete=models.PROTECT, verbose_name='预定用户')
    flightObj = models.ForeignKey(Flight,  db_column='flightObj', on_delete=models.PROTECT, verbose_name='预定航班')
    startStation = models.ForeignKey(StationInfo,  db_column='startStation',related_name="order_startStation", on_delete=models.PROTECT, verbose_name='始发机场')
    endStation = models.ForeignKey(StationInfo,  db_column='endStation', related_name="order_endStation",on_delete=models.PROTECT, verbose_name='终到机场')
    startTime = models.CharField(max_length=20, default='', verbose_name='起飞时间')
    endTime = models.CharField(max_length=20, default='', verbose_name='终到时间')
    seatType = models.ForeignKey(SeatType,  db_column='seatType', on_delete=models.PROTECT, verbose_name='席别')
    seatNum = models.IntegerField(default=0,verbose_name='预定票数')
    totalPrice = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='总票价')
    orderMemo = models.CharField(max_length=800, default='', verbose_name='订单备注')

    class Meta:
        db_table = 't_OrderInfo'
        verbose_name = '订单信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        orderInfo = {
            'orderId': self.orderId,
            'userObj': self.userObj.realName,
            'userObjPri': self.userObj.user_name,
            'flightObj': self.flightObj.flightNumber,
            'flightObjPri': self.flightObj.flightId,
            'startStation': self.startStation.stationName,
            'startStationPri': self.startStation.stationId,
            'endStation': self.endStation.stationName,
            'endStationPri': self.endStation.stationId,
            'startTime': self.startTime,
            'endTime': self.endTime,
            'seatType': self.seatType.seatTypeName,
            'seatTypePri': self.seatType.seatTypeId,
            'seatNum': self.seatNum,
            'totalPrice': self.totalPrice,
            'orderMemo': self.orderMemo,
        }
        return orderInfo

