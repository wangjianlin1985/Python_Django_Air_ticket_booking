from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.OrderInfo.models import OrderInfo
from apps.Flight.models import Flight
from apps.SeatType.models import SeatType
from apps.StationInfo.models import StationInfo
from apps.UserInfo.models import UserInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台订单信息添加
    def get(self,request):
        flights = Flight.objects.all()  # 获取所有航班信息
        seatTypes = SeatType.objects.all()  # 获取所有座位席别
        stationInfos = StationInfo.objects.all()  # 获取所有机场信息
        userInfos = UserInfo.objects.all()  # 获取所有用户信息
        context = {
            'flights': flights,
            'seatTypes': seatTypes,
            'stationInfos': stationInfos,
            'userInfos': userInfos,
        }

        # 使用模板
        return render(request, 'OrderInfo/orderInfo_frontAdd.html', context)

    def post(self, request):
        pass


class FrontUserAddView(BaseView):  # 前台订单信息添加
    def get(self,request):
        flightId = request.GET.get("flightId")
        flight =Flight.objects.get(flightId=flightId)
        context = {
            'flight': flight,
        }
        # 使用模板
        return render(request, 'OrderInfo/orderInfo_userFrontAdd.html', context)

    def post(self, request):
        pass




class FrontModifyView(BaseView):  # 前台修改订单信息
    def get(self, request, orderId):
        context = {'orderId': orderId}
        return render(request, 'OrderInfo/orderInfo_frontModify.html', context)


class FrontListView(BaseView):  # 前台订单信息查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        userObj_user_name = request.session.get('user_name') #self.getStrParam(request, 'userObj.user_name')
        flightObj_flightId = self.getIntParam(request, 'flightObj.flightId')
        startStation_stationId = self.getIntParam(request, 'startStation.stationId')
        endStation_stationId = self.getIntParam(request, 'endStation.stationId')
        startTime = self.getStrParam(request, 'startTime')
        endTime = self.getStrParam(request, 'endTime')
        seatType_seatTypeId = self.getIntParam(request, 'seatType.seatTypeId')
        # 然后条件组合查询过滤
        orderInfos = OrderInfo.objects.all()
        if userObj_user_name != '':
            orderInfos = orderInfos.filter(userObj=userObj_user_name)
        if flightObj_flightId != '0':
            orderInfos = orderInfos.filter(flightObj=flightObj_flightId)
        if startStation_stationId != '0':
            orderInfos = orderInfos.filter(startStation=startStation_stationId)
        if endStation_stationId != '0':
            orderInfos = orderInfos.filter(endStation=endStation_stationId)
        if startTime != '':
            orderInfos = orderInfos.filter(startTime__contains=startTime)
        if endTime != '':
            orderInfos = orderInfos.filter(endTime__contains=endTime)
        if seatType_seatTypeId != '0':
            orderInfos = orderInfos.filter(seatType=seatType_seatTypeId)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(orderInfos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        orderInfos_page = self.paginator.page(self.currentPage)

        # 获取所有航班信息
        flights = Flight.objects.all()
        # 获取所有座位席别
        seatTypes = SeatType.objects.all()
        # 获取所有机场信息
        stationInfos = StationInfo.objects.all()
        # 获取所有用户信息
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'flights': flights,
            'seatTypes': seatTypes,
            'stationInfos': stationInfos,
            'userInfos': userInfos,
            'orderInfos_page': orderInfos_page,
            'userObj_user_name': userObj_user_name,
            'flightObj_flightId': int(flightObj_flightId),
            'startStation_stationId': int(startStation_stationId),
            'endStation_stationId': int(endStation_stationId),
            'startTime': startTime,
            'endTime': endTime,
            'seatType_seatTypeId': int(seatType_seatTypeId),
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'OrderInfo/orderInfo_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示订单信息详情页
    def get(self, request, orderId):
        # 查询需要显示的订单信息对象
        orderInfo = OrderInfo.objects.get(orderId=orderId)
        context = {
            'orderInfo': orderInfo
        }
        # 渲染模板显示
        return render(request, 'OrderInfo/orderInfo_frontshow.html', context)


class ListAllView(View): # 前台查询所有订单信息
    def get(self,request):
        orderInfos = OrderInfo.objects.all()
        orderInfoList = []
        for orderInfo in orderInfos:
            orderInfoObj = {
                'orderId': orderInfo.orderId,
            }
            orderInfoList.append(orderInfoObj)
        return JsonResponse(orderInfoList, safe=False)


class UpdateView(BaseView):  # Ajax方式订单信息更新
    def get(self, request, orderId):
        # GET方式请求查询订单信息对象并返回订单信息json格式
        orderInfo = OrderInfo.objects.get(orderId=orderId)
        return JsonResponse(orderInfo.getJsonObj())

    def post(self, request, orderId):
        pass

class AddView(BaseView):  # 后台订单信息添加
    def get(self,request):
        flights = Flight.objects.all()  # 获取所有航班信息
        seatTypes = SeatType.objects.all()  # 获取所有座位席别
        stationInfos = StationInfo.objects.all()  # 获取所有机场信息
        userInfos = UserInfo.objects.all()  # 获取所有用户信息
        context = {
            'flights': flights,
            'seatTypes': seatTypes,
            'stationInfos': stationInfos,
            'userInfos': userInfos,
        }

        # 渲染显示模板界面
        return render(request, 'OrderInfo/orderInfo_add.html', context)

    def post(self, request):
        pass


class BackModifyView(BaseView):  # 后台更新订单信息
    def get(self, request, orderId):
        context = {'orderId': orderId}
        return render(request, 'OrderInfo/orderInfo_modify.html', context)


class ListView(BaseView):  # 后台订单信息列表
    def get(self, request):
        # 使用模板
        return render(request, 'OrderInfo/orderInfo_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        flightObj_flightId = self.getIntParam(request, 'flightObj.flightId')
        startStation_stationId = self.getIntParam(request, 'startStation.stationId')
        endStation_stationId = self.getIntParam(request, 'endStation.stationId')
        startTime = self.getStrParam(request, 'startTime')
        endTime = self.getStrParam(request, 'endTime')
        seatType_seatTypeId = self.getIntParam(request, 'seatType.seatTypeId')
        # 然后条件组合查询过滤
        orderInfos = OrderInfo.objects.all()
        if userObj_user_name != '':
            orderInfos = orderInfos.filter(userObj=userObj_user_name)
        if flightObj_flightId != '0':
            orderInfos = orderInfos.filter(flightObj=flightObj_flightId)
        if startStation_stationId != '0':
            orderInfos = orderInfos.filter(startStation=startStation_stationId)
        if endStation_stationId != '0':
            orderInfos = orderInfos.filter(endStation=endStation_stationId)
        if startTime != '':
            orderInfos = orderInfos.filter(startTime__contains=startTime)
        if endTime != '':
            orderInfos = orderInfos.filter(endTime__contains=endTime)
        if seatType_seatTypeId != '0':
            orderInfos = orderInfos.filter(seatType=seatType_seatTypeId)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(orderInfos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        orderInfos_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        orderInfoList = []
        for orderInfo in orderInfos_page:
            orderInfo = orderInfo.getJsonObj()
            orderInfoList.append(orderInfo)
        # 构造模板页面需要的参数
        orderInfo_res = {
            'rows': orderInfoList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(orderInfo_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除订单信息信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        orderIds = self.getStrParam(request, 'orderIds')
        orderIds = orderIds.split(',')
        count = 0
        try:
            for orderId in orderIds:
                OrderInfo.objects.get(orderId=orderId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出订单信息信息到excel并下载
    def get(self, request):
        # 收集查询参数
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        flightObj_flightId = self.getIntParam(request, 'flightObj.flightId')
        startStation_stationId = self.getIntParam(request, 'startStation.stationId')
        endStation_stationId = self.getIntParam(request, 'endStation.stationId')
        startTime = self.getStrParam(request, 'startTime')
        endTime = self.getStrParam(request, 'endTime')
        seatType_seatTypeId = self.getIntParam(request, 'seatType.seatTypeId')
        # 然后条件组合查询过滤
        orderInfos = OrderInfo.objects.all()
        if userObj_user_name != '':
            orderInfos = orderInfos.filter(userObj=userObj_user_name)
        if flightObj_flightId != '0':
            orderInfos = orderInfos.filter(flightObj=flightObj_flightId)
        if startStation_stationId != '0':
            orderInfos = orderInfos.filter(startStation=startStation_stationId)
        if endStation_stationId != '0':
            orderInfos = orderInfos.filter(endStation=endStation_stationId)
        if startTime != '':
            orderInfos = orderInfos.filter(startTime__contains=startTime)
        if endTime != '':
            orderInfos = orderInfos.filter(endTime__contains=endTime)
        if seatType_seatTypeId != '0':
            orderInfos = orderInfos.filter(seatType=seatType_seatTypeId)
        #将查询结果集转换成列表
        orderInfoList = []
        for orderInfo in orderInfos:
            orderInfo = orderInfo.getJsonObj()
            orderInfoList.append(orderInfo)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(orderInfoList)
        # 设置要导入到excel的列
        columns_map = {
            'userObj': '预定用户',
            'flightObj': '预定航班',
            'startStation': '始发机场',
            'endStation': '终到机场',
            'startTime': '起飞时间',
            'endTime': '终到时间',
            'seatType': '席别',
            'seatNum': '预定票数',
            'totalPrice': '总票价',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'orderInfos.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="orderInfos.xlsx"'
        return response

