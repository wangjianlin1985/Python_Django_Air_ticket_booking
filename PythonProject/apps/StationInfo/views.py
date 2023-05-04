from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.StationInfo.models import StationInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台机场信息添加
    def get(self,request):

        # 使用模板
        return render(request, 'StationInfo/stationInfo_frontAdd.html')

    def post(self, request):
        stationInfo = StationInfo() # 新建一个机场信息对象然后获取参数
        stationInfo.stationName = request.POST.get('stationInfo.stationName')
        stationInfo.connectPerson = request.POST.get('stationInfo.connectPerson')
        stationInfo.telephone = request.POST.get('stationInfo.telephone')
        stationInfo.postcode = request.POST.get('stationInfo.postcode')
        stationInfo.address = request.POST.get('stationInfo.address')
        stationInfo.save() # 保存机场信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改机场信息
    def get(self, request, stationId):
        context = {'stationId': stationId}
        return render(request, 'StationInfo/stationInfo_frontModify.html', context)


class FrontListView(BaseView):  # 前台机场信息查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        stationName = self.getStrParam(request, 'stationName')
        connectPerson = self.getStrParam(request, 'connectPerson')
        telephone = self.getStrParam(request, 'telephone')
        postcode = self.getStrParam(request, 'postcode')
        # 然后条件组合查询过滤
        stationInfos = StationInfo.objects.all()
        if stationName != '':
            stationInfos = stationInfos.filter(stationName__contains=stationName)
        if connectPerson != '':
            stationInfos = stationInfos.filter(connectPerson__contains=connectPerson)
        if telephone != '':
            stationInfos = stationInfos.filter(telephone__contains=telephone)
        if postcode != '':
            stationInfos = stationInfos.filter(postcode__contains=postcode)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(stationInfos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        stationInfos_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'stationInfos_page': stationInfos_page,
            'stationName': stationName,
            'connectPerson': connectPerson,
            'telephone': telephone,
            'postcode': postcode,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'StationInfo/stationInfo_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示机场信息详情页
    def get(self, request, stationId):
        # 查询需要显示的机场信息对象
        stationInfo = StationInfo.objects.get(stationId=stationId)
        context = {
            'stationInfo': stationInfo
        }
        # 渲染模板显示
        return render(request, 'StationInfo/stationInfo_frontshow.html', context)


class ListAllView(View): # 前台查询所有机场信息
    def get(self,request):
        stationInfos = StationInfo.objects.all()
        stationInfoList = []
        for stationInfo in stationInfos:
            stationInfoObj = {
                'stationId': stationInfo.stationId,
                'stationName': stationInfo.stationName,
            }
            stationInfoList.append(stationInfoObj)
        return JsonResponse(stationInfoList, safe=False)


class UpdateView(BaseView):  # Ajax方式机场信息更新
    def get(self, request, stationId):
        # GET方式请求查询机场信息对象并返回机场信息json格式
        stationInfo = StationInfo.objects.get(stationId=stationId)
        return JsonResponse(stationInfo.getJsonObj())

    def post(self, request, stationId):
        # POST方式提交机场信息修改信息更新到数据库
        stationInfo = StationInfo.objects.get(stationId=stationId)
        stationInfo.stationName = request.POST.get('stationInfo.stationName')
        stationInfo.connectPerson = request.POST.get('stationInfo.connectPerson')
        stationInfo.telephone = request.POST.get('stationInfo.telephone')
        stationInfo.postcode = request.POST.get('stationInfo.postcode')
        stationInfo.address = request.POST.get('stationInfo.address')
        stationInfo.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台机场信息添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'StationInfo/stationInfo_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        stationInfo = StationInfo() # 新建一个机场信息对象然后获取参数
        stationInfo.stationName = request.POST.get('stationInfo.stationName')
        stationInfo.connectPerson = request.POST.get('stationInfo.connectPerson')
        stationInfo.telephone = request.POST.get('stationInfo.telephone')
        stationInfo.postcode = request.POST.get('stationInfo.postcode')
        stationInfo.address = request.POST.get('stationInfo.address')
        stationInfo.save() # 保存机场信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新机场信息
    def get(self, request, stationId):
        context = {'stationId': stationId}
        return render(request, 'StationInfo/stationInfo_modify.html', context)


class ListView(BaseView):  # 后台机场信息列表
    def get(self, request):
        # 使用模板
        return render(request, 'StationInfo/stationInfo_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        stationName = self.getStrParam(request, 'stationName')
        connectPerson = self.getStrParam(request, 'connectPerson')
        telephone = self.getStrParam(request, 'telephone')
        postcode = self.getStrParam(request, 'postcode')
        # 然后条件组合查询过滤
        stationInfos = StationInfo.objects.all()
        if stationName != '':
            stationInfos = stationInfos.filter(stationName__contains=stationName)
        if connectPerson != '':
            stationInfos = stationInfos.filter(connectPerson__contains=connectPerson)
        if telephone != '':
            stationInfos = stationInfos.filter(telephone__contains=telephone)
        if postcode != '':
            stationInfos = stationInfos.filter(postcode__contains=postcode)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(stationInfos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        stationInfos_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        stationInfoList = []
        for stationInfo in stationInfos_page:
            stationInfo = stationInfo.getJsonObj()
            stationInfoList.append(stationInfo)
        # 构造模板页面需要的参数
        stationInfo_res = {
            'rows': stationInfoList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(stationInfo_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除机场信息信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        stationIds = self.getStrParam(request, 'stationIds')
        stationIds = stationIds.split(',')
        count = 0
        try:
            for stationId in stationIds:
                StationInfo.objects.get(stationId=stationId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出机场信息信息到excel并下载
    def get(self, request):
        # 收集查询参数
        stationName = self.getStrParam(request, 'stationName')
        connectPerson = self.getStrParam(request, 'connectPerson')
        telephone = self.getStrParam(request, 'telephone')
        postcode = self.getStrParam(request, 'postcode')
        # 然后条件组合查询过滤
        stationInfos = StationInfo.objects.all()
        if stationName != '':
            stationInfos = stationInfos.filter(stationName__contains=stationName)
        if connectPerson != '':
            stationInfos = stationInfos.filter(connectPerson__contains=connectPerson)
        if telephone != '':
            stationInfos = stationInfos.filter(telephone__contains=telephone)
        if postcode != '':
            stationInfos = stationInfos.filter(postcode__contains=postcode)
        #将查询结果集转换成列表
        stationInfoList = []
        for stationInfo in stationInfos:
            stationInfo = stationInfo.getJsonObj()
            stationInfoList.append(stationInfo)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(stationInfoList)
        # 设置要导入到excel的列
        columns_map = {
            'stationName': '机场名称',
            'connectPerson': '联系人',
            'telephone': '联系电话',
            'postcode': '邮编',
            'address': '通讯地址',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'stationInfos.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="stationInfos.xlsx"'
        return response

