from django.db import models
from apps.UserInfo.models import UserInfo


class Recharge(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='记录编号')
    userObj = models.ForeignKey(UserInfo,  db_column='userObj', on_delete=models.PROTECT, verbose_name='充值用户')
    money = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='充值金额')
    rechargeMemo = models.CharField(max_length=500, default='', verbose_name='充值备注')
    chargeTime = models.CharField(max_length=20, default='', verbose_name='充值时间')

    class Meta:
        db_table = 't_Recharge'
        verbose_name = '充值信息信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        recharge = {
            'id': self.id,
            'userObj': self.userObj.realName,
            'userObjPri': self.userObj.user_name,
            'money': self.money,
            'rechargeMemo': self.rechargeMemo,
            'chargeTime': self.chargeTime,
        }
        return recharge

