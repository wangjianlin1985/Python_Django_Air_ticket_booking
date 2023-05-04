from django.db import models


class SeatType(models.Model):
    seatTypeId = models.AutoField(primary_key=True, verbose_name='记录编号')
    seatTypeName = models.CharField(max_length=20, default='', verbose_name='席别名称')

    class Meta:
        db_table = 't_SeatType'
        verbose_name = '座位席别信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        seatType = {
            'seatTypeId': self.seatTypeId,
            'seatTypeName': self.seatTypeName,
        }
        return seatType

