from django.db import models


class StationInfo(models.Model):
    stationId = models.AutoField(primary_key=True, verbose_name='记录编号')
    stationName = models.CharField(max_length=20, default='', verbose_name='机场名称')
    connectPerson = models.CharField(max_length=20, default='', verbose_name='联系人')
    telephone = models.CharField(max_length=30, default='', verbose_name='联系电话')
    postcode = models.CharField(max_length=20, default='', verbose_name='邮编')
    address = models.CharField(max_length=20, default='', verbose_name='通讯地址')

    class Meta:
        db_table = 't_StationInfo'
        verbose_name = '机场信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        stationInfo = {
            'stationId': self.stationId,
            'stationName': self.stationName,
            'connectPerson': self.connectPerson,
            'telephone': self.telephone,
            'postcode': self.postcode,
            'address': self.address,
        }
        return stationInfo

