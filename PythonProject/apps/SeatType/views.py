from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.SeatType.models import SeatType
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台座位席别添加
    def get(self,request):

        # 使用模板
        return render(request, 'SeatType/seatType_frontAdd.html')

    def post(self, request):
        seatType = SeatType() # 新建一个座位席别对象然后获取参数
        seatType.seatTypeName = request.POST.get('seatType.seatTypeName')
        seatType.save() # 保存座位席别信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改座位席别
    def get(self, request, seatTypeId):
        context = {'seatTypeId': seatTypeId}
        return render(request, 'SeatType/seatType_frontModify.html', context)


class FrontListView(BaseView):  # 前台座位席别查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        seatTypes = SeatType.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(seatTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        seatTypes_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'seatTypes_page': seatTypes_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'SeatType/seatType_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示座位席别详情页
    def get(self, request, seatTypeId):
        # 查询需要显示的座位席别对象
        seatType = SeatType.objects.get(seatTypeId=seatTypeId)
        context = {
            'seatType': seatType
        }
        # 渲染模板显示
        return render(request, 'SeatType/seatType_frontshow.html', context)


class ListAllView(View): # 前台查询所有座位席别
    def get(self,request):
        seatTypes = SeatType.objects.all()
        seatTypeList = []
        for seatType in seatTypes:
            seatTypeObj = {
                'seatTypeId': seatType.seatTypeId,
                'seatTypeName': seatType.seatTypeName,
            }
            seatTypeList.append(seatTypeObj)
        return JsonResponse(seatTypeList, safe=False)


class UpdateView(BaseView):  # Ajax方式座位席别更新
    def get(self, request, seatTypeId):
        # GET方式请求查询座位席别对象并返回座位席别json格式
        seatType = SeatType.objects.get(seatTypeId=seatTypeId)
        return JsonResponse(seatType.getJsonObj())

    def post(self, request, seatTypeId):
        # POST方式提交座位席别修改信息更新到数据库
        seatType = SeatType.objects.get(seatTypeId=seatTypeId)
        seatType.seatTypeName = request.POST.get('seatType.seatTypeName')
        seatType.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台座位席别添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'SeatType/seatType_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        seatType = SeatType() # 新建一个座位席别对象然后获取参数
        seatType.seatTypeName = request.POST.get('seatType.seatTypeName')
        seatType.save() # 保存座位席别信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新座位席别
    def get(self, request, seatTypeId):
        context = {'seatTypeId': seatTypeId}
        return render(request, 'SeatType/seatType_modify.html', context)


class ListView(BaseView):  # 后台座位席别列表
    def get(self, request):
        # 使用模板
        return render(request, 'SeatType/seatType_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        seatTypes = SeatType.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(seatTypes, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        seatTypes_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        seatTypeList = []
        for seatType in seatTypes_page:
            seatType = seatType.getJsonObj()
            seatTypeList.append(seatType)
        # 构造模板页面需要的参数
        seatType_res = {
            'rows': seatTypeList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(seatType_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除座位席别信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        seatTypeIds = self.getStrParam(request, 'seatTypeIds')
        seatTypeIds = seatTypeIds.split(',')
        count = 0
        try:
            for seatTypeId in seatTypeIds:
                SeatType.objects.get(seatTypeId=seatTypeId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出座位席别信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        seatTypes = SeatType.objects.all()
        #将查询结果集转换成列表
        seatTypeList = []
        for seatType in seatTypes:
            seatType = seatType.getJsonObj()
            seatTypeList.append(seatType)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(seatTypeList)
        # 设置要导入到excel的列
        columns_map = {
            'seatTypeId': '记录编号',
            'seatTypeName': '席别名称',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'seatTypes.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="seatTypes.xlsx"'
        return response

