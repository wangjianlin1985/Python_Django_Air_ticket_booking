from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Recharge.models import Recharge
from apps.UserInfo.models import UserInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os
import datetime


class FrontAddView(BaseView):  # 前台充值信息添加
    def get(self,request):
        userInfos = UserInfo.objects.all()  # 获取所有用户信息
        context = {
            'userInfos': userInfos,
        }

        # 使用模板
        return render(request, 'Recharge/recharge_frontAdd.html', context)

    def post(self, request):
        recharge = Recharge() # 新建一个充值信息对象然后获取参数
        userObj = UserInfo.objects.get(user_name=request.POST.get('recharge.userObj.user_name'))
        recharge.userObj = userObj
        recharge.money = float(request.POST.get('recharge.money'))
        recharge.rechargeMemo = request.POST.get('recharge.rechargeMemo')

        recharge.chargeTime = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        userObj.money = userObj.money + recharge.money

        recharge.save()  # 保存充值信息信息到数据库
        userObj.save()
        return JsonResponse({'success': True, 'message': '充值成功'})


class FrontModifyView(BaseView):  # 前台修改充值信息
    def get(self, request, id):
        context = {'id': id}
        return render(request, 'Recharge/recharge_frontModify.html', context)


class FrontListView(BaseView):  # 前台充值信息查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        chargeTime = self.getStrParam(request, 'chargeTime')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        # 然后条件组合查询过滤
        recharges = Recharge.objects.all()
        if chargeTime != '':
            recharges = recharges.filter(chargeTime__contains=chargeTime)
        if userObj_user_name != '':
            recharges = recharges.filter(userObj=userObj_user_name)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(recharges, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        recharges_page = self.paginator.page(self.currentPage)

        # 获取所有用户信息
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'userInfos': userInfos,
            'recharges_page': recharges_page,
            'chargeTime': chargeTime,
            'userObj_user_name': userObj_user_name,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Recharge/recharge_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示充值信息详情页
    def get(self, request, id):
        # 查询需要显示的充值信息对象
        recharge = Recharge.objects.get(id=id)
        context = {
            'recharge': recharge
        }
        # 渲染模板显示
        return render(request, 'Recharge/recharge_frontshow.html', context)


class ListAllView(View): # 前台查询所有充值信息
    def get(self,request):
        recharges = Recharge.objects.all()
        rechargeList = []
        for recharge in recharges:
            rechargeObj = {
                'id': recharge.id,
            }
            rechargeList.append(rechargeObj)
        return JsonResponse(rechargeList, safe=False)


class UpdateView(BaseView):  # Ajax方式充值信息更新
    def get(self, request, id):
        # GET方式请求查询充值信息对象并返回充值信息json格式
        recharge = Recharge.objects.get(id=id)
        return JsonResponse(recharge.getJsonObj())

    def post(self, request, id):
        # POST方式提交充值信息修改信息更新到数据库
        recharge = Recharge.objects.get(id=id)
        recharge.userObj = UserInfo.objects.get(user_name=request.POST.get('recharge.userObj.user_name'))
        recharge.money = float(request.POST.get('recharge.money'))
        recharge.rechargeMemo = request.POST.get('recharge.rechargeMemo')
        recharge.chargeTime = request.POST.get('recharge.chargeTime')
        recharge.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台充值信息添加
    def get(self,request):
        userInfos = UserInfo.objects.all()  # 获取所有用户信息
        context = {
            'userInfos': userInfos,
        }

        # 渲染显示模板界面
        return render(request, 'Recharge/recharge_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        recharge = Recharge() # 新建一个充值信息对象然后获取参数
        userObj = UserInfo.objects.get(user_name=request.POST.get('recharge.userObj.user_name'))
        recharge.userObj = UserInfo.objects.get(user_name=request.POST.get('recharge.userObj.user_name'))
        recharge.money = float(request.POST.get('recharge.money'))
        recharge.rechargeMemo = request.POST.get('recharge.rechargeMemo')
        recharge.chargeTime = request.POST.get('recharge.chargeTime')
        recharge.save() # 保存充值信息信息到数据库
        recharge.chargeTime = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        recharge.save()  # 保存充值信息信息到数据库
        userObj.money = userObj.money + recharge.money
        userObj.save()
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新充值信息
    def get(self, request, id):
        context = {'id': id}
        return render(request, 'Recharge/recharge_modify.html', context)


class ListView(BaseView):  # 后台充值信息列表
    def get(self, request):
        # 使用模板
        return render(request, 'Recharge/recharge_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        chargeTime = self.getStrParam(request, 'chargeTime')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        # 然后条件组合查询过滤
        recharges = Recharge.objects.all()
        if chargeTime != '':
            recharges = recharges.filter(chargeTime__contains=chargeTime)
        if userObj_user_name != '':
            recharges = recharges.filter(userObj=userObj_user_name)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(recharges, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        recharges_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        rechargeList = []
        for recharge in recharges_page:
            recharge = recharge.getJsonObj()
            rechargeList.append(recharge)
        # 构造模板页面需要的参数
        recharge_res = {
            'rows': rechargeList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(recharge_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除充值信息信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        ids = self.getStrParam(request, 'ids')
        ids = ids.split(',')
        count = 0
        try:
            for id in ids:
                Recharge.objects.get(id=id).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出充值信息信息到excel并下载
    def get(self, request):
        # 收集查询参数
        chargeTime = self.getStrParam(request, 'chargeTime')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        # 然后条件组合查询过滤
        recharges = Recharge.objects.all()
        if chargeTime != '':
            recharges = recharges.filter(chargeTime__contains=chargeTime)
        if userObj_user_name != '':
            recharges = recharges.filter(userObj=userObj_user_name)
        #将查询结果集转换成列表
        rechargeList = []
        for recharge in recharges:
            recharge = recharge.getJsonObj()
            rechargeList.append(recharge)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(rechargeList)
        # 设置要导入到excel的列
        columns_map = {
            'userObj': '充值用户',
            'money': '充值金额',
            'chargeTime': '充值时间',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'recharges.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="recharges.xlsx"'
        return response

